import React, { useState, useEffect, useRef } from 'react';

// Se nel file 'google-apis.d.ts' non sono state esportate, le definiamo qui localmente:
// Se invece le hai esportate, puoi importarle: 
// import { TokenClientConfig, TokenClient } from '@/types/google-apis';

// Definizione delle interfacce locali (necessarie per TypeScript)
// NOTA: Se queste interfacce sono in 'google-apis.d.ts' con 'export', 
// puoi Rimuoverle e importarle (vedi commento sopra).
/*interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback: (resp: any) => void;
}*/

interface TokenClient {
  requestAccessToken: (params: { prompt: string }) => void;
  callback: (resp: any) => void;
}

// Assumiamo che i tipi globali (gapi, google) siano ora definiti in src/types/google-apis.d.ts
// e non causino più errori di duplicazione.

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string; // Assert string type
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

const GoogleDriveAuth: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [content, setContent] = useState('Inizializzazione...');
  
  // Usiamo useRef per mantenere l'istanza del client token GIS tra i render
  const tokenClient = useRef<TokenClient | null>(null);

  /**
   * 1. Carica le librerie GAPI e GIS.
   * 2. Inizializza GAPI client e GIS token client.
   */
  useEffect(() => {
    // Funzione per caricare script esterni
    const loadScript = (src: string, onLoad: () => void) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = onLoad;
      document.body.appendChild(script);
    };

    let gapiInited = false;
    let gisInited = false;

    // Inizializza GAPI
    const initializeGapiClient = async () => {
      // TypeScript ora riconosce gapi.client.init grazie al file .d.ts
      await gapi.client.init({
        discoveryDocs: [DISCOVERY_DOC],
      });
      gapiInited = true;
      if (gisInited) maybeEnable();
    };
    const gapiLoaded = () => gapi.load('client', initializeGapiClient);

    // Inizializza GIS
    const initializeGisClient = () => {
      // TypeScript ora riconosce google.accounts.oauth2 grazie al file .d.ts
      tokenClient.current = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: () => {}, // Definito in handleAuthClick
      });
      gisInited = true;
      if (gapiInited) maybeEnable();
    };
    
    // Abilita i pulsanti solo quando entrambe le librerie sono caricate
    const maybeEnable = () => {
      setContent('Pronto per l\'autorizzazione.');
    };

    // Avvia il caricamento delle librerie
    loadScript('https://apis.google.com/js/api.js', gapiLoaded);
    loadScript('https://accounts.google.com/gsi/client', initializeGisClient);

  }, []); // Esegue solo al montaggio del componente

  /**
   * Stampa i metadati dei primi 10 file.
   */
  const listFiles = async () => {
    let response;
    try {
      response = await gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': 'files(id, name)',
      });
    } catch (err: any) {
      setContent(`Errore: ${err.message}`);
      return;
    }
    const files = response.result.files;
    if (!files || files.length === 0) {
      setContent('Nessun file trovato.');
      return;
    }
    const output = files.reduce(
        (str: string, file: { name: string, id: string }) => `${str}${file.name} (${file.id})\n`,
        'Files:\n'
    );
    setContent(output);
  };

  /**
   * Autentica l'utente e ottiene l'AccessToken.
   */
  const handleAuthClick = () => {
    if (!tokenClient.current) return;

    tokenClient.current.callback = async (resp) => {
      if (resp.error) {
        setContent(`Errore di autorizzazione: ${resp.error}`);
        return;
      }
      setIsSignedIn(true);
      // Aggiorna lo stato, poi chiama listFiles
      await listFiles(); 
    };

    if (gapi.client.getToken() === null) {
      // Nuova sessione: richiede il consenso
      tokenClient.current.requestAccessToken({ prompt: 'consent' });
    } else {
      // Sessione esistente: rinnova il token
      tokenClient.current.requestAccessToken({ prompt: '' });
    }
  };

  /**
   * Disconnette l'utente e revoca il token.
   */
  const handleSignoutClick = () => {
    const token = gapi.client.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      setIsSignedIn(false);
      setContent('Disconnesso. Pronto per l\'autorizzazione.');
    }
  };

  return (
    <div>
      <h3>Google Drive API - Quickstart React</h3>

      <button
        id="authorize_button"
        onClick={handleAuthClick}
        disabled={content.includes('Inizializzazione')} 
      >
        {isSignedIn ? 'Aggiorna File' : 'Autorizza'}
      </button>

      <button
        id="signout_button"
        onClick={handleSignoutClick}
        style={{ marginLeft: '10px' }}
        disabled={!isSignedIn}
      >
        Disconnetti
      </button>

      <pre id="content" style={{ whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {content}
      </pre>
    </div>
  );
};

export default GoogleDriveAuth;