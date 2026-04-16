import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiFetch } from '../utils/apiFetch';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface Props {
  buildingSiteId: number;
  date: string;
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

type Phase = 'idle' | 'loading' | 'ready' | 'saving' | 'saved' | 'error';

const GenerateExcelFileComponent: React.FC<Props> = ({ buildingSiteId, date, onClose, onSuccess }) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [excelBlob, setExcelBlob] = useState<Blob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEndDateMissing, setIsEndDateMissing] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) checkEndDate(token);
  }, []);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  async function checkEndDate(token: string) {
    try {
      const response = await axios.get(
        `${apiUrl}/api/building-sites/${buildingSiteId}`,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (response.data) {
        const site: BuildingSite = response.data;
        if (!site.end_date) setIsEndDateMissing(true);
      }
    } catch {
      setIsEndDateMissing(true);
    }
  }

  const handleGenerateExcel = async () => {
    setPhase('loading');
    setErrorMsg(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('Token di autenticazione non trovato.');
      setPhase('error');
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/generate-excel`,
        { buildingSiteId },
        {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setExcelBlob(blob);
      setDownloadUrl(url);
      setPhase('ready');
      onSuccess();
    } catch {
      setErrorMsg('Errore nella generazione del file. Riprova.');
      setPhase('error');
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'report_cantiere.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resolveUniqueFileName = async (baseName: string): Promise<string> => {
    const res = await apiFetch(`${apiUrl}/api/file-manager/files/${buildingSiteId}`, {});
    if (!res.ok) return baseName;

    const files: Array<{ name: string }> = await res.json();
    const existingNames = new Set(files.map(f => f.name));

    if (!existingNames.has(baseName)) return baseName;

    const lastDot = baseName.lastIndexOf('.');
    const ext  = lastDot !== -1 ? baseName.slice(lastDot) : '';
    const stem = lastDot !== -1 ? baseName.slice(0, lastDot) : baseName;

    let counter = 2;
    let candidate = `${stem} (${counter})${ext}`;
    while (existingNames.has(candidate)) {
      counter++;
      candidate = `${stem} (${counter})${ext}`;
    }
    return candidate;
  };

  const handleSaveToPlatform = async () => {
    if (!excelBlob) return;
    setPhase('saving');

    const fileName = await resolveUniqueFileName('report_cantiere.xlsx');
    const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    try {
      // 1. Richiedi link di upload
      const resLink = await apiFetch(`${apiUrl}/api/file-manager/get-upload-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileType: mimeType, buildingSiteId }),
      });
      if (!resLink.ok) throw new Error('Errore nel link di upload');
      const { uploadUrl, storageKey } = await resLink.json();

      // 2. Upload su Backblaze B2
      const resB2 = await fetch(uploadUrl, { method: 'PUT', body: excelBlob });
      if (!resB2.ok) throw new Error('Upload su storage fallito');

      // 3. Registra il file nel DB
      const resConfirm = await apiFetch(`${apiUrl}/api/file-manager/confirm-file-upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storageKey,
          originalName: fileName,
          buildingSiteId,
          mimeType,
          date,
        }),
      });
      if (!resConfirm.ok) throw new Error('Registrazione file fallita');

      setPhase('saved');
    } catch {
      setErrorMsg('Errore durante il salvataggio sulla piattaforma.');
      setPhase('error');
    }
  };

  return (
    <div className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 1080 }}>
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(24, 28, 33, 0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      <div className="bg-white shadow-lg rounded-4 overflow-hidden position-relative" style={{ maxWidth: '400px', width: '100%' }}>

        {/* Header */}
        <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-dark mb-0">
            <i className="bi bi-file-earmark-excel me-2 text-success" />
            Report Excel
          </h5>
          <button type="button" className="btn-close shadow-none" onClick={onClose} disabled={phase === 'loading' || phase === 'saving'} />
        </div>

        <div className="p-5 text-center">

          {/* Errore */}
          {phase === 'error' && (
            <div className="mb-4">
              <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-exclamation-triangle fs-3" />
              </div>
              <div className="alert alert-danger border-0 small">{errorMsg}</div>
              <button className="btn btn-outline-secondary btn-sm rounded-3 px-4" onClick={() => setPhase('idle')}>
                Riprova
              </button>
            </div>
          )}

          {/* Loading */}
          {phase === 'loading' && (
            <div className="py-3">
              <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }} />
              <p className="fw-medium text-muted">Elaborazione dati in corso...</p>
              <small className="text-secondary">Potrebbe volerci qualche secondo</small>
            </div>
          )}

          {/* Saving */}
          {phase === 'saving' && (
            <div className="py-3">
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }} />
              <p className="fw-medium text-muted">Salvataggio in corso...</p>
            </div>
          )}

          {/* Data di fine mancante */}
          {phase === 'idle' && isEndDateMissing && (
            <div className="py-3">
              <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-calendar-x fs-3" />
              </div>
              <p className="fw-medium text-muted">
                Devi impostare una data di fine cantiere per generare il report.{' '}
                <a href={`/action-page/modify-building-site/${buildingSiteId}/:date`}>Clicca qui</a> per impostarla.
              </p>
              <small className="text-secondary">Puoi usare una data provvisoria e cambiarla in seguito.</small>
            </div>
          )}

          {/* Idle — pronto a generare */}
          {phase === 'idle' && !isEndDateMissing && (
            <div>
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-file-earmark-spreadsheet fs-1" />
              </div>
              <p className="text-muted mb-4 px-3">Sei pronto a generare il report dettagliato in formato Excel?</p>
              <button className="btn btn-success w-100 py-3 fw-bold shadow-sm rounded-3" onClick={handleGenerateExcel}>
                <i className="bi bi-gear-fill me-2" />Genera Report
              </button>
            </div>
          )}

          {/* Pronto — mostra i tasti azione */}
          {phase === 'ready' && (
            <div className="animate-pop">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-check-lg fs-1" />
              </div>
              <h5 className="fw-bold text-success">Report Generato!</h5>
              <p className="text-muted mb-4 small">Il file è pronto. Puoi scaricarlo o salvarlo sulla piattaforma.</p>
              <div className="d-flex flex-column gap-2">
                <button className="btn btn-outline-success w-100 py-2 fw-bold rounded-3" onClick={handleDownload}>
                  <i className="bi bi-download me-2" />Scarica Excel
                </button>
                <button className="btn btn-primary w-100 py-2 fw-bold rounded-3" onClick={handleSaveToPlatform}>
                  <i className="bi bi-cloud-arrow-up me-2" />Salva sulla piattaforma
                </button>
              </div>
            </div>
          )}

          {/* Salvato con successo */}
          {phase === 'saved' && (
            <div className="animate-pop">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-cloud-check fs-1" />
              </div>
              <h5 className="fw-bold text-primary">Salvato sulla piattaforma!</h5>
              <p className="text-muted mb-4 small">
                Il file <strong>report_cantiere.xlsx</strong> è ora disponibile nella sezione documenti del cantiere.
              </p>
              <button className="btn btn-outline-secondary w-100 py-2 fw-bold rounded-3" onClick={handleDownload}>
                <i className="bi bi-download me-2" />Scarica anche in locale
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
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
