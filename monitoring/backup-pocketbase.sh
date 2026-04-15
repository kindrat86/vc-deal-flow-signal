#!/bin/bash
# Daily PocketBase backup script
# Run via launchd daily at 3:00 AM

PROJECT_DIR="/Users/sipi/launch-projects/vc-deal-flow-signal"
PB_DATA="$PROJECT_DIR/pocketbase/pb_data"
BACKUP_DIR="$PROJECT_DIR/pocketbase/backups"
RETAIN_DAYS=14

mkdir -p "$BACKUP_DIR"

DATE=$(date +%Y%m%d)
BACKUP_FILE="$BACKUP_DIR/data-$DATE.db"

# Use SQLite backup API for a consistent snapshot
if command -v sqlite3 &>/dev/null; then
  sqlite3 "$PB_DATA/data.db" ".backup '$BACKUP_FILE'"
else
  # Fallback: copy the file (less safe if PB is writing)
  cp "$PB_DATA/data.db" "$BACKUP_FILE"
fi

if [ -f "$BACKUP_FILE" ]; then
  echo "$(date '+%Y-%m-%d %H:%M') | Backup OK: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
else
  echo "$(date '+%Y-%m-%d %H:%M') | BACKUP FAILED"
fi

# Remove backups older than RETAIN_DAYS
find "$BACKUP_DIR" -name "data-*.db" -mtime +$RETAIN_DAYS -delete

# Also backup auxiliary.db
if [ -f "$PB_DATA/auxiliary.db" ]; then
  sqlite3 "$PB_DATA/auxiliary.db" ".backup '$BACKUP_DIR/auxiliary-$DATE.db'" 2>/dev/null
  find "$BACKUP_DIR" -name "auxiliary-*.db" -mtime +$RETAIN_DAYS -delete
fi
