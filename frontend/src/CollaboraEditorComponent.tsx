import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/apiFetch';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

type Props = {
    fileId: number;
    fileName: string;
    onClose: () => void;
};

export default function CollaboraEditorComponent({ fileId, fileName, onClose }: Props) {
    const [editorUrl, setEditorUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEditorUrl = async () => {
            try {
                const res = await apiFetch(`${apiUrl}/api/collabora/editor-url/${fileId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) throw new Error('Errore nel recupero URL editor');
                const data = await res.json();
                setEditorUrl(data.editorUrl);
            } catch {
                setError("Impossibile avviare l'editor. Assicurarsi che Collabora sia in esecuzione.");
            }
        };
        fetchEditorUrl();
    }, [fileId]);

    return (
        <>
            <style>{`
                .ce-overlay {
                    position: fixed; inset: 0; z-index: 1060;
                    background: #0f1220;
                    display: flex; flex-direction: column;
                    animation: ceFadeIn 0.18s ease;
                }
                @keyframes ceFadeIn { from { opacity: 0 } to { opacity: 1 } }
                .ce-header {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 16px;
                    background: #1a1a2e;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    flex-shrink: 0;
                }
                .ce-title {
                    flex: 1; font-weight: 600; font-size: 0.9rem; color: #e8e8f0;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .ce-dev-badge {
                    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.5px;
                    padding: 2px 8px; border-radius: 20px;
                    background: rgba(255,193,7,0.15); color: #ffc107;
                    white-space: nowrap; flex-shrink: 0;
                }
                .ce-close {
                    width: 32px; height: 32px; border-radius: 8px;
                    border: none; background: rgba(255,255,255,0.08); color: #ccc;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; font-size: 1rem; flex-shrink: 0;
                    transition: background 0.15s;
                }
                .ce-close:hover { background: rgba(255,255,255,0.15); color: #fff; }
                .ce-iframe {
                    flex: 1; width: 100%; border: none; background: #fff;
                }
                .ce-center {
                    flex: 1; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; gap: 16px; color: #aaa;
                }
            `}</style>

            <div className="ce-overlay">
                <div className="ce-header">
                    <i className="bi bi-pencil-square" style={{ fontSize: '1.1rem', color: '#4da6ff', flexShrink: 0 }} />
                    <span className="ce-title">{fileName}</span>
                    <span className="ce-dev-badge">Modalità sviluppo</span>
                    <button className="ce-close" onClick={onClose} aria-label="Chiudi editor">
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {!editorUrl && !error && (
                    <div className="ce-center">
                        <div className="spinner-border" style={{ color: '#4da6ff', width: '2.5rem', height: '2.5rem' }} role="status" />
                        <span style={{ fontSize: '0.9rem' }}>Avvio Collabora...</span>
                    </div>
                )}

                {error && (
                    <div className="ce-center">
                        <i className="bi bi-exclamation-circle-fill fs-2" style={{ color: '#dc3545' }} />
                        <p style={{ fontSize: '0.9rem', textAlign: 'center', maxWidth: 420, margin: 0 }}>{error}</p>
                        <button className="btn btn-outline-light btn-sm rounded-3 px-4" onClick={onClose}>
                            Chiudi
                        </button>
                    </div>
                )}

                {editorUrl && (
                    <iframe
                        className="ce-iframe"
                        src={editorUrl}
                        title={`Modifica: ${fileName}`}
                        allowFullScreen
                    />
                )}
            </div>
        </>
    );
}
