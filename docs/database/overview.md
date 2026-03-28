## Database Overview

Questa sezione descrive lo stato attuale del database PostgreSQL usato dall'applicazione.

- Schema tecnico completo: `docs/database/db_schema.sql`
- Schema descritto in modo leggibile: `docs/database/db_schema.md`
- Seed dati di esempio: `docs/database/db_seed.sql`

Note importanti:

- Lo schema e allineato al dump recente (`backup.sql`, pg_dump 17.7).
- La gestione documentale usa le tabelle `files` (metadati file) e `documents` (contenuto JSON del documento).
- E presente anche la tabella `projects`, collegata ai file tramite `files.project_id`.
- Ogni record di `projects` e riferito a un cantiere e a una data (`building_site_id`, `date`).
- `daily_notes` ha vincolo unico su `(building_site_id, date)`.
- `users` richiede `last_name NOT NULL`.
