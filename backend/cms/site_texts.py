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


def prices_payload() -> dict[str, object]:
    """Price list in the shape the website already uses, plus a {uz text: {ru,en,kaa}} dictionary."""
    from .models import CheckupDirection, PriceCategory, PriceItem

    translations: dict[str, dict[str, str]] = {}

    def remember(row, field: str, uz: str | None = None) -> str:
        uz = (uz if uz is not None else getattr(row, f'{field}_uz') or '').strip()
        if uz:
            entry = {lang: (getattr(row, f'{field}_{lang}', '') or '').strip() for lang in ('ru', 'en', 'kaa')}
            entry = {k: v for k, v in entry.items() if v}
            if entry:
                translations.setdefault(uz, {}).update(entry)
        return uz

    def lines(value: str) -> list[str]:
        return [line.strip() for line in (value or '').splitlines() if line.strip()]

    def remember_lines(row, field: str) -> list[str]:
        uz_lines = lines(getattr(row, f'{field}_uz'))
        per_lang = {lang: lines(getattr(row, f'{field}_{lang}')) for lang in ('ru', 'en', 'kaa')}
        for i, uz in enumerate(uz_lines):
            entry = {lang: vals[i] for lang, vals in per_lang.items() if len(vals) == len(uz_lines)}
            if entry:
                translations.setdefault(uz, {}).update(entry)
        return uz_lines

    items = list(PriceItem.objects.filter(is_active=True).select_related('category'))
    catalog = None
    categories: list[str] = []
    newest = None
    if items:
        catalog = []
        for item in items:
            category = remember(item.category, 'name')
            if category not in categories:
                categories.append(category)
            catalog.append({
                'id': item.pk,
                'name': remember(item, 'name'),
                'citizen': item.price_citizen,
                'foreign': item.price_foreign,
                'location': remember(item, 'location') or None,
                'category': category,
            })
            newest = max(filter(None, [newest, item.updated_at]))

    directions = list(CheckupDirection.objects.filter(is_active=True).prefetch_related('tiers'))
    checkups = None
    if directions:
        checkups = []
        for direction in directions:
            tiers = []
            for tier in sorted(direction.tiers.all(), key=lambda t: ['Layt', 'Standart', 'Premium'].index(t.tier)):
                tiers.append({
                    'tier': tier.tier,
                    'price': tier.price,
                    'includes': remember_lines(tier, 'includes'),
                    'notes': remember_lines(tier, 'notes'),
                })
                newest = max(filter(None, [newest, tier.updated_at]))
            checkups.append({
                'id': direction.slug,
                'title': remember(direction, 'title'),
                'accent': direction.accent if re.match(r'^#[0-9A-Fa-f]{6}$', direction.accent or '') else '#0EA5E9',
                'tiers': tiers,
            })
            newest = max(filter(None, [newest, direction.updated_at]))

    return {
        'catalog': catalog,
        'categories': categories if catalog is not None else None,
        'checkups': checkups,
        'translations': translations,
        'updated': newest.date().isoformat() if newest else None,
    }
