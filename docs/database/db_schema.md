# Documentazione Struttura Database

## Tabelle Principali

### `users` (Utenti)

Gestisce le anagrafiche degli utenti e dei proprietari del sistema.
| Attributo | Tipo | Vincoli |
| :--- | :--- | :--- |
| **id** | integer | PRIMARY KEY, AUTO_INCREMENT |
| **first_name** | varchar(100) | NOT NULL |
| **last_name** | varchar(100) | NOT NULL |
| **username** | varchar(50) | - |
| **email** | varchar(100) | - |
| **password** | varchar(255) | - |
| **phone** | varchar(15) | - |
| **notes** | text | - |
| **owner_id** | integer | FK (users.id), NOT NULL |

### `building_sites` (Cantieri)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, AUTO_INCREMENT |
| **name** | varchar(100) | NOT NULL |
| **notes** | text | - |
| **city** | varchar(100) | - |
| **address** | varchar(255) | - |
| **latitude** | numeric(9,6) | - |
| **longitude** | numeric(9,6) | - |
| **owner_id** | integer | FK (users.id), NOT NULL |
| **start_date** | date | NOT NULL |
| **end_date** | date | - |

---

### `companies` (Aziende)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, AUTO_INCREMENT |
| **name** | varchar(100) | NOT NULL |
| **notes** | text | - |
| **owner_id** | integer | FK (users.id), NOT NULL |

### `teams` (Squadre)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, AUTO_INCREMENT |
| **name** | varchar(100) | NOT NULL |

---

## Gestione Operativa

### `daily_notes` (Rapportini Giornalieri)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, AUTO_INCREMENT |
| **date** | date | NOT NULL, UNIQUE (con building_site_id) |
| **building_site_id** | integer | FK (building_sites.id), NOT NULL |
| **notes** | text | - |
| **other_notes** | text | - |
| **personal_notes** | text | - |
| **owner_id** | integer | FK (users.id), NOT NULL |

### `daily_presences` (Presenze)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY, AUTO_INCREMENT |
| **building_site_id** | integer | FK (building_sites.id), NOT NULL |
| **user_id** | integer | FK (users.id), NOT NULL |
| **date** | date | NOT NULL |
| **is_present** | varchar(20) | CHECK (present, absent, not_required) |
| **notes** | text | - |
| **owner_id** | integer | FK (users.id), NOT NULL |

---

## Tabelle di Relazione e Tipologie

### `user_type` (Ruoli/Tipi Utente)

| Attributo | Tipo | Vincoli |
| --- | --- | --- |
| **id** | integer | PRIMARY KEY |
| **name** | varchar(50) | NOT NULL |
| **owner_id** | integer | FK (users.id) |

### Relazioni Molti-a-Molti (Join Tables)

Tutte le seguenti tabelle hanno un **id** (PK) e chiavi esterne (**FK**) verso le tabelle di riferimento.

| Tabella | Relazione | Vincoli Extra |
| --- | --- | --- |
| **users_building_sites** | `user_id` ↔ `site_id` | UNIQUE(user_id, site_id) |
| **users_companies** | `user_id` ↔ `company_id` | - |
| **users_teams** | `user_id` ↔ `team_id` | - |
| **users_user_type** | `user_id` ↔ `user_type_id` | - |

