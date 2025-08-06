import React, { useState } from 'react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface Props {
  onClose: () => void;
  onUserTypeAdded: () => void;
}

const AddUserTypeComponent: React.FC<Props> = ({ onClose, onUserTypeAdded }) => {
  // Stato per memorizzare i dati del form
  const [formData, setFormData] = useState({
    name: '',
  });

  // Stato per gestire il caricamento durante l'invio del form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestore per aggiornare lo stato quando l'utente scrive nei campi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.name.trim()) {
      setError("Il nome della mansione è obbligatorio.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/add-user_type`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossibile aggiungere la mansione. Errore sconosciuto.");
      }

      console.log('Mansione aggiunta con successo!');
      onUserTypeAdded();
      onClose();
    } catch (err) {
      console.error("Errore durante l'aggiunta della mansione:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Aggiungi Nuova Mansione</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={isSubmitting}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nome Mansione *</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose} disabled={isSubmitting}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Aggiungendo...' : 'Aggiungi Mansione'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserTypeComponent;