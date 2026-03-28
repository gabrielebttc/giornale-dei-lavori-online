import { useEffect, useState, useRef } from 'react';
import { Editor as TiptapEditor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditorComponent from './RichTextEditorComponent';
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

type EditDocumentComponentProps = {
    projectId?: number | null;
};

export default function EditDocumentComponent({ projectId = null }: EditDocumentComponentProps) {
    const navigate = useNavigate();
    const { siteId, date } = useParams<{ siteId?: string; date?: string }>();
    
    const [projectData, setProjectData] = useState<ProjectsRecord | null>(null);
    const [newProjectData, setNewProjectData] = useState<ProjectsRecord | null>(null);
    const [isLoadingProject, setIsLoadingProject] = useState<boolean>(false);
    const [projectError, setProjectError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const saveDocument = async (dataToSave: ProjectsRecord) => {
        if (!projectId) return;
        setIsSaving(true);
        setSaveError(null);
        
        try {
            // Ensure content_json is a JS object
            const parseContent = (c: any) => {
                try {
                    return typeof c === 'string' ? JSON.parse(c) : c;
                } catch {
                    return c;
                }
            };

            const replaceImageSrcWithStorageKey = (node: any): any => {
                if (!node || typeof node !== 'object') return node;
                const copy: any = { ...node };
                if (copy.attrs && copy.type === 'image') {
                    if (copy.attrs.storageKey) {
                        copy.attrs = { ...copy.attrs, src: copy.attrs.storageKey };
                    }
                }
                if (Array.isArray(copy.content)) {
                    copy.content = copy.content.map((child: any) => replaceImageSrcWithStorageKey(child));
                }
                return copy;
            };

            const token = localStorage.getItem('token');
            // transform content_json replacing image src with storageKey when available
            const originalContent = parseContent(dataToSave.content_json);
            const transformedContent = replaceImageSrcWithStorageKey(originalContent);

            const response = await fetch(`${apiUrl}/api/projects-manager/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: dataToSave.name,
                    content_json: transformedContent,
                    date: dateToString(new Date(dataToSave.date)),
                }),
            });
            if (!response.ok) throw new Error(`Errore HTTP ${response.status}`);
            
            setLastSaved(new Date());
            setProjectData(dataToSave);
        } catch (error) {
            setSaveError('Errore durante il salvataggio.');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!newProjectData || !autoSaveEnabled || !projectId) return;
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

        debounceTimerRef.current = setTimeout(() => {
            const hasChanged = JSON.stringify(newProjectData) !== JSON.stringify(projectData);
            if (hasChanged) saveDocument(newProjectData);
        }, 2000); 

        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, [newProjectData, autoSaveEnabled, projectId]);

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

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;
            setIsLoadingProject(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/api/projects-manager/projects/${projectId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error();
                const data = await response.json();
                // If content_json is an HTML string (legacy), convert to tiptap JSON and persist
                let content = data.content_json;
                if (typeof content === 'string' && content.trim().startsWith('<')) {
                    try {
                        const tempEditor = new TiptapEditor({ extensions: [StarterKit], content });
                        const converted = tempEditor.getJSON();
                        tempEditor.destroy();
                        data.content_json = converted;
                        // persist converted JSON to backend
                        const putResp = await fetch(`${apiUrl}/api/projects-manager/projects/${projectId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({ content_json: converted }),
                        });
                        if (!putResp.ok) {
                            console.warn('Impossibile aggiornare content_json convertito');
                        }
                    } catch (err) {
                        console.warn('Conversione HTML->JSON fallita, lascio il contenuto originale');
                    }
                }
                // Risolvi i storageKey delle immagini in URL di download
                let contentJson = data.content_json;
                if (contentJson) {
                    try {
                        const parsed = typeof contentJson === 'string' ? JSON.parse(contentJson) : contentJson;
                        data.content_json = await resolveImageStorageKeys(parsed, token ?? '');
                    } catch { /* lascia invariato */ }
                }

                setProjectData(data);
                setNewProjectData(data);
            } catch (error) {
                setProjectError('Impossibile recuperare i dati.');
            } finally {
                setIsLoadingProject(false);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleExportPDF = () => {
        // aggiungere logica per export pdf
    }

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
                    <span className="fw-semibold text-uppercase ls-1" style={{ fontSize: '0.75rem' }}>I tuoi documenti</span>
                </button>

                <div className="d-flex align-items-center gap-3">
                    {/* Status indicator */}
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

            {/* Editor Card */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
                {/* Toolbar superiore integrata */}
                <div className="px-4 py-3 border-bottom bg-light d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center flex-grow-1">
                        <i className="bi bi-file-earmark-text-fill text-primary fs-4 me-3"></i>
                        <input
                            type="text"
                            className="form-control border-0 bg-transparent fw-bold fs-5 p-0 focus-none"
                            placeholder="Titolo del documento..."
                            value={newProjectData?.name || ''}
                            onChange={e => setNewProjectData(prev => prev ? { ...prev, name: e.target.value } : prev)}
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

                        {/* Dropdown Export Button */}
                        <div className="dropdown">
                            <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold shadow-sm dropdown-toggle" type="button" id="exportDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-download me-1"></i> Esporta
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="exportDropdown">
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

                        <div className="vr mx-1 my-2"></div>

                        <button 
                            className="btn btn-secondary btn-sm rounded-pill px-3 fw-bold shadow-sm me-2" 
                            onClick={() => setNewProjectData(projectData)} 
                            disabled={isSaving || !projectData || JSON.stringify(newProjectData) === JSON.stringify(projectData)}
                            type="button"
                        >
                            <i className="bi bi-arrow-counterclockwise me-1"></i> Ripristina all'ultima versione
                        </button>
                        <button 
                            className="btn btn-primary btn-sm rounded-pill px-4 fw-bold shadow-sm" 
                            onClick={() => newProjectData && saveDocument(newProjectData)} 
                            disabled={isSaving}
                        >
                            {isSaving ? '...' : 'Salva'}
                        </button>
                    </div>
                </div>

                <div className="card-body p-4 min-vh-50">
                    {projectError ? (
                        <div className="alert alert-danger rounded-3 border-0 shadow-sm">{projectError}</div>
                    ) : (
                        <RichTextEditorComponent
                                value={newProjectData?.content_json}
                                buildingSiteId={siteId}
                                onChange={(value) => setNewProjectData(prev => {
                                    if (prev) return { ...prev, content_json: value } as ProjectsRecord;
                                    // if no prev (first update), base from projectData or create minimal object
                                    const base = projectData ? { ...projectData } as ProjectsRecord : {} as ProjectsRecord;
                                    return { ...base, content_json: value } as ProjectsRecord;
                                })}
                            />
                    )}
                </div>

                {/* Footer di stato (Mobile & Errori) */}
                {(saveError || isSaving) && (
                    <div className="card-footer bg-white border-top-0 px-4 pb-4">
                        {saveError && (
                            <div className="alert alert-danger py-2 px-3 small border-0 d-flex align-items-center mb-0">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {saveError}
                            </div>
                        )}
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

            <LoadingScreen isLoading={isLoading} />
        </div>
    );
}