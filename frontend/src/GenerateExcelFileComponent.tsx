import React, { useState } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface Props {
  buildingSiteId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const GenerateExcelFileComponent: React.FC<Props> = ({ buildingSiteId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="modal-backdrop-custom">
      <div className="modal-content-custom">
        <div className="modal-header">
          <h5 className="modal-title">Genera Report Excel</h5>
          <button type="button" className="close" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body text-center">
          {error && <div className="alert alert-danger">{error}</div>}
          {loading && (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {!loading && !downloadUrl && !error && (
            <button className="btn btn-primary" onClick={handleGenerateExcel}>
              Genera File Excel
            </button>
          )}
          {!loading && downloadUrl && (
            <>
              <p className="text-success">File generato con successo!</p>
              <button className="btn btn-success" onClick={handleDownload}>
                Scarica File Excel
              </button>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateExcelFileComponent;