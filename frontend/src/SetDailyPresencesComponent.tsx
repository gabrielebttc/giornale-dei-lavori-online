import React, { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface Worker {
  user_id: number;
  first_name: string;
  last_name: string;
  company_names: string[];
  user_types: string[]; // Aggiunto user_types
}

type PresenceStatus = 'present' | 'absent' | 'not_required';

interface DailyPresence {
  user_id: number;
  status: PresenceStatus;
  notes?: string;
}

interface Props {
  buildingSiteId: number;
  date: string;
}

const SetDailyPresencesComponent: React.FC<Props> = ({ buildingSiteId, date }) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [presences, setPresences] = useState<DailyPresence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkersAndPresences = async () => {
      setLoading(true);
      setError(null);
      try {
        const workersResponse = await fetch(`${apiUrl}/api/get-all-workers?buildingSiteId=${buildingSiteId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!workersResponse.ok) throw new Error('Failed to fetch workers');
        const workersData = await workersResponse.json();
        setWorkers(workersData);

        // Fetch delle presenze esistenti per la data
        const presencesResponse = await fetch(`${apiUrl}/api/daily-presences?buildingSiteId=${buildingSiteId}&date=${date}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!presencesResponse.ok) throw new Error('Failed to fetch presences');
        const presencesData: DailyPresence[] = await presencesResponse.json();

        // Inizializza le presenze. Se ci sono già dati, li usa, altrimenti li imposta su 'not_required'
        const initialPresences = workersData.map((worker: Worker) => {
          const existingPresence = presencesData.find(p => p.user_id === worker.user_id);
          return existingPresence || { user_id: worker.user_id, status: 'not_required', notes: '' };
        });
        setPresences(initialPresences);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Impossibile caricare i dati. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkersAndPresences();
  }, [buildingSiteId, date]);

  const handleStatusChange = (userId: number, status: PresenceStatus) => {
    setPresences(prevPresences =>
      prevPresences.map(p =>
        p.user_id === userId ? { ...p, status } : p
      )
    );
  };

  const handleNotesChange = (userId: number, notes: string) => {
    setPresences(prevPresences =>
      prevPresences.map(p =>
        p.user_id === userId ? { ...p, notes } : p
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${apiUrl}/api/daily-presences/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          buildingSiteId,
          date,
          presences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save presences');
      }

      setSuccessMessage('Presenze salvate con successo!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving presences:', err);
      setError("Errore durante il salvataggio delle presenze.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Caricamento presenze...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Appello Giornaliero - {date}</h3>
      <div className="list-group">
        {workers.map((worker) => {
          const presence = presences.find(p => p.user_id === worker.user_id) || { status: 'not_required', notes: '' };
          return (
            <div key={worker.user_id} className="list-group-item d-flex flex-column mb-3 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{worker.first_name} {worker.last_name}</h5>
                  <small className="text-muted">Azienda: {worker.company_names.join(', ')}</small>
                  <br />
                  <small className="text-muted">Mansione: {worker.user_types.join(', ')}</small>
                </div>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${presence.status === 'present' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => handleStatusChange(worker.user_id, 'present')}
                  >
                    Presente
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${presence.status === 'absent' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => handleStatusChange(worker.user_id, 'absent')}
                  >
                    Assente
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${presence.status === 'not_required' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => handleStatusChange(worker.user_id, 'not_required')}
                  >
                    N/R
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <textarea
                  className="form-control"
                  placeholder="Aggiungi una nota (es. 'arrivato tardi', 'in malattia')"
                  value={presence.notes || ''}
                  onChange={(e) => handleNotesChange(worker.user_id, e.target.value)}
                />
              </div>
            </div>
          );
        })}
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      <div className="text-end mt-4">
        <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Salvataggio...' : 'Salva Presenze'}
        </button>
      </div>
    </div>
  );
};

export default SetDailyPresencesComponent;