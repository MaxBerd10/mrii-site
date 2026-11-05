# Admin panel qo'llanmasi (fermiclinic.uz)

Admin panel: `https://fermiclinic.uz/admin/`. Dasturchi kerak emas — sayt matni, rasmi, narxi, kontaktlari shu yerdan o'zgaradi.
Admin ichida ham qo'llanma bor: bosh sahifadagi **«Qo'llanma»** tugmasi.

## Qayerdan boshlash
- **Qidiruv** (tepada, yoki «/» tugmasi): so'z yozing — telefon, narx, shifokor ismi, yangilik sarlavhasi, matn bo'lagi — to'g'ri tahrirlash joyiga olib boradi.
- **Sayt sahifalari**: saytdagi sahifani tanlang (masalan «Narxlar») — shu sahifadagi hamma o'zgartiriladigan narsa (ro'yxatlar, matnlar, rasmlar) bir joyda, «Saytda ko'rish» tugmasi bilan.
- **Bosh sahifadagi «Tez o'zgartirish»**: eng ko'p kerak bo'ladigan ishlar (telefon, narx, yangilik, shifokor, rasm).

## 3 qadam
1. Bosh sahifadan bo'lim tanlang.
2. Matn / narx / rasmni o'zgartiring.
3. **Saqlash**. Sayt 1–2 daqiqada yangilanadi (sahifani qayta oching).

Xato qilsangiz: «Sayt matnlari» va «Sayt rasmlari»da har qatorda **«Asl holiga»** tugmasi bor. Maydonni bo'sh qoldirsangiz, saytdagi tayyor qiymat saqlanadi.

## Nimani qayerdan o'zgartiraman
| Saytda nima | Admin bo'limi |
|---|---|
| Telefon, Telegram, Instagram, pochta, xarita manzili, qabul komissiyasi telefonlari | **Aloqa ma'lumotlari** (Sayt sozlamalari) — bir marta o'zgartirsangiz butun saytda almashadi |
| Xizmat narxi | **Narxlar** (jadvalda narxni yozib «Saqlash»; qidiruv va bo'lim filtri bor) |
| Check-up paketlari (Layt/Standart/Premium) | **Check-up paketlari** |
| Narxnoma bo'limlari nomi/tartibi | **Narx bo'limlari** |
| Saytdagi ixtiyoriy yozuv (sarlavha, tugma, tavsif — ~1000 ta, 4 tilda) | **Sayt matnlari** (qidiruv oynasi + bo'lim filtri) |
| Tayyor rasm/video (klinika, galereya, bosh sahifa, AI, videolar) | **Sayt rasmlari** (bo'lim → «Almashtirish») |
| Yangilik | **Yangiliklar** |
| Shifokor | **Shifokorlar** |
| Klinika bo'limi (yo'nalish) | **Klinik yo'nalishlar** |
| Vakansiya | **Vakansiyalar** (yoki HR Telegram mini-ilovasi) |
| Kelgan murojaat / ish arizasi, rezyume | **Murojaatlar** |
| Bosh sahifa asosiy matni, raqamlar | **Bosh sahifa** |
| Tadqiqotlar, AI mahsulotlar, klinika videosi, sharhlar | «Sahifalar bo'yicha» ro'yxati |

## Tillar
O'zbekcha, ruscha, inglizcha, qoraqalpoqcha. CMS bo'limlarida (yangilik, shifokor…) faqat o'zbekcha yozing — ruscha/inglizcha saqlashda avtomatik tarjima qilinadi, tekshirib chiqing. «Sayt matnlari»da tillar alohida; «Rus/Ingliz tarjima» tugmasi bor. Qoraqalpoqcha bo'sh qolsa, tayyor matn ko'rinadi.

`{n}`, `{id}` kabi qavsli joylarni o'zgartirmang.

## Rasm va videolar
- Rasm: JPG/PNG/WebP/GIF, 8 MB gacha (yaxshisi < 1 MB, eski bilan bir xil nisbatda).
- Video: MP4/WebM, 30 MB gacha.
- Shifokor/yangilik/yo'nalish rasmlari o'z bo'limlarida yuklanadi.

## Cheklovlar (dasturchi kerak)
Dizayn, bo'limlar tartibi, yangi sahifa; FAQ va ba'zi ro'yxatlarga **yangi band qo'shish** (mavjudlarining matni esa o'zgaradi).

---

## Dasturchi uchun
**Qanday ishlaydi.** Sayt har ochilganda `GET /api/texts/` (+ `GET /api/prices/`) oladi: `{texts, contacts, assets}`.
- Matnlar: `backend/cms/site_texts.json` — katalog; `TextOverride` — o'zgartirilganlari (bo'sh yoki asl bilan teng = o'zgarmagan). Frontend `t` ga qo'shadi (`src/i18n/textOverrides.ts`, `useCopy`).
- Kontaktlar: `SiteSettings.contact_*`; asl telefon/Telegram/sayt/pochta yozuvlari barcha matnlarda almashtiriladi (`src/lib/contacts.ts`).
- Rasmlar: `AssetOverride`; `src/lib/assetOverrides.ts` `src/srcset/poster/style` yozilayotganda yo'lni almashtiradi.
- Narxlar: `PriceCategory/PriceItem/CheckupDirection/CheckupTier`; bo'sh bo'lsa sayt o'z ichidagi ro'yxatni ko'rsatadi.
- Hammasi keshlangan (60 s) va hech narsa bo'lmasa sayt eski tayyor qiymatlarni ko'rsatadi.

**Yangi matn qo'shgandan keyin** (`translations.ts`, `src/data/*Copy.ts`): `npm run texts:export` va `backend/cms/site_texts.json` ni commit qiling. Yangi rasm yo'li qo'shsangiz: `npm run assets:export`.

**Deploy:**
```bash
cd /home/mrii-site && git pull && docker compose up -d --build && npm ci && npm run build
```
Migratsiyalar (`0024`–`0029`) avtomatik; `0027` narxlarni bir marta yuklaydi (keyin qayta yuklamaydi). Qo'lda: `docker compose exec web python manage.py import_prices [--replace]`.

**Testlar:** `cd backend && python manage.py test cms`.
