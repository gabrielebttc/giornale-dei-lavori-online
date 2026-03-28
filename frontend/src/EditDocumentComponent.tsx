import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditorComponent from './RichTextEditorComponent';
import { dateToString } from '../utils/formatDate';
import LoadingScreen from './LoadingScreen';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

type EditDocumentComponentProps = {
    projectId?: number | null;
};

import type { ProjectsRecord } from './types/dbTables';

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
    const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Funzione di salvataggio
    const saveDocument = async () => {
        if (!projectId) return;
        setIsSaving(true);
        setSaveError(null);
        if (!newProjectData) {
            setSaveError('Dati progetto non disponibili per il salvataggio.');
            setIsSaving(false);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/projects-manager/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newProjectData.name,
                    content_json: newProjectData.content_json,
                    date: dateToString(new Date(newProjectData.date)),
                }),
            });
            if (!response.ok) {
                throw new Error(`Errore HTTP ${response.status}`);
            }
            setLastSaved(new Date());
        } catch (error) {
            setSaveError('Errore durante il salvataggio.');
        } finally {
            setIsSaving(false);
        }
    };

    // Autosalvataggio ogni 10s
    useEffect(() => {
        if (!projectId || !autoSaveEnabled) {
            if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
            return;
        }
        if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = setInterval(() => {
            saveDocument();
        }, 10000);
        return () => {
            if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, newProjectData, autoSaveEnabled]);

    const handleBackToFiles = () => {
        while (isSaving) {
            setIsLoading(true)
        }
        setIsLoading(false)
        if (siteId && date) {
            navigate(`/action-page/file-manager/${siteId}/${date}`);
            return;
        }

        navigate(-1);
    };

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) {
                setProjectData(null);
                setProjectError(null);
                return;
            }

            setIsLoadingProject(true);
            setProjectError(null);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/api/projects-manager/projects/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Errore HTTP ${response.status}`);
                }

                const data: ProjectsRecord = await response.json();
                setProjectData(data);
                setNewProjectData(data);

            } catch (error) {
                console.error('Errore durante il recupero progetto:', error);
                setProjectError('Impossibile recuperare i dati del progetto.');
            } finally {
                setIsLoadingProject(false);
            }
        };

        void fetchProject();
    }, [projectId]);

    return (
        <>
            <div className="row mb-3">
                <div className="col-12">
                    <button
                        onClick={handleBackToFiles}
                        className="btn btn-link text-decoration-none text-secondary p-0 d-inline-flex align-items-center transition-all hover-primary"
                        style={{ transition: '0.2s' }}
                    >
                        <div className="rounded-circle bg-white shadow-sm border d-flex align-items-center justify-content-center me-2" style={{ width: '35px', height: '35px' }}>
                            <i className="bi bi-arrow-left text-primary"></i>
                        </div>
                        <span className="fw-bold small text-uppercase" style={{ letterSpacing: '1px' }}>torna ai tuoi files</span>
                    </button>
                </div>
            </div>


            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="bg-primary bg-gradient p-3 text-white d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-file-earmark-richtext me-2" />
                        <input
                            type="text"
                            className="form-control form-control-sm fw-bold bg-white border-0 shadow-sm px-2"
                            style={{ maxWidth: 320, fontSize: '1.1rem' }}
                            value={newProjectData ? newProjectData.name : 'Nuovo documento senza titolo'}
                            onChange={e => {
                                setNewProjectData(prev => prev ? { ...prev, name: e.target.value } : prev);
                            }}
                            placeholder="Nome progetto"
                            disabled={isLoadingProject}
                        />
                    </div>
                    {projectId && (
                        <div className="d-flex align-items-center gap-2">
                            <button
                                className="btn btn-success btn-sm d-flex align-items-center px-3 fw-bold"
                                onClick={saveDocument}
                                disabled={isSaving}
                                style={{ minWidth: 90 }}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Salvataggio...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save me-2"></i> Salva
                                    </>
                                )}
                            </button>
                            <button
                                className={`btn btn-outline-light btn-sm d-flex align-items-center px-2 fw-bold ${autoSaveEnabled ? '' : 'opacity-50'}`}
                                onClick={() => setAutoSaveEnabled(v => !v)}
                                type="button"
                                title={autoSaveEnabled ? 'Disattiva autosalvataggio' : 'Attiva autosalvataggio'}
                                style={{ minWidth: 44 }}
                            >
                                <i className={`bi ${autoSaveEnabled ? 'bi-pause-circle' : 'bi-play-circle'} me-1`}></i>
                                <span className="d-none d-md-inline">Auto</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="card-body p-3 p-md-4">
                    {projectId && (
                        <div className="mb-3 p-3 rounded-3 border bg-light">
                            <div className="fw-semibold text-primary mb-2">Dati progetto</div>

                            {isLoadingProject && <div className="small text-muted">Caricamento progetto...</div>}
                            {projectError && <div className="small text-danger">{projectError}</div>}

                            {!isLoadingProject && !projectError && projectData && (
                                <>
                                    <div className="small mb-1"><strong>ID:</strong> {projectData.id}</div>
                                    <div className="small mb-1"><strong>Nome:</strong> {projectData.name}</div>
                                    <div className="small mb-1"><strong>Owner:</strong> {projectData.owner_id ?? 'N/A'}</div>
                                    <div className="small mb-1"><strong>Cantiere:</strong> {projectData.building_site_id}</div>
                                    <div className="small mb-1"><strong>Data:</strong> {projectData.date}</div>
                                    <div className="small mb-1"><strong>Creato il:</strong> {new Date(projectData.created_at).toLocaleString()}</div>
                                    <div className="small mb-3"><strong>Aggiornato il:</strong> {new Date(projectData.updated_at).toLocaleString()}</div>

                                    <div className="small fw-semibold mb-1">Metadata</div>
                                    <pre className="small bg-white border rounded p-2 mb-2" style={{ maxHeight: 140, overflow: 'auto' }}>
                                        {JSON.stringify(projectData.metadata, null, 2)}
                                    </pre>

                                    <div className="small fw-semibold mb-1">Content JSON</div>
                                    <pre className="small bg-white border rounded p-2 mb-0" style={{ maxHeight: 180, overflow: 'auto' }}>
                                        {JSON.stringify(projectData.content_json, null, 2)}
                                    </pre>
                                </>
                            )}
                        </div>
                    )}

                    <RichTextEditorComponent
                        value={newProjectData?.content_json}
                        onChange={(value) => setNewProjectData(prev => prev ? { ...prev, content_json: value } : prev)}
                        placeholder="Scrivi il contenuto del documento..."
                    />

                    <div className="mt-3 small text-muted d-flex align-items-center gap-3">
                        <span>Lunghezza HTML attuale: {newProjectData?.content_json.length} caratteri</span>
                        {isSaving && <span className="text-info">Salvataggio in corso...</span>}
                        {lastSaved && <span className="text-success">Salvato alle {lastSaved.toLocaleTimeString()}</span>}
                        {saveError && <span className="text-danger">{saveError}</span>}
                    </div>
                </div>
            </div>
            <LoadingScreen isLoading={isLoading} />
        </>
    );
}