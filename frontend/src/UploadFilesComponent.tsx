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
    onCollaboraFileCreated?: (fileId: number, fileName: string) => void;
    onCollaboraTemplateCreated?: (templateId: number, templateName: string) => void;
}

const UploadFilesComponent: React.FC<UploadFilesProps> = ({ buildingSiteId, selectedDate = "2000-01-01", handleEditFile, onCollaboraFileCreated, onCollaboraTemplateCreated }) => {

    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState<'upload' | 'create' | 'template' | 'collabora' | 'collabora_template' | null>(null);

    const toggleSection = (section: 'upload' | 'create' | 'template' | 'collabora' | 'collabora_template') => {
        setActiveSection(prev => prev === section ? null : section);
    };

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

    const COLLABORA_FORMATS = [
        // { label: 'Documento di testo', ext: '.odt', mimeType: 'application/vnd.oasis.opendocument.text', icon: 'bi-file-earmark-word' },
        // { label: 'Foglio di calcolo', ext: '.ods', mimeType: 'application/vnd.oasis.opendocument.spreadsheet', icon: 'bi-file-earmark-excel' },
        // { label: 'Presentazione', ext: '.odp', mimeType: 'application/vnd.oasis.opendocument.presentation', icon: 'bi-file-earmark-slides' },
        { label: 'Word (.docx)', ext: '.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: 'bi-file-earmark-word' },
        { label: 'Excel (.xlsx)', ext: '.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: 'bi-file-earmark-excel' },
        { label: 'PowerPoint (.pptx)', ext: '.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', icon: 'bi-file-earmark-slides' },
    ];

    const [isCreatingCollaboraFile, setIsCreatingCollaboraFile] = useState<boolean>(false);

    // ── Template Collabora ────────────────────────────────────────────────────
    type CollaboraTemplate = { id: number; name: string; file_type: string };
    const [collaboraTemplates, setCollaboraTemplates] = useState<CollaboraTemplate[]>([]);
    const [isCreatingCollaboraTemplate, setIsCreatingCollaboraTemplate] = useState<boolean>(false);
    const [templateToDeleteId, setTemplateToDeleteId] = useState<number | null>(null);

    const fetchCollaboraTemplates = async () => {
        try {
            const res = await apiFetch(`${apiUrl}/api/collabora/templates`, {});
            if (res.ok) setCollaboraTemplates(await res.json());
        } catch { /* silenzioso */ }
    };

    useEffect(() => { fetchCollaboraTemplates(); }, []);

    const handleCreateCollaboraTemplate = async (format: typeof COLLABORA_FORMATS[0]) => {
        if (!onCollaboraTemplateCreated) return;
        setIsCreatingCollaboraTemplate(true);
        try {
            const fileName = `Nuovo template${format.ext}`;
            const res = await apiFetch(`${apiUrl}/api/collabora/templates/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName, fileType: format.mimeType }),
            });
            if (!res.ok) throw new Error('Errore creazione template');
            const { templateId, fileName: createdName } = await res.json();
            onCollaboraTemplateCreated(templateId, createdName);
        } catch (error) {
            console.error('Errore creazione template Collabora:', error);
            setMessage({ text: 'Errore durante la creazione del template. Riprova.', type: 'danger' });
        } finally {
            setIsCreatingCollaboraTemplate(false);
        }
    };

    const handleDeleteCollaboraTemplate = async (id: number) => {
        try {
            await apiFetch(`${apiUrl}/api/collabora/templates/${id}`, { method: 'DELETE' });
            await fetchCollaboraTemplates();
        } catch { /* silenzioso */ }
        setTemplateToDeleteId(null);
    };

    const handleCreateFromCollaboraTemplate = async (template: CollaboraTemplate) => {
        if (!onCollaboraFileCreated) return;
        setIsLoading(true);
        try {
            const res = await apiFetch(`${apiUrl}/api/collabora/create-from-template/${template.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buildingSiteId: Number(buildingSiteId), date: fileDate }),
            });
            if (!res.ok) throw new Error('Errore creazione da template');
            const { fileId, fileName } = await res.json();
            onCollaboraFileCreated(fileId, fileName);
        } catch (error) {
            console.error('Errore creazione da template:', error);
            setMessage({ text: 'Errore durante la creazione del documento. Riprova.', type: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCollaboraFile = async (format: typeof COLLABORA_FORMATS[0]) => {
        if (!onCollaboraFileCreated) return;
        setIsCreatingCollaboraFile(true);
        try {
            const fileName = `Nuovo documento${format.ext}`;
            const response = await apiFetch(`${apiUrl}/api/collabora/new-file`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName,
                    fileType: format.mimeType,
                    buildingSiteId: Number(buildingSiteId),
                    date: fileDate,
                }),
            });
            if (!response.ok) throw new Error('Errore creazione file Collabora');
            const { fileId, fileName: createdName } = await response.json();
            onCollaboraFileCreated(fileId, createdName);
        } catch (error) {
            console.error('Errore creazione file Collabora:', error);
            setMessage({ text: 'Errore durante la creazione del documento. Riprova.', type: 'danger' });
        } finally {
            setIsCreatingCollaboraFile(false);
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
                    <div className="col-6 col-md-3">
                        <button
                            className={`btn w-100 h-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2 ${activeSection === 'upload' ? 'btn-primary' : 'btn-outline-primary'}`}
                            type="button"
                            onClick={() => toggleSection('upload')}
                        >
                            <i className="bi bi-laptop fs-3 mb-2"></i>
                            <span className="fw-bold">Carica dal PC</span>
                        </button>
                    </div>
                    <div className="col-6 col-md-3">
                        <button
                            className={`btn w-100 h-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2 ${activeSection === 'collabora' ? 'btn-success' : 'btn-outline-success'}`}
                            type="button"
                            onClick={() => toggleSection('collabora')}
                        >
                            <i className="bi bi-file-earmark-richtext fs-3 mb-2"></i>
                            <span className="fw-bold">Crea Documento</span>
                        </button>
                    </div>
                    <div className="col-6 col-md-3">
                        <button
                            className={`btn w-100 h-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2 ${activeSection === 'collabora_template' ? 'btn-warning' : 'btn-outline-warning'}`}
                            type="button"
                            onClick={() => toggleSection('collabora_template')}
                        >
                            <i className="bi bi-layout-text-window-reverse fs-3 mb-2"></i>
                            <span className="fw-bold">Crea Template</span>
                        </button>
                    </div>
                    <div className="col-6 col-md-3">
                        <button
                            className="btn w-100 h-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2 btn-outline-secondary"
                            type="button"
                            disabled
                            title="Editor interno (disabilitato)"
                            style={{ opacity: 0.4, cursor: 'not-allowed' }}
                        >
                            <i className="bi bi-file-earmark-plus fs-3 mb-2"></i>
                            <span className="fw-bold">Editor Interno</span>
                        </button>
                    </div>
                </div>

                {/* Sezione Upload */}
                <form onSubmit={handleMultipleUploads} className={activeSection === 'upload' ? 'd-block' : 'd-none'}>
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

                {/* Sezione Collabora — crea nuovo documento */}
                <div className={activeSection === 'collabora' ? 'd-block' : 'd-none'}>
                    <div className="p-4 border border-success border-opacity-25 rounded-4 bg-light shadow-sm">
                        <div className="mb-4 text-center">
                            <label className="form-label d-block mb-3 small fw-bold text-uppercase text-success letter-spacing-1">
                                1. Seleziona la Data del Documento
                            </label>
                            <div className="d-inline-block p-2 bg-white rounded-3 shadow-sm border w-100">
                                <CalendarComponent
                                    onDateSelect={(date) => setFileDate(dateToString(date))}
                                    selectedDate={stringToDate(fileDate)}
                                />
                            </div>
                        </div>

                        {/* Template Collabora salvati */}
                        {collaboraTemplates.length > 0 && (
                            <>
                                <label className="form-label d-block mb-3 small fw-bold text-uppercase text-success letter-spacing-1 text-center">
                                    2. Parti da un Template
                                </label>
                                <div className="row g-2 mb-4">
                                    {collaboraTemplates.map((tmpl) => (
                                        <div key={tmpl.id} className="col-6 col-md-4">
                                            <button
                                                type="button"
                                                className="btn btn-outline-success w-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2 position-relative"
                                                onClick={() => handleCreateFromCollaboraTemplate(tmpl)}
                                                disabled={isLoading}
                                            >
                                                <i className="bi bi-layout-text-window-reverse fs-3 mb-1"></i>
                                                <span className="small fw-bold" style={{ wordBreak: 'break-word' }}>{tmpl.name}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <div style={{ flex: 1, height: 1, background: '#dee2e6' }} />
                                    <span className="text-muted small">oppure documento vuoto</span>
                                    <div style={{ flex: 1, height: 1, background: '#dee2e6' }} />
                                </div>
                            </>
                        )}

                        <label className="form-label d-block mb-3 small fw-bold text-uppercase text-success letter-spacing-1 text-center">
                            {collaboraTemplates.length > 0 ? '3. Scegli il Formato' : '2. Scegli il Formato'}
                        </label>
                        <div className="row g-2">
                            {COLLABORA_FORMATS.map((format) => (
                                <div key={format.ext} className="col-6 col-md-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-success w-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2"
                                        onClick={() => handleCreateCollaboraFile(format)}
                                        disabled={isCreatingCollaboraFile || isLoading}
                                    >
                                        <i className={`bi ${format.icon} fs-3 mb-1`}></i>
                                        <span className="small fw-bold">{format.label}</span>
                                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>{format.ext}</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {(isCreatingCollaboraFile || isLoading) && (
                            <div className="text-center mt-3">
                                <span className="spinner-border spinner-border-sm text-success me-2" />
                                <span className="text-muted small">Creazione in corso...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sezione Crea Template Collabora */}
                <div className={activeSection === 'collabora_template' ? 'd-block' : 'd-none'}>
                    <div className="p-4 border border-warning border-opacity-25 rounded-4 bg-light shadow-sm">

                        {/* Template esistenti */}
                        {collaboraTemplates.length > 0 && (
                            <div className="mb-4">
                                <label className="form-label d-block mb-3 small fw-bold text-uppercase text-warning letter-spacing-1">
                                    Template salvati
                                </label>
                                <div className="row g-2">
                                    {collaboraTemplates.map((tmpl) => (
                                        <div key={tmpl.id} className="col-6 col-md-4">
                                            <div className="btn-group w-100" role="group">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-warning py-2 rounded-start-3 d-flex flex-column align-items-center justify-content-center flex-grow-1"
                                                    onClick={() => onCollaboraTemplateCreated?.(tmpl.id, tmpl.name)}
                                                >
                                                    <i className="bi bi-layout-text-window-reverse fs-4 mb-1"></i>
                                                    <span className="small fw-bold" style={{ wordBreak: 'break-word', fontSize: '0.72rem' }}>{tmpl.name}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger px-2 rounded-end-3"
                                                    onClick={() => setTemplateToDeleteId(tmpl.id)}
                                                    title="Elimina template"
                                                >
                                                    <i className="bi bi-trash3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="d-flex align-items-center gap-2 my-3">
                                    <div style={{ flex: 1, height: 1, background: '#dee2e6' }} />
                                    <span className="text-muted small">crea nuovo</span>
                                    <div style={{ flex: 1, height: 1, background: '#dee2e6' }} />
                                </div>
                            </div>
                        )}

                        <label className="form-label d-block mb-3 small fw-bold text-uppercase text-warning letter-spacing-1 text-center">
                            Scegli il formato del nuovo template
                        </label>
                        <div className="row g-2">
                            {COLLABORA_FORMATS.map((format) => (
                                <div key={format.ext} className="col-6 col-md-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-warning w-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center border-2"
                                        onClick={() => handleCreateCollaboraTemplate(format)}
                                        disabled={isCreatingCollaboraTemplate}
                                    >
                                        <i className={`bi ${format.icon} fs-3 mb-1`}></i>
                                        <span className="small fw-bold">{format.label}</span>
                                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>{format.ext}</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {isCreatingCollaboraTemplate && (
                            <div className="text-center mt-3">
                                <span className="spinner-border spinner-border-sm text-warning me-2" />
                                <span className="text-muted small">Creazione in corso...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sezione Create (editor interno TipTap — disabilitata, codice mantenuto) */}
                <div className={activeSection === 'create' ? 'd-block' : 'd-none'}>
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

            </div>
            <LoadingScreen isLoading={isLoading} />

            {/* Conferma eliminazione template Collabora */}
            {templateToDeleteId !== null && (
                <div
                    className="modal d-block"
                    tabIndex={-1}
                    style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 1080 }}
                    onClick={() => setTemplateToDeleteId(null)}
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-body p-4 text-center">
                                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56 }}>
                                    <i className="bi bi-trash3 fs-4" />
                                </div>
                                <p className="fw-bold mb-1">Eliminare il template?</p>
                                <p className="text-muted small mb-4">Questa azione non può essere annullata.</p>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary flex-fill rounded-3" onClick={() => setTemplateToDeleteId(null)}>Annulla</button>
                                    <button className="btn btn-danger flex-fill rounded-3" onClick={() => void handleDeleteCollaboraTemplate(templateToDeleteId)}>Elimina</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadFilesComponent;
