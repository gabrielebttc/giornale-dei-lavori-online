# WebApp Ispezioni Cantieri

## Scopo
Applicazione Web per **ispettori di cantieri** per velocizzare e **automatizzare** creazione e **aggiornamento** del **Giornale dei Lavori**.<br>
Consente inoltre di **generare un giornare dei lavori in formato xls**.

## Stack tecnologico
- **Backend**: *Node.js*, con Package Manager *npm*
- **Frontend**: *React + Typescript*, buildato con *Vite*
- **Database**: *PostgreSQL*

## Tipologie di utenti
- ***Admin*** → Ispettore di cantienre
    - Può creare e gestire cantieri
    - Aggiungere diversi tipi di note per ogni cantiere (diversi anche per giorno)
    - Può creare e gestire lavorari nel cantiere
        - Gli stessi lavoratori creati possono essere aggiunti in uno o piu cantineri diversi
        - I lavoratori possono far parte di un'azienda, avere diversi ruoli e informazioni personali

## Documentazione
- [Architettura](architecture/overview.md)
- [API](api/overview.md)
- [Database](database/overview.md)
- [Frontend](frontend/overview.md)
- [Manuale Utente](user/manual.md)
