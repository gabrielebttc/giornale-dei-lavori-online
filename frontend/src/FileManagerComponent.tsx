import { useEffect, useState } from "react";
import { formatDateLong } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import AddRecordComponent from "./AddRecordComponent";
import type { FilesRecord, ProjectsRecord } from "./types/dbTables";
import DeleteRecordComponent from "./DeleteRecordComponent";
import FileViewerComponent from "./FileViewerComponent";

import FileCardComponent from "./FileCardComponent";
import CollaboraEditorComponent from "./CollaboraEditorComponent";
import './styles/FileManagerComponent.css';
import { apiFetch } from '../utils/apiFetch';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

type FileManagerComponentProps = {
    buildingSiteId: number,
    selectedDate: string,
    handleEditFile: (fileAlreadyExists: boolean) => void;
}

export default function FileManagerComponent({ buildingSiteId, selectedDate, handleEditFile }: FileManagerComponentProps) {
    const navigate = useNavigate();

    const [filesList, setFilesList] = useState<FilesRecord[]>([]);
    const [projectsList, setProjectsList] = useState<ProjectsRecord[]>([]);
    const [deleteRecordPopup, isDeleteRecordPopupVisible] = useState<boolean>(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<number>(0);
    const [itemToDeleteStorageKey, setItemToDeleteStorageKey] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<FilesRecord | null>(null);
    const [collaboraFile, setCollaboraFile] = useState<FilesRecord | null>(null);
    const [newCollaboraFile, setNewCollaboraFile] = useState<{ id: number; name: string } | null>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectsRecord | null>(null);
    const [deleteProjectPopup, isDeleteProjectPopupVisible] = useState<boolean>(false);
    const [projectToDeleteId, setProjectToDeleteId] = useState<number>(0);

    type EditTarget = { kind: 'file'; id: number } | { kind: 'project'; id: number };
    const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
    const [editName, setEditName] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editSaving, setEditSaving] = useState(false);

    const sortedFiles = [...filesList].sort((a, b) => {
        const dateA = new Date(a.date ?? "").getTime();
        const dateB = new Date(b.date ?? "").getTime();
        return dateA - dateB;
    });

    const sortedProjects = [...projectsList].sort((a, b) => {
        const dateA = new Date(a.date ?? "").getTime();
        const dateB = new Date(b.date ?? "").getTime();
        return dateA - dateB;
    });

    const openEditPopup = (target: { kind: 'file'; id: number } | { kind: 'project'; id: number }, currentName: string, currentDate?: string | null) => {
        setEditTarget(target);
        setEditName(currentName);
        setEditDate(currentDate ? String(currentDate).slice(0, 10) : '');
    };

    const saveEditMeta = async () => {
        if (!editTarget) return;
        setEditSaving(true);
        try {
            if (editTarget.kind === 'file') {
                await apiFetch(`${apiUrl}/api/file-manager/files/${editTarget.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: editName.trim(), date: editDate }),
                });
            } else {
                await apiFetch(`${apiUrl}/api/projects-manager/projects/${editTarget.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: editName.trim(), date: editDate }),
                });
            }
        } catch { /* silenzioso */ } finally {
            setEditSaving(false);
            setEditTarget(null);
            void fetchFilesAndProjects(buildingSiteId);
        }
    };

    async function deleteFile () {
        isDeleteRecordPopupVisible(true);
        deleteFileFromCloudStorage(itemToDeleteStorageKey); // qualora lo storage_key non fosse un valido storage_key, non riporta alcun errore, non so perchè, ma meglio così
    }

    const fetchFilesAndProjects = async (currentBuildingSiteId: number) => {
        const [filesData, projectsData] = await Promise.all([
            fetchFilesFromBuildingSiteId(currentBuildingSiteId),
            fetchProjectsFromBuildingSiteId(currentBuildingSiteId),
        ]);

        setFilesList(filesData);
        setProjectsList(projectsData);
    }

    // Logica di ricerca dei files/progetti con SearchBarComponent
    const [searchTerm, setSearchTerm] = useState<string>('');
    const term = searchTerm.trim().toLowerCase();

    const matchingFiles = term
        ? sortedFiles.filter((file) => file.name.toLowerCase().includes(term))
        : sortedFiles;

    const projectIdsWithMatchingFiles = new Set(
        matchingFiles
            .filter((file) => file.project_id !== null)
            .map((file) => file.project_id as number)
    );

    const filteredSortedProjects = term
        ? sortedProjects.filter(
            (project) =>
                project.name.toLowerCase().includes(term) ||
                projectIdsWithMatchingFiles.has(project.id)
        )
        : sortedProjects;

    const projectIdsInView = new Set(filteredSortedProjects.map((project) => project.id));

    const filteredSortedFiles = term
        ? sortedFiles.filter((file) => {
            if (file.project_id && projectIdsInView.has(file.project_id)) {
                const project = filteredSortedProjects.find((item) => item.id === file.project_id);
                // Se matcha il nome progetto, mostra l'intero gruppo progetto+file.
                if (project && project.name.toLowerCase().includes(term)) {
                    return true;
                }
            }

            return file.name.toLowerCase().includes(term);
        })
        : sortedFiles;

    const normalizeDateKey = (value?: string | null) => {
        if (!value) return '';
        const raw = String(value);

        if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
            return raw.slice(0, 10);
        }

        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) return '';
        return parsed.toISOString().slice(0, 10);
    };

    const areSameCalendarDate = (left?: string | null, right?: string | null) => {
        const leftKey = normalizeDateKey(left);
        const rightKey = normalizeDateKey(right);
        return leftKey !== '' && leftKey === rightKey;
    };

    // Raggruppa i contenuti per data (chiave stabile) e lega i files ai rispettivi progetti.
    const groupedByDate = (() => {
        const groups: Record<string, { label: string; projects: ProjectsRecord[]; standaloneFiles: Array<{ file: FilesRecord; warning: string | null }> }> = {};
        const projectsById = new Map(sortedProjects.map((project) => [project.id, project]));

        const ensureGroup = (dateKey: string, dateLabel: string) => {
            if (!groups[dateKey]) {
                groups[dateKey] = { label: dateLabel, projects: [], standaloneFiles: [] };
            }
        };

        filteredSortedProjects.forEach((project) => {
            const dateKey = project.date || 'no-date';
            const dateLabel = project.date ? formatDateLong(project.date) : 'Senza data';
            ensureGroup(dateKey, dateLabel);
            groups[dateKey].projects.push(project);
        });

        filteredSortedFiles.forEach((file) => {
            const dateKey = file.date || 'no-date';
            const dateLabel = file.date ? formatDateLong(file.date) : 'Senza data';
            ensureGroup(dateKey, dateLabel);

            const linkedProject = file.project_id ? projectsById.get(file.project_id) : null;
            const isDateMismatch = Boolean(linkedProject) && !areSameCalendarDate(file.date, linkedProject?.date);
            const canStayInsideProject = Boolean(linkedProject) && areSameCalendarDate(file.date, linkedProject?.date);

            if (!file.project_id || isDateMismatch || !canStayInsideProject) {
                groups[dateKey].standaloneFiles.push({
                    file,
                    warning: isDateMismatch
                        ? 'Attenzione, questo file e associato ad un progetto con una data diversa'
                        : null,
                });
            }
        });

        return groups;
    })();

    const groupedDateKeys = Object.keys(groupedByDate).sort(
        (a, b) => new Date(b === 'no-date' ? 0 : b).getTime() - new Date(a === 'no-date' ? 0 : a).getTime()
    );

    useEffect(() => {
        fetchFilesAndProjects(buildingSiteId);
    }, [buildingSiteId]);

    const totalItems = filteredSortedProjects.length + filteredSortedFiles.length;

    return (
        <>
        <div className="fm-page">

            {/* Barra di ricerca */}
            <div className="fm-search-wrap mb-4">
                <i className="bi bi-search fm-search-icon" />
                <input
                    type="text"
                    className="fm-search-input"
                    placeholder="Cerca per nome documento o file..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Stato vuoto */}
            {totalItems === 0 && (
                <div className="fm-empty">
                    <div className="fm-empty-icon">
                        <i className="bi bi-folder2-open" />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#bbb' }}>
                        {searchTerm ? 'Nessun risultato per la ricerca.' : 'Nessun documento o file caricato.'}
                    </p>
                </div>
            )}

            {/* Gruppi per data */}
            {groupedDateKeys.map((dateKey) => (
                <div key={dateKey} style={{ marginBottom: '2.25rem' }}>

                    {/* Header data */}
                    <div className="fm-date-header">
                        <div className="fm-date-pill">
                            <i className="bi bi-calendar3" />
                            {groupedByDate[dateKey].label}
                        </div>
                        <div className="fm-date-line"></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                        {/* Progetti con Documenti */}
                        {groupedByDate[dateKey].projects.map((project) => {
                            const projectFiles = filteredSortedFiles.filter(
                                (file) => file.project_id === project.id && areSameCalendarDate(file.date, project.date)
                            );
                            return (
                                <div key={project.id} className="fm-project-group">
                                    <div className="fm-project-group-header">
                                        <span className="fm-project-badge">
                                            <i className="bi bi-pencil-square me-1" />
                                            Documento modificabile
                                        </span>
                                    </div>
                                    <div className="fm-project-body">
                                        {/* Card progetto */}
                                        <div className="fm-grid" style={{ marginBottom: projectFiles.length > 0 ? '16px' : 0 }}>
                                            <FileCardComponent
                                                handleDeleteClick={() => {
                                                    setProjectToDeleteId(project.id);
                                                    isDeleteProjectPopupVisible(true);
                                                }}
                                                title={project.name}
                                                biIconName="bi-pencil-square"
                                                handleCardClick={() => setSelectedProject(project)}
                                                itemId={project.id}
                                                onEditClick={() => openEditPopup({ kind: 'project', id: project.id }, project.name, project.date)}
                                            />
                                        </div>

                                        {/* Documenti */}
                                        {projectFiles.length > 0 && (
                                            <>
                                                <div className="fm-attachments-label">
                                                    <i className="bi bi-paperclip" />
                                                    Documenti ({projectFiles.length})
                                                </div>
                                                <div className="fm-grid">
                                                    {projectFiles.map((file) => (
                                                        <FileCardComponent
                                                            key={file.id}
                                                            handleDeleteClick={() => {
                                                                setItemToDeleteId(file.id);
                                                                setItemToDeleteStorageKey(file.storage_key);
                                                                deleteFile();
                                                            }}
                                                            title={file.name}
                                                            biIconName={getFileIcon(file.file_type)}
                                                            handleCardClick={() => {
                                                                if (isCollaboraEditable(file.name)) {
                                                                    setCollaboraFile(file);
                                                                } else {
                                                                    setSelectedFile(file);
                                                                }
                                                            }}
                                                            itemId={file.id}
                                                            onEditClick={() => openEditPopup({ kind: 'file', id: file.id }, file.name, file.date)}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        {projectFiles.length === 0 && (
                                            <p className="fm-no-attachments">Nessun Documento associato.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* File standalone */}
                        {groupedByDate[dateKey].standaloneFiles.length > 0 && (
                            <div className="fm-grid">
                                {groupedByDate[dateKey].standaloneFiles.map(({ file, warning }) => (
                                    <FileCardComponent
                                        key={file.id}
                                        handleDeleteClick={() => {
                                            setItemToDeleteId(file.id);
                                            setItemToDeleteStorageKey(file.storage_key);
                                            deleteFile();
                                        }}
                                        title={file.name}
                                        biIconName={getFileIcon(file.file_type)}
                                        handleCardClick={() => {
                                            if (isCollaboraEditable(file.name)) {
                                                setCollaboraFile(file);
                                            } else {
                                                setSelectedFile(file);
                                            }
                                        }}
                                        itemId={file.id}
                                        warningText={warning || undefined}
                                        onEditClick={() => openEditPopup({ kind: 'file', id: file.id }, file.name, file.date)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Overlay e Modal */}
        <AddRecordComponent
            tableName="files"
            buildingSiteId={buildingSiteId}
            selectedDate={selectedDate}
            onSuccess={() => fetchFilesAndProjects(buildingSiteId)}
            handleEditFile={(fileAlreadyExists) => handleEditFile(fileAlreadyExists)}
            onCollaboraFileCreated={(fileId, fileName) => {
                fetchFilesAndProjects(buildingSiteId);
                setNewCollaboraFile({ id: fileId, name: fileName });
            }}
        />

        {deleteRecordPopup && (
            <DeleteRecordComponent
                tableName="files"
                recordId={itemToDeleteId}
                onClose={() => { fetchFilesAndProjects(buildingSiteId); isDeleteRecordPopupVisible(false); }}
                onSuccess={() => { fetchFilesAndProjects(buildingSiteId); isDeleteRecordPopupVisible(false); }}
            />
        )}

        {selectedFile && (
            <FileViewerComponent
                storageKey={selectedFile.storage_key}
                fileType={selectedFile.file_type}
                fileName={selectedFile.name}
                fileId={selectedFile.id}
                fileDate={selectedFile.date ?? undefined}
                onClose={() => { setSelectedFile(null); fetchFilesAndProjects(buildingSiteId); }}
            />
        )}

        {selectedProject && (
            <FileViewerComponent
                storageKey=""
                fileType="platformProject"
                fileName={selectedProject.name}
                projectId={selectedProject.id}
                fileDate={selectedProject.date ?? undefined}
                onClose={() => { setSelectedProject(null); fetchFilesAndProjects(buildingSiteId); }}
                onEdit={() => navigate(`/edit-document/${buildingSiteId}/${selectedDate}?projectId=${selectedProject.id}`)}
            />
        )}

        {deleteProjectPopup && (
            <DeleteRecordComponent
                tableName="projects"
                recordId={projectToDeleteId}
                onClose={() => { fetchFilesAndProjects(buildingSiteId); isDeleteProjectPopupVisible(false); }}
                onSuccess={() => { fetchFilesAndProjects(buildingSiteId); isDeleteProjectPopupVisible(false); }}
            />
        )}

        {collaboraFile && (
            <CollaboraEditorComponent
                fileId={collaboraFile.id}
                fileName={collaboraFile.name}
                onClose={() => { setCollaboraFile(null); fetchFilesAndProjects(buildingSiteId); }}
            />
        )}

        {newCollaboraFile && (
            <CollaboraEditorComponent
                fileId={newCollaboraFile.id}
                fileName={newCollaboraFile.name}
                onClose={() => { setNewCollaboraFile(null); fetchFilesAndProjects(buildingSiteId); }}
            />
        )}

        {/* Popup modifica nome/data */}
        {editTarget && (
            <div
                className="modal d-block"
                tabIndex={-1}
                style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 1070 }}
                onClick={() => setEditTarget(null)}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    style={{ maxWidth: 380 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header border-0 pb-0">
                            <h6 className="modal-title fw-bold text-primary">
                                <i className="bi bi-pencil me-2" />
                                Modifica informazioni
                            </h6>
                            <button type="button" className="btn-close" onClick={() => setEditTarget(null)} />
                        </div>
                        <div className="modal-body px-4 pb-4 pt-3">
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary text-uppercase" style={{ letterSpacing: '0.5px' }}>
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => { if (e.key === 'Enter') void saveEditMeta(); }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary text-uppercase" style={{ letterSpacing: '0.5px' }}>
                                    Data
                                </label>
                                <input
                                    type="date"
                                    className="form-control rounded-3"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn btn-primary w-100 rounded-3 fw-bold"
                                onClick={() => void saveEditMeta()}
                                disabled={editSaving || !editName.trim()}
                            >
                                {editSaving
                                    ? <><span className="spinner-border spinner-border-sm me-2" />Salvataggio...</>
                                    : <><i className="bi bi-check2 me-2" />Salva</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

async function fetchFilesFromBuildingSiteId(id: number): Promise<FilesRecord[]> {
    try {
        const response = await apiFetch(`${apiUrl}/api/file-manager/files/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        });

        if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data: FilesRecord[] = await response.json();
        return data;
        
    } catch (error) {
        console.error("Errore durante il recupero dei file:", error);
        return [];
    }
}

async function fetchProjectsFromBuildingSiteId(buildingSiteId: number): Promise<ProjectsRecord[]> {
    try {
        const response = await apiFetch(`${apiUrl}/api/projects-manager/building-sites/${buildingSiteId}/projects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data: ProjectsRecord[] = await response.json();
        return data;
    } catch (error) {
        console.error('Errore durante il recupero dei progetti:', error);
        return [];
    }
}

const COLLABORA_EXTENSIONS = ['.docx', '.doc', '.odt', '.xlsx', '.xls', '.ods', '.pptx', '.ppt', '.odp'];

const isCollaboraEditable = (fileName: string): boolean => {
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return COLLABORA_EXTENSIONS.includes(ext);
};

const getFileIcon = (mimeType: string) => {
  const icons: Record<string, string> = {
    'application/pdf': 'bi-file-earmark-pdf',
    'image/jpeg': 'bi-file-earmark-image',
    'image/png': 'bi-file-earmark-image',
    'image/webp': 'bi-file-earmark-image',
    'application/vnd.ms-excel': 'bi-file-earmark-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'bi-file-earmark-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'bi-filetype-docx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'bi-file-earmark-slides',
    'application/vnd.oasis.opendocument.text': 'bi-file-earmark-word',
    'application/vnd.oasis.opendocument.spreadsheet': 'bi-file-earmark-excel',
    'application/vnd.oasis.opendocument.presentation': 'bi-file-earmark-slides',
    'text/csv': 'bi-filetype-csv',
    
  };

  // Se non trova il tipo specifico, mette un'icona generica per file
  return icons[mimeType] || 'bi-file-earmark';
};

const deleteFileFromCloudStorage = async (storageKey: string) => {
    try {
        const response = await apiFetch(`${apiUrl}/api/file-manager/delete-file/${encodeURIComponent(storageKey)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Errore:', data.error);
        }
    } catch (error) {
        console.error('Errore di rete:', error);
    }
};