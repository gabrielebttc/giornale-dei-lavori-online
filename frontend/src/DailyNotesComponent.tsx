import React, { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

type NoteType = 'notes' | 'other_notes' | 'personal_notes';

interface Props {
  buildingSiteId: number;
  date: string;
  noteType: NoteType;
  onClose: () => void;
}

const DailyNoteComponent: React.FC<Props> = ({ buildingSiteId, date, noteType, onClose }) => {
  const [noteValue, setNoteValue] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const noteLabels = {
    notes: {
      title: 'ANNOTAZIONI SPECIALI E GENERALI',
      description: 'Sull\'andamento e modo di esecuzione dei lavori, sugli avvenimenti straordinari e sul tempo utilmente impiegato.',
    },
    other_notes: {
      title: 'OSSERVAZIONI E ISTRUZIONI',
      description: 'Della direzione lavori, del responsabile del procedimento, del coordinatore per l\'esecuzione, del collaudatore.',
    },
    personal_notes: {
      title: 'Annotazioni Personali',
      description: 'Segna le attività giornaliere o altro...',
    },
  };

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/api/get-daily-note?buildingSiteId=${buildingSiteId}&date=${date}&noteType=${noteType}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch note');
        const data = await response.json();
        setNoteValue(data.noteValue || '');
      } catch (err) {
        console.error("Error fetching daily note:", err);
        setError("Impossibile caricare la nota.");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [buildingSiteId, date, noteType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiUrl}/api/add-daily-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          buildingSiteId,
          date,
          noteType,
          noteValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save note');
      }

      setSuccess('Nota salvata con successo!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error saving daily note:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Caricamento nota...</div>;
  }

  const currentLabel = noteLabels[noteType];

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{currentLabel.title}</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={isSubmitting}></button>
          </div>
          <div className="modal-body">
            <p className="text-muted mb-3">{currentLabel.description}</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="noteText" className="form-label">{currentLabel.title}</label>
                <textarea
                  className="form-control"
                  id="noteText"
                  rows={5}
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose} disabled={isSubmitting}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvataggio...' : 'Salva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyNoteComponent;