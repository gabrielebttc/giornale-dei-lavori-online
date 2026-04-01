import React, { useEffect, useState, useRef } from 'react';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import ImageWithStorageKey from './extensions/ImageWithStorageKey';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import * as XLSX from 'xlsx';
import { renderAsync } from 'docx-preview';
import { apiFetch } from '../utils/apiFetch';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

type FileViewerProps = {
    storageKey: string;
    fileType: string;
    fileName: string;
    projectId?: number;
    onClose: () => void;
    onEdit?: () => void;
};

const getFileAccent = (fileType: string, fileName: string) => {
    if (fileType === 'platformProject') return { color: '#0d6efd', icon: 'bi-file-earmark-text-fill', label: 'Documento' };
    if (fileType === 'application/pdf') return { color: '#dc3545', icon: 'bi-file-earmark-pdf-fill', label: 'PDF' };
    if (fileType.startsWith('image/')) return { color: '#6f42c1', icon: 'bi-file-earmark-image-fill', label: 'Immagine' };
    if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileName.endsWith('.xlsx'))
        return { color: '#198754', icon: 'bi-file-earmark-excel-fill', label: 'Foglio Excel' };
    if (fileType.includes('word') || fileName.endsWith('.docx'))
        return { color: '#0d6efd', icon: 'bi-file-earmark-word-fill', label: 'Word' };
    return { color: '#6c757d', icon: 'bi-file-earmark-fill', label: 'File' };
};

