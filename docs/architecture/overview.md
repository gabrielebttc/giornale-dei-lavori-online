# Architettura del sistema

## Panoramica
Il sistema è composto da frontend *React + Typescript* con *Vite*, backend *Node.js* e database *PostgreSQL*.

## Flusso principale
1. L’utente accede tramite frontend
2. Il frontend chiama le API REST
3. Il backend valida e accede al DB

## Autenticazione
### JWT Bearer Token
- **access token**
    - Lato Client -> Salvato in local storage browser utente
- **refresh token** 
    - Lato Client -> Salvato in browser utente e inviato tramite HttpOnly
    - Lato Server -> Salvato nel Database 

## Comunicazione
- REST
- JSON
