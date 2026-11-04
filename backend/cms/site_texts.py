"""Catalogue of the website's editable texts (generated from the frontend translations).

`site_texts.json` is produced by `npm run texts:export`. The admin page "Sayt matnlari" lists it;
saved edits live in `TextOverride` and are served to the website by `/api/texts/`.
"""
import json
import re
from functools import lru_cache
from pathlib import Path

LANGS = ('uz', 'ru', 'en', 'kaa')
CATALOG_PATH = Path(__file__).with_name('site_texts.json')

# Top-level translation key -> (Uzbek title shown in admin, page where the texts appear)
SECTIONS = {
    'topBar': ('Yuqori panel', 'Hamma sahifa (tepada)'),
    'nav': ('Menyu', 'Hamma sahifa (tepada)'),
    'theme': ('Kun/tun rejimi tugmalari', 'Hamma sahifa'),
    'backToTop': ('«Yuqoriga» tugmasi', 'Hamma sahifa'),
    'assistant': ('Muxlisa AI yordamchi (chat)', 'Hamma sahifa (pastki burchak)'),
    'footer': ('Sayt pastki qismi va murojaat formasi', 'Hamma sahifa (pastda), Aloqa'),
    'hero': ('Birinchi ekran (sarlavha, tugmalar)', 'Bosh sahifa'),
    'homeCare': ('Bosh sahifa matnlari', 'Bosh sahifa'),
    'home': ('Bosh sahifa: yo‘nalishlar va shifokorlar sarlavhasi', 'Bosh sahifa'),
    'homeDark': ('Bosh sahifa: bo‘limlar (AI, taqqoslash, yo‘l, savol-javob…)', 'Bosh sahifa'),
    'homeShowcase': ('Bosh sahifa: AiShifokor namoyishi', 'Bosh sahifa'),
    'process': ('«Biz qanday ishlaymiz» bosqichlari', 'Bosh sahifa'),
    'scrollStory': ('Bosh sahifa: aylantirib ko‘riladigan hikoya', 'Bosh sahifa'),
    'touchScroll': ('Telefon uchun ko‘rsatma', 'Bosh sahifa'),
    'stats': ('Raqamlar (statistika)', 'Bosh sahifa'),
    'pillars': ('Institutning to‘rt yo‘nalishi', 'Bosh sahifa'),
    'clinic': ('Klinika sahifasi, yo‘nalishlar, galereya, video sayohat', 'Klinika'),
    'doctors': ('Shifokorlar sahifasi (tugma va yozuvlar)', 'Shifokorlar'),
    'prices': ('Narxlar sahifasi (sarlavha va yozuvlar)', 'Narxlar'),
    'vacancies': ('Vakansiyalar sahifasi va ariza formasi', 'Vakansiyalar'),
    'research': ('Tadqiqotlar sahifasi', 'Tadqiqotlar'),
    'education': ('Klinik baza (ta’lim) sahifasi', 'Klinik baza'),
    'ai': ('AI yechimlar sahifasi', 'AI yechimlar'),
    'news': ('Yangiliklar sahifasi', 'Yangiliklar'),
    'international': ('Xalqaro bo‘lim', 'Xalqaro bo‘lim'),
    'partners': ('Hamkorlar', 'Bosh sahifa'),
    'contactCopy': ('Aloqa bo‘limi (sayt pastida): manzil, ish vaqti, telefon yozuvlari', 'Hamma sahifa (pastda), Aloqa'),
    'educationCopy': ('Klinik baza (ta’lim): ordinatura, qabul, shartlar', 'Klinik baza'),
    'aiShifokorCopy': ('AI yechimlar: AiShifokor kartalari va matnlari', 'AI yechimlar, Bosh sahifa'),
    'footerNav': ('Sayt pastidagi havolalar ro‘yxati', 'Hamma sahifa (pastda)'),
}


@lru_cache(maxsize=1)
def catalog() -> list[dict]:
    with open(CATALOG_PATH, encoding='utf-8') as fh:
        return json.load(fh)


@lru_cache(maxsize=1)
def by_key() -> dict[str, dict]:
    return {e['key']: e for e in catalog()}


def section_of(key: str) -> str:
    return re.split(r'[.\[]', key, maxsplit=1)[0]


def section_title(section: str) -> str:
    return SECTIONS.get(section, (section, ''))[0]


def section_page(section: str) -> str:
    return SECTIONS.get(section, ('', ''))[1]


def overrides_payload() -> dict[str, dict[str, str]]:
    """{key: {lang: text}} for every non-empty override (what the website downloads)."""
    from .models import TextOverride

    known = by_key()
    out: dict[str, dict[str, str]] = {}
    for row in TextOverride.objects.all():
        if row.key not in known:
            continue  # stale key after a catalogue change: ignore
        values = {lang: getattr(row, lang) for lang in LANGS if getattr(row, lang)}
        if values:
            out[row.key] = values
    return out


def contacts_payload() -> dict[str, object]:
    """Contact details the clinic set in the admin (only non-blank, sanitised values).

    Anything blank is omitted so the website keeps its built-in default for it.
    """
    import re

    from .models import SiteSettings

    obj = SiteSettings.objects.first()
    if obj is None:
        return {}
    out: dict[str, object] = {}

    def url(value: str) -> str:
        value = (value or '').strip()
        return value if re.match(r'^https?://', value, re.I) else ''

    phone = (obj.contact_phone or '').strip()
    if re.match(r'^\+?[\d\s().-]{7,}$', phone):
        out['phone'] = phone
    for field, key in (
        ('contact_telegram_url', 'telegramUrl'),
        ('contact_instagram_url', 'instagramUrl'),
        ('contact_website', 'website'),
    ):
        value = url(getattr(obj, field))
        if value:
            out[key] = value
    email = (obj.contact_email or '').strip()
    if email:
        out['email'] = email
    map_query = (obj.contact_map_query or '').strip()
    if map_query:
        out['mapQuery'] = map_query
    phones = [
        line.strip() for line in (obj.contact_admissions_phones or '').splitlines()
        if re.match(r'^\+?[\d\s().-]{7,}$', line.strip())
    ]
    if phones:
        out['admissionsPhones'] = phones
    return out
