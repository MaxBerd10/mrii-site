# MRII CMS (Django Admin + API)

Клиент контентни **Django Admin** orqali boshqaradi (uz / ru / en + rasmlar). React frontend ma’lumotni `VITE_API_URL` orqali o’qiydi; API ishlamasa sayt static fallback da qoladi.

## Tezkor start (lokal)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_from_frontend --superuser
python manage.py runserver 8000
```

- Admin: http://127.0.0.1:8000/admin/  
  Default: `admin` / `admin123` (seed `--superuser` dan keyin — prod da almashtiring)
- Admin UI: maxsus MRII dizayn — bosh panelda kartochkalar, o’zbekcha yo’riqnoma, til bo’yicha fieldsetlar
- Interfeys tili: **to’liq o’zbekcha** (`locale/uz/` + `LANGUAGE_CODE=uz`)
- API home: http://127.0.0.1:8000/api/home/?lang=uz

Frontend (alohida terminal):

```bash
# repo root
cp .env.example .env
# VITE_API_URL=http://127.0.0.1:8000
npm run dev
```

## Asosiy API

| Endpoint | Tavsif |
|----------|--------|
| `GET /api/settings/?lang=` | Telefon, ish vaqti, copyright |
| `GET /api/home/?lang=` | Bosh sahifa bo’limlari (bitta so’rov) |
| `GET /api/specialties/`, `/api/specialties/<slug>/` | Klinika |
| `GET /api/doctors/` | Shifokorlar |
| `GET /api/news/`, `/api/news/<slug>/` | Yangiliklar |
| `GET /api/ai-products/`, `/api/ai-products/<slug>/` | AI mahsulotlar |
| `GET /api/research/`, `/api/education/` | Tadqiqot / ta’lim |

Til: `?lang=uz|ru|en` yoki `Accept-Language`.

## Avtomatik tarjima (UZ → RU / EN)

Admin da **o’zbekcha** maydonlarni to’ldiring, rus/inglizni **bo’sh** qoldiring va **Saqlash** bosing.
Bo’sh RU/EN maydonlar internet orqali avtomatik tarjima qilinadi (`deep-translator`).
Agar RU/EN allaqachon to’ldirilgan bo’lsa — ular o’zgarmaydi (qo’lda yozgan matn saqlanadi).

## Seed

Mavjud frontend matnlardan DB ni to’ldirish:

```bash
python manage.py seed_from_frontend
python manage.py seed_from_frontend --superuser   # admin yaratish / yangilash
```

## Production eslatma

1. **Django** — Railway / Render / VPS:
   - `DJANGO_DEBUG=False`
   - `DJANGO_SECRET_KEY` — kuchli kalit
   - `DJANGO_ALLOWED_HOSTS` — API domeni
   - `CORS_ALLOWED_ORIGINS` — Vercel frontend URL
   - Prod DB: PostgreSQL (hozircha SQLite faqat lokal)
   - Media: volume yoki S3/Cloudinary; `MEDIA_URL` to’g’ri bo’lsin
   - `gunicorn config.wsgi:application`

2. **Vercel** (frontend):
   - Environment: `VITE_API_URL=https://your-api-host.example`
   - Redeploy after env change

3. Klientga beriladi: `https://api…/admin/` + login/parol.

## Muhit o’zgaruvchilari

Qarang: [`.env.example`](.env.example) va root [`.env.example`](../.env.example).
