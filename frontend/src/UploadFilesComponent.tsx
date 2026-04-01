import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarComponent from './CalendarComponent';
import FileCardComponent from './FileCardComponent';
import DeleteRecordComponent from './DeleteRecordComponent';
import LoadingScreen from './LoadingScreen';
import { dateToString, stringToDate } from '../utils/formatDate';
import { apiFetch } from '../utils/apiFetch';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface UploadFilesProps {
    buildingSiteId: number | string;
    selectedDate?: string;
    handleEditFile?: () => void;
}

const UploadFilesComponent: React.FC<UploadFilesProps> = ({ buildingSiteId, selectedDate = "2000-01-01", handleEditFile }) => {

    const navigate = useNavigate();

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
    const [fileDate, setFileDate] = useState<string>(dateToString(new Date()));

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
                const resLink = await apiFetch(`${apiUrl}/api/file-manager/get-upload-link`, {
                    method: 'POST',
                    body: JSON.stringify({
                        fileName: file.name,
                        fileType: file.type,
                        buildingSiteId
                    }),
                    headers: {
                        'Content-Type': 'application/json',
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
                const resConfirm = await apiFetch(`${apiUrl}/api/file-manager/confirm-file-upload`, {
                    method: 'POST',
                    body: JSON.stringify({
                        storageKey,
                        originalName: file.name,
                        buildingSiteId,
                        mimeType: file.type,
                        date: new Date(fileDate).toISOString()
                    }),
                    headers: {
                        'Content-Type': 'application/json',
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
        handleEditFile?.();
        setMessage({ 
            text: `Caricati con successo ${successCount} di ${selectedFiles.length} file.`, 
            type: successCount === selectedFiles.length ? "success" : "warning" 
        });
    };

    const [templates, setTemplates] = useState<{ id: number; name: string }[]>([]);
    const [templateToDeleteId, setTemplateToDeleteId] = useState<number | null>(null);

    const fetchTemplates = async () => {
        try {
            const response = await apiFetch(`${apiUrl}/api/templates-manager/templates`, {
            });
            if (!response.ok) return;
            const data = await response.json();
            setTemplates(data);
        } catch (err) {
            console.error('Errore nel caricamento dei template:', err);
        }
    };

    useEffect(() => { fetchTemplates(); }, []);

    const handleCreateFromTemplate = async (templateId: number) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Recupera il contenuto del template
            const templateRes = await apiFetch(`${apiUrl}/api/templates-manager/templates/${templateId}`, {
            });
            if (!templateRes.ok) throw new Error('Template non trovato');
            const template = await templateRes.json();

            // Crea un nuovo progetto a partire dal contenuto del template
            const response = await apiFetch(`${apiUrl}/api/projects-manager/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: template.name,
                    content_json: template.content_json,
                    metadata: { source: 'template', template_id: templateId },
                    building_site_id: Number(buildingSiteId),
                    date: new Date(fileDate).toISOString(),
                }),
            });
            if (!response.ok) throw new Error(`Errore creazione progetto: ${response.status}`);
            const created = await response.json();
            setIsLoading(false);
            navigate(`/edit-document/${buildingSiteId}/${selectedDate}?projectId=${created.id}`);
        } catch (error) {
            setIsLoading(false);
            console.error('Errore creazione da template:', error);
            setMessage({ text: 'Errore durante la creazione del documento. Riprova.', type: 'danger' });
        }
    };

    const [templateName, setTemplateName] = useState<string>('');
    const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
    const [templateMessage, setTemplateMessage] = useState<{ text: string; type: string } | null>(null);

    const handleCreateTemplate = async () => {
        if (!templateName.trim()) {
            setTemplateMessage({ text: 'Inserisci un nome per il template.', type: 'warning' });
            return;
        }
        setIsCreatingTemplate(true);
        setTemplateMessage(null);
        try {
            const token = localStorage.getItem('token');
            const response = await apiFetch(`${apiUrl}/api/templates-manager/templates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: templateName.trim(),
                    content_json: {
                        type: 'doc',
                        content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }],
                    },
                }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Errore nella creazione del template');
            }
            const created = await response.json();
            navigate(`/edit-document/${buildingSiteId}/${selectedDate}?templateId=${created.id}`);
        } catch (error) {
            console.error('Errore creazione template:', error);
            setTemplateMessage({ text: 'Errore durante la creazione del template. Riprova.', type: 'danger' });
            setIsCreatingTemplate(false);
        }
    };

    const handleCreateUntitledProject = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await apiFetch(`${apiUrl}/api/projects-manager/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Progetto senza titolo',
                    content_json: {
                        type: 'doc',
                        content: [
                            {
                                type: 'paragraph',
                                content: [{ type: 'text', text: 'Nuovo documento' }],
                            },
                        ],
                    },
                    metadata: {
                        source: 'upload-files-component',
                    },
                    building_site_id: Number(buildingSiteId),
                    date: new Date(fileDate).toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error(`Errore nella creazione progetto: ${response.status}`);
            }

            const createdProject = await response.json();
            setIsLoading(false);
            navigate(
                `/edit-document/${buildingSiteId}/${selectedDate}?projectId=${createdProject.id}`
            );
        } catch (error) {
            setIsLoading(false);
            console.error('Errore creazione progetto:', error);
            setMessage({
                text: 'Errore durante la creazione del progetto. Riprova.',
                type: 'danger',
            });
        }
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
                    <div className="col-md-4">
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
                    <div className="col-md-4">
                        <a className="btn btn-outline-secondary w-100 h-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2"
                            data-bs-toggle="collapse" href="#createFileSection" role="button"
                            aria-expanded="false" aria-controls="createFileSection">
                                <i className="bi bi-file-earmark-plus fs-3 mb-2"></i>
                                <span className="fw-bold">Crea Documento</span>
                        </a>
                    </div>
                    <div className="col-md-4">
                        <button
                            className="btn btn-outline-warning w-100 h-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#createTemplateSection"
                            aria-expanded="false"
                        >
                            <i className="bi bi-layout-text-window-reverse fs-3 mb-2"></i>
                            <span className="fw-bold">Crea Template</span>
                        </button>
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
                                    onDateSelect={(date) => setFileDate(dateToString(date))}
                                    selectedDate={stringToDate(fileDate)}
                                />
                            </div>
                        </div>

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

                {/* Sezione Create Collassabile */}
                <div className="collapse" id="createFileSection">
                    <div className="p-4 border border-secondary border-opacity-25 rounded-4 bg-light shadow-sm">

                        <div className="mb-4 text-center">
                            <label className="form-label d-block mb-3 small fw-bold text-uppercase text-secondary letter-spacing-1">
                                1. Seleziona la Data del Documento
                            </label>
                            <div className="d-inline-block p-2 bg-white rounded-3 shadow-sm border w-100">
                                <CalendarComponent
                                    onDateSelect={(date) => setFileDate(dateToString(date))}
                                    selectedDate={stringToDate(fileDate)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label d-block mb-3 small fw-bold text-uppercase text-secondary letter-spacing-1 text-center">
                                2. Scegli il Template da cui Partire
                            </label>
                        <FileCardComponent
                            handleDeleteClick={() => {}}
                            title={"Documento Vuoto"}
                            biIconName={"bi-file-earmark-plus"}
                            handleCardClick={() => { void handleCreateUntitledProject(); }}
                            itemId={0}
                            deletable={false}
                        />
                        {templates.map((template) => (
                            <FileCardComponent
                                key={template.id}
                                handleDeleteClick={() => setTemplateToDeleteId(template.id)}
                                title={template.name}
                                biIconName={"bi-layout-text-window-reverse"}
                                handleCardClick={() => { void handleCreateFromTemplate(template.id); }}
                                itemId={template.id}
                                deletable={true}
                            />
                        ))}
                        {templates.length === 0 && (
                            <p className="text-muted small mt-3 mb-0">
                                <i className="bi bi-info-circle me-1"></i>
                                Nessun template salvato. Creane uno dal tasto "Crea Template".
                            </p>
                        )}
                        </div>
                    </div>
                </div>

                {/* Sezione Crea Template Collassabile */}
                <div className="collapse mt-3" id="createTemplateSection">
                    <div className="p-4 border border-warning border-opacity-50 rounded-4 bg-light shadow-sm">
                        <label className="form-label d-block mb-3 small fw-bold text-uppercase text-warning letter-spacing-1">
                            Nome del template
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-3 mb-3"
                            placeholder="Es. Verbale di cantiere, Relazione settimanale..."
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                        />
                        {templateMessage && (
                            <div className={`alert alert-${templateMessage.type} border-0 shadow-sm rounded-3 py-2 mb-3`} role="alert">
                                {templateMessage.text}
                            </div>
                        )}
                        <button
                            type="button"
                            className="btn btn-warning w-100 rounded-3 fw-bold py-2"
                            onClick={handleCreateTemplate}
                            disabled={isCreatingTemplate}
                        >
                            {isCreatingTemplate ? (
                                <><span className="spinner-border spinner-border-sm me-2" />Creazione...</>
                            ) : (
                                <><i className="bi bi-layout-text-window-reverse me-2" />Crea Template</>
                            )}
                        </button>
                    </div>
                </div>

            </div>
            <LoadingScreen isLoading={isLoading} />

            {templateToDeleteId !== null && (
                <DeleteRecordComponent
                    tableName="templates"
                    recordId={templateToDeleteId}
                    onClose={() => setTemplateToDeleteId(null)}
                    onSuccess={() => { fetchTemplates(); setTemplateToDeleteId(null); }}
                />
            )}
        </div>
    );
};

export default UploadFilesComponent;
