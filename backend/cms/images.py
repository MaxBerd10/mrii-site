"""Keep uploaded pictures web-sized: staff upload phone photos of 5–10 MB and 4000+ px; visitors must not download them."""
import io
import os

from django.core.files.base import ContentFile

MAX_SIDE = 1600
RECOMPRESS_ABOVE = 700 * 1024  # bytes: smaller files that already fit are left untouched
_FORMATS = {'JPEG': ('.jpg', {'quality': 82, 'optimize': True, 'progressive': True}),
            'PNG': ('.png', {'optimize': True}),
            'WEBP': ('.webp', {'quality': 82, 'method': 4})}


def optimize_image_bytes(data: bytes) -> bytes | None:
    """Return smaller bytes, or None when the image should be left as it is (or cannot be processed)."""
    try:
        from PIL import Image, ImageOps

        with Image.open(io.BytesIO(data)) as img:
            fmt = img.format
            if fmt not in _FORMATS:
                return None  # GIF/other: leave alone
            width, height = img.size
            if max(width, height) <= MAX_SIDE and len(data) <= RECOMPRESS_ABOVE:
                return None
            img = ImageOps.exif_transpose(img)  # phone photos carry rotation in metadata
            if max(img.size) > MAX_SIDE:
                img.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
            if fmt == 'JPEG' and img.mode not in ('RGB', 'L'):
                img = img.convert('RGB')
            out = io.BytesIO()
            img.save(out, fmt, **_FORMATS[fmt][1])
        smaller = out.getvalue()
        return smaller if len(smaller) < len(data) else None
    except Exception:  # unreadable/unsupported: keep the original upload rather than failing the save
        return None


def optimize_field(instance, field_name: str) -> None:
    """Shrink a freshly uploaded image on `instance.<field_name>` before it is stored."""
    field_file = getattr(instance, field_name, None)
    if not field_file or getattr(field_file, '_committed', True):
        return  # nothing new was uploaded
    name = field_file.name or ''
    if os.path.splitext(name)[1].lower() not in ('.jpg', '.jpeg', '.png', '.webp'):
        return
    try:
        field_file.file.seek(0)
        data = field_file.file.read()
        field_file.file.seek(0)
    except Exception:
        return
    smaller = optimize_image_bytes(data)
    if smaller is not None:
        setattr(instance, field_name, ContentFile(smaller, name=os.path.basename(name)))
