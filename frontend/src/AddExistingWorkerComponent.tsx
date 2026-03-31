import React, { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface Worker {
  user_id: number;
  first_name: string;
  last_name: string;
  company_names: string[];
  user_types: string[];
}

interface Props {
  onClose: () => void;
  onWorkerAdded: () => void;
  buildingSiteId: number;
}

const AddExistingWorkerComponent: React.FC<Props> = ({ onClose, onWorkerAdded, buildingSiteId }) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkersNotInSite = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/get-all-workers-not-in-building-site?buildingSiteId=${buildingSiteId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch workers');
        }
        const data = await response.json();
        setWorkers(data);
      } catch (err) {
        console.error("Error fetching workers:", err);
        setError("Impossibile caricare i lavoratori esistenti.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkersNotInSite();
  }, [buildingSiteId]);

  const handleAddWorker = async (userId: number) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiUrl}/api/add-existing-worker-to-building-site`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId, buildingSiteId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Impossibile aggiungere il lavoratore al cantiere.");
      }

      setSuccess("Lavoratore aggiunto con successo!");
      setTimeout(() => {
        onWorkerAdded();
        onClose();
      }, 500);
    } catch (err) {
      console.error("Error adding worker to building site:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block px-3" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(24, 28, 33, 0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
        <div className="modal-content border-0 shadow-lg rounded-4">
          
          {/* Header */}
          <div className="modal-header border-0 p-4 d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold text-dark mb-0">Seleziona Lavoratore</h4>
              <small className="text-muted">Aggiungi un profilo già registrato al cantiere</small>
            </div>
            <button type="button" className="btn-close shadow-none" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body p-4 pt-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Ricerca lavoratori...</p>
              </div>
            ) : workers.length === 0 ? (
              <div className="text-center py-5 bg-light rounded-4 border border-dashed">
                <i className="bi bi-person-x fs-1 text-muted"></i>
                <p className="mt-2 fw-medium text-secondary">Nessun lavoratore disponibile.</p>
              </div>
            ) : (
              <div className="list-group list-group-flush rounded-3 border overflow-hidden">
                {workers.map((worker) => (
                  <div 
                    key={worker.user_id} 
                    className="list-group-item list-group-item-action p-3 d-flex align-items-center justify-content-between border-bottom"
                  >
                    <div className="d-flex align-items-center">
                      {/* Avatar Iniziali */}
                      <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '45px', height: '45px', minWidth: '45px' }}>
                        {worker.first_name[0]}{worker.last_name[0]}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{worker.first_name} {worker.last_name}</div>
                        <div className="small text-muted mb-1">
                          <i className="bi bi-building me-1"></i>
                          {worker.company_names.join(', ')}
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          {worker.user_types.map((type, idx) => (
                            <span key={idx} className="badge bg-light text-dark border-0 fw-normal p-0 small" style={{ fontSize: '0.7rem' }}>
                              #{type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold shadow-sm"
                      onClick={() => handleAddWorker(worker.user_id)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <>Aggiungi <i className="bi bi-plus-lg ms-1"></i></>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Feedback Messages */}
            {(error || success) && (
              <div className={`alert ${error ? 'alert-danger' : 'alert-success'} mt-4 border-0 rounded-3 shadow-sm`} role="alert">
                <i className={`bi ${error ? 'bi-exclamation-circle' : 'bi-check-circle'} me-2`}></i>
                {error || success}
              </div>
            )}
          </div>

          <div className="modal-footer border-0 p-4 pt-0">
            <button type="button" className="btn btn-light border w-100 fw-bold text-muted py-2" onClick={onClose} disabled={isSubmitting}>
              Chiudi
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .list-group-item-action:hover {
          background-color: #f8fbff;
        }
        .modal-dialog-scrollable .modal-body {
          max-height: 60vh;
        }
        /* Scrollbar personalizzata */
        .modal-body::-webkit-scrollbar { width: 6px; }
        .modal-body::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AddExistingWorkerComponent;