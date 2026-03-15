
type FileCardComponentProps = {
    handleDeleteClick: () => void,
    title: string,
    biIconName: string,
    handleCardClick: (number: number) => void,
    itemId: number,
    deletable?: boolean
};

export default function FileCardComponent ({ handleDeleteClick, title, biIconName, handleCardClick, itemId, deletable = true }: FileCardComponentProps) {
    return (
        <div className="col-6 col-md-4 col-lg-3" key={itemId}>
            <div 
                className="card h-100 border-0 shadow-sm overflow-hidden hover-shadow transition-all"
                style={{ cursor: 'pointer' }}
                onClick={() => handleCardClick(itemId)}
            >
                <div className="card-body d-flex flex-column align-items-center py-4">
                    {/* Icona File */}
                    <div 
                        className="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center mb-3 text-primary"
                        style={{ width: '50px', height: '50px' }}
                    >
                        <i className={`bi ${biIconName} fs-3`}></i>
                    </div>

                    {/* Nome File */}
                    <p className="card-title mb-3 fw-semibold text-dark text-truncate w-100 text-center" style={{ fontSize: '0.8rem' }}>
                        {title}
                    </p>

                    {/* Pulsante Elimina */}
                    {deletable && <button
                        type="button" // default è type submit, il che fa ricaricare la pagina al click
                        className="btn btn-link text-danger btn-sm p-0 mt-auto decoration-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick();
                        }}
                    >
                        <i className="bi bi-trash3 me-1"></i> Elimina
                    </button>}
                </div>
            </div>
        </div>
    )
}