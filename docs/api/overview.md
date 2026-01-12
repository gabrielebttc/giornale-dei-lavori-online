# API Overview

## API URL
### Standard Api URL
/api
### Authentication Api URL
/api/auth

## Autenticazione
Tutte le API richiedono JWT, tranne alcune tra quelle di auth

## Formato dati
JSON

## Convenzioni
- 200 OK
- 401 Unauthorized → *L'utente non è loggato e deve fare il login per accedere a questa risorsa*
- 403 Forbidden → *Questo tipo di utente non è autorizzato ad accedere a queste risorse*
- 500 Internal Server Error
