import React, { useState, type ChangeEvent, type FormEvent } from 'react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

type InsertImageComponentProps = {
    buildingSiteId: string;
};

const InsertImageComponent = ({ buildingSiteId }: InsertImageComponentProps) => {

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
    const [fileDate, setFileDate] = useState<Date>(new Date());
    const [downloadUrls, setDownloadUrls] = useState<string[]>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        if (!isUploading) setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (isUploading) return;

        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            setSelectedFiles(Array.from(droppedFiles));
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

                // 3. Richiesta link di download/registrazione
                const resLink2 = await fetch(`${apiUrl}/api/file-manager/get-download-link`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ storageKey })
                });

                if (!resLink2.ok) throw new Error('Errore nella richiesta del link di download');

                const { uploadUrl: downloadUrl } = await resLink2.json();

                setDownloadUrls(prev => [...prev, downloadUrl]);

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

    return(
        <form onSubmit={handleMultipleUploads} className="collapse" id="uploadFileSection">
            <div className="p-4 border border-primary border-opacity-25 rounded-4 bg-light shadow-sm">
                <div className="mb-4 text-center">
                    <label className="form-label d-block mb-3 small fw-bold text-uppercase text-primary letter-spacing-1">
                        2. Scegli i File
                    </label>
                    <label
                        htmlFor="fileInput"
                        className={`w-100 d-block rounded-4 border border-2 p-4 bg-white cursor-pointer transition-all ${
                            isDragging
                                ? 'border-primary shadow'
                                : 'border-primary border-opacity-25'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{
                            borderStyle: 'dashed',
                            cursor: isUploading ? 'not-allowed' : 'pointer',
                            background: isDragging
                                ? 'linear-gradient(135deg, rgba(13,110,253,0.12), rgba(13,110,253,0.04))'
                                : 'linear-gradient(135deg, rgba(13,110,253,0.06), rgba(255,255,255,1))'
                        }}
                    >
                        <input 
                            className="d-none"
                            type="file" 
                            id="fileInput" 
                            multiple 
                            onChange={handleFileChange} 
                            disabled={isUploading}
                        />

                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                                <i className="bi bi-cloud-arrow-up text-primary fs-2"></i>
                            </div>
                            <p className="mb-1 fw-bold text-primary">Trascina i file qui o clicca per aggiungere</p>
                            <small className="text-muted">Supporto multiplo: documenti, immagini e video</small>
                        </div>
                    </label>
                    
                    {selectedFiles.length > 0 && (
                        <div className="mt-2 animate__animated animate__fadeIn">
                            <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">
                                <i className="bi bi-check2-all me-1"></i>
                                {selectedFiles.length} file pronti all'invio
                            </span>
                            <div className="small text-muted mt-2">
                                {selectedFiles.slice(0, 3).map((file) => file.name).join(' • ')}
                                {selectedFiles.length > 3 ? ' • ...' : ''}
                            </div>
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
)
}