const FileViewerComponent: React.FC<FileViewerProps> = ({ storageKey, fileType, fileName, projectId, onClose, onEdit }) => {
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [excelData, setExcelData] = useState<string[][] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projectHtml, setProjectHtml] = useState<string | null>(null);
    const docxRef = useRef<HTMLDivElement>(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const accent = getFileAccent(fileType, fileName);

    useEffect(() => {
        if (fileType === 'platformProject') {
            const fetchProject = async () => {
                setLoading(true);
                setError(null);
                try {
                    const token = localStorage.getItem('token');
                    const response = await apiFetch(`${apiUrl}/api/projects-manager/projects/${projectId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) throw new Error('Errore nel recupero progetto');
                    const data = await response.json();
                    let json = data.content_json;
                    if (typeof json === 'string') {
                        try { json = JSON.parse(json); } catch { /* fallback */ }
                    }
                    const resolveImages = async (node: any): Promise<any> => {
                        if (!node || typeof node !== 'object') return node;
                        const copy: any = { ...node };
                        if (copy.type === 'image' && copy.attrs?.src && !copy.attrs.src.startsWith('http')) {
                            try {
                                const res = await apiFetch(`${apiUrl}/api/file-manager/get-download-link`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ storageKey: copy.attrs.src }),
                                });
                                if (res.ok) {
                                    const { uploadUrl } = await res.json();
                                    copy.attrs = { ...copy.attrs, src: uploadUrl };
                                }
                            } catch { /* lascia src invariato */ }
                        }
                        if (Array.isArray(copy.content)) {
                            copy.content = await Promise.all(copy.content.map(resolveImages));
                        }
                        return copy;
                    };
                    const resolvedJson = await resolveImages(json);
                    const html = generateHTML(resolvedJson, [StarterKit, ImageWithStorageKey]);
                    setProjectHtml(html);
                } catch {
                    setError('Impossibile caricare il documento.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
            return;
        }
        const fetchDownloadUrl = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await apiFetch(`${apiUrl}/api/file-manager/get-download-link`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ storageKey })
                });
                if (!response.ok) throw new Error('Errore nel recupero del link');
                const data = await response.json();
                setDownloadUrl(data.uploadUrl);
            } catch {
                setError("Impossibile caricare l'anteprima.");
            } finally {
                setLoading(false);
            }
        };
        fetchDownloadUrl();
    }, [storageKey, fileType, fileName]);

    useEffect(() => {
        if (downloadUrl && fileType.includes('excel') || fileType.includes('spreadsheet') || fileName.endsWith('.xlsx')) {
            const loadExcel = async () => {
                const response = await fetch(downloadUrl!);
                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer);
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
                setExcelData(jsonData);
            };
            loadExcel();
        }
        if (downloadUrl && (fileType.includes('word') || fileName.endsWith('.docx')) && docxRef.current) {
            const loadDocx = async () => {
                const response = await fetch(downloadUrl!);
                const arrayBuffer = await response.arrayBuffer();
                renderAsync(arrayBuffer, docxRef.current!);
            };
            loadDocx();
        }
    }, [downloadUrl, fileType, fileName]);

    const isImage = fileType.startsWith('image/');
    const isPDF = fileType === 'application/pdf';
    const isExcel = fileType.includes('excel') || fileType.includes('spreadsheet') || fileName.endsWith('.xlsx');
    const isWord = fileType.includes('word') || fileName.endsWith('.docx');

    return (
        <>
            <style>{`
                .fv-overlay {
                    position: fixed; inset: 0; z-index: 1055;
                    background: rgba(15, 20, 35, 0.75);
                    backdrop-filter: blur(6px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 1rem;
                    animation: fvFadeIn 0.18s ease;
                }
                @keyframes fvFadeIn { from { opacity: 0 } to { opacity: 1 } }
                .fv-dialog {
                    background: #fff;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 960px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.35);
                    animation: fvSlideUp 0.2s ease;
                }
                @keyframes fvSlideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
                .fv-header {
                    display: flex; align-items: center; gap: 12px;
                    padding: 16px 20px;
                    border-bottom: 1px solid #f0f0f0;
                    flex-shrink: 0;
                }
                .fv-header-accent {
                    width: 4px; border-radius: 4px; align-self: stretch; flex-shrink: 0;
                }
                .fv-header-icon {
                    width: 40px; height: 40px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; font-size: 1.2rem;
                }
                .fv-header-info { flex: 1; min-width: 0; }
                .fv-header-title {
                    font-weight: 600; font-size: 0.95rem;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                    color: #1a1a2e; margin: 0;
                }
                .fv-header-badge {
                    font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
                    letter-spacing: 0.5px; padding: 2px 8px; border-radius: 20px;
                    display: inline-block; margin-top: 3px;
                }
                .fv-body {
                    flex: 1; overflow: auto; min-height: 0;
                }
                .fv-close {
                    width: 32px; height: 32px; border-radius: 8px;
                    border: none; background: #f4f4f6; color: #666;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; flex-shrink: 0; font-size: 1rem;
                    transition: background 0.15s;
                }
                .fv-close:hover { background: #e8e8ec; color: #333; }
                .fv-loading {
                    display: flex; flex-direction: column; align-items: center;
                    justify-content: center; padding: 64px 32px; gap: 16px; color: #888;
                }
                .fv-error {
                    display: flex; flex-direction: column; align-items: center;
                    justify-content: center; padding: 64px 32px; gap: 12px; color: #dc3545;
                }
                .fv-prose {
                    max-width: 720px; margin: 0 auto;
                    padding: 48px 40px;
                    font-family: 'Georgia', 'Times New Roman', serif;
                    font-size: 1rem; line-height: 1.8; color: #1a1a2e;
                }
                .fv-prose h1, .fv-prose h2, .fv-prose h3 {
                    font-family: system-ui, -apple-system, sans-serif;
                    font-weight: 700; color: #0f1623; margin-top: 1.6em; margin-bottom: 0.5em;
                }
                .fv-prose h1 { font-size: 1.7rem; }
                .fv-prose h2 { font-size: 1.35rem; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
                .fv-prose h3 { font-size: 1.1rem; }
                .fv-prose p { margin-bottom: 1em; }
                .fv-prose strong { font-weight: 700; }
                .fv-prose em { font-style: italic; }
                .fv-prose ul, .fv-prose ol { padding-left: 1.6em; margin-bottom: 1em; }
                .fv-prose li { margin-bottom: 0.25em; }
                .fv-prose img { max-width: 100%; border-radius: 8px; margin: 1em 0; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
                .fv-prose a { color: #0d6efd; text-decoration: underline; }
                .fv-prose blockquote {
                    border-left: 3px solid #0d6efd; margin-left: 0; padding-left: 1.2em;
                    color: #555; font-style: italic;
                }
                .fv-prose code {
                    background: #f4f4f6; padding: 2px 6px; border-radius: 4px;
                    font-family: monospace; font-size: 0.9em;
                }
                .fv-image-bg {
                    background: #0f1623;
                    display: flex; align-items: center; justify-content: center;
                    min-height: 400px; padding: 24px;
                }
                .fv-unsupported {
                    display: flex; flex-direction: column; align-items: center;
                    justify-content: center; padding: 64px 32px; gap: 16px; color: #888;
                    text-align: center;
                }
            `}</style>

            <div className="fv-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
                <div className="fv-dialog">
                    {/* Header */}
                    <div className="fv-header">
                        <div className="fv-header-accent" style={{ background: accent.color }} />
                        <div className="fv-header-icon" style={{ background: `${accent.color}18`, color: accent.color }}>
                            <i className={`bi ${accent.icon}`} />
                        </div>
                        <div className="fv-header-info">
                            <p className="fv-header-title">{fileName}</p>
                            <span className="fv-header-badge" style={{ background: `${accent.color}18`, color: accent.color }}>
                                {accent.label}
                            </span>
                        </div>
                        {onEdit && (
                            <button type="button" className="btn btn-primary btn-sm rounded-3 px-3 me-1" onClick={onEdit}>
                                <i className="bi bi-pencil me-1" />Modifica
                            </button>
                        )}
                        <button className="fv-close" onClick={onClose} aria-label="Chiudi">
                            <i className="bi bi-x-lg" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="fv-body">
                        {loading && (
                            <div className="fv-loading">
                                <div className="spinner-border" style={{ color: accent.color, width: '2.5rem', height: '2.5rem' }} role="status" />
                                <span style={{ fontSize: '0.9rem' }}>Caricamento in corso...</span>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="fv-error">
                                <i className="bi bi-exclamation-circle-fill fs-2" />
                                <span>{error}</span>
                            </div>
                        )}

                        {!loading && !error && fileType === 'platformProject' && projectHtml && (
                            <div style={{ background: '#f7f8fc' }}>
                                <div className="fv-prose" dangerouslySetInnerHTML={{ __html: projectHtml }} />
                            </div>
                        )}

                        {!loading && !error && downloadUrl && (
                            <>
                                {isImage && (
                                    <div className="fv-image-bg">
                                        <PhotoProvider>
                                            <PhotoView src={downloadUrl}>
                                                <img
                                                    src={downloadUrl}
                                                    alt={fileName}
                                                    style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px', cursor: 'zoom-in', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                                                />
                                            </PhotoView>
                                        </PhotoProvider>
                                    </div>
                                )}

                                {isPDF && (
                                    <div style={{ height: '75vh' }}>
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                            <Viewer fileUrl={downloadUrl} plugins={[defaultLayoutPluginInstance]} />
                                        </Worker>
                                    </div>
                                )}

                                {isExcel && excelData && (
                                    <div className="table-responsive p-4" style={{ background: '#f7f8fc' }}>
                                        <table className="table table-bordered table-hover table-sm mb-0" style={{ fontSize: '0.82rem', background: '#fff' }}>
                                            <tbody>
                                                {excelData.map((row, i) => (
                                                    <tr key={i} style={i === 0 ? { background: '#e9f0ff', fontWeight: 600 } : {}}>
                                                        {row.map((cell, j) => <td key={j} className="px-3">{cell}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {isWord && (
                                    <div ref={docxRef} className="p-4 bg-white" style={{ minHeight: '60vh' }} />
                                )}

                                {!isImage && !isPDF && !isExcel && !isWord && (
                                    <div className="fv-unsupported">
                                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f4f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="bi bi-file-earmark-arrow-down fs-2 text-muted" />
                                        </div>
                                        <p className="mb-0" style={{ fontSize: '0.9rem' }}>Anteprima non disponibile per questo tipo di file</p>
                                        <a href={downloadUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm rounded-3 px-4">
                                            <i className="bi bi-download me-1" />Scarica File
                                        </a>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FileViewerComponent;
