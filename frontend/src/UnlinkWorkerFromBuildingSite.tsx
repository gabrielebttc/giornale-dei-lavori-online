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
    <div className="modal show d-block px-3" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(24, 28, 33, 0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered shadow" style={{ maxWidth: '400px' }} role="document">
        <div className="modal-content border-0 rounded-4">
          
          {/* Header con icona di avviso */}
          <div className="modal-body p-4 text-center">
            <div className="mb-3">
              <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-link-slash fs-1"></i>
              </div>
            </div>
            
            <h4 className="fw-bold text-dark">Scollega Lavoratore</h4>
            <p className="text-muted px-2">
              Sei sicuro di voler rimuovere questo lavoratore da <strong>questo cantiere</strong>? 
              <br />
              <span className="small">Il profilo rimarrà comunque nel database generale.</span>
            </p>

            {error && (
              <div className="alert alert-danger border-0 small py-2" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {/* Pulsanti Verticali per Mobile-first look */}
            <div className="d-grid gap-2 mt-4">
              <button 
                type="button" 
                className="btn btn-danger py-2 fw-bold rounded-3 shadow-sm" 
                onClick={handleUnlink} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Esecuzione...</>
                ) : 'Conferma Rimozione'}
              </button>
              
              <button 
                type="button" 
                className="btn btn-light border py-2 fw-bold text-muted rounded-3" 
                onClick={onClose} 
                disabled={isSubmitting}
              >
                Annulla
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UnlinkWorkerFromBuildingSite;