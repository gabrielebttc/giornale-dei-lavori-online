import { useEffect, useState } from "react";
import AddRecordComponent from "./AddRecordComponent";
import type { FilesRecord } from "./types/dbTables";
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
    const [deleteRecordPopup, isDeleteRecordPopupVisible] = useState<boolean>(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<number>(0);
    const [itemToDeleteStorageKey, setItemToDeleteStorageKey] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<FilesRecord | null>(null);
    
    const sortedFiles = [...filesList].sort((a, b) => {
        const dateA = new Date(a.date ?? "").getTime();
        const dateB = new Date(b.date ?? "").getTime();
        return dateA - dateB;
    });

    async function deleteFile () {
        isDeleteRecordPopupVisible(true);
        deleteFileFromCloudStorage(itemToDeleteStorageKey); // qualora lo storage_key non fosse un valido storage_key, non riporta alcun errore, non so perchè, ma meglio così
    }

    const fetchFiles = async (buildingSiteId: number) => {
        const data = await fetchFilesFromBuildingSiteId(buildingSiteId);
        setFilesList(data);
    }

    // Logica di ricerca dei files con SearchBarComponent
    const [searchTerm, setSearchTerm] = useState<string>('');
    const filteredSortedFiles = sortedFiles.filter(file => {
        const term = searchTerm.toLowerCase();
        
        return (
            file.name.toLowerCase().includes(term)
        );
    });

    // raggruppa files per data
    const groupedFiles = filteredSortedFiles.reduce<Record<string, FilesRecord[]>>((groups, file) => {
        const date = file.date ? new Date(file.date).toLocaleDateString() : 'Senza data';
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(file);
        return groups;
    }, {});

    useEffect(() => {
        fetchFiles(buildingSiteId);
    }, []);

    return(
        <>
            <div className="container py-4">
                <SearchBarComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {Object.keys(groupedFiles).map((date) => (
                    <div key={date} className="mb-5">
                        {/* Header della Data */}
                        <div className="d-flex align-items-center mb-3">
                            <h5 className="text-secondary fw-bold mb-0 me-3">{date}</h5>
                            <div className="flex-grow-1 border-bottom opacity-25"></div>
                        </div>

                        <div className="row g-4">
                            {groupedFiles[date].map((item) => (
                                <FileCardComponent 
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
                    </div>
                ))}
            </div>
            <AddRecordComponent
                tableName="files"
                buildingSiteId={buildingSiteId}
                selectedDate={selectedDate}
                onSuccess={() => fetchFiles(buildingSiteId)}
                handleEditFile={(fileAlreadyExists) => handleEditFile(fileAlreadyExists)}
            />
            {deleteRecordPopup && 
                <DeleteRecordComponent tableName={"files"} recordId={itemToDeleteId}
                    onClose={() => {
                        fetchFiles(buildingSiteId);
                        isDeleteRecordPopupVisible(false)
                    }}
                    onSuccess={() => {
                        fetchFiles(buildingSiteId);
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