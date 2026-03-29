import React, { useEffect, useRef, useState } from 'react';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import ImageWithStorageKey from './extensions/ImageWithStorageKey';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

type GeneratePDFComponentProps = {
    projectId: number;
    projectName: string;
    buildingSiteId: string;
    date: string;
    onClose: () => void;
};

type Phase = 'generating' | 'preview' | 'saving' | 'saved' | 'error';

const GeneratePDFComponent: React.FC<GeneratePDFComponentProps> = ({
    projectId,
    projectName,
    buildingSiteId,
    date,
    onClose,
}) => {
    const [phase, setPhase] = useState<Phase>('generating');
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const renderContainerRef = useRef<HTMLDivElement>(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    // Pulisci l'object URL quando il componente si smonta
    useEffect(() => {
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfUrl]);

    useEffect(() => {
        const generate = async () => {
            try {
                const token = localStorage.getItem('token');

                // 1. Fetch del progetto
                const res = await fetch(`${apiUrl}/api/projects-manager/projects/${projectId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Errore nel recupero del progetto');
                const data = await res.json();

                let json = data.content_json;
                if (typeof json === 'string') {
                    try { json = JSON.parse(json); } catch { /* lascia invariato */ }
                }

                // 2. Risolvi storageKey delle immagini in URL
                const resolveImages = async (node: any): Promise<any> => {
                    if (!node || typeof node !== 'object') return node;
                    const copy: any = { ...node };
                    if (copy.type === 'image' && copy.attrs?.src && !copy.attrs.src.startsWith('http')) {
                        try {
                            const r = await fetch(`${apiUrl}/api/file-manager/get-download-link`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ storageKey: copy.attrs.src }),
                            });
                            if (r.ok) {
                                const { uploadUrl } = await r.json();
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

                // 3. Inietta l'HTML nel contenitore nascosto e aspetta il render
                const container = renderContainerRef.current;
                if (!container) throw new Error('Contenitore render non disponibile');
                container.innerHTML = html;

                // Aspetta che le immagini si carichino
                await Promise.all(
                    Array.from(container.querySelectorAll('img')).map(
                        (img) =>
                            new Promise<void>((resolve) => {
                                if (img.complete) { resolve(); return; }
                                img.onload = () => resolve();
                                img.onerror = () => resolve();
                            })
                    )
                );

                // 4. html2canvas → jsPDF
                const canvas = await html2canvas(container, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: '#ffffff',
                    logging: false,
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.92);
                const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
                const pageW = pdf.internal.pageSize.getWidth();
                const pageH = pdf.internal.pageSize.getHeight();
                const imgW = pageW;
                const imgH = (canvas.height * imgW) / canvas.width;

                let heightLeft = imgH;
                let yPos = 0;
                pdf.addImage(imgData, 'JPEG', 0, yPos, imgW, imgH);
                heightLeft -= pageH;
                while (heightLeft > 0) {
                    yPos -= pageH;
                    pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, yPos, imgW, imgH);
                    heightLeft -= pageH;
                }

                const blob = pdf.output('blob');
                const url = URL.createObjectURL(blob);
                setPdfBlob(blob);
                setPdfUrl(url);
                setPhase('preview');
            } catch (err) {
                console.error(err);
                setErrorMsg('Errore durante la generazione del PDF.');
                setPhase('error');
            }
        };

        generate();
    }, [projectId]);

    const handleDownload = () => {
        if (!pdfUrl) return;
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = `${projectName}.pdf`;
        a.click();
    };

    const handleSaveToPlatform = async () => {
        if (!pdfBlob) return;
        setPhase('saving');
        const token = localStorage.getItem('token');
        const fileName = `${projectName}.pdf`;

        try {
            // 1. Richiesta link di upload
            const resLink = await fetch(`${apiUrl}/api/file-manager/get-upload-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ fileName, fileType: 'application/pdf', buildingSiteId }),
            });
            if (!resLink.ok) throw new Error('Errore nel link di upload');
            const { uploadUrl, storageKey } = await resLink.json();

            // 2. Upload su Backblaze B2
            const resB2 = await fetch(uploadUrl, {
                method: 'PUT',
                body: pdfBlob,
            });
            if (!resB2.ok) throw new Error('Upload su storage fallito');

            // 3. Registra il file nel DB, collegato al progetto
            const resConfirm = await fetch(`${apiUrl}/api/file-manager/confirm-file-upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    storageKey,
                    originalName: fileName,
                    buildingSiteId,
                    mimeType: 'application/pdf',
                    date,
                    projectId,
                }),
            });
            if (!resConfirm.ok) throw new Error('Registrazione file fallita');

            setPhase('saved');
        } catch (err) {
            console.error(err);
            setErrorMsg('Errore durante il salvataggio sulla piattaforma.');
            setPhase('error');
        }
    };

    return (
        <>
            <style>{`
                .gpdf-overlay {
                    position: fixed; inset: 0; z-index: 1060;
                    background: rgba(15, 20, 35, 0.78);
                    backdrop-filter: blur(6px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 1rem;
                    animation: gpdfFadeIn 0.18s ease;
                }
                @keyframes gpdfFadeIn { from { opacity: 0 } to { opacity: 1 } }
                .gpdf-dialog {
                    background: #fff;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 960px;
                    max-height: 92vh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.4);
                    animation: gpdfSlideUp 0.2s ease;
                }
                @keyframes gpdfSlideUp {
                    from { transform: translateY(20px); opacity: 0 }
                    to   { transform: translateY(0);    opacity: 1 }
                }
                .gpdf-header {
                    display: flex; align-items: center; gap: 12px;
                    padding: 16px 20px;
                    border-bottom: 1px solid #f0f0f0;
                    flex-shrink: 0;
                }
                .gpdf-body {
                    flex: 1; overflow: auto; min-height: 0;
                }
                .gpdf-footer {
                    display: flex; align-items: center; justify-content: flex-end; gap: 10px;
                    padding: 14px 20px;
                    border-top: 1px solid #f0f0f0;
                    flex-shrink: 0;
                    background: #fafafa;
                }
                .gpdf-center {
                    display: flex; flex-direction: column; align-items: center;
                    justify-content: center; padding: 64px 32px; gap: 16px;
                    color: #888; text-align: center;
                }
                /* Contenitore nascosto per il render dell'HTML prima della cattura */
                .gpdf-render-container {
                    position: fixed;
                    left: -9999px;
                    top: 0;
                    width: 794px; /* larghezza A4 a 96dpi */
                    background: #ffffff;
                    font-family: Georgia, 'Times New Roman', serif;
                    font-size: 14px;
                    line-height: 1.8;
                    color: #1a1a2e;
                    padding: 60px 64px;
                    box-sizing: border-box;
                }
                .gpdf-render-container h1,
                .gpdf-render-container h2,
                .gpdf-render-container h3 {
                    font-family: system-ui, -apple-system, sans-serif;
                    font-weight: 700; color: #0f1623;
                    margin-top: 1.4em; margin-bottom: 0.4em;
                }
                .gpdf-render-container h1 { font-size: 24px; }
                .gpdf-render-container h2 { font-size: 19px; border-bottom: 1px solid #e0e0e0; padding-bottom: 6px; }
                .gpdf-render-container h3 { font-size: 16px; }
                .gpdf-render-container p  { margin-bottom: 0.9em; }
                .gpdf-render-container ul,
                .gpdf-render-container ol { padding-left: 24px; margin-bottom: 0.9em; }
                .gpdf-render-container img { max-width: 100%; border-radius: 6px; margin: 8px 0; }
                .gpdf-render-container blockquote {
                    border-left: 3px solid #0d6efd; margin-left: 0;
                    padding-left: 16px; color: #555; font-style: italic;
                }
                .gpdf-render-container code {
                    background: #f4f4f6; padding: 2px 5px;
                    border-radius: 3px; font-family: monospace; font-size: 0.88em;
                }
            `}</style>

            {/* Contenitore nascosto per cattura html2canvas */}
            <div ref={renderContainerRef} className="gpdf-render-container" aria-hidden="true" />

            <div className="gpdf-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
                <div className="gpdf-dialog">

                    {/* Header */}
                    <div className="gpdf-header">
                        <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: '#dc354518', color: '#dc3545',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', flexShrink: 0
                        }}>
                            <i className="bi bi-file-earmark-pdf-fill" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {projectName}.pdf
                            </p>
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
                                letterSpacing: '0.5px', padding: '2px 8px', borderRadius: 20,
                                background: '#dc354518', color: '#dc3545', display: 'inline-block', marginTop: 3
                            }}>PDF</span>
                        </div>
                        <button
                            style={{
                                width: 32, height: 32, borderRadius: 8, border: 'none',
                                background: '#f4f4f6', color: '#666', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
                            }}
                            onClick={onClose}
                            aria-label="Chiudi"
                        >
                            <i className="bi bi-x-lg" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="gpdf-body">
                        {phase === 'generating' && (
                            <div className="gpdf-center">
                                <div className="spinner-border" style={{ color: '#dc3545', width: '2.5rem', height: '2.5rem' }} role="status" />
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>Generazione PDF in corso...</p>
                            </div>
                        )}

                        {phase === 'error' && (
                            <div className="gpdf-center">
                                <i className="bi bi-exclamation-circle-fill fs-2 text-danger" />
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#dc3545' }}>{errorMsg}</p>
                            </div>
                        )}

                        {phase === 'saved' && (
                            <div className="gpdf-center">
                                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#d1e7dd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="bi bi-check-lg fs-2 text-success" />
                                </div>
                                <p style={{ margin: 0, fontWeight: 600, color: '#198754' }}>PDF salvato sulla piattaforma</p>
                                <p style={{ margin: 0, fontSize: '0.82rem', color: '#888' }}>
                                    Il file <strong>{projectName}.pdf</strong> è ora disponibile nella sezione documenti del cantiere.
                                </p>
                            </div>
                        )}

                        {(phase === 'preview' || phase === 'saving') && pdfUrl && (
                            <div style={{ height: '65vh' }}>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
                                </Worker>
                            </div>
                        )}
                    </div>

                    {/* Footer con tasti */}
                    {(phase === 'preview' || phase === 'saving') && (
                        <div className="gpdf-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm rounded-3 px-4"
                                onClick={handleDownload}
                                disabled={phase === 'saving'}
                            >
                                <i className="bi bi-download me-2" />Scarica
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm rounded-3 px-4"
                                onClick={handleSaveToPlatform}
                                disabled={phase === 'saving'}
                            >
                                {phase === 'saving' ? (
                                    <><span className="spinner-border spinner-border-sm me-2" role="status" />Salvataggio...</>
                                ) : (
                                    <><i className="bi bi-cloud-arrow-up me-2" />Salva sulla piattaforma</>
                                )}
                            </button>
                        </div>
                    )}

                    {phase === 'saved' && (
                        <div className="gpdf-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm rounded-3 px-4"
                                onClick={handleDownload}
                            >
                                <i className="bi bi-download me-2" />Scarica
                            </button>
                            <button
                                type="button"
                                className="btn btn-success btn-sm rounded-3 px-4"
                                onClick={onClose}
                            >
                                <i className="bi bi-check me-1" />Chiudi
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GeneratePDFComponent;
