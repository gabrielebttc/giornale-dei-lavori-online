import { useEffect, useState, useRef } from 'react';
import { Editor as TiptapEditor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditorComponent from './RichTextEditorComponent';
import GeneratePDFComponent from './GeneratePDFComponent';
import { dateToString } from '../utils/formatDate';
import LoadingScreen from './LoadingScreen';
import type { ProjectsRecord } from './types/dbTables';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const resolveImageStorageKeys = async (node: any, token: string): Promise<any> => {
    if (!node || typeof node !== 'object') return node;
    const copy: any = { ...node };
    if (copy.type === 'image' && copy.attrs?.src && !copy.attrs.src.startsWith('http')) {
        try {
            const res = await fetch(`${apiUrl}/api/file-manager/get-download-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ storageKey: copy.attrs.src }),
            });
            if (res.ok) {
                const { uploadUrl } = await res.json();
                copy.attrs = { ...copy.attrs, src: uploadUrl };
            }
        } catch { /* lascia src invariato */ }
    }
    if (Array.isArray(copy.content)) {
        copy.content = await Promise.all(copy.content.map((child: any) => resolveImageStorageKeys(child, token)));
    }
    return copy;
};

const replaceImageSrcWithStorageKey = (node: any): any => {
    if (!node || typeof node !== 'object') return node;
    const copy: any = { ...node };
    if (copy.attrs && copy.type === 'image' && copy.attrs.storageKey) {
        copy.attrs = { ...copy.attrs, src: copy.attrs.storageKey };
    }
    if (Array.isArray(copy.content)) {
        copy.content = copy.content.map((child: any) => replaceImageSrcWithStorageKey(child));
    }
    return copy;
};

const parseContent = (c: any) => {
    try { return typeof c === 'string' ? JSON.parse(c) : c; } catch { return c; }
};

interface TemplateData {
    id: number;
    name: string;
    content_json: any;
}

type EditDocumentComponentProps = {
    projectId?: number | null;
    templateId?: number | null;
};

export default function EditDocumentComponent({ projectId = null, templateId = null }: EditDocumentComponentProps) {
    const navigate = useNavigate();
    const { siteId, date } = useParams<{ siteId?: string; date?: string }>();

    // — Project state —
    const [projectData, setProjectData] = useState<ProjectsRecord | null>(null);
    const [newProjectData, setNewProjectData] = useState<ProjectsRecord | null>(null);

    // — Template state —
    const [templateData, setTemplateData] = useState<TemplateData | null>(null);
    const [newTemplateData, setNewTemplateData] = useState<TemplateData | null>(null);

    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [dataError, setDataError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPDFModal, setShowPDFModal] = useState<boolean>(false);

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Unified getters for editor
    const editorName = templateId ? newTemplateData?.name : newProjectData?.name;
    const editorContent = templateId ? newTemplateData?.content_json : newProjectData?.content_json;

    // — Save functions —
    const saveDocument = async (dataToSave: ProjectsRecord) => {
        if (!projectId) return;
        setIsSaving(true);
        setSaveError(null);
        try {
            const token = localStorage.getItem('token');
            const transformedContent = replaceImageSrcWithStorageKey(parseContent(dataToSave.content_json));
            const response = await fetch(`${apiUrl}/api/projects-manager/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name: dataToSave.name,
                    content_json: transformedContent,
                    date: new Date(String(dataToSave.date)).toISOString(),
                }),
            });
            if (!response.ok) throw new Error(`Errore HTTP ${response.status}`);
            setLastSaved(new Date());
            setProjectData(dataToSave);
        } catch {
            setSaveError('Errore durante il salvataggio.');
        } finally {
            setIsSaving(false);
        }
    };

    const saveTemplate = async (dataToSave: TemplateData) => {
        if (!templateId) return;
        setIsSaving(true);
        setSaveError(null);
        try {
            const token = localStorage.getItem('token');
            const transformedContent = replaceImageSrcWithStorageKey(parseContent(dataToSave.content_json));
            const response = await fetch(`${apiUrl}/api/templates-manager/templates/${templateId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name: dataToSave.name,
                    content_json: transformedContent,
                }),
            });
            if (!response.ok) throw new Error(`Errore HTTP ${response.status}`);
            setLastSaved(new Date());
            setTemplateData(dataToSave);
        } catch {
            setSaveError('Errore durante il salvataggio.');
        } finally {
            setIsSaving(false);
        }
    };

    const saveProjectOrTemplate = () => {
        if (templateId && newTemplateData) {
            saveTemplate(newTemplateData);
        } else if (projectId && newProjectData) {
            saveDocument(newProjectData);
        }
    };

    // — Autosave —
    useEffect(() => {
        if (!newProjectData || !autoSaveEnabled || !projectId) return;
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            if (JSON.stringify(newProjectData) !== JSON.stringify(projectData)) {
                saveDocument(newProjectData);
            }
        }, 2000);
        return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
    }, [newProjectData, autoSaveEnabled, projectId]);

    useEffect(() => {
        if (!newTemplateData || !autoSaveEnabled || !templateId) return;
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            if (JSON.stringify(newTemplateData) !== JSON.stringify(templateData)) {
                saveTemplate(newTemplateData);
            }
        }, 2000);
        return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
    }, [newTemplateData, autoSaveEnabled, templateId]);

    // — Fetch project —
    useEffect(() => {
        if (!projectId) return;
        const fetchProject = async () => {
            setIsLoadingData(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/api/projects-manager/projects/${projectId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error();
                const data = await response.json();

                // Conversione legacy HTML → JSON
                let content = data.content_json;
                if (typeof content === 'string' && content.trim().startsWith('<')) {
                    try {
                        const tempEditor = new TiptapEditor({ extensions: [StarterKit], content });
                        const converted = tempEditor.getJSON();
                        tempEditor.destroy();
                        data.content_json = converted;
                        await fetch(`${apiUrl}/api/projects-manager/projects/${projectId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({ content_json: converted }),
                        });
                    } catch { /* lascia il contenuto originale */ }
                }

                // Risolvi storageKey immagini
                if (data.content_json) {
                    try {
                        const parsed = parseContent(data.content_json);
                        data.content_json = await resolveImageStorageKeys(parsed, token ?? '');
                    } catch { /* lascia invariato */ }
                }

                setProjectData(data);
                setNewProjectData(data);
            } catch {
                setDataError('Impossibile recuperare i dati del progetto.');
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchProject();
    }, [projectId]);

    // — Fetch template —
    useEffect(() => {
        if (!templateId) return;
        const fetchTemplate = async () => {
            setIsLoadingData(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/api/templates-manager/templates/${templateId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error();
                const data = await response.json();

                // Risolvi storageKey immagini
                if (data.content_json) {
                    try {
                        const parsed = parseContent(data.content_json);
                        data.content_json = await resolveImageStorageKeys(parsed, token ?? '');
                    } catch { /* lascia invariato */ }
                }

                setTemplateData(data);
                setNewTemplateData(data);
            } catch {
                setDataError('Impossibile recuperare i dati del template.');
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchTemplate();
    }, [templateId]);

    const handleBackToFiles = async () => {
        if (isSaving) {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        if (siteId && date) {
            navigate(`/action-page/file-manager/${siteId}/${date}`);
        } else {
            navigate(-1);
        }
    };

    const handleExportPDF = () => setShowPDFModal(true);

    const handleNameChange = (name: string) => {
        if (templateId) {
            setNewTemplateData(prev => prev ? { ...prev, name } : prev);
        } else {
            setNewProjectData(prev => prev ? { ...prev, name } : prev);
        }
    };

    const handleContentChange = (value: any) => {
        if (templateId) {
            setNewTemplateData(prev => {
                if (prev) return { ...prev, content_json: value };
                return { id: templateId, name: '', content_json: value };
            });
        } else {
            setNewProjectData(prev => {
                if (prev) return { ...prev, content_json: value } as ProjectsRecord;
                const base = projectData ? { ...projectData } as ProjectsRecord : {} as ProjectsRecord;
                return { ...base, content_json: value } as ProjectsRecord;
            });
        }
    };

    const isResetDisabled = templateId
        ? isSaving || !templateData || JSON.stringify(newTemplateData) === JSON.stringify(templateData)
        : isSaving || !projectData || JSON.stringify(newProjectData) === JSON.stringify(projectData);

    const handleReset = () => {
        if (templateId) setNewTemplateData(templateData);
        else setNewProjectData(projectData);
    };

    return (
        <div className="container-fluid py-4" style={{ maxWidth: '1100px' }}>
            {/* Header di navigazione */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <button
                    onClick={handleBackToFiles}
                    className="btn btn-link text-decoration-none p-0 group d-flex align-items-center transition-all"
                    style={{ color: '#6c757d' }}
                >
                    <div className="rounded-circle bg-white shadow-sm border d-flex align-items-center justify-content-center me-3"
                         style={{ width: 40, height: 40, transition: '0.2s' }}>
                        <i className="bi bi-chevron-left"></i>
                    </div>
                    <span className="fw-semibold text-uppercase ls-1" style={{ fontSize: '0.75rem' }}>
                        {templateId ? 'I tuoi template' : 'I tuoi documenti'}
                    </span>
                </button>

                <div className="d-flex align-items-center gap-3">
                    <div className="d-none d-md-flex flex-column align-items-end me-2">
                        {isSaving ? (
                            <span className="badge rounded-pill bg-light text-primary border border-primary-subtle px-3 py-2">
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Salvataggio...
                            </span>
                        ) : lastSaved ? (
                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                <i className="bi bi-cloud-check me-1 text-success"></i>
                                Salvato alle {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Badge template */}
            {templateId && (
                <div className="mb-3">
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-semibold">
                        <i className="bi bi-layout-text-window-reverse me-2"></i>Stai modificando un template
                    </span>
                </div>
            )}

            {/* Editor Card */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
                {/* Toolbar superiore */}
                <div className="px-4 py-3 border-bottom bg-light d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center flex-grow-1">
                        <i className={`bi ${templateId ? 'bi-layout-text-window-reverse text-warning' : 'bi-file-earmark-text-fill text-primary'} fs-4 me-3`}></i>
                        <input
                            type="text"
                            className="form-control border-0 bg-transparent fw-bold fs-5 p-0 focus-none"
                            placeholder={templateId ? 'Nome del template...' : 'Titolo del documento...'}
                            value={editorName || ''}
                            onChange={e => handleNameChange(e.target.value)}
                            style={{ boxShadow: 'none', borderBottom: '2px solid transparent' }}
                            onFocus={(e) => e.target.style.borderBottom = '2px solid #0d6efd'}
                            onBlur={(e) => e.target.style.borderBottom = '2px solid transparent'}
                        />
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <button
                            className={`btn btn-sm rounded-pill px-3 transition-all ${autoSaveEnabled ? 'btn-soft-primary' : 'btn-outline-secondary opacity-50'}`}
                            onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                            style={{ fontSize: '0.8rem', fontWeight: 600 }}
                        >
                            <i className={`bi ${autoSaveEnabled ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                            Auto-save
                        </button>

                        {!templateId && (
                            <div className="dropdown">
                                <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold shadow-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="bi bi-download me-1"></i> Esporta
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className="dropdown-item" type="button" onClick={handleExportPDF}>
                                            <i className="bi bi-file-earmark-pdf me-2 text-danger"></i> Esporta come PDF
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" type="button">
                                            <i className="bi bi-file-earmark-word me-2 text-primary"></i> Altri formati presto disponibili...
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}

                        <div className="vr mx-1 my-2"></div>

                        <button
                            className="btn btn-secondary btn-sm rounded-pill px-3 fw-bold shadow-sm me-2"
                            onClick={handleReset}
                            disabled={isResetDisabled}
                            type="button"
                        >
                            <i className="bi bi-arrow-counterclockwise me-1"></i> Ripristina
                        </button>
                        <button
                            className="btn btn-primary btn-sm rounded-pill px-4 fw-bold shadow-sm"
                            onClick={saveProjectOrTemplate}
                            disabled={isSaving}
                        >
                            {isSaving ? '...' : 'Salva'}
                        </button>
                    </div>
                </div>

                <div className="card-body p-4 min-vh-50">
                    {isLoadingData ? (
                        <div className="text-center text-muted py-5">
                            <span className="spinner-border spinner-border-sm me-2"></span>Caricamento...
                        </div>
                    ) : dataError ? (
                        <div className="alert alert-danger rounded-3 border-0 shadow-sm">{dataError}</div>
                    ) : (
                        <RichTextEditorComponent
                            value={editorContent}
                            buildingSiteId={siteId}
                            onChange={handleContentChange}
                        />
                    )}
                </div>

                {saveError && (
                    <div className="card-footer bg-white border-top-0 px-4 pb-4">
                        <div className="alert alert-danger py-2 px-3 small border-0 d-flex align-items-center mb-0">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {saveError}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .btn-soft-primary {
                    background-color: #e7f1ff;
                    color: #0d6efd;
                    border: 1px solid #cfe2ff;
                }
                .btn-soft-primary:hover {
                    background-color: #0d6efd;
                    color: white;
                }
                .ls-1 { letter-spacing: 1px; }
                .focus-none:focus { outline: none !important; }
                .transition-all { transition: all 0.3s ease; }
                .min-vh-50 { min-height: 60vh; }
            `}</style>

            {showPDFModal && projectId && siteId && (
                <GeneratePDFComponent
                    projectId={projectId}
                    projectName={newProjectData?.name || 'documento'}
                    buildingSiteId={siteId}
                    date={newProjectData?.date ? String(newProjectData.date).slice(0, 10) : dateToString(new Date())}
                    onClose={() => setShowPDFModal(false)}
                />
            )}

            <LoadingScreen isLoading={isLoading} />
        </div>
    );
}
