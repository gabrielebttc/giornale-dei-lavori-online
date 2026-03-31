import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface Props {
  buildingSiteId: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface BuildingSite {
  id: number;
  name: string;
  notes: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string | null;
}

const GenerateExcelFileComponent: React.FC<Props> = ({ buildingSiteId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModifyEndDatePopupOpen, setIsModifyEndDatePopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token)
      isEndDateNotSet(token)

  }, []);

  async function isEndDateNotSet(token: string){
    try {
      const response = await axios.get(
        `${apiUrl}/api/building-sites/${buildingSiteId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if(response.data){
        const buildingSite: BuildingSite = response.data;
        if(!buildingSite.end_date){
          setIsModifyEndDatePopupOpen(true);
        }
      }

    } catch (err) {
      console.error('Errore durante la verifica della data di fine del cantiere: ', err);
      setError('Errore durante la verifica della data di fine del cantiere. Riprova.');
      setIsModifyEndDatePopupOpen(true);
    }
  }

  const handleGenerateExcel = async () => {
    setLoading(true);
    setDownloadUrl(null);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token di autenticazione non trovato.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/generate-excel`,
        { buildingSiteId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob', // Importante per gestire la risposta come file binario
        }
      );

      // Crea un URL per il file scaricabile
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);

      onSuccess(); // Notifica il componente genitore
    } catch (err) {
      console.error('Errore nella generazione del file Excel:', err);
      setError('Errore nella generazione del file. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'report_cantiere.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 1080 }}>
      {/* Overlay con sfocatura */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100" 
        style={{ backgroundColor: 'rgba(24, 28, 33, 0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      ></div>

      <div className="bg-white shadow-lg rounded-4 overflow-hidden position-relative" style={{ maxWidth: '400px', width: '100%' }}>
        
        {/* Header con gradiente discreto */}
        <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-dark mb-0">
            <i className="bi bi-file-earmark-excel me-2 text-success"></i>
            Report Excel
          </h5>
          <button type="button" className="btn-close shadow-none" onClick={onClose} disabled={loading}></button>
        </div>

        <div className="p-5 text-center">
          {error && (
            <div className="mb-4">
              <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-exclamation-triangle fs-3"></i>
              </div>
              <div className="alert alert-danger border-0 small">{error}</div>
            </div>
          )}

          {loading && (
            <div className="py-3">
              <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
              <p className="fw-medium text-muted">Elaborazione dati in corso...</p>
              <small className="text-secondary">Potrebbe volerci qualche secondo</small>
            </div>
          )}

          {!loading && isModifyEndDatePopupOpen && (
            <div className="py-3">
              <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
              <p className="fw-medium text-muted">Devi impostare una data di fine cantiere per generare il report, per farlo <a href={`/action-page/modify-building-site/${buildingSiteId}/:date`}>clicca qui</a></p>
              <small className="text-secondary">Se non hai una data in mente, puoi metterne una provvisoria e cambiarla quando vuoi</small>
            </div>
          )}

          {!loading && !downloadUrl && !error && (
            <div>
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-file-earmark-spreadsheet fs-1"></i>
              </div>
              <p className="text-muted mb-4 px-3">Sei pronto a generare il report dettagliato in formato Excel?</p>
              <button className="btn btn-success w-100 py-3 fw-bold shadow-sm rounded-3" disabled={isModifyEndDatePopupOpen} onClick={handleGenerateExcel}>
                <i className="bi bi-gear-fill me-2"></i> Genera Report
              </button>
            </div>
          )}

          {!loading && downloadUrl && (
            <div className="animate-pop">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-check-lg fs-1"></i>
              </div>
              <h5 className="fw-bold text-success">Pronto per il Download!</h5>
              <p className="text-muted mb-4 small">Il file è stato generato e può essere scaricato.</p>
              <button className="btn btn-primary w-100 py-3 fw-bold shadow rounded-3 mb-2" onClick={handleDownload}>
                <i className="bi bi-download me-2"></i> Scarica Excel
              </button>
            </div>
          )}
        </div>

        {/* Footer semplice */}
        <div className="p-3 bg-light text-center border-top">
          <button type="button" className="btn btn-link text-decoration-none text-secondary fw-bold small" onClick={onClose}>
            Chiudi finestra
          </button>
        </div>
      </div>

      <style>{`
        .animate-pop {
          animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GenerateExcelFileComponent;