# Saytni topshirish ro'yxati (fermiclinic.uz)

## 1. Nima topshiriladi
| Nima | Qayerda |
|---|---|
| Sayt | https://fermiclinic.uz |
| Admin panel | https://fermiclinic.uz/admin/ (ichida «Qo'llanma» bor; `docs/admin-qollanma.md`) |
| HR Telegram mini-ilovasi | bot `@fermiclinic_hr_bot` (`docs/telegram-hr-miniapp.md`) |
| Kod | GitHub: MaxBerd10/mrii-site, branch `main` |
| Server papkasi | `/home/mrii-site` (docker compose loyihasi `mrii-site`) |

## 2. Topshirishdan OLDIN bajariladigan ishlar (bir martalik)
1. **Admin akkaunt.** Admin'ni faqat bitta mas'ul odam ishlatadi: unga bitta kuchli parolli akkaunt yetadi (parolni boshqa hech kimga bermang, parol menejerda saqlang). Keyinchalik ishlovchi ko'paysa, Admin → Boshqa bo'limlar → Xodimlar'da har biriga alohida akkaunt oching va «Kontent menejeri» guruhini bering (u shifokor, yangilik, narx, matn, rasm, sharh va murojaatlarni boshqaradi, lekin xodimlar va tizim sozlamalariga kira olmaydi). HR xodimiga «HR bo'limi» guruhini bering — u faqat arizalar va vakansiyalarni ko'radi. Dasturchi akkauntini topshirgandan keyin o'chiring yoki parolini almashtiring.
2. **HR Telegram ro'yxati.** Sinov ID `123456789` ni o'chiring:
   ```bash
   cd /home/mrii-site && docker compose exec web python manage.py add_hr_telegram 123456789 --deactivate
   ```
   Haqiqiy HR xodimining ID sini qo'shing (`--name "Ism"`), u botda `/start` bosadi.
3. **Birinchi zaxira nusxa** va avtomatik zaxira (3-bo'limga qarang).
4. **Aloqa ma'lumotlarini tekshiring:** Admin → Aloqa ma'lumotlari (telefon, Telegram, Instagram, pochta, xarita manzili). Hozir bo'sh bo'lsa, saytdagi tayyor qiymatlar ko'rinadi.
5. **Birinchi yangilikni qo'shing** (hozir saytda yangilik yo'q).
6. `.env` fayl (`/home/mrii-site/.env`) nusxasini xavfsiz joyda saqlang (parollar va bot tokeni shu yerda). Uni hech qayerga yubormang.

## 3. Zaxira nusxa (backup)
Zaxira ma'lumotlar bazasi + yuklangan fayllar (shifokor fotosi, almashtirilgan rasmlar, rezyumelar). Rezyumelarda shaxsiy ma'lumot bor — nusxalarni begona odamga bermang.

Qo'lda:
```bash
/home/mrii-site/scripts/backup.sh
```
Har kuni avtomatik (server `crontab -e`, faqat shu qatorni qo'shing):
```
30 3 * * * /home/mrii-site/scripts/backup.sh >> /home/mrii-site/backups/backup.log 2>&1
```
Oxirgi 14 ta nusxa saqlanadi (`/home/mrii-site/backups/`). **Muhim:** nusxalar shu serverning o'zida turadi — server o'chib qolsa, ular ham yo'qoladi. Haftada bir marta `backups/` papkasini boshqa joyga (o'z kompyuteringiz yoki bulut) ko'chiring:
```bash
scp -r user@server:/home/mrii-site/backups ./fermiclinic-backups
```

