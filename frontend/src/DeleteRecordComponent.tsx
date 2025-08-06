import React, { useState } from 'react';

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
      const response = await fetch(`${apiUrl}/api/delete-record/${tableName}/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
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
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Conferma eliminazione</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={isDeleting}></button>
          </div>
          <div className="modal-body">
            <p>Sei sicuro di voler eliminare questo record?</p>
            <p>Questa operazione non può essere annullata.</p>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isDeleting}
            >
              Annulla
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminazione in corso...' : 'Elimina'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRecordComponent;