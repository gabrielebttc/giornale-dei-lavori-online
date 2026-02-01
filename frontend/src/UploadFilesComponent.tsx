import React, { useState, type ChangeEvent, type FormEvent } from 'react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface UploadFilesProps {
    buildingSiteId: number | string;
}

const UploadFilesComponent: React.FC<UploadFilesProps> = ({ buildingSiteId }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ text: string; type: string } | null>(null);

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

                // 2. Upload binario su Backblaze B2
                const resB2 = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                });

                if (!resB2.ok) {
                    console.error("Upload fallito su storage");
                    throw new Error("Upload fallito su storage");
                }

                // 3. Conferma nel Database
                const resConfirm = await fetch(`${apiUrl}/api/file-manager/confirm-file-upload`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        storageKey, 
                        originalName: file.name, 
                        buildingSiteId, 
                        mimeType: file.type 
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

    return (
        <div className="card shadow-sm p-4">
            <h5 className="card-title mb-3">Allega Documenti o Foto</h5>
            
            <form onSubmit={handleMultipleUploads}>
                <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label">Seleziona file</label>
                    <input 
                        className="form-control" 
                        type="file" 
                        id="fileInput" 
                        multiple 
                        onChange={handleFileChange} 
                        disabled={isUploading}
                    />
                </div>

                {selectedFiles.length > 0 && (
                    <div className="mb-3">
                        <small className="text-muted">File pronti per l'invio: {selectedFiles.length}</small>
                    </div>
                )}

                {message && (
                    <div className={`alert alert-${message.type} py-2`} role="alert">
                        {message.text}
                    </div>
                )}

                <button 
                    type="submit" 
                    className="btn btn-primary w-100" 
                    disabled={isUploading || selectedFiles.length === 0}
                >
                    {isUploading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : 'Avvia Upload'}
                </button>
            </form>
        </div>
    );
};

export default UploadFilesComponent;