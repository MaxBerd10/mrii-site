# Xavfsizlik auditi — fermiclinic.uz (2026-10-23)

Qamrov: React frontend, Django/DRF backend, Docker/compose, nginx konfiguratsiyasi, bog'liqliklar, git tarixi va jonli server (faqat o'qiladigan, yengil so'rovlar). Boshqa loyihalarga tegilmagan.

Holat belgilari: **Tuzatildi** (kodda, shu branch'da) · **Serverda amal kerak** · **Qabul qilingan / tavsiya**.

## Xulosa

| # | Daraja | Topilma | Holat |
|---|--------|---------|-------|
| H-1 | Yuqori | Rezyumelar (shaxsiy ma'lumot) hamma uchun ochiq `/media/resumes/...` edi | Tuzatildi va deploy qilingan (2026-10-07) |
| H-2 | Yuqori | `/media/backups/*.json` ochiq yuklab olinardi (jonli server: HTTP 200) | Kodda tuzatildi · **serverda faylni o'chirish kerak** |
| H-3 | Yuqori | Rate limit `X-Forwarded-For`ni almashtirish bilan aylanib o'tilardi (45/45 so'rov o'tdi) | Tuzatildi |
| H-4 | Yuqori | Zaif bog'liqliklar: DRF 3.17.1 (autentifikatsiyasiz DoS), Pillow 12.3.0, Django 5.2.16, certifi, sqlparse, urllib3; npm dev-toolchain (vite) | Tuzatildi (pin + lock) · **serverda qayta build** |
| M-1 | O'rta | Ochiq endpointlarda 512 MB so'rov tanasi xotirada (`DATA_UPLOAD_MAX_MEMORY_SIZE`) | Tuzatildi |
| M-2 | O'rta | Murojaat matn maydonlari cheklanmagan (xabar, tibbiy tarix, allergiya) | Tuzatildi (5000/2000) |
| M-3 | O'rta | Murojaat raqami 32 bit (advice endpointida sanab chiqish xavfi) | Tuzatildi (48 bit) |
| M-4 | O'rta | Admin loginda brute-force himoyasi yo'q | Tuzatildi (lockout + nginx limit) · 2FA tavsiya |
| M-5 | O'rta | docker-compose `8001`ni `0.0.0.0` da ochadi (hozir tashqaridan yopiq — tekshirildi) | Tuzatildi (127.0.0.1) |
| M-6 | O'rta | compose'da `DEBUG=True` va `ALLOWED_HOSTS=*` default (fail-open) | Tuzatildi (compose) |
| M-7 | O'rta | nginx shablonida /media va /admin uchun 512 MB, /api uchun limit yo'q | Shablon tuzatildi · **serverda qo'lda qo'shish** |
| M-8 | O'rta | Sayt (SPA) javoblarida HSTS/nosniff yo'q | Shablonda bor · serverda qo'llanmagan (qaror: nginx'ga tegilmaydi). `X-Frame-Options` ataylab qo'yilmagan: Telegram Web Mini App'ni iframe'da ochadi |
| M-9 | O'rta | Rezyume faqat kengaytma bo'yicha tekshirilardi | Tuzatildi (fayl imzosi) |
| L-1 | Past | `Server: nginx/1.24.0` versiyasi ko'rinadi | Shablonda `server_tokens off` |
| L-2 | Past | Server IP'sida 21-port (FTP) tashqaridan TCP qabul qiladi (banner yo'q) | **Serverda tekshirish kerak** |
| L-3 | Past | Konteynerlar root bilan ishlaydi; baza image digest bilan mahkamlanmagan | Tavsiya (pastga qarang) |
| L-4 | Past | CSP yo'q (Google Fonts/Maps tashqi) | Tavsiya |
| L-5 | Past | `deep-translator` tarixiy advisory (PYSEC-2022-252); 1.11.4 — joriy, lock'da pin | Qabul qilingan |
| L-6 | Past | Advice endpoint to'g'ri ID bilan bemorning to'liq ismini qaytaradi | Tavsiya (faqat ism) |
| L-7 | Past | compose'da Postgres paroli fallback `mrii` | Prod `.env`da `POSTGRES_PASSWORD` borligini tekshiring |
| L-8 | Info | Avtomatik tashqi (offsite) DB/media zaxira nusxasi hujjatlashtirilmagan | Tavsiya |

