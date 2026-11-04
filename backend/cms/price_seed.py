"""Loads the built-in price list (price_seed.json) into the admin tables, once."""

import json
from pathlib import Path

SEED_PATH = Path(__file__).resolve().parent / 'price_seed.json'
LANGS = ('uz', 'ru', 'en', 'kaa')


def load_seed():
    with open(SEED_PATH, encoding='utf-8') as fh:
        return json.load(fh)


def import_prices(PriceCategory, PriceItem, CheckupDirection, CheckupTier, *, replace=False):
    """Fill the price tables from the seed. Returns (items, checkups) created.

    Without ``replace`` nothing is touched when the tables already hold rows, so a
    re-run (or a redeploy) never overwrites prices the clinic has edited.
    """
    seed = load_seed()
    created_items = created_checkups = 0

    if replace:
        PriceItem.objects.all().delete()
        PriceCategory.objects.all().delete()
    if not PriceItem.objects.exists() and not PriceCategory.objects.exists():
        categories = {}
        for order, cat in enumerate(seed['categories'], start=1):
            categories[cat['uz']] = PriceCategory.objects.create(
                order=order, **{f'name_{lang}': cat[lang] for lang in LANGS},
            )
        for order, item in enumerate(seed['items'], start=1):
            loc = item['location'] or {lang: '' for lang in LANGS}
            PriceItem.objects.create(
                category=categories[item['category']],
                order=order,
                price_citizen=item['citizen'],
                price_foreign=item['foreign'],
                **{f'name_{lang}': item['name'][lang] for lang in LANGS},
                **{f'location_{lang}': loc[lang] for lang in LANGS},
            )
            created_items += 1

    if replace:
        CheckupDirection.objects.all().delete()
    if not CheckupDirection.objects.exists():
        for order, direction in enumerate(seed['checkups'], start=1):
            obj = CheckupDirection.objects.create(
                slug=direction['id'], accent=direction['accent'], order=order,
                **{f'title_{lang}': direction['title'][lang] for lang in LANGS},
            )
            for tier in direction['tiers']:
                CheckupTier.objects.create(
                    direction=obj, tier=tier['tier'], price=tier['price'],
                    **{f'includes_{lang}': '\n'.join(tier['includes'][lang]) for lang in LANGS},
                    **{f'notes_{lang}': '\n'.join(tier['notes'][lang]) for lang in LANGS},
                )
            created_checkups += 1
    # Keep the real "price list updated" date instead of the import day.
    from datetime import datetime, timezone

    stamp = datetime.fromisoformat(seed['updated']).replace(tzinfo=timezone.utc)
    if created_items:
        PriceItem.objects.update(updated_at=stamp)
        PriceCategory.objects.update(updated_at=stamp)
    if created_checkups:
        CheckupDirection.objects.update(updated_at=stamp)
        CheckupTier.objects.update(updated_at=stamp)
    return created_items, created_checkups
