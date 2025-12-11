// Dichiarazioni dei tipi per GAPI (Google API)
declare namespace gapi {
  function load(libraries: string, callback: () => void): void;
  namespace client {
    const drive: any; 
    function init(config: object): Promise<void>;
    function getToken(): { access_token: string } | null;
    function setToken(token: string): void;
  }
}

// Dichiarazioni dei tipi per GIS (Google Identity Services)
declare namespace google.accounts.oauth2 {
  interface TokenClientConfig {
    client_id: string;
    scope: string;
    callback: (resp: any) => void;
  }
  
  interface TokenClient {
    requestAccessToken: (params: { prompt: string }) => void;
    callback: (resp: any) => void;
  }
  
  function initTokenClient(config: TokenClientConfig): TokenClient;
  function revoke(token: string): void;
}

// Dichiarazioni delle variabili globali
declare const gapi: typeof gapi;
declare const google: {
    accounts: {
        oauth2: typeof google.accounts.oauth2;
    };
    // Aggiungere altre proprietà se necessario (es. google.maps)
};

// Interfacce spostate fuori dal blocco global
interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback: (resp: any) => void;
}

interface TokenClient {
  requestAccessToken: (params: { prompt: string }) => void;
  callback: (resp: any) => void;
}

// Se usi direttamente le interfacce nel tuo componente (come stai facendo):
// Rimuovi le interfacce dal file .d.ts e lasciale nel componente, 
// oppure usa `export` nel file .d.ts e importale nel componente.