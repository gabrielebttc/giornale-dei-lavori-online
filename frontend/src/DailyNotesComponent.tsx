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
    <div className="fixed-top w-100 h-100 d-flex align-items-end justify-content-center" style={{ zIndex: 1070 }}>
      {/* Overlay più scuro per isolare il contenuto */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100" 
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      ></div>

      <div 
        className="bg-white shadow-lg rounded-top-5 w-100 animate-slide-up-high" 
        style={{ 
          maxWidth: '700px', 
          height: '85vh', // Arriva quasi in cima (85% dell'altezza schermo)
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Handle superiore per "trascinamento" */}
        <div className="text-center pt-3 pb-2" onClick={onClose} style={{ cursor: 'pointer' }}>
          <div className="bg-secondary bg-opacity-20 rounded-pill d-inline-block" style={{ width: '50px', height: '6px' }}></div>
        </div>

        <div className="px-4 pb-4 flex-grow-1 d-flex flex-column">
          {/* Header fisso */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h3 className="fw-bold text-dark mb-1">{currentLabel.title}</h3>
              <p className="text-muted mb-0">{currentLabel.description}</p>
            </div>
            <button type="button" className="btn-close shadow-none p-2" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column">
            {/* Area di testo che occupa tutto lo spazio disponibile */}
            <div className="flex-grow-1 mb-4">
              <textarea
                className="form-control border-0 bg-light p-4 shadow-none rounded-4"
                id="noteText"
                placeholder="Inizia a scrivere qui le tue considerazioni..."
                style={{ 
                  height: '100%', 
                  fontSize: '1.2rem', 
                  resize: 'none',
                  lineHeight: '1.6'
                }}
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              ></textarea>
            </div>

            {/* Messaggi di stato */}
            {(error || success) && (
              <div className={`alert ${error ? 'alert-danger' : 'alert-success'} border-0 rounded-3 mb-3`}>
                {error || success}
              </div>
            )}

            {/* Footer con bottoni grandi */}
            <div className="row g-3 mt-auto">
              <div className="col-4">
                <button 
                  type="button" 
                  className="btn btn-light w-100 py-3 fw-bold border rounded-3" 
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Annulla
                </button>
              </div>
              <div className="col-8">
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-3 fw-bold shadow-lg rounded-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <><i className="bi bi-send-fill me-2"></i>Conferma e Salva</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .animate-slide-up-high {
          animation: slide-up-high 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slide-up-high {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        textarea::placeholder { color: #adb5bd; font-style: italic; }
      `}</style>
    </div>
  );
};

export default DailyNoteComponent;