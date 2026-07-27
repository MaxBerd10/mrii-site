---
title: 'Doctor detail sahifasini tasdiqlangan preview bilan birxillashtirish'
type: 'feature'
created: '2026-07-26'
status: 'in-review'
review_loop_iteration: 0
baseline_commit: '72d2b02d1614497b6555caa91dba56a6a67b5ce0'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Hozirgi doctor detail sahifasi `localhost:51999/__preview-doctor.html` dagi tasdiqlangan ko‘rinishdan farq qiladi: sahifa tor dossier kartasi kabi ko‘rinadi, global navbar birinchi ekran kompozitsiyasini buzadi, qabul jadvali va boy professional ma’lumotlar preview’dagi vizual ierarxiyada berilmagan.

**Approach:** Barcha doctor detail route’larini preview’dagi to‘liq kenglikdagi klinik profil tizimiga o‘tkazish: ko‘k grid hero, arch portrait, stats strip, inline qabul jadvali, mutaxassis/visit card, timeline, evidence panellari, sharhlar, doctor shelf va yakuniy coordinator CTA. Mavjud profil ma’lumotlari har bir doctor uchun dinamik ishlatiladi, mavjud booking modal va review yozish funksiyasi saqlanadi.

## Boundaries & Constraints

**Always:** Faqat doctor detail tajribasi va uning to‘g‘ridan-to‘g‘ri komponentlariga tegish; barcha doctor slug’lari, UZ/RU/EN matnlari, haqiqiy doctor rasmlari, booking modal, review yozish, keyboard focus, mobile layout va reduced-motion ishlashi; preview’dagi Sora/Source Sans 3, `#0F4C81` klinik ko‘k, cyan signal, emerald availability va to‘liq kenglik ritmini saqlash.

**Ask First:** Doctor modeliga backend/CMS schema o‘zgarishi, yangi tashqi paket, mavjud route formatini o‘zgartirish yoki doctor detail’dan tashqari global sahifa dizaynini almashtirish talab qilinsa.

**Never:** Preview HTML’ni iframe qilish; statik faqat Xolmatovga ishlaydigan sahifa yaratish; boshqa doctor ma’lumotlarini Xolmatov ma’lumotlari bilan almashtirish; mavjud saqlanmagan o‘zgarishlarni bekor qilish; global navbar’ni boshqa route’lardan olib tashlash.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Doctor topildi | `/doctors/:slug` haqiqiy profil | Preview bilan bir xil kompozitsiya, profilga mos ism, rol, rasm, tajriba, maqola, tadqiqot, ta’lim, yo‘nalish va tillar | N/A |
| Doctor topilmadi | Noto‘g‘ri slug | Mavjud `NotFoundPage` | Sahifa xato bermaydi |
| Qabul vaqti tanlanadi | Kun va bo‘sh slot bosiladi | Tanlov vizual belgilanadi va summary yangilanadi | Band slot disabled qoladi |
| Review mavjud emas | Local storage bo‘sh | Uchta demo tasdiqlangan review preview uslubida ko‘rinadi | Yangi review qo‘shilganda demo va user review birga ishlaydi |
| Kichik ekran | 360–720px viewport | Hero, booking, timeline, evidence, reviews va shelf bitta ustunga tushadi | Gorizontal overflow bo‘lmaydi |

</frozen-after-approval>

## Code Map

- `src/App.tsx` — doctor detail route’da global chrome’ni preview’dagi maxsus dockbar bilan almashtirish chegarasi.
- `src/pages/DoctorPage.tsx` — doctor profilining barcha dinamik sectionlari va qabul tanlovi.
- `src/styles/doctor-profile.css` — preview tokenlari, layout, responsive, hover/focus va motion.
- `src/data/doctorDossier.ts` — timeline, til darajalari va demo professional fallback ma’lumotlari.
- `src/components/DoctorReviews.tsx` — profile variantidagi score distribution, demo reviews va yozish formasi.
- `src/lib/doctorReviews.ts` — foydalanuvchi review’larini saqlash; mavjud API saqlanadi.

## Tasks & Acceptance

**Execution:**
- [x] `src/App.tsx` — doctor detail route’da asosiy `Nav`, `BackToTop` va assistant o‘rniga sahifaning o‘z dockbar tajribasiga joy berish; boshqa route’larni o‘zgartirmaslik.
- [x] `src/pages/DoctorPage.tsx` — preview semantik tuzilmasini dinamik React sahifaga ko‘chirish; kun/slot state’i va modal triggerlarini ulash.
- [x] `src/data/doctorDossier.ts` — preview talab qilgan visit details, professional milestones, til darajasi va lokal copy fallbacklarini markazlashtirish.
- [x] `src/components/DoctorReviews.tsx` — doctor profile uchun preview uslubidagi score/review variantini qo‘shish, mavjud kartadagi modal variantini buzmaslik.
- [x] `src/styles/doctor-profile.css` — etalon CSS yo‘nalishini project-scoped `.dp` stillariga moslashtirish va responsive/motion holatlarini yakunlash.

**Acceptance Criteria:**
- Given Xolmatov profili ochilgan, when desktop’da sahifa ko‘rilsa, then first viewport, qabul kartasi, about/visit split, timeline, uchta evidence paneli, review grid, related shelf va closing CTA preview bilan bir xil vizual tizimda ko‘rinadi.
- Given boshqa doctor slug’i ochilgan, when sahifa render bo‘lsa, then ayni layout shu doctorning o‘z ma’lumoti va rasmi bilan ishlaydi.
- Given foydalanuvchi kun va bo‘sh vaqtni tanlasa, when selection o‘zgarsa, then summary tanlangan sana/vaqtni ko‘rsatadi va tasdiqlash mavjud booking modalini ochadi.
- Given scroll hero’dan o‘tsa, when dock threshold bosib o‘tilsa, then compact doctor dockbar paydo bo‘ladi; sahifa boshida global nav kompozitsiyani to‘smasligi kerak.
- Given keyboard yoki reduced-motion ishlatilsa, when interactive elementlar boshqarilsa, then focus ko‘rinadi va ortiqcha reveal/pulse animatsiyalari o‘chadi.
- Given `npm run build`, when implementation tugasa, then TypeScript/Vite build xatosiz yakunlanadi.

## Spec Change Log

## Design Notes

Etalonning asosiy imzosi — klinik o‘lchov asbobini eslatuvchi ruled cobalt stage va yurak izi. Oqartirilgan yumaloq booking sheet stage ustiga chiqadi; qolgan sahifa sokin daylight card tizimida davom etadi. Katta rasm faqat hero’da ishlatiladi, related doctor shelf’da rasmlar bir xil aspect ratio’da, lekin gorizontal to‘liq kenglikda beriladi.

## Verification

**Commands:**
- `npm run build` — TypeScript va Vite build muvaffaqiyatli.

**Manual checks:**
- `http://localhost:8443/doctors/xolmatov-s-r` ni `http://localhost:51999/__preview-doctor.html` bilan desktop va mobile’da yonma-yon tekshirish.
- Kun/slot tanlash, booking modal, review form, related doctor navigation, dockbar va reduced-motion holatlarini sinash.
