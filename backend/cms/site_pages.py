"""The website seen as the visitor sees it: one entry per page, with everything an editor can change there.

Used by the admin «Sayt sahifalari» hub, so staff start from the page they see on the website,
not from database table names.
"""

# models: (model_name, Uzbek label, plain-language hint, single)   single=True → one settings-like row
PAGES = [
    {
        'key': 'everywhere',
        'title': 'Hamma sahifada ko‘rinadigan qismlar',
        'path': '/',
        'blurb': 'Saytning tepasi (menyu, telefon), pastki qismi, aloqa bo‘limi va chat yordamchi — har sahifada bir xil.',
        'text_sections': ['topBar', 'nav', 'footer', 'contactCopy', 'footerNav', 'assistant', 'theme', 'backToTop'],
        'asset_groups': [],
        'models': [('sitesettings', 'Aloqa ma’lumotlari', 'Telefon, Telegram, Instagram, pochta, xarita manzili', True)],
    },
    {
        'key': 'home',
        'title': 'Bosh sahifa',
        'path': '/',
        'blurb': 'Birinchi ekran, yo‘nalishlar, raqamlar, «Biz qanday ishlaymiz», savol-javob va boshqa bo‘limlar.',
        'text_sections': ['hero', 'homeCare', 'home', 'homeDark', 'homeShowcase', 'process', 'scrollStory', 'touchScroll', 'stats', 'pillars', 'partners', 'international'],
        'asset_groups': ['medical', 'videos', 'pillars'],
        'models': [
            ('homepage', 'Asosiy matn va raqamlar', 'Birinchi ekrandagi sarlavha, jamoa rasmi, raqamlar', True),
            ('testimonial', 'Sharhlar', 'Bemor va hamkor fikrlari (kamida bittasi bo‘lsa ko‘rinadi)', False),
        ],
    },
    {
        'key': 'clinic',
        'title': 'Klinika',
        'path': '/clinic',
        'blurb': 'Klinika haqida, yo‘nalishlar (bo‘limlar), galereya va video sayohat.',
        'text_sections': ['clinic', 'specialtyPageLabels', 'specialtyWorldLabels'],
        'asset_groups': ['fjsticlinic-new', 'clinic-gallery', 'clinic-tour'],
        'models': [
            ('specialty', 'Klinik yo‘nalishlar', 'Har bir bo‘lim: nomi, tavsifi, xizmatlari, rasmi', False),
            ('clinictourvideo', 'Video sayohat', 'Klinika sayohati videolari', False),
        ],
    },
    {
        'key': 'doctors',
        'title': 'Shifokorlar',
        'path': '/doctors',
        'blurb': 'Shifokorlar ro‘yxati va har birining shaxsiy sahifasi.',
        'text_sections': ['doctors', 'doctorPageLabels', 'doctorProfileUi', 'doctorDossier'],
        'asset_groups': ['doctors'],
        'models': [('doctor', 'Shifokorlar', 'Ism, lavozim, mutaxassislik, foto, ma’lumot', False)],
    },
    {
        'key': 'prices',
        'title': 'Narxlar',
        'path': '/prices',
        'blurb': 'Xizmatlar narxnomasi va check-up paketlari.',
        'text_sections': ['prices'],
        'asset_groups': [],
        'models': [
            ('priceitem', 'Xizmatlar narxi', 'Narxni jadvalda to‘g‘ridan-to‘g‘ri o‘zgartiring', False),
            ('checkupdirection', 'Check-up paketlari', 'Layt / Standart / Premium tarkibi va narxi', False),
            ('pricecategory', 'Narx bo‘limlari', 'Narxnoma bo‘limlari nomi va tartibi', False),
        ],
    },
    {
        'key': 'news',
        'title': 'Yangiliklar',
        'path': '/news',
        'blurb': 'Yangiliklar ro‘yxati va maqolalar.',
        'text_sections': ['news', 'newsPageLabels'],
        'asset_groups': [],
        'models': [('newsarticle', 'Yangiliklar', 'Maqola yozish yoki tahrirlash', False)],
    },
    {
        'key': 'research',
        'title': 'Tadqiqotlar',
        'path': '/research',
        'blurb': 'Klinik tadqiqotlar, imkoniyatlar va hamkorlik.',
        'text_sections': ['research'],
        'asset_groups': [],
        'models': [
            ('researchstudy', 'Faol tadqiqotlar', 'Tadqiqot nomi, sohasi, holati', False),
            ('researchsection', 'Bo‘lim matni', 'Sarlavha va «Nima uchun»', True),
            ('researchcapability', 'Tadqiqot imkoniyatlari', 'Statistika qiymatlari', False),
        ],
    },
    {
        'key': 'education',
        'title': 'Klinik baza (ta’lim)',
        'path': '/education',
        'blurb': 'Ordinatura, amaliyot, qabul shartlari va telefonlar.',
        'text_sections': ['education', 'educationCopy'],
        'asset_groups': [],
        'models': [('sitesettings', 'Qabul komissiyasi telefonlari', 'Aloqa ma’lumotlari ichida', True)],
    },
    {
        'key': 'ai',
        'title': 'AI yechimlar',
        'path': '/ai',
        'blurb': 'AiShifokor va boshqa sun’iy intellekt mahsulotlari.',
        'text_sections': ['ai', 'aiShifokorCopy'],
        'asset_groups': ['ai'],
        'models': [('aiproduct', 'AI mahsulotlar', 'Nomi, tavsifi, imkoniyatlari', False)],
    },
    {
        'key': 'vacancies',
        'title': 'Vakansiyalar',
        'path': '/vakansiyalar',
        'blurb': 'Ochiq lavozimlar va ish arizasi formasi.',
        'text_sections': ['vacancies'],
        'asset_groups': [],
        'models': [
            ('vacancy', 'Vakansiyalar', 'Lavozim qo‘shish, yashirish (HR Telegram ilovasida ham)', False),
            ('inquiry', 'Kelgan arizalar', 'Nomzodlar, rezyume, holat', False),
        ],
    },
]


def page_by_key(key: str):
    return next((p for p in PAGES if p['key'] == key), None)


def assigned_text_sections() -> set[str]:
    return {s for p in PAGES for s in p['text_sections']}
