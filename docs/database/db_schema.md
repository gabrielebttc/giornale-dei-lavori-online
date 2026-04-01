# Database Schema

## Tabelle principali

### `users`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| first_name | varchar(100) | NOT NULL |
| last_name | varchar(100) | NOT NULL |
| username | varchar(50) | |
| email | varchar(100) | |
| password | varchar(255) | Hash bcrypt |
| phone | varchar(15) | |
| notes | text | |
| owner_id | integer | NOT NULL, FK → users(id) ON DELETE CASCADE |
| refresh_token | text | JWT refresh token corrente |

### `building_sites`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| name | varchar(100) | NOT NULL |
| notes | text | |
| city | varchar(100) | |
| address | varchar(255) | |
| latitude | numeric(9,6) | |
| longitude | numeric(9,6) | |
| owner_id | integer | NOT NULL, FK → users(id) ON DELETE CASCADE |
| start_date | date | NOT NULL |
| end_date | date | |

### `companies`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| name | varchar(100) | NOT NULL |
| notes | text | |
| owner_id | integer | NOT NULL, FK → users(id) ON DELETE CASCADE |

### `user_type`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| name | varchar(50) | NOT NULL |
| owner_id | integer | FK → users(id) ON DELETE CASCADE |

ID riservati: `1` = admin, `2` = ispettore di cantiere (hardcoded in `authRoutes.js`).

### `daily_notes`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| date | date | NOT NULL |
| building_site_id | integer | NOT NULL, FK → building_sites(id) ON DELETE CASCADE |
| notes | text | Annotazioni speciali / avanzamento lavori |
| other_notes | text | Osservazioni DL |
| personal_notes | text | Note personali / private |
| owner_id | integer | NOT NULL, FK → users(id) ON DELETE CASCADE |

Vincolo UNIQUE su `(building_site_id, date)`.

### `daily_presences`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| building_site_id | integer | NOT NULL, FK → building_sites(id) ON DELETE CASCADE |
| user_id | integer | NOT NULL, FK → users(id) ON DELETE CASCADE |
| date | date | NOT NULL |
| is_present | varchar(20) | NOT NULL, CHECK: `present` \| `absent` \| `not_required` |
| notes | text | |
| owner_id | integer | NOT NULL, FK → users(id) ON DELETE CASCADE |

### `files`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| name | varchar(255) | NOT NULL |
| tag | varchar(36) | |
| file_type | varchar(36) | NOT NULL |
| date | date | NOT NULL |
| building_site_id | integer | NOT NULL, FK → building_sites(id) |
| owner_id | integer | NOT NULL, FK → users(id) |
| uploaded_at | timestamp | DEFAULT CURRENT_TIMESTAMP |
| storage_key | text | NOT NULL, UNIQUE — chiave Backblaze B2 |
| is_generated | boolean | NOT NULL, DEFAULT false |
| project_id | integer | FK → projects(id) ON DELETE SET NULL |

### `projects`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| name | varchar(255) | NOT NULL |
| content_json | jsonb | NOT NULL — contenuto TipTap |
| metadata | jsonb | |
| created_at | timestamptz | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamptz | DEFAULT CURRENT_TIMESTAMP |
| owner_id | integer | FK → users(id) ON DELETE SET NULL |
| building_site_id | integer | NOT NULL, FK → building_sites(id) |
| date | date | NOT NULL |

### `templates`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| name | varchar(40) | NOT NULL |
| content_json | jsonb | Contenuto TipTap |
| created_at | timestamptz | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamptz | DEFAULT CURRENT_TIMESTAMP |
| owner_id | integer | FK → users(id) ON DELETE CASCADE |

### `documents`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| file_id | integer | NOT NULL, FK → files(id) ON DELETE CASCADE |
| content_json | jsonb | |

### `teams`
| Colonna | Tipo | Note |
|---|---|---|
| id | integer | PK, auto-increment |
| name | varchar(100) | NOT NULL |

---

## Tabelle di join

| Tabella | Colonne | Vincoli |
|---|---|---|
| `users_building_sites` | user_id → users, site_id → building_sites | UNIQUE(user_id, site_id), CASCADE |
| `users_companies` | user_id → users, company_id → companies | CASCADE |
| `users_user_type` | user_id → users, user_type_id → user_type | CASCADE |
| `users_teams` | user_id → users, team_id → teams | CASCADE |

---

## Note architetturali

- **Multi-tenancy**: ogni tabella ha `owner_id` che punta all'utente admin proprietario dei dati. Tutte le query devono filtrare per `owner_id` derivato dal JWT.
- **Seed obbligatorio**: i record `user_type(1, 'admin')` e `user_type(2, 'ispettore di cantiere')` devono esistere prima di poter registrare utenti.
- **Eliminazione a cascata**: la cancellazione di un utente elimina a cascata tutti i suoi dati (cantieri, presenze, note, file, ecc.).
- **projects vs files**: i documenti TipTap vivono in `projects`. La tabella `files` tiene traccia dei file caricati su Backblaze B2, con `project_id` opzionale per collegare un file a un progetto.
