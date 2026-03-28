import { useEffect, useState } from "react";
import AddRecordComponent from "./AddRecordComponent";
import type { FilesRecord, ProjectsRecord } from "./types/dbTables";
import DeleteRecordComponent from "./DeleteRecordComponent";
import SearchBarComponent from "./SearchBarComponent";
import FileViewerComponent from "./FileViewerComponent";
import FileCardComponent from "./FileCardComponent";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

type FileManagerComponentProps = {
    buildingSiteId: number,
    selectedDate: string,
    handleEditFile: (fileAlreadyExists: boolean) => void;
}

export default function FileManagerComponent({ buildingSiteId, selectedDate, handleEditFile }: FileManagerComponentProps) {

    const [filesList, setFilesList] = useState<FilesRecord[]>([]);
    const [projectsList, setProjectsList] = useState<ProjectsRecord[]>([]);
    const [deleteRecordPopup, isDeleteRecordPopupVisible] = useState<boolean>(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<number>(0);
    const [itemToDeleteStorageKey, setItemToDeleteStorageKey] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<FilesRecord | null>(null);
    
    const sortedFiles = [...filesList].sort((a, b) => {
        const dateA = new Date(a.date ?? "").getTime();
        const dateB = new Date(b.date ?? "").getTime();
        return dateA - dateB;
    });

    const sortedProjects = [...projectsList].sort((a, b) => {
        const dateA = new Date(a.date ?? "").getTime();
        const dateB = new Date(b.date ?? "").getTime();
        return dateA - dateB;
    });

    async function deleteFile () {
        isDeleteRecordPopupVisible(true);
        deleteFileFromCloudStorage(itemToDeleteStorageKey); // qualora lo storage_key non fosse un valido storage_key, non riporta alcun errore, non so perchè, ma meglio così
    }

    const fetchFilesAndProjects = async (currentBuildingSiteId: number) => {
        const [filesData, projectsData] = await Promise.all([
            fetchFilesFromBuildingSiteId(currentBuildingSiteId),
            fetchProjectsFromBuildingSiteId(currentBuildingSiteId),
        ]);

        setFilesList(filesData);
        setProjectsList(projectsData);
    }

    // Logica di ricerca dei files/progetti con SearchBarComponent
    const [searchTerm, setSearchTerm] = useState<string>('');
    const term = searchTerm.trim().toLowerCase();

    const matchingFiles = term
        ? sortedFiles.filter((file) => file.name.toLowerCase().includes(term))
        : sortedFiles;

    const projectIdsWithMatchingFiles = new Set(
        matchingFiles
            .filter((file) => file.project_id !== null)
            .map((file) => file.project_id as number)
    );

    const filteredSortedProjects = term
        ? sortedProjects.filter(
            (project) =>
                project.name.toLowerCase().includes(term) ||
                projectIdsWithMatchingFiles.has(project.id)
        )
        : sortedProjects;

    const projectIdsInView = new Set(filteredSortedProjects.map((project) => project.id));

    const filteredSortedFiles = term
        ? sortedFiles.filter((file) => {
            if (file.project_id && projectIdsInView.has(file.project_id)) {
                const project = filteredSortedProjects.find((item) => item.id === file.project_id);
                // Se matcha il nome progetto, mostra l'intero gruppo progetto+file.
                if (project && project.name.toLowerCase().includes(term)) {
                    return true;
                }
            }

            return file.name.toLowerCase().includes(term);
        })
        : sortedFiles;

    // Raggruppa i contenuti per data (chiave stabile) e lega i files ai rispettivi progetti.
    const groupedByDate = (() => {
        const groups: Record<string, { label: string; projects: ProjectsRecord[]; standaloneFiles: FilesRecord[] }> = {};

        const ensureGroup = (dateKey: string, dateLabel: string) => {
            if (!groups[dateKey]) {
                groups[dateKey] = { label: dateLabel, projects: [], standaloneFiles: [] };
            }
        };

        filteredSortedProjects.forEach((project) => {
            const dateKey = project.date || 'no-date';
            const dateLabel = project.date ? new Date(project.date).toLocaleDateString() : 'Senza data';
            ensureGroup(dateKey, dateLabel);
            groups[dateKey].projects.push(project);
        });

        filteredSortedFiles.forEach((file) => {
            const dateKey = file.date || 'no-date';
            const dateLabel = file.date ? new Date(file.date).toLocaleDateString() : 'Senza data';
            ensureGroup(dateKey, dateLabel);

            if (!file.project_id) {
                groups[dateKey].standaloneFiles.push(file);
            }
        });

        return groups;
    })();

    const groupedDateKeys = Object.keys(groupedByDate).sort(
        (a, b) => new Date(a === 'no-date' ? 0 : a).getTime() - new Date(b === 'no-date' ? 0 : b).getTime()
    );

    useEffect(() => {
        fetchFilesAndProjects(buildingSiteId);
    }, [buildingSiteId]);

    return(
        <>
            <div className="container py-4">
                <SearchBarComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {groupedDateKeys.map((dateKey) => (
                    <div key={dateKey} className="mb-5">
                        {/* Header della Data */}
                        <div className="d-flex align-items-center mb-3">
                            <h5 className="text-secondary fw-bold mb-0 me-3">{groupedByDate[dateKey].label}</h5>
                            <div className="flex-grow-1 border-bottom opacity-25"></div>
                        </div>

                        <div className="d-flex flex-column gap-4">
                            {groupedByDate[dateKey].projects.map((project) => {
                                const projectFiles = filteredSortedFiles.filter(
                                    (file) => file.project_id === project.id
                                );

                                return (
                                    <div key={project.id} className="border rounded-4 p-3 bg-light-subtle">
                                        <div className="small fw-semibold text-muted text-uppercase mb-3">Progetto e file associati</div>

                                        <div className="row g-4 mb-2">
                                            <FileCardComponent
                                                handleDeleteClick={() => {}}
                                                title={project.name}
                                                biIconName={"bi-pencil-square"}
                                                handleCardClick={() => {}}
                                                itemId={project.id}
                                                deletable={false}
                                            />
                                        </div>

                                        {projectFiles.length > 0 ? (
                                            <div className="row g-4">
                                                {projectFiles.map((item) => (
                                                    <FileCardComponent
                                                        key={item.id}
                                                        handleDeleteClick={ () => {
                                                            setItemToDeleteId(item.id);
                                                            setItemToDeleteStorageKey(item.storage_key);
                                                            deleteFile();
                                                        }}
                                                        title={item.name}
                                                        biIconName={getFileIcon(item.file_type)}
                                                        handleCardClick={() => setSelectedFile(item)}
                                                        itemId={item.id}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-muted small">Nessun file associato a questo progetto.</div>
                                        )}
                                    </div>
                                );
                            })}

                            {groupedByDate[dateKey].standaloneFiles.length > 0 && (
                                <div className="row g-4">
                                    {groupedByDate[dateKey].standaloneFiles.map((item) => (
                                        <FileCardComponent
                                            key={item.id}
                                            handleDeleteClick={ () => {
                                                setItemToDeleteId(item.id);
                                                setItemToDeleteStorageKey(item.storage_key);
                                                deleteFile();
                                            }}
                                            title={item.name}
                                            biIconName={getFileIcon(item.file_type)}
                                            handleCardClick={() => setSelectedFile(item)}
                                            itemId={item.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <AddRecordComponent
                tableName="files"
                buildingSiteId={buildingSiteId}
                selectedDate={selectedDate}
                onSuccess={() => fetchFilesAndProjects(buildingSiteId)}
                handleEditFile={(fileAlreadyExists) => handleEditFile(fileAlreadyExists)}
            />
            {deleteRecordPopup && 
                <DeleteRecordComponent tableName={"files"} recordId={itemToDeleteId}
                    onClose={() => {
                        fetchFilesAndProjects(buildingSiteId);
                        isDeleteRecordPopupVisible(false)
                    }}
                    onSuccess={() => {
                        fetchFilesAndProjects(buildingSiteId);
                        isDeleteRecordPopupVisible(false);
                    }}
                />
            }
            {selectedFile && (
                <FileViewerComponent 
                    storageKey={selectedFile.storage_key} 
                    fileType={selectedFile.file_type} 
                    fileName={selectedFile.name} 
                    onClose={() => setSelectedFile(null)} 
                />
            )}
        </>
    )
}

async function fetchFilesFromBuildingSiteId(id: number): Promise<FilesRecord[]> {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/api/file-manager/files/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        });

        if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data: FilesRecord[] = await response.json();
        return data;
        
    } catch (error) {
        console.error("Errore durante il recupero dei file:", error);
        return [];
    }
}

async function fetchProjectsFromBuildingSiteId(id: number): Promise<ProjectsRecord[]> {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/api/file-manager/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data: ProjectsRecord[] = await response.json();
        return data;
    } catch (error) {
        console.error('Errore durante il recupero dei progetti:', error);
        return [];
    }
}

const getFileIcon = (mimeType: string) => {
  const icons: Record<string, string> = {
    'application/pdf': 'bi-file-earmark-pdf',
    'image/jpeg': 'bi-file-earmark-image',
    'image/png': 'bi-file-earmark-image',
    'image/webp': 'bi-file-earmark-image',
    'application/vnd.ms-excel': 'bi-file-earmark-excel',
    'application/vnd.openxmlformats-offic': 'bi-file-earmark-excel',
    'text/csv': 'bi-filetype-csv',
  };

  // Se non trova il tipo specifico, mette un'icona generica per file
  return icons[mimeType] || 'bi-file-earmark';
};

const deleteFileFromCloudStorage = async (storageKey: string) => {

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${apiUrl}/api/file-manager/delete-file/${encodeURIComponent(storageKey)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Errore:', data.error);
        }
    } catch (error) {
        console.error('Errore di rete:', error);
    }
};