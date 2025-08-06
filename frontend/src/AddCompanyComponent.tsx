import React, { useState } from 'react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;


interface Props {
  onClose: () => void;
  onCompanyAdded: () => void;
}

const AddCompanyComponent: React.FC<Props> = ({ onClose, onCompanyAdded }) => {
  // Stato per memorizzare i dati del form
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
  });

  // Stato per gestire il caricamento durante l'invio del form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestore per aggiornare lo stato quando l'utente scrive nei campi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene il ricaricamento della pagina
    setIsSubmitting(true); // Disabilita il pulsante per evitare doppi click
    setError(null); // Resetta eventuali errori precedenti

    try {
      const response = await fetch(`${apiUrl}/api/add-company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          notes: formData.notes || null, // Invia null se le note sono vuote
        }),
      });

      if (!response.ok) {
        // Se la risposta non è OK, leggiamo l'errore e lo lanciamo
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossibile aggiungere l'azienda.");
      }

      console.log('Azienda aggiunta con successo!');
      onCompanyAdded(); // Notifica il componente genitore per aggiornare la sua lista
      onClose();        // Chiude il popup
    } catch (err) {
      console.error("Errore durante l'aggiunta dell'azienda:", err);
      setError(err as string); // Mostra l'errore all'utente
    } finally {
      setIsSubmitting(false); // Riabilita il pulsante in ogni caso
    }
  };

  return (
    // Struttura del modale di Bootstrap 5 per un popup
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Aggiungi Nuova Azienda</h5>
            {/* Pulsante di chiusura che chiama la funzione onClose */}
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={isSubmitting}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nome Azienda *</label>
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
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">Note</label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {/* Mostra un messaggio di errore se ce n'è uno */}
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
                  {isSubmitting ? 'Aggiungendo...' : 'Aggiungi Azienda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyComponent;