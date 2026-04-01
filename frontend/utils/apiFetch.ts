/// <reference types="vite/client" />
const apiUrl = import.meta.env.VITE_BACKEND_URL;

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${apiUrl}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // invia il cookie HttpOnly automaticamente
  });
  if (!res.ok) return null;
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data.token;
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('token');

  const authInit: RequestInit = {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  let response = await fetch(input, authInit);

  // Se l'access token è scaduto, prova a fare il refresh una volta sola
  if (response.status === 401 || response.status === 403) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      // Refresh fallito (refresh token scaduto o non valido) → logout forzato
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return response;
    }

    // Riprova la richiesta originale con il nuovo token
    const retryInit: RequestInit = {
      ...init,
      credentials: 'include',
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${newToken}`,
      },
    };
    response = await fetch(input, retryInit);
  }

  return response;
}
