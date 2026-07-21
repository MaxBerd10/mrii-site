# fermiclinic.uz — server deploy

Bitta domen: sayt + CMS/API.

| URL | Vazifa |
|-----|--------|
| https://fermiclinic.uz | Sayt (`dist/`) |
| https://fermiclinic.uz/admin/ | Django CMS |
| https://fermiclinic.uz/api/home/?lang=uz | API |

## 0. DNS

`fermiclinic.uz` va `www.fermiclinic.uz` **A-record** → server IP.

## 1. Loyiha

```bash
cd /home/mrii-site
git pull origin main
```

## 2. Backend `.env` (repo root)

```bash
cd /home/mrii-site
nano .env
```

```env
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=bu-yerga-uzun-random-kalit
DJANGO_ALLOWED_HOSTS=fermiclinic.uz,www.fermiclinic.uz,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://fermiclinic.uz,https://www.fermiclinic.uz
FRONTEND_URL=https://fermiclinic.uz
CSRF_TRUSTED_ORIGINS=https://fermiclinic.uz,https://www.fermiclinic.uz
SEED_SUPERUSER=1
# Nginx HTTPS beradi; to‘g‘ridan-to‘g‘ri :8001 curl uchun ixtiyoriy:
# SECURE_SSL_REDIRECT=False
```

Secret yaratish:

```bash
openssl rand -hex 32
```

Docker:

```bash
docker compose -p mrii-site up -d --build
curl -I localhost:8001/admin/
curl 'localhost:8001/api/home/?lang=uz'
```

## 3. Frontend build

Node 20+ kerak.

```bash
cd /home/mrii-site
echo 'VITE_API_URL=https://fermiclinic.uz' > .env.production.local
npm ci
npm run build
# natija: dist/
```

## 4. Nginx + SSL

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

sudo cp /home/mrii-site/deploy/nginx-fermiclinic.uz.conf /etc/nginx/sites-available/fermiclinic.uz
sudo ln -sf /etc/nginx/sites-available/fermiclinic.uz /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl reload nginx

sudo certbot --nginx -d fermiclinic.uz -d www.fermiclinic.uz
```

Certbot HTTPS bloklarini o‘zi qo‘shadi.

## 5. Xavfsizlik

1. Oching: https://fermiclinic.uz/admin/
2. Default `admin` / `admin123` ni **darhol** o‘zgartiring (Parol)

## Yangilash (keyingi deploy)

```bash
cd /home/mrii-site
git pull origin main
docker compose -p mrii-site up -d --build
echo 'VITE_API_URL=https://fermiclinic.uz' > .env.production.local
npm ci
npm run build
sudo systemctl reload nginx
```
