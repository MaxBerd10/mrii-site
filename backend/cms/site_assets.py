"""Catalogue of the images/videos the website uses (site_assets.json, from `npm run assets:export`).

The admin page «Sayt rasmlari» lets the clinic replace any of them; replacements are stored as
`AssetOverride` and served to the website by /api/texts/ (key `assets`).
"""
import json
import os
from functools import lru_cache
from pathlib import Path

CATALOG_PATH = Path(__file__).with_name('site_assets.json')

MAX_IMAGE_BYTES = 8 * 1024 * 1024
MAX_VIDEO_BYTES = 30 * 1024 * 1024
IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp', '.gif')
VIDEO_EXTENSIONS = ('.mp4', '.webm')

GROUPS = {
    'medical': ('Bosh sahifa rasmlari', 'Birinchi ekran: shifokorlar jamoasi, yurak rasmi va boshqalar'),
    'videos': ('Bosh sahifa videolari', 'Birinchi ekrandagi video va uning boshlang‘ich kadri'),
    'pillars': ('To‘rt yo‘nalish videolari', 'Bosh sahifa: Klinika / Tadqiqot / Ta’lim / AI kartalari'),
    'fjsticlinic-new': ('Klinika binolari va bo‘limlar', 'Kirish, kunduzgi statsionar, KT, UZI, operatsiya xonasi…'),
    'clinic-gallery': ('Klinika galereyasi', 'Klinika → Galereya sahifasi'),
    'clinic-tour': ('Klinika sayohati videolari', 'Klinika → Video sayohat sahifasi'),
    'ai': ('AI yechimlar rasmlari', 'AI yechimlar sahifasi'),
    'doctors': ('Shifokor fotosuratlari va videolari', 'Shifokorlar sahifasi (saytdagi tayyor rasmlar)'),
}


@lru_cache(maxsize=1)
def catalog() -> list[dict]:
    with open(CATALOG_PATH, encoding='utf-8') as fh:
        return json.load(fh)


@lru_cache(maxsize=1)
def by_path() -> dict[str, dict]:
    return {e['path']: e for e in catalog()}


def group_title(group: str) -> str:
    return GROUPS.get(group, (group, ''))[0]


def group_hint(group: str) -> str:
    return GROUPS.get(group, ('', ''))[1]


def validate_upload(uploaded, kind: str) -> str:
    """Return an Uzbek error message, or '' when the file is acceptable for an `image`/`video` slot."""
    ext = os.path.splitext(uploaded.name or '')[1].lower()
    head = uploaded.read(32)
    uploaded.seek(0)
    if kind == 'image':
        if ext not in IMAGE_EXTENSIONS:
            return 'Rasm turi noto‘g‘ri. JPG, PNG, WebP yoki GIF yuklang.'
        if uploaded.size > MAX_IMAGE_BYTES:
            return 'Rasm hajmi 8 MB dan oshmasin. Kichraytirib qayta yuklang.'
        try:
            from PIL import Image

            with Image.open(uploaded) as img:
                img.verify()
        except Exception:
            return 'Bu fayl rasm emas yoki buzilgan.'
        finally:
            uploaded.seek(0)
        return ''
    if ext not in VIDEO_EXTENSIONS:
        return 'Video turi noto‘g‘ri. MP4 yoki WebM yuklang.'
    if uploaded.size > MAX_VIDEO_BYTES:
        return 'Video hajmi 30 MB dan oshmasin. Siqib qayta yuklang.'
    is_mp4 = head[4:8] == b'ftyp'
    is_webm = head[:4] == b'\x1a\x45\xdf\xa3'
    if (ext == '.mp4' and not is_mp4) or (ext == '.webm' and not is_webm):
        return 'Bu fayl haqiqiy video emas yoki buzilgan.'
    return ''


def assets_payload(request) -> dict[str, str]:
    """{default path: URL of the replacement} for every asset the clinic replaced."""
    from .models import AssetOverride

    known = by_path()
    out: dict[str, str] = {}
    for row in AssetOverride.objects.all():
        if row.path not in known or not row.file:
            continue
        try:
            out[row.path] = request.build_absolute_uri(row.file.url)
        except ValueError:
            continue
    return out