## Batafsil

### H-2 Ochiq backup fayl
`remove_demo_content` buyrug'i zaxirani `/app/media/backups/` ga yozgan, jonli sayt esa butun `MEDIA_ROOT`ni ommaga berardi. `https://fermiclinic.uz/media/backups/demo_content_backup_20261008T032109.json` → **200**. Ichida faqat demo yangilik/sharh/litsenziya bor (maxfiy emas), lekin dizayn xatosi: `media/` ichiga tushgan har qanday fayl ochiq bo'lardi.
**Tuzatish:** `/media/` endi faqat `ai/ clinic-tour/ doctors/ hero/ homepage/ news/ specialties/` papkalarini beradi (allow-list); qolgan hamma narsa — `resumes/`, `backups/`, tasodifiy fayllar — 404. Buyruqning standart zaxira papkasi `/app/backups`. Testlar bor.
**Serverda:** `docker compose exec web rm -rf /app/media/backups`

### H-3 Rate limit aylanib o'tilishi
DRF `NUM_PROXIES` o'rnatilmagan bo'lsa, mijoz yuborgan `X-Forwarded-For` qiymati to'liq identifikator bo'lib xizmat qiladi. nginx `$proxy_add_x_forwarded_for` mijoz qiymatiga o'zinikini qo'shadi, shuning uchun har so'rovda sarlavhani almashtirish limitni yo'qqa chiqarardi. Lokal sinov: bir xil mijoz — `404×40, 429×5`; almashtirilgan sarlavha bilan — `404×45`.
Oqibat: `/api/inquiries/` (bazaga yozadi) spami; `/api/inquiries/<id>/` orqali ID sanash.
**Tuzatish:** `TRUSTED_PROXY_COUNT=1` (DRF `NUM_PROXIES` va admin lockout faqat nginx qo'shgan oxirgi manzilga ishonadi); hisoblagichlar barcha gunicorn worker'lar uchun umumiy fayl-keshda (avval har worker'da alohida va qayta ishga tushganda nolga tushardi). Test: `ThrottleAndLoginSecurityTests`.

### H-4 Bog'liqliklar
- **DRF 3.17.1:** Accept sarlavhasi orqali kvadratik vaqt (bitta so'rov worker'ni ~19 s band qiladi) va Content-Type charset orqali xotira kuchaytirishi — ikkalasi **autentifikatsiyasiz**. 3.18.x da tuzatilgan.
- **Pillow 12.3.0:** o‘nlab advisory (TIFF/GIF/EPS/PDF parserlari va h.k.). Faqat xodim yuklagan rasmlarga ta'sir qiladi. 13.0.0 da tuzatilgan.
- **Django 5.2.16:** GeoDjango advisory'lari (loyiha GIS ishlatmaydi) — baribir 5.2.17+.
- **certifi:** bekor qilingan emSign ildiz sertifikati; **sqlparse/urllib3:** DoS.
- **npm:** prod bog'liqliklarda 0; dev toolchain'da 4 (vite 8.0–8.1.5 dev-server, postcss, nanoid, source-map-js). `npm run dev` `--host 0.0.0.0` bilan LANda ochiladi, shuning uchun vite advisory'lari dev mashinada real.
**Tuzatish:** `requirements.txt` da xavfsizlik pol versiyalari, aniq pinlar `requirements.lock`da, Docker `requirements.lock`dan o'rnatadi (qayta build tasodifan yangi/buzilgan versiya tortmaydi). Barcha 20 paket py3.12 linux x86_64/aarch64 uchun tayyor wheel. `npm audit fix` → 0 zaiflik.
**Serverda:** `git pull && docker compose up -d --build && npm ci && npm run build` (`npm ci` — lock'dagi yangi versiyalarni o'rnatadi).

### M-1…M-3, M-9 Ochiq endpoint chegaralari
`DATA_UPLOAD_MAX_MEMORY_SIZE` 10 MB; `FILE_UPLOAD_MAX_MEMORY_SIZE` standartga qaytarildi (katta fayllar xotirada emas, vaqtinchalik faylga oqadi); yuklangan fayllar `0640`. `message/medical_history/allergies` uchun `max_length`. Murojaat raqami `PREFIX-YYYY-` + 12 hex. Rezyume: kengaytma + sarlavha baytlari mos kelishi shart (`%PDF-`, `PK..`, OLE2) — `.pdf` deb nomlangan HTML rad etiladi. Virus skaneri yo'q (hajm oshsa ClamAV tavsiya).

### M-4 Admin brute-force
Admin `/admin/login/` ochiq. Endi: 15 daqiqada 10 ta xato (IP bo'yicha) yoki 25 ta (login nomi bo'yicha) → **429**; muvaffaqiyatli login nomi hisoblagichini tozalaydi. nginx shablonida `limit_req` (30/min). **Keyingi qadam (kodsiz emas):** admin uchun 2FA yoki IP allowlist/VPN.

### M-7/M-8/L-1 nginx
Shablon (`deploy/nginx-fermiclinic.uz.conf`) yangilandi: `server_tokens off`, `/api/` 8 MB + `limit_req 10r/s`, `/media/` faqat GET/HEAD va 1 MB, `/admin/login/` limit, SPA uchun xavfsizlik sarlavhalari.
**Muhim:** serverdagi haqiqiy fayl shablondan farq qiladi (`listen 192.168.0.101:443/80`, `client_max_body_size 32m`). Faylni almashtirmang — faqat kerakli bloklarni qo'lda qo'shing (`deploy/README.md`dagi ogohlantirish). Jonli konfiguratsiyada hozir: global 32 MB, rate limit yo'q, SPA sarlavhalari yo'q.

### Tekshirilgan va yaxshi
- Git tarixi va HEAD'da haqiqiy sir (kalit/token/parol) yo'q; `.env` ignore'da; `admin123` faqat `DEBUG` rejimida seeder fallback'i.
- Frontend: `dangerouslySetInnerHTML/innerHTML/eval` yo'q, bundle'da sir yo'q, tashqi havolalar `noreferrer`; chatbot lokal (tashqi API yo'q).
- Backend: ORM (raw SQL yo'q), `mark_safe/|safe` yo'q, admin JS'dagi bitta `innerHTML` statik matn, `next` parametri shablonda escape qilinadi; serializer aniq maydonlar ro'yxati (mass-assignment yo'q); HR faqat `career` murojaatlarini ko'radi.
- Jonli: HTTP→HTTPS 301; TLS 1.0/1.1 rad, 1.2/1.3 ishlaydi; sertifikat 2027-01-06 gacha (avtomatik yangilangan); cookie `HttpOnly; Secure; SameSite=Lax`; Django sahifalarida HSTS/DENY/nosniff; CORS faqat `https://fermiclinic.uz` (credentials bilan), evil/localhost/null rad; TRACE/PUT 405; DB va app portlari (5432/8001/8000) tashqaridan yopiq; `/.git /.env /db.sqlite3 /src` so'rovlari faylni emas, SPA sahifasini qaytaradi (oshkor bo'lish yo'q); source map yo'q; DEBUG o'chiq.

### Tavsiyalar (kod o'zgartirilmadi)
1. **Admin uchun 2FA yoki IP cheklash** (eng katta qolgan xavf: bitta zaif xodim paroli).
2. **Konteyner non-root:** `Dockerfile`da `USER app`, `entrypoint.sh` boshida `chown /app/media` + `gosu`. Hajm (volume) huquqlari sinab ko'rilmasdan o'zgartirilsa deploy'da yuklashlar buziladi — staging'da sinab, keyin.
3. **CSP (report-only bilan boshlang)**, Google Fonts'ni lokal xostlash (maxfiylik va CSP soddalashadi).
4. **Zaxira nusxa:** `pg_dump` + `media` hajmini serverdan tashqariga (kunlik, shifrlangan).
5. Advice endpointida to'liq ism o'rniga faqat ism; murojaatlar uchun saqlash muddati siyosati (tibbiy ma'lumot!).
6. 21-port: serverda `ss -tlnp | grep ':21 '`; FTP bo'lsa o'chirib, SFTP'ga o'ting (ochiq matnli parol).
7. `.env`da `POSTGRES_PASSWORD`, `DJANGO_SECRET_KEY`, `SEED_SUPERUSER=0` borligini tasdiqlang.
