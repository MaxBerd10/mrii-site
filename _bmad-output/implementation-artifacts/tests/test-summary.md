# Test Automation Summary

## Generated Tests

### E2E Tests

- [x] `tests/e2e/clinic-specialty.spec.ts` — klinik katalogdan laboratoriya yo‘nalishiga o‘tish.
- [x] `tests/e2e/clinic-specialty.spec.ts` — mobil ekranda laboratoriya sarlavhasi va tavsifi gorizontal kesilmasligi.
- [x] `tests/e2e/clinic-specialty.spec.ts` — qabulga yozilish havolasi kerakli so‘rov bilan ochilishi.

## Coverage

- UI: klinik katalog va laboratoriya yo‘nalishining 3 ta kritik foydalanuvchi oqimi qamrab olindi.
- API: bu to‘plamda API endpoint testlari yo‘q; frontend hozir CMS ma’lumotlarini fallback rejimida ham ishlata oladi.

## Commands

- `npm run test:e2e` — Chromium’da barcha E2E testlarni ishga tushiradi.
- `npm run test:e2e:ui` — testlarni vizual rejimda ishga tushiradi.

## Next Steps

- Aloqa formasining yuborilishini va til almashtirishni qamrab olish.
- Django API endpointlari uchun alohida test to‘plami qo‘shish.
