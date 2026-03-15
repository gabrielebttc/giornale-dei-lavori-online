import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarComponent from './CalendarComponent';
import FileCardComponent from './FileCardComponent';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface UploadFilesProps {
    buildingSiteId: number | string;
    selectedDate?: string;
}

const UploadFilesComponent: React.FC<UploadFilesProps> = ({ buildingSiteId, selectedDate = "2000-01-01"}) => {

    const navigate = useNavigate();

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
    const [fileDate, setFileDate] = useState<Date>(new Date());

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleMultipleUploads = async (event: FormEvent) => {
        event.preventDefault();
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        setMessage({ text: "Caricamento in corso...", type: "info" });

        const uploadPromises = selectedFiles.map(async (file) => {
            try {
                // 1. Richiesta link di upload
                const resLink = await fetch(`${apiUrl}/api/file-manager/get-upload-link`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        fileName: file.name, 
                        fileType: file.type, 
                        buildingSiteId
                    }),
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const { uploadUrl, storageKey } = await resLink.json();

                // 2. Upload binario
                const resB2 = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                });

                if (!resB2.ok) throw new Error("Upload fallito su storage");

                // 3. Conferma nel Database (Passando la data selezionata)
                const resConfirm = await fetch(`${apiUrl}/api/file-manager/confirm-file-upload`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        storageKey, 
                        originalName: file.name, 
                        buildingSiteId,
                        mimeType: file.type,
                        date: fileDate
                    }),
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                return resConfirm.ok;
            } catch (err) {
                console.error(`Errore file ${file.name}:`, err);
                return false;
            }
        });

        const results = await Promise.all(uploadPromises);
        const successCount = results.filter(r => r).length;

        setIsUploading(false);
        setSelectedFiles([]);
        setMessage({ 
            text: `Caricati con successo ${successCount} di ${selectedFiles.length} file.`, 
            type: successCount === selectedFiles.length ? "success" : "warning" 
        });
    };

    // upload file
    return (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header con gradiente discreto */}
            <div className="bg-primary bg-gradient p-3 text-white">
                <h6 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-cloud-arrow-up-fill me-2 fs-5"></i>
                    Gestione Documenti
                </h6>
            </div>

            <div className="card-body p-4">
                {/* Pulsanti di azione - Layout a card */}
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <button 
                            className="btn btn-outline-primary w-100 h-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2"
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#uploadFileSection" 
                            aria-expanded="false"
                        >
                            <i className="bi bi-laptop fs-3 mb-2"></i>
                            <span className="fw-bold">Carica dal PC</span>
                        </button>
                    </div>
                    <div className="col-md-6">
                        <a className="btn btn-outline-secondary w-100 h-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2"
                            data-bs-toggle="collapse" href="#createFileSection" role="button" 
                            aria-expanded="false" aria-controls="collapseExample">
                                <i className="bi bi-file-earmark-plus fs-3 mb-2"></i>
                                <span className="fw-bold">Crea Documento</span>
                        </a>
                    </div>
                </div>

                {/* Sezione Upload Collassabile */}
                <form onSubmit={handleMultipleUploads} className="collapse" id="uploadFileSection">
                    <div className="p-4 border border-primary border-opacity-25 rounded-4 bg-light shadow-sm">
                        
                        <div className="mb-4 text-center">
                            <label className="form-label d-block mb-3 small fw-bold text-uppercase text-primary letter-spacing-1">
                                1. Seleziona la Data
                            </label>
                            <div className="d-inline-block p-2 bg-white rounded-3 shadow-sm border w-100">
                                <CalendarComponent 
                                    onDateSelect={(date) => setFileDate(date)} 
                                    selectedDate={fileDate}
                                />
                            </div>
                        </div>

                        <div className="mb-4 text-center">
                            <label className="form-label d-block mb-3 small fw-bold text-uppercase text-primary letter-spacing-1">
                                2. Scegli i File
                            </label>
                            <div className="input-group">
                                <input 
                                    className="form-control form-control-lg rounded-start-3 fs-6" 
                                    type="file" 
                                    id="fileInput" 
                                    multiple 
                                    onChange={handleFileChange} 
                                    disabled={isUploading}
                                />
                                <span className="input-group-text bg-white px-3 border-start-0 rounded-end-3">
                                    <i className="bi bi-files text-muted"></i>
                                </span>
                            </div>
                            
                            {selectedFiles.length > 0 && (
                                <div className="mt-2 animate__animated animate__fadeIn">
                                    <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">
                                        <i className="bi bi-check2-all me-1"></i>
                                        {selectedFiles.length} file pronti all'invio
                                    </span>
                                </div>
                            )}
                        </div>

                        {message && (
                            <div className={`alert alert-${message.type} border-0 shadow-sm rounded-3 py-3 mb-4 d-flex align-items-center`} role="alert">
                                <i className={`bi ${message.type === 'danger' ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2 fs-5`}></i>
                                <div>{message.text}</div>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg w-100 rounded-3 shadow py-3 transition-all fw-bold" 
                            disabled={isUploading || selectedFiles.length === 0}
                        >
                            {isUploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Caricamento in corso...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-cloud-upload me-2"></i>
                                    Avvia Upload
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Sezione Create Collassabile */}
                <form className="collapse" id="createFileSection">
                    <div className="p-4 border border-primary border-opacity-25 rounded-4 bg-light shadow-sm">
                        <label className="form-label d-block mb-4 small fw-bold text-uppercase text-primary letter-spacing-1">
                            Seleziona Template
                        </label>
                        <FileCardComponent 
                            handleDeleteClick={ () => {
                                console.log("Eliminazione Tema");
                            }}
                            title={"Documento Vuoto"}
                            biIconName={"bi-file-earmark-plus"}
                            handleCardClick={() => navigate(`/action-page/edit-document/${buildingSiteId}/${selectedDate}`)}
                            itemId={0}
                            deletable={false}
                        />
                    </div>
                </form>

            </div>
        </div>
    );
};

export default UploadFilesComponent;
