# HR Telegram Mini App (`/hr`)

HR xodimi admin panelga kirmasdan, Telegram ichida:
- vakansiya qo'shadi / tahrirlaydi / saytdan yashiradi / o'chiradi (RU va EN o'zbekchadan avtomatik tarjima qilinadi);
- kelgan **ish arizalarini** ko'radi (faqat vakansiya arizalari — bemor murojaatlari ko'rinmaydi), holatini belgilaydi, qo'ng'iroq qiladi;
- rezyumeni **o'z Telegram chatiga** oladi («📎 Rezyume»);
- yangi ariza kelganda botdan xabar oladi.

## Qanday ishlaydi
- Mini App — saytning `https://fermiclinic.uz/hr` sahifasi (React, alohida paket yo'q). Faqat Telegram ichida ochiladi; saytda hech qayerdan havola yo'q, `robots.txt`da yopiq.
- Kirish: Telegram `initData` (Telegram o'zi imzolaydi, bot tokenidan olingan kalit bilan HMAC-SHA256). Server imzoni, yangiligini (6 soat) va Telegram ID **ruxsat ro'yxatida** (`HRTelegramUser`) ekanini tekshiradi. Botni topgan begona odam kira olmaydi.
- API: `/api/hr/*`, `Authorization: tma <initData>`. Cookie yo'q → CSRF xavfi yo'q. Har foydalanuvchiga 600 so'rov/soat.
- Bot tokeni **faqat serverdagi `.env`da**; frontend va repoda yo'q. Server Telegram'ga faqat chiquvchi HTTPS so'rov yuboradi (webhook shart emas).
- Rezyume URL sifatida ochilmaydi: server faylni botning o'zi orqali HR ning chatiga `sendDocument` qiladi. (Eslatma: fayl Telegram serverlaridan o'tadi.)

## O'rnatish (bir marta)
1. **Bot yarating:** Telegram'da @BotFather → `/newbot` → token oling (mavjud bot bo'lsa, shuni ishlating).
2. **Serverdagi `.env`ga** (`/home/mrii-site/.env`) qo'shing:
   ```
   TELEGRAM_BOT_TOKEN=123456:ABC...
   ```
   (`FRONTEND_URL=https://fermiclinic.uz` allaqachon bor.)
3. **Deploy:**
   ```bash
   cd /home/mrii-site && git pull && docker compose up -d --build && npm ci && npm run build
   ```
   (migratsiya `0022` avtomatik qo'llanadi.)
4. **HR akkauntni ruxsat ro'yxatiga qo'shing.** HR xodimi Telegram ID'sini @userinfobot dan oladi (bu telefon raqam yoki @username emas, raqamli ID):
   ```bash
   docker compose exec web python manage.py add_hr_telegram 123456789 --name "Nigmatova S.A."
   ```
   Ro'yxatni admin panelda ham boshqarish mumkin (Admin → «HR Telegram»), faqat superuser ko'radi. Olib tashlash: `... add_hr_telegram 123456789 --deactivate`.
5. **Menyu tugmasini sozlang** (bot menyusi Mini App'ni ochadi):
   ```bash
   docker compose exec web python manage.py setup_telegram_bot
   ```
6. **HR xodimi:** botni Telegram'da ochib **/start** bosadi (bot unga xabar yubora olishi uchun bir marta shart), so'ng menyudagi **«Vakansiyalar»** tugmasini bosadi.

Ruxsati bo'lmagan odam Mini App'ni ochsa, ekranda o'zining Telegram ID'si chiqadi — uni administratorga yuboradi.

## Muammolar
| Alomat | Sabab |
|---|---|
| «Bu sahifa Telegram ichida ochiladi» | Brauzerdan ochilgan; Telegram menyu tugmasidan oching |
| «Sizga ruxsat etilmagan» + ID | ID ro'yxatda yo'q → `add_hr_telegram` |
| «Sessiya eskirgan» | Mini App 6 soatdan ortiq ochiq turgan → yoping, qayta oching |
| «Telegram bot hali sozlanmagan» (503) | `.env`da `TELEGRAM_BOT_TOKEN` yo'q yoki konteyner qayta yaratilmagan (`docker compose up -d`) |
| Rezyume kelmayapti (502) | HR botga hali `/start` bosmagan, yoki server `api.telegram.org`ga chiqa olmayapti |
| Bildirishnoma kelmayapti | Xuddi shu (/start), yoki akkaunt faol emas |

## Muhim
- **nginx:** SPA javoblariga `X-Frame-Options` qo'ymang — Telegram Web/Desktop Mini App'ni iframe'da ochadi. Clickjacking himoyasi kerak bo'lsa, CSP `frame-ancestors` ga Telegram originlarini qo'shing.
- Admin panel (`/admin/`) saqlanadi (superuser uchun, ruxsat ro'yxati va kontent uchun). Endi uni faqat 1–2 kishi ishlatadi — IP cheklash/2FA bilan yopish ancha osonlashdi (`docs/security-audit-2026-10-23.md`).
- Eski «HR bo'limi» guruhidagi admin akkauntlarni Mini App ishlay boshlagach o'chirish mumkin.
