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
      }, 1500);
    } catch (err) {
      console.error("Error adding worker to building site:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title">Aggiungi Lavoratore Esistente</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {loading ? (
              <p>Caricamento lavoratori...</p>
            ) : workers.length === 0 ? (
              <p className="text-center">Nessun lavoratore disponibile da aggiungere.</p>
            ) : (
              <ul className="list-group">
                {workers.map((worker) => (
                  <li key={worker.user_id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{worker.first_name} {worker.last_name}</strong>
                      <br/>
                      <small>Azienda: {worker.company_names.join(', ')}</small>
                      <br/>
                      <small>Mansioni: {worker.user_types.join(', ')}</small>
                    </div>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAddWorker(worker.user_id)}
                      disabled={isSubmitting}
                    >
                      Aggiungi
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success mt-3" role="alert">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExistingWorkerComponent;