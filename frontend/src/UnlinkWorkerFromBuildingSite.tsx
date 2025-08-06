import React, { useState } from 'react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface Props {
  workerId: number;
  buildingSiteId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const UnlinkWorkerFromBuildingSite: React.FC<Props> = ({ workerId, buildingSiteId, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlink = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/unlink-worker-from-site/${buildingSiteId}/${workerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to unlink worker from building site.');
      }

      // Disassociazione riuscita, chiama il callback di successo e chiudi il modale
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error unlinking worker:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Rimuovi Lavoratore dal Cantiere</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Sei sicuro di voler rimuovere questo lavoratore da questo cantiere?</p>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Annulla
            </button>
            <button type="button" className="btn btn-danger" onClick={handleUnlink} disabled={isSubmitting}>
              {isSubmitting ? 'Rimozione in corso...' : 'Rimuovi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlinkWorkerFromBuildingSite;