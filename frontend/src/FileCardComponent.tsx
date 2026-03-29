import './styles/FileManagerComponent.css';

const ICON_STYLES: Record<string, { bg: string; color: string }> = {
    'bi-pencil-square':       { bg: '#e7f1ff', color: '#0d6efd' },
    'bi-file-earmark-pdf':    { bg: '#fde8ea', color: '#dc3545' },
    'bi-file-earmark-image':  { bg: '#f0e6ff', color: '#6f42c1' },
    'bi-file-earmark-excel':  { bg: '#e6f7ee', color: '#198754' },
    'bi-filetype-csv':        { bg: '#e6f7ee', color: '#198754' },
    'bi-file-earmark-plus':   { bg: '#e7f1ff', color: '#0d6efd' },
    'bi-file-earmark-word':   { bg: '#e7f1ff', color: '#0d47a1' },
};
const DEFAULT_STYLE = { bg: '#f4f4f6', color: '#6c757d' };

type FileCardComponentProps = {
    handleDeleteClick: () => void;
    title: string;
    biIconName: string;
    handleCardClick: (id: number) => void;
    itemId: number;
    deletable?: boolean;
    warningText?: string;
};

export default function FileCardComponent({
    handleDeleteClick,
    title,
    biIconName,
    handleCardClick,
    itemId,
    deletable = true,
    warningText,
}: FileCardComponentProps) {
    const style = ICON_STYLES[biIconName] ?? DEFAULT_STYLE;

    return (
        <div className="fc-card" onClick={() => handleCardClick(itemId)}>
            {deletable && (
                <button
                    type="button"
                    className="fc-delete-btn"
                    aria-label="Elimina"
                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}
                >
                    <i className="bi bi-trash3" />
                </button>
            )}

            <div className="fc-icon-wrap" style={{ background: style.bg, color: style.color }}>
                <i className={`bi ${biIconName}`} />
            </div>

            <span className="fc-title">{title}</span>

            {warningText && (
                <div className="fc-warning">
                    <i className="bi bi-exclamation-triangle-fill me-1" />
                    {warningText}
                </div>
            )}
        </div>
    );
}
