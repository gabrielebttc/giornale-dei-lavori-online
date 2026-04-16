import { useEffect, useState } from "react";
import { formatDateLong } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import AddRecordComponent from "./AddRecordComponent";
import type { FilesRecord, ProjectsRecord } from "./types/dbTables";
import DeleteRecordComponent from "./DeleteRecordComponent";
import FileViewerComponent from "./FileViewerComponent";

import FileCardComponent from "./FileCardComponent";
import CollaboraEditorComponent from "./CollaboraEditorComponent";
import './styles/FileManagerComponent.css';
import { apiFetch } from '../utils/apiFetch';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

type FileManagerComponentProps = {
    buildingSiteId: number,
    selectedDate: string,
    handleEditFile: (fileAlreadyExists: boolean) => void;
}

export default function FileManagerComponent({ buildingSiteId, selectedDate, handleEditFile }: FileManagerComponentProps) {
    const navigate = useNavigate();

    const [filesList, setFilesList] = useState<FilesRecord[]>([]);
    const [projectsList, setProjectsList] = useState<ProjectsRecord[]>([]);
    const [deleteRecordPopup, isDeleteRecordPopupVisible] = useState<boolean>(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<number>(0);
    const [itemToDeleteStorageKey, setItemToDeleteStorageKey] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<FilesRecord | null>(null);
    const [collaboraFile, setCollaboraFile] = useState<FilesRecord | null>(null);
    const [newCollaboraFile, setNewCollaboraFile] = useState<{ id: number; name: string } | null>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectsRecord | null>(null);
    const [deleteProjectPopup, isDeleteProjectPopupVisible] = useState<boolean>(false);
    const [projectToDeleteId, setProjectToDeleteId] = useState<number>(0);

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

    const normalizeDateKey = (value?: string | null) => {
        if (!value) return '';
        const raw = String(value);

        if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
            return raw.slice(0, 10);
        }

        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) return '';
        return parsed.toISOString().slice(0, 10);
    };

    const areSameCalendarDate = (left?: string | null, right?: string | null) => {
        const leftKey = normalizeDateKey(left);
        const rightKey = normalizeDateKey(right);
        return leftKey !== '' && leftKey === rightKey;
    };

    // Raggruppa i contenuti per data (chiave stabile) e lega i files ai rispettivi progetti.
    const groupedByDate = (() => {
        const groups: Record<string, { label: string; projects: ProjectsRecord[]; standaloneFiles: Array<{ file: FilesRecord; warning: string | null }> }> = {};
        const projectsById = new Map(sortedProjects.map((project) => [project.id, project]));

        const ensureGroup = (dateKey: string, dateLabel: string) => {
            if (!groups[dateKey]) {
                groups[dateKey] = { label: dateLabel, projects: [], standaloneFiles: [] };
            }
        };

        filteredSortedProjects.forEach((project) => {
            const dateKey = project.date || 'no-date';
            const dateLabel = project.date ? formatDateLong(project.date) : 'Senza data';
            ensureGroup(dateKey, dateLabel);
            groups[dateKey].projects.push(project);
        });

        filteredSortedFiles.forEach((file) => {
            const dateKey = file.date || 'no-date';
            const dateLabel = file.date ? formatDateLong(file.date) : 'Senza data';
            ensureGroup(dateKey, dateLabel);

            const linkedProject = file.project_id ? projectsById.get(file.project_id) : null;
            const isDateMismatch = Boolean(linkedProject) && !areSameCalendarDate(file.date, linkedProject?.date);
            const canStayInsideProject = Boolean(linkedProject) && areSameCalendarDate(file.date, linkedProject?.date);

            if (!file.project_id || isDateMismatch || !canStayInsideProject) {
                groups[dateKey].standaloneFiles.push({
                    file,
                    warning: isDateMismatch
                        ? 'Attenzione, questo file e associato ad un progetto con una data diversa'
                        : null,
                });
            }
        });

        return groups;
    })();

    const groupedDateKeys = Object.keys(groupedByDate).sort(
        (a, b) => new Date(b === 'no-date' ? 0 : b).getTime() - new Date(a === 'no-date' ? 0 : a).getTime()
    );

    useEffect(() => {
        fetchFilesAndProjects(buildingSiteId);
    }, [buildingSiteId]);

    const totalItems = filteredSortedProjects.length + filteredSortedFiles.length;

    return (
        <>
        <div className="fm-page">

            {/* Barra di ricerca */}
            <div className="fm-search-wrap mb-4">
                <i className="bi bi-search fm-search-icon" />
                <input
                    type="text"
                    className="fm-search-input"
                    placeholder="Cerca per nome documento o file..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Stato vuoto */}
            {totalItems === 0 && (
                <div className="fm-empty">
                    <div className="fm-empty-icon">
                        <i className="bi bi-folder2-open" />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#bbb' }}>
                        {searchTerm ? 'Nessun risultato per la ricerca.' : 'Nessun documento o file caricato.'}
                    </p>
                </div>
            )}

            {/* Gruppi per data */}
            {groupedDateKeys.map((dateKey) => (
                <div key={dateKey} style={{ marginBottom: '2.25rem' }}>

                    {/* Header data */}
                    <div className="fm-date-header">
                        <div className="fm-date-pill">
                            <i className="bi bi-calendar3" />
                            {groupedByDate[dateKey].label}
                        </div>
                        <div className="fm-date-line"></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                        {/* Progetti con Documenti */}
                        {groupedByDate[dateKey].projects.map((project) => {
                            const projectFiles = filteredSortedFiles.filter(
                                (file) => file.project_id === project.id && areSameCalendarDate(file.date, project.date)
                            );
                            return (
                                <div key={project.id} className="fm-project-group">
                                    <div className="fm-project-group-header">
                                        <span className="fm-project-badge">
                                            <i className="bi bi-pencil-square me-1" />
                                            Documento modificabile
                                        </span>
                                    </div>
                                    <div className="fm-project-body">
                                        {/* Card progetto */}
                                        <div className="fm-grid" style={{ marginBottom: projectFiles.length > 0 ? '16px' : 0 }}>
                                            <FileCardComponent
                                                handleDeleteClick={() => {
                                                    setProjectToDeleteId(project.id);
                                                    isDeleteProjectPopupVisible(true);
                                                }}
                                                title={project.name}
                                                biIconName="bi-pencil-square"
                                                handleCardClick={() => setSelectedProject(project)}
                                                itemId={project.id}
                                            />
                                        </div>

                                        {/* Documenti */}
                                        {projectFiles.length > 0 && (
                                            <>
                                                <div className="fm-attachments-label">
                                                    <i className="bi bi-paperclip" />
                                                    Documenti ({projectFiles.length})
                                                </div>
                                                <div className="fm-grid">
                                                    {projectFiles.map((file) => (
                                                        <FileCardComponent
                                                            key={file.id}
                                                            handleDeleteClick={() => {
                                                                setItemToDeleteId(file.id);
                                                                setItemToDeleteStorageKey(file.storage_key);
                                                                deleteFile();
                                                            }}
                                                            title={file.name}
                                                            biIconName={getFileIcon(file.file_type)}
                                                            handleCardClick={() => {
                                                                if (isCollaboraEditable(file.name)) {
                                                                    setCollaboraFile(file);
                                                                } else {
                                                                    setSelectedFile(file);
                                                                }
                                                            }}
                                                            itemId={file.id}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        {projectFiles.length === 0 && (
                                            <p className="fm-no-attachments">Nessun Documento associato.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* File standalone */}
                        {groupedByDate[dateKey].standaloneFiles.length > 0 && (
                            <div className="fm-grid">
                                {groupedByDate[dateKey].standaloneFiles.map(({ file, warning }) => (
                                    <FileCardComponent
                                        key={file.id}
                                        handleDeleteClick={() => {
                                            setItemToDeleteId(file.id);
                                            setItemToDeleteStorageKey(file.storage_key);
                                            deleteFile();
                                        }}
                                        title={file.name}
                                        biIconName={getFileIcon(file.file_type)}
                                        handleCardClick={() => {
                                            if (isCollaboraEditable(file.name)) {
                                                setCollaboraFile(file);
                                            } else {
                                                setSelectedFile(file);
                                            }
                                        }}
                                        itemId={file.id}
                                        warningText={warning || undefined}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Overlay e Modal */}
        <AddRecordComponent
            tableName="files"
            buildingSiteId={buildingSiteId}
            selectedDate={selectedDate}
            onSuccess={() => fetchFilesAndProjects(buildingSiteId)}
            handleEditFile={(fileAlreadyExists) => handleEditFile(fileAlreadyExists)}
            onCollaboraFileCreated={(fileId, fileName) => {
                fetchFilesAndProjects(buildingSiteId);
                setNewCollaboraFile({ id: fileId, name: fileName });
            }}
        />

        {deleteRecordPopup && (
            <DeleteRecordComponent
                tableName="files"
                recordId={itemToDeleteId}
                onClose={() => { fetchFilesAndProjects(buildingSiteId); isDeleteRecordPopupVisible(false); }}
                onSuccess={() => { fetchFilesAndProjects(buildingSiteId); isDeleteRecordPopupVisible(false); }}
            />
        )}

        {selectedFile && (
            <FileViewerComponent
                storageKey={selectedFile.storage_key}
                fileType={selectedFile.file_type}
                fileName={selectedFile.name}
                onClose={() => setSelectedFile(null)}
            />
        )}

        {selectedProject && (
            <FileViewerComponent
                storageKey=""
                fileType="platformProject"
                fileName={selectedProject.name}
                projectId={selectedProject.id}
                onClose={() => setSelectedProject(null)}
                onEdit={() => navigate(`/edit-document/${buildingSiteId}/${selectedDate}?projectId=${selectedProject.id}`)}
            />
        )}

        {deleteProjectPopup && (
            <DeleteRecordComponent
                tableName="projects"
                recordId={projectToDeleteId}
                onClose={() => { fetchFilesAndProjects(buildingSiteId); isDeleteProjectPopupVisible(false); }}
                onSuccess={() => { fetchFilesAndProjects(buildingSiteId); isDeleteProjectPopupVisible(false); }}
            />
        )}

        {collaboraFile && (
            <CollaboraEditorComponent
                fileId={collaboraFile.id}
                fileName={collaboraFile.name}
                onClose={() => setCollaboraFile(null)}
            />
        )}

        {newCollaboraFile && (
            <CollaboraEditorComponent
                fileId={newCollaboraFile.id}
                fileName={newCollaboraFile.name}
                onClose={() => { setNewCollaboraFile(null); fetchFilesAndProjects(buildingSiteId); }}
            />
        )}
        </>
    )
}

async function fetchFilesFromBuildingSiteId(id: number): Promise<FilesRecord[]> {
    try {
        const response = await apiFetch(`${apiUrl}/api/file-manager/files/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
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

async function fetchProjectsFromBuildingSiteId(buildingSiteId: number): Promise<ProjectsRecord[]> {
    try {
        const response = await apiFetch(`${apiUrl}/api/projects-manager/building-sites/${buildingSiteId}/projects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

const COLLABORA_EXTENSIONS = ['.docx', '.doc', '.odt', '.xlsx', '.xls', '.ods', '.pptx', '.ppt', '.odp'];

const isCollaboraEditable = (fileName: string): boolean => {
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return COLLABORA_EXTENSIONS.includes(ext);
};

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
    try {
        const response = await apiFetch(`${apiUrl}/api/file-manager/delete-file/${encodeURIComponent(storageKey)}`, {
            method: 'DELETE',
            headers: {
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