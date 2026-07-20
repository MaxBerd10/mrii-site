#!/bin/sh
set -e
python manage.py migrate --noinput
python manage.py collectstatic --noinput

if [ "${SEED_SUPERUSER:-0}" = "1" ]; then
  python manage.py seed_from_frontend --superuser || true
fi

exec "$@"
