# MRII — Medical Research & Innovation Institute

Sayt (React + Vite) + CMS (Django Admin/API).

## Stack

| Qism | Texnologiya | Vazifa |
|------|-------------|--------|
| Frontend | React 19, Vite, Tailwind CSS v4 | Sayt UI |
| Backend | Django + DRF | Admin CMS + JSON API |
| DB | PostgreSQL (Docker/prod), SQLite (lokal ixtiyoriy) | Kontent |

```
src/          → React sayt
backend/      → Django CMS
public/       → Static rasmlar
docker-compose.yml → API + Postgres
```

## Tezkor start (lokal)

### 1. Frontend

```bash
cp .env.example .env
# VITE_API_URL=http://127.0.0.1:8001
npm install
npm run dev
```

Preview: http://127.0.0.1:8443

### 2. Backend (Docker — tavsiya)

```bash
docker compose -p mrii up -d --build
```

- Admin: http://127.0.0.1:8001/admin/ (`admin` / `admin123`)
- API: http://127.0.0.1:8001/api/home/?lang=uz

### 3. Backend (venv, Docker’siz)

Batafsil: [backend/README.md](backend/README.md)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_from_frontend --superuser
python manage.py runserver 8000
```

## Environment

**Frontend** (`.env`):

```
VITE_API_URL=https://api.example.com
```

Bo‘sh qoldirilsa — sayt static fallback matndan ishlaydi.

**Backend** (`backend/.env`): qarang `backend/.env.example`  
(`DJANGO_SECRET_KEY`, `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, Postgres…)

## Production

1. **API** — Docker Compose yoki Railway/VPS (`gunicorn`)
2. **Sayt** — `npm run build` → `dist/` (Nginx / Vercel)
3. Vercel’da SPA uchun `vercel.json` rewrite bor (`/(.*) → /index.html`)

## Asosiy buyruqlar

```bash
npm run dev       # frontend
npm run build     # production build
npm run preview   # dist preview

docker compose -p mrii up -d --build   # API + DB
docker compose -p mrii logs -f web
docker compose -p mrii down
```
