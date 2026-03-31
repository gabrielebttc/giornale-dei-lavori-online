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

        // Inizializza le presenze. Se ci sono già dati li usa, altrimenti defaulta a 'not_required'.
        // Usa sempre || 'not_required' anche quando il record esiste ma status è null/undefined.
        const initialPresences = workersData.map((worker: Worker) => {
          const existingPresence = presencesData.find(p => p.user_id === worker.user_id);
          return {
            user_id: worker.user_id,
            status: (existingPresence?.status as PresenceStatus) || 'not_required',
            notes: existingPresence?.notes || '',
          };
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
          presences: presences.filter(p => p.status !== 'not_required'),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save presences');
      }

      setSuccessMessage('Presenze salvate con successo!');
      setTimeout(() => setSuccessMessage(null), 500);
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
    <div className="container py-4 bg-light min-vh-100">
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h3 className="fw-bold text-dark mb-0">
      <i className="bi bi-clipboard-check me-2 text-primary"></i>
      Appello <span className="text-primary">{date}</span>
    </h3>
    <button 
      className="btn btn-primary shadow-sm fw-bold px-4 rounded-pill d-none d-md-block" 
      onClick={handleSave} 
      disabled={isSaving}
    >
      {isSaving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-cloud-arrow-up me-2"></i>}
      Salva Presenze
    </button>
  </div>

  <div className="row g-3">
    {workers.map((worker) => {
      const presence = presences.find(p => p.user_id === worker.user_id) || { status: 'not_required', notes: '' };
      
      // Colori dinamici basati sullo stato per feedback immediato
      const getStatusColor = () => {
        if (presence.status === 'present') return 'border-success bg-success bg-opacity-10';
        if (presence.status === 'absent') return 'border-danger bg-danger bg-opacity-10';
        return 'border-light bg-white';
      };

      return (
        <div key={worker.user_id} className="col-12">
          <div className={`card shadow-sm border-2 transition-all ${getStatusColor()} rounded-4 overflow-hidden`}>
            <div className="card-body p-3">
              <div className="row align-items-center">
                {/* Info Lavoratore */}
                <div className="col-md-5 mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center fw-bold me-3 text-primary border" style={{ width: '48px', height: '48px' }}>
                      {worker.first_name[0]}{worker.last_name[0]}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{worker.first_name} {worker.last_name}</h6>
                      <small className="text-muted d-block">{worker.company_names.join(', ')}</small>
                      <span className="badge bg-white text-muted border fw-normal mt-1" style={{ fontSize: '0.7rem' }}>
                        {worker.user_types.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottoni Stato (Pill Style) */}
                <div className="col-md-7 text-md-end">
                  <div className="btn-group bg-white rounded-pill p-1 shadow-sm border" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-2 fw-bold transition-all ${presence.status === 'present' ? 'btn-success text-white shadow' : 'btn-light text-muted border-0'}`}
                      onClick={() => handleStatusChange(worker.user_id, 'present')}
                    >
                      Presente
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-2 fw-bold transition-all ${presence.status === 'absent' ? 'btn-danger text-white shadow' : 'btn-light text-muted border-0'}`}
                      onClick={() => handleStatusChange(worker.user_id, 'absent')}
                    >
                      Assente
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-2 fw-bold transition-all ${presence.status === 'not_required' ? 'btn-secondary text-white shadow' : 'btn-light text-muted border-0'}`}
                      onClick={() => handleStatusChange(worker.user_id, 'not_required')}
                    >
                      N/R
                    </button>
                  </div>
                </div>
              </div>

              {/* Sezione Note Expansible o sempre visibile */}
              <div className="mt-3">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-0 ps-0 text-muted">
                    <i className="bi bi-chat-left-text me-2"></i> Note:
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent shadow-none"
                    placeholder="E es. 'Ritardo', 'Malattia'..."
                    value={presence.notes || ''}
                    onChange={(e) => handleNotesChange(worker.user_id, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>

  {/* Messaggi */}
  <div className="mt-4">
    {error && <div className="alert alert-danger border-0 shadow-sm rounded-3"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
    {successMessage && <div className="alert alert-success border-0 shadow-sm rounded-3"><i className="bi bi-check-lg me-2"></i>{successMessage}</div>}
  </div>

  {/* Bottone Mobile Salva */}
  <div className="d-md-none position-fixed bottom-0 mb-5 start-0 w-100 p-3 bg-white border-top shadow-lg" style={{ zIndex: 1000 }}>
    <button className="btn btn-primary w-100 py-3 fw-bold rounded-4" onClick={handleSave} disabled={isSaving}>
      {isSaving ? 'Salvataggio...' : 'Salva Presenze'}
    </button>
  </div>

  <style>{`
    .transition-all { transition: all 0.3s ease; }
    .card:hover { transform: translateY(-2px); }
    .btn-group .btn { min-width: 80px; }
  `}</style>
</div>
  );
};

export default SetDailyPresencesComponent;