import { useEffect, useState } from "react";
import AddRecordComponent from "./AddRecordComponent";
import type { FilesRecord } from "./types/dbTables";
import DeleteRecordComponent from "./DeleteRecordComponent";
import SearchBarComponent from "./SearchBarComponent";
import FileViewerComponent from "./FileViewerComponent";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

type FileManagerComponenteProps = {
    buildingSiteId: number,
    // selectedDate: Date --> non ci serve per ora
}

export default function FileManagerComponent({ buildingSiteId }: FileManagerComponenteProps) {

    const [filesList, setFilesList] = useState<FilesRecord[]>([]);
    const [deleteRecordPopup, isDeleteRecordPopupVisible] = useState<boolean>(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<number>(0);
    const [selectedFile, setSelectedFile] = useState<FilesRecord | null>(null);
    
    const sortedFiles = [...filesList].sort((a, b) => {
        const dateA = new Date(a.date ?? "").getTime();
        const dateB = new Date(b.date ?? "").getTime();
        return dateA - dateB;
    });

    async function deleteFile (item?: FilesRecord) {
        if(item) {
            setItemToDeleteId(item.id);
            isDeleteRecordPopupVisible(true);
            deleteFileFromCloudStorage(item.storage_key);
        }
    }

    const onFileUploadSuccess = async (buildingSiteId: number) => {
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
        onFileUploadSuccess(buildingSiteId);
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
                                <div className="col-6 col-md-4 col-lg-3" key={item.id}>
                                    <div 
                                        className="card h-100 border-0 shadow-sm overflow-hidden hover-shadow transition-all"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSelectedFile(item)}
                                    >
                                        <div className="card-body d-flex flex-column align-items-center py-4">
                                            {/* Icona File */}
                                            <div 
                                                className="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center mb-3 text-primary"
                                                style={{ width: '50px', height: '50px' }}
                                            >
                                                <i className={`bi ${getFileIcon(item.file_type)} fs-3`}></i>
                                            </div>

                                            {/* Nome File */}
                                            <p className="card-title mb-3 fw-semibold text-dark text-truncate w-100 text-center" style={{ fontSize: '0.8rem' }}>
                                                {item.name}
                                            </p>

                                            {/* Pulsante Elimina */}
                                            <button 
                                                className="btn btn-link text-danger btn-sm p-0 mt-auto decoration-none"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteFile(item);
                                                }}
                                            >
                                                <i className="bi bi-trash3 me-1"></i> Elimina
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <AddRecordComponent tableName="files" buildingSiteId={buildingSiteId} onSuccess={() => onFileUploadSuccess(buildingSiteId)}/>
            {deleteRecordPopup && 
                <DeleteRecordComponent tableName={"files"} recordId={itemToDeleteId}
                    onClose={() => {onFileUploadSuccess(buildingSiteId); isDeleteRecordPopupVisible(false)}}
                    onSuccess={() => {onFileUploadSuccess(buildingSiteId); isDeleteRecordPopupVisible(false)}}
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