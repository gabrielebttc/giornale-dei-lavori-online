import React, { useEffect, useState, useRef } from 'react';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import * as XLSX from 'xlsx';
import { renderAsync } from 'docx-preview';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

type FileViewerProps = {
    storageKey: string;
    fileType: string;
    fileName: string;
    onClose: () => void;
};

const FileViewerComponent: React.FC<FileViewerProps> = ({ storageKey, fileType, fileName, onClose }) => {
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [excelData, setExcelData] = useState<string[][] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projectHtml, setProjectHtml] = useState<string | null>(null);
    const docxRef = useRef<HTMLDivElement>(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        if (fileType === 'platformProject') {
            // Assume fileName contiene l'id del progetto
            const fetchProject = async () => {
                setLoading(true);
                setError(null);
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${apiUrl}/api/projects-manager/projects/${fileName}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) throw new Error('Errore nel recupero progetto');
                    const data = await response.json();
                    // content_json può essere stringa o oggetto
                    let json = data.content_json;
                    if (typeof json === 'string') {
                        try { json = JSON.parse(json); } catch { /* fallback: lascio stringa */ }
                    }
                    const html = generateHTML(json, [StarterKit]);
                    setProjectHtml(html);
                } catch (err) {
                    setError('Impossibile caricare il documento.');
                    setProjectHtml(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
            return;
        }
        // ...esistente fetchDownloadUrl per altri tipi
        const fetchDownloadUrl = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/api/file-manager/get-download-link`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ storageKey })
                });

                if (!response.ok) throw new Error('Errore nel recupero del link');
                const data = await response.json();
                setDownloadUrl(data.uploadUrl);
            } catch (err) {
                setError('Impossibile caricare l\'anteprima.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDownloadUrl();
    }, [storageKey, fileType, fileName]);

    useEffect(() => {
        if (downloadUrl && fileType.includes('excel') || fileType.includes('spreadsheet') || fileName.endsWith('.xlsx')) {
            const loadExcel = async () => {
                const response = await fetch(downloadUrl);
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
                const response = await fetch(downloadUrl);
                const arrayBuffer = await response.arrayBuffer();
                renderAsync(arrayBuffer, docxRef.current!);
            };
            loadDocx();
        }
    }, [downloadUrl, fileType, fileName]);

    if (loading) return <div className="p-4 text-center">Caricamento anteprima...</div>;
    if (error) return <div className="p-4 text-center text-danger">{error}</div>;
    if (fileType === 'platformProject' && projectHtml) {
        return (
            <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" style={{ maxHeight: '90vh' }}>
                    <div className="modal-content h-100">
                        <div className="modal-header">
                            <h5 className="modal-title text-truncate">Documento piattaforma</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body p-4 bg-white overflow-auto" style={{ minHeight: '60vh' }}>
                            <div dangerouslySetInnerHTML={{ __html: projectHtml }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (!downloadUrl) return null;

    const isImage = fileType.startsWith('image/');
    const isPDF = fileType === 'application/pdf';
    const isExcel = fileType.includes('excel') || fileType.includes('spreadsheet') || fileName.endsWith('.xlsx');
    const isWord = fileType.includes('word') || fileName.endsWith('.docx');

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" style={{ maxHeight: '90vh' }}>
                <div className="modal-content h-100">
                    <div className="modal-header">
                        <h5 className="modal-title text-truncate">{fileName}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-0 d-flex justify-content-center align-items-center bg-light overflow-auto">
                        {isImage && (
                            <PhotoProvider>
                                <PhotoView src={downloadUrl}>
                                    <img src={downloadUrl} alt={fileName} style={{ maxWidth: '100%', maxHeight: '70vh', cursor: 'zoom-in' }} />
                                </PhotoView>
                            </PhotoProvider>
                        )}

                        {isPDF && (
                            <div style={{ height: '70vh', width: '100%' }}>
                                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                    <Viewer fileUrl={downloadUrl} plugins={[defaultLayoutPluginInstance]} />
                                </Worker>
                            </div>
                        )}

                        {isExcel && excelData && (
                            <div className="table-responsive p-3 bg-white w-100 h-100">
                                <table className="table table-bordered table-sm small">
                                    <tbody>
                                        {excelData.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((cell, j) => <td key={j}>{cell}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {isWord && (
                            <div ref={docxRef} className="p-3 bg-white w-100 h-100" style={{ minHeight: '70vh' }}></div>
                        )}

                        {!isImage && !isPDF && !isExcel && !isWord && (
                            <div className="text-center p-5">
                                <i className="bi bi-file-earmark-arrow-down fs-1 text-muted"></i>
                                <p className="mt-3">Anteprima non disponibile per questo tipo di file.</p>
                                <a href={downloadUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                                    Scarica File
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileViewerComponent;
