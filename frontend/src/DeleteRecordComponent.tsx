import React, { useState } from 'react';
import { apiFetch } from '../utils/apiFetch';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Definisci l'interfaccia delle prop per chiarezza
interface Props {
  tableName: string;
  recordId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteRecordComponent: React.FC<Props> = ({ tableName, recordId, onClose, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await apiFetch(`${apiUrl}/api/delete-record/${tableName}/${recordId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore durante l\'eliminazione del record');
      }
      
      // Chiamiamo la funzione onSuccess per notificare il componente genitore
      onSuccess();

    } catch (err) {
      console.error('Errore durante l\'eliminazione:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal show d-block px-3" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(24, 28, 33, 0.8)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered shadow" style={{ maxWidth: '400px' }} role="document">
        <div className="modal-content border-0 rounded-4 overflow-hidden">
          
          {/* Barra superiore di avviso */}
          <div className="bg-danger" style={{ height: '6px' }}></div>

          <div className="modal-body p-4 text-center">
            <div className="mb-4">
              <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center animate-pulse" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-exclamation-octagon fs-1"></i>
              </div>
            </div>
            
            <h4 className="fw-bold text-dark">Elimina Definitivamente</h4>
            <p className="text-muted px-2 mb-0">
              Sei sicuro di voler eliminare?
            </p>
            <p className="text-danger small fw-bold mt-1">
              <i className="bi bi-info-circle me-1"></i>
              Questa operazione è irreversibile.
            </p>

            {error && (
              <div className="alert alert-danger border-0 small py-2 mt-3 text-start" role="alert">
                <i className="bi bi-bug me-2"></i>
                {error}
              </div>
            )}

            {/* Pulsanti di azione */}
            <div className="d-grid gap-2 mt-4">
              <button 
                type="button" 
                className="btn btn-danger py-2 fw-bold rounded-3 shadow-sm border-0" 
                onClick={handleDelete} 
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Eliminazione...</>
                ) : 'Sì, Elimina ora'}
              </button>
              
              <button 
                type="button" 
                className="btn btn-light border-0 py-2 fw-bold text-muted rounded-3" 
                onClick={onClose} 
                disabled={isDeleting}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-pulse {
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
        }
      `}</style>
    </div>
  );
};

export default DeleteRecordComponent;