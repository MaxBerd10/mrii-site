# MRII site (agent notes)

React + Vite + Tailwind CSS frontend + Django CMS in `backend/`.

## Key paths

- `src/App.tsx` — routing / homepage sections
- `src/main.tsx` — entry (`./styles/index.css`)
- `src/styles/` — tokens, base, scenes, sections
- `backend/` — Django admin + `/api/`
- `docker-compose.yml` — Postgres + web (port **8001**)
- `README.md` — setup for humans

## Dev

- Vite default port: `$PORT` or **8443**
- API often on **8001** via Compose
- Set `VITE_API_URL` to the Django origin; empty = static fallback

## Styling

Tailwind CSS v4 via Vite plugin. Prefer utilities + existing CSS modules in `src/styles/`. Do not resurrect legacy `src/index.css`.
