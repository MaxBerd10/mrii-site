#!/usr/bin/env bash
# Daily backup of the FJSTI site: database + uploaded files (photos, replaced pictures, resumes).
# Touches only this project's own compose containers. Run from anywhere:  /home/mrii-site/scripts/backup.sh
# Keeps the newest BACKUP_KEEP (default 14) copies in BACKUP_DIR (default <project>/backups).
set -euo pipefail

cd "$(dirname "$0")/.."
DEST="${BACKUP_DIR:-$PWD/backups}"
KEEP="${BACKUP_KEEP:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"

umask 077   # resumes are personal data: readable by the owner only
mkdir -p "$DEST"

docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner' | gzip > "$DEST/db-$STAMP.sql.gz"
docker compose exec -T web tar -C /app -czf - media > "$DEST/media-$STAMP.tar.gz"

# A backup that is empty is worse than none: fail loudly.
for f in "$DEST/db-$STAMP.sql.gz" "$DEST/media-$STAMP.tar.gz"; do
  [ -s "$f" ] || { echo "BACKUP FAILED: $f is empty" >&2; exit 1; }
done

# Rotation: drop everything but the newest $KEEP of each kind.
for kind in db media; do
  ls -1t "$DEST"/"$kind"-*.gz 2>/dev/null | tail -n +"$((KEEP + 1))" | while read -r old; do rm -f -- "$old"; done
done

echo "OK  $(du -h "$DEST/db-$STAMP.sql.gz" | cut -f1) database, $(du -h "$DEST/media-$STAMP.tar.gz" | cut -f1) files -> $DEST"
