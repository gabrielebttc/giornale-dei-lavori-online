import { useState, useEffect } from 'react';
import { getInstallPrompt, clearInstallPrompt, onInstallPromptReady } from '../pwaInstall';

const InstallPage = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);
    setCanInstall(!!getInstallPrompt());

    // Aggiorna il pulsante se l'evento arriva dopo il mount del componente
    const unsubscribe = onInstallPromptReady(() => setCanInstall(true));
    return unsubscribe;
  }, []);

  const handleInstall = async () => {
    const prompt = getInstallPrompt();
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      clearInstallPrompt();
      setCanInstall(false);
      setIsInstalled(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="container mt-5 text-center">
        <i className="bi bi-check-circle-fill text-success fs-1"></i>
        <h4 className="mt-3">App già installata!</h4>
        <p className="text-muted">Puoi aprirla direttamente dalla schermata Home.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Installa l'app</h2>
      <p className="text-muted">
        Installa <strong>Giornale dei Lavori</strong> sul tuo dispositivo per usarla senza browser,
        anche offline, e senza la barra degli indirizzi.
      </p>

      {canInstall && (
        <button className="btn btn-primary mt-3" onClick={handleInstall}>
          <i className="bi bi-download me-2"></i>Installa ora
        </button>
      )}

      {isIOS && (
        <div className="alert alert-info mt-4">
          <h6 className="alert-heading">Su iPhone / iPad:</h6>
          <ol className="mb-0">
            <li>Tocca il pulsante <strong>Condividi</strong> <i className="bi bi-box-arrow-up"></i> in basso</li>
            <li>Scorri e tocca <strong>"Aggiungi alla schermata Home"</strong></li>
            <li>Tocca <strong>Aggiungi</strong> in alto a destra</li>
          </ol>
        </div>
      )}

      {!canInstall && !isIOS && (
        <div className="alert alert-warning mt-4">
          Il tuo browser non supporta l'installazione automatica.<br />
          Prova con Chrome su Android o Edge su Windows.
        </div>
      )}
    </div>
  );
};

export default InstallPage;
