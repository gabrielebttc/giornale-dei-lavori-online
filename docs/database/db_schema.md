# Documentazione Struttura Database

Schema aggiornato in base al dump PostgreSQL (`backup.sql`, pg_dump 17.7).

## Tabelle Principali

### `users` (Utenti)

Gestisce le anagrafiche utenti e la multi-tenancy tramite `owner_id`.

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, DEFAULT nextval(...) |
| **first_name** | varchar(100) | NOT NULL |
| **last_name** | varchar(100) | NOT NULL |
| **username** | varchar(50) | - |
| **email** | varchar(100) | - |
| **password** | varchar(255) | - |
| **phone** | varchar(15) | - |
| **notes** | text | - |
| **owner_id** | integer | FK -> users.id, NOT NULL, ON DELETE CASCADE |

### `building_sites` (Cantieri)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, DEFAULT nextval(...) |
| **name** | varchar(100) | NOT NULL |
| **notes** | text | - |
| **city** | varchar(100) | - |
| **address** | varchar(255) | - |
| **latitude** | numeric(9,6) | - |
| **longitude** | numeric(9,6) | - |
| **owner_id** | integer | FK -> users.id, NOT NULL, ON DELETE CASCADE |
| **start_date** | date | NOT NULL |
| **end_date** | date | - |

### `companies` (Aziende)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, DEFAULT nextval(...) |
| **name** | varchar(100) | NOT NULL |
| **notes** | text | - |
| **owner_id** | integer | FK -> users.id, NOT NULL, ON DELETE CASCADE |

### `teams` (Squadre)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, DEFAULT nextval(...) |
| **name** | varchar(100) | NOT NULL |

## Gestione Operativa

### `daily_notes` (Rapportini giornalieri)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, DEFAULT nextval(...) |
| **date** | date | NOT NULL |
| **building_site_id** | integer | FK -> building_sites.id, NOT NULL, ON DELETE CASCADE |
| **notes** | text | - |
| **other_notes** | text | - |
| **personal_notes** | text | - |
| **owner_id** | integer | FK -> users.id, NOT NULL, ON DELETE CASCADE |

Vincolo unico: `UNIQUE (building_site_id, date)`.

### `daily_presences` (Presenze)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, DEFAULT nextval(...) |
| **building_site_id** | integer | FK -> building_sites.id, NOT NULL, ON DELETE CASCADE |
| **user_id** | integer | FK -> users.id, NOT NULL, ON DELETE CASCADE |
| **date** | date | NOT NULL |
| **is_present** | varchar(20) | CHECK (present, absent, not_required), NOT NULL |
| **notes** | text | - |
| **owner_id** | integer | FK -> users.id, NOT NULL, ON DELETE CASCADE |

### `files` (Metadati file)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, DEFAULT nextval(...) |
| **name** | varchar(255) | NOT NULL |
| **tag** | varchar(36) | - |
| **file_type** | varchar(36) | NOT NULL |
| **date** | date | NOT NULL |
| **building_site_id** | integer | FK -> building_sites.id, NOT NULL |
| **owner_id** | integer | FK -> users.id, NOT NULL |
| **uploaded_at** | timestamp | DEFAULT CURRENT_TIMESTAMP |
| **storage_key** | text | NOT NULL, UNIQUE |
| **is_generated** | boolean | NOT NULL, DEFAULT false |
| **project_id** | integer | FK -> projects.id, ON DELETE SET NULL |

### `projects` (Progetti documentali)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, DEFAULT nextval(...) |
| **name** | varchar(255) | NOT NULL |
| **content_json** | jsonb | NOT NULL |
| **metadata** | jsonb | - |
| **created_at** | timestamptz | DEFAULT CURRENT_TIMESTAMP |
| **updated_at** | timestamptz | DEFAULT CURRENT_TIMESTAMP |
| **owner_id** | integer | FK -> users.id, ON DELETE SET NULL |
| **building_site_id** | integer | NOT NULL, FK -> building_sites.id |
| **date** | date | NOT NULL |

### `documents` (Contenuti documenti)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, DEFAULT nextval(...) |
| **file_id** | integer | FK -> files.id, NOT NULL, ON DELETE CASCADE |
| **content_json** | jsonb | - |

## Tabelle di Relazione e Tipologie

### `user_type` (Ruoli/Tipi utente)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, DEFAULT nextval(...) |
| **name** | varchar(50) | NOT NULL |
| **owner_id** | integer | FK -> users.id, ON DELETE CASCADE |

### Relazioni molti-a-molti (join table)

Tutte le seguenti tabelle hanno `id` (PK), `DEFAULT nextval(...)` e FK verso le tabelle di riferimento.

| Tabella | Relazione | Vincoli extra |
| --- | --- | --- |
| **users_building_sites** | `user_id` <-> `site_id` | `UNIQUE (user_id, site_id)` |
| **users_companies** | `user_id` <-> `company_id` | - |
| **users_teams** | `user_id` <-> `team_id` | - |
| **users_user_type** | `user_id` <-> `user_type_id` | - |

