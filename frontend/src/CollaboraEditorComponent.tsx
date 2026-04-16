import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../utils/apiFetch';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

type Props = {
    fileId: number;
    fileName: string;
    onClose: () => void;
    type?: 'file' | 'template';
};

export default function CollaboraEditorComponent({ fileId, fileName, onClose, type = 'file' }: Props) {
    const [editorUrl, setEditorUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState(fileName);
    const [editingName, setEditingName] = useState(false);
    const [draftName, setDraftName] = useState(fileName);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const [date, setDate] = useState<string>('');
    const [editingDate, setEditingDate] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchEditorUrl = async () => {
            try {
                const editorUrlPath = type === 'template'
                    ? `${apiUrl}/api/collabora/editor-url/template/${fileId}`
                    : `${apiUrl}/api/collabora/editor-url/${fileId}`;
                const res = await apiFetch(editorUrlPath, {
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

        const fetchFileMeta = async () => {
            if (type === 'template') return; // i template non hanno data cantiere
            try {
                const res = await apiFetch(`${apiUrl}/api/file-manager/files/${fileId}/meta`, {
                    method: 'GET',
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.date) setDate(String(data.date).slice(0, 10));
                }
            } catch { /* non bloccante */ }
        };

        fetchEditorUrl();
        fetchFileMeta();
    }, [fileId]);

    useEffect(() => {
        if (editingName && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [editingName]);

    const saveMeta = async (newName?: string, newDate?: string) => {
        const payload: Record<string, string> = {};
        if (newName !== undefined) payload.name = newName;
        if (newDate !== undefined && type !== 'template') payload.date = newDate;
        if (Object.keys(payload).length === 0) return;

        setSaving(true);
        try {
            const patchUrl = type === 'template'
                ? `${apiUrl}/api/collabora/templates/${fileId}/rename`
                : `${apiUrl}/api/file-manager/files/${fileId}`;
            const method = type === 'template' ? 'PATCH' : 'PATCH';
            const res = await apiFetch(patchUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const updated = await res.json();
                if (updated.name) setName(updated.name);
                if (updated.date) setDate(String(updated.date).slice(0, 10));
            }
        } catch { /* silenzioso */ } finally {
            setSaving(false);
        }
    };

    const commitName = () => {
        setEditingName(false);
        const trimmed = draftName.trim();
        if (trimmed && trimmed !== name) {
            void saveMeta(trimmed);
        } else {
            setDraftName(name);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDate(val);
        setEditingDate(false);
        void saveMeta(undefined, val);
    };

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
                    padding: 8px 16px;
                    background: #1a1a2e;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    flex-shrink: 0;
                    min-height: 50px;
                }
                .ce-meta {
                    flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0;
                }
                .ce-name-row {
                    display: flex; align-items: center; gap: 6px;
                }
                .ce-name {
                    font-weight: 600; font-size: 0.9rem; color: #e8e8f0;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                    cursor: pointer; border-radius: 4px; padding: 1px 4px;
                    transition: background 0.15s;
                }
                .ce-name:hover { background: rgba(255,255,255,0.08); }
                .ce-name-input {
                    flex: 1; background: rgba(255,255,255,0.1); border: 1px solid rgba(77,166,255,0.5);
                    border-radius: 4px; color: #e8e8f0; font-size: 0.9rem; font-weight: 600;
                    padding: 2px 6px; outline: none; min-width: 0;
                }
                .ce-name-input:focus { border-color: #4da6ff; background: rgba(255,255,255,0.13); }
                .ce-date-row {
                    display: flex; align-items: center; gap: 6px;
                }
                .ce-date-label {
                    font-size: 0.72rem; color: #8888aa;
                    cursor: pointer; padding: 1px 4px; border-radius: 4px;
                    transition: background 0.15s;
                }
                .ce-date-label:hover { background: rgba(255,255,255,0.06); color: #aaa; }
                .ce-date-input {
                    background: rgba(255,255,255,0.08); border: 1px solid rgba(77,166,255,0.4);
                    border-radius: 4px; color: #c8c8e0; font-size: 0.72rem;
                    padding: 1px 5px; outline: none; cursor: pointer;
                    color-scheme: dark;
                }
                .ce-date-input:focus { border-color: #4da6ff; }
                .ce-saving {
                    width: 12px; height: 12px; border: 2px solid rgba(77,166,255,0.3);
                    border-top-color: #4da6ff; border-radius: 50%;
                    animation: spin 0.7s linear infinite; flex-shrink: 0;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
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

                    <div className="ce-meta">
                        {/* Nome file */}
                        <div className="ce-name-row">
                            {editingName ? (
                                <input
                                    ref={nameInputRef}
                                    className="ce-name-input"
                                    value={draftName}
                                    onChange={(e) => setDraftName(e.target.value)}
                                    onBlur={commitName}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') commitName();
                                        if (e.key === 'Escape') { setEditingName(false); setDraftName(name); }
                                    }}
                                />
                            ) : (
                                <span
                                    className="ce-name"
                                    title="Clicca per rinominare"
                                    onClick={() => { setDraftName(name); setEditingName(true); }}
                                >
                                    {name}
                                </span>
                            )}
                            {saving && <span className="ce-saving" />}
                        </div>

                        {/* Data */}
                        <div className="ce-date-row">
                            <i className="bi bi-calendar3" style={{ fontSize: '0.7rem', color: '#6666aa' }} />
                            {editingDate ? (
                                <input
                                    type="date"
                                    className="ce-date-input"
                                    value={date}
                                    onChange={handleDateChange}
                                    onBlur={() => setEditingDate(false)}
                                    autoFocus
                                />
                            ) : (
                                <span
                                    className="ce-date-label"
                                    title="Clicca per cambiare data"
                                    onClick={() => setEditingDate(true)}
                                >
                                    {date ? new Date(date + 'T00:00:00').toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Imposta data'}
                                </span>
                            )}
                        </div>
                    </div>

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
                        title={`Modifica: ${name}`}
                        allowFullScreen
                    />
                )}
            </div>
        </>
    );
}
