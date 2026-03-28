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

## Route Projects

### `POST /api/projects-manager/projects`

Crea un nuovo record nella tabella `projects`.

Headers:
- `Authorization: Bearer <jwt>`

Body JSON richiesto:
- `name` (string)
- `content_json` (object/json)
- `building_site_id` (integer)
- `date` (string, formato `YYYY-MM-DD`)

Body JSON opzionale:
- `metadata` (object/json)

Risposte principali:
- `201 Created` con il progetto creato
- `400 Bad Request` se mancano campi obbligatori o formato non valido
- `401/403` se token assente/non valido