**Tiklash** (faqat zarurat bo'lganda; avval mutaxassis bilan maslahatlashing):
```bash
cd /home/mrii-site
docker compose stop web
docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"'
gunzip -c backups/db-YYYYMMDD-HHMMSS.sql.gz | docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
docker compose up -d web
# fayllar:
docker compose exec -T web tar -C /app -xzf - < backups/media-YYYYMMDD-HHMMSS.tar.gz
```

## 4. Sayt ishlamay qolsa
```bash
cd /home/mrii-site
docker compose ps                 # web va db «Up» bo'lishi kerak
docker compose logs web --tail 50 # oxirgi xatolar
docker compose up -d              # to'xtab qolgan bo'lsa ishga tushiradi
```
Sayt ochilmasa, lekin konteynerlar «Up» bo'lsa — muammo nginx yoki sertifikatda bo'lishi mumkin. **Server boshqa loyihalar bilan umumiy: nginx va boshqa saytlarga tegmang**, faqat `/home/mrii-site` ichida ishlang.

Yangilash (dasturchi yangi versiya chiqarganda):
```bash
cd /home/mrii-site && git pull && docker compose up -d --build && npm ci && npm run build
```

## 5. Admin'da ehtiyot bo'ling
- **Hamma shifokorni o'chirmang** — kamida bittasi qolishi shart (tizim buni o'zi to'xtatadi). Kerak bo'lsa «faolsiz qilish»dan foydalaning.
- Narxlar jadvalida narxni o'zgartirgach «Saqlash» bosing; o'zgarish saytda 1–2 daqiqada ko'rinadi.
- «Sayt matnlari»da `{n}`, `{id}` kabi qavsli joylarni o'zgartirmang.
- Rasm hajmi: 8 MB gacha (yaxshisi < 1 MB). Video: 30 MB gacha.
- Hech kimga parol bermang; xodim ketsa, uning akkauntini o'chiring.

## 6. Admin'dan o'zgartirib bo'lmaydigan narsalar (dasturchi kerak)
Dizayn, bo'limlar tartibi, yangi sahifa qo'shish; FAQ va ba'zi ro'yxatlarga yangi band qo'shish; bosh sahifadagi 8 ta tanlangan shifokor ro'yxati (kodda; ulardan biri o'chirilsa, o'rniga boshqa shifokor qo'yiladi); qoraqalpoqcha shifokor tavsiflari (faqat eski shifokorlarda bor).

## 7. Oylik tekshiruv (5 daqiqa)
- [ ] `backups/` da yangi nusxalar bor (`ls -lh /home/mrii-site/backups | tail`).
- [ ] Admin'ga kiring, «Murojaatlar»da javobsiz so'rov yo'qligini ko'ring.
- [ ] Sayt ochiladi, telefon raqami to'g'ri, sertifikat muddati tugamayapti (brauzerda qulf belgisini bosing).
- [ ] Admin akkauntlar ro'yxatida begona yoki ketgan xodim yo'q.
- [ ] Xavfsizlik yangilanishlari: yiliga 1–2 marta dasturchidan `pip`/`npm` paketlarini yangilashni so'rang.

## 7a. Bemor sharhlari
Saytdagi shifokor sahifasida bemorlar sharh yoza oladi. Sharh **darhol ko'rinmaydi**: Admin → Shifokor sharhlari'da «Tekshiruv kutmoqda» holatida turadi. Haftada kamida 2–3 marta tekshiring: haqiqiy bo'lsa belgilab «tasdiqlash» deng, haqoratli yoki reklama bo'lsa o'chiring. Bosh sahifadagi «Bemor sharhlarini tekshirish» ham yangi sharh sonini ko'rsatadi. Sharhga havola, telefon va pochta yozish tizim tomonidan to'sib qo'yilgan; soatiga 6 ta urinishdan ko'p yuborib bo'lmaydi.

## 8. Saytda e'lon qilinadigan ma'lumotlar mas'uliyati
Saytdagi raqamlar (bemorlar soni, tadqiqotlar, AI natijalari), narxlar va shifokor ma'lumotlari litsenziyalangan tibbiyot muassasasining ommaviy da'volaridir: faqat haqiqiy va tasdiqlangan ma'lumotni kiriting. Mijoz sharhlari faqat haqiqiy bo'lsa qo'shiladi.
