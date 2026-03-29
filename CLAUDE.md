# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Giornale dei Lavori** — a multi-tenant SaaS web app for Italian construction site inspectors to manage work logs ("Giornale dei Lavori"), track daily worker attendance, add notes, and generate XLS reports. Production: `https://giornaledeilavori.gabrielebuttice.com`.

## Commands

### Frontend (`/frontend`)
```bash
npm run dev      # Dev server (Vite, port 5173, HTTPS via basic-ssl plugin)
npm run build    # TypeScript compile + Vite bundle
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Backend (`/backend`)
```bash
npm run dev    # nodemon dev server (port 3001)
npm run start  # Production server
```

### Full Stack (Docker)
```bash
docker-compose up   # Starts PostgreSQL (port 5434), backend (3001), frontend build
```

### Initial Setup
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Database schema: `docs/database/db_schema.sql`. Required seed records (must exist in DB):
```sql
INSERT INTO user_type(id, name) VALUES (1, 'admin');
INSERT INTO user_type(id, name) VALUES (2, 'ispettore di cantiere');
INSERT INTO users(id, first_name, last_name, owner_id) VALUES (1, 'admin', 'admin', 1);
```

## Architecture

### Stack
- **Frontend:** React 19 + TypeScript, Vite, React Router, Axios, Bootstrap 5, TipTap (rich text editor), Mapbox GL
- **Backend:** Node.js + Express 5, PostgreSQL 15, Socket.io 4, JWT auth, ExcelJS
- **Storage:** Backblaze B2 (S3-compatible) for file uploads
- **DB Connection:** `backend/db.js` uses `DATABASE_URL` env var (connection pool)

### Multi-tenancy
All user data is isolated by `owner_id`. Every query on sensitive tables must filter by `owner_id` derived from the authenticated user's JWT.

### Authentication Flow
1. Login → access token (stored in `localStorage`) + refresh token (HttpOnly cookie, DB-backed)
2. All API requests: `Authorization: Bearer <access_token>`
3. Token refresh: automatic via cookie on expiry
4. Middleware: `backend/authMiddleware.js`

### Backend Route Structure
- `server.js` — entry point, mounts all routers, initializes Socket.io
- `apiRoutes.js` — main CRUD endpoints (building sites, daily notes, worker presences, Excel export, companies)
- `authRoutes.js` — register, login, logout, token refresh
- `fileManagerRoutes.js` — Backblaze B2 upload/download/delete
- `projectsManagerRoutes.js` — TipTap document projects (JSON content stored in DB)
- `templatesManagerRoutes.js` — reusable document templates (JSON content stored in DB)
- `socket.js` — WebSocket event handlers

### Frontend Route Structure (`App.tsx`)
| Route | Component | Purpose |
|---|---|---|
| `/building-sites` | HomePage | List all construction sites |
| `/building-site-actions/:site_id` | BuildingSiteActionsPage | Site detail + management |
| `/action-page/:link/:siteId/:date` | ActionPage | Daily work log entry |
| `/edit-document/:siteId/:date` | EditDocumentPage | TipTap document editor |
| `/profile` | ProfilePage | User profile |
| `/login`, `/register` | Auth pages | Authentication |

`ActionPage` renders different components based on the `:link` URL segment: `daily-notes`, `set-daily-presences`, `all-workers-from-site`, `modify-building-site`, `generate-excel-file`, `file-manager`.

`EditDocumentPage` accepts `?projectId=` or `?templateId=` query param to determine whether to load/save a project or a template.

### Database Schema
Key tables: `users`, `building_sites`, `companies`, `daily_notes` (unique on `building_site_id + date`), `daily_presences`, `files`, `projects`, `documents`, `templates`, `user_type`.
Join tables: `users_building_sites`, `users_companies`, `users_teams`, `users_user_type`.

Full schema: `docs/database/db_schema.sql` | Human-readable: `docs/database/db_schema.md`

### Date Handling
- **Frontend:** Dates are stored as `YYYY-MM-DD` strings (never as `Date` objects) in component state. Use `dateToString(date)` from `frontend/utils/formatDate.ts` immediately in calendar `onDateSelect` callbacks to avoid UTC timezone shift bugs. `new Date("YYYY-MM-DD")` parses as UTC midnight and shifts the date in Italy (UTC+2).
- **Backend:** PostgreSQL `date` columns are returned by node-postgres as plain `YYYY-MM-DD` strings — no conversion needed. Send dates from the frontend as plain strings, not ISO UTC timestamps.

## Known Issues & Active Development
See `docs/Developer_notes.md` for the full list. Key items:
- User deletion is broken
- Duplicate email validation missing for `ispettore di cantiere` user type
- Docker init scripts don't seed the required `user_type` and admin `users` records
- `user_type` IDs (1=admin, 2=ispettore di cantiere) are hardcoded in `authRoutes.js` — should move to `.env`
- Google Drive API code present but should be removed
- File/photo/video per daily note is partially implemented
