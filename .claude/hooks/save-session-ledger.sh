#!/bin/bash
# SessionEnd hook: Append session summary to context intelligence ledger
# Captures session metadata for the /analyst command's internal data dependencies

INPUT=$(cat)
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
LEDGER="$PROJECT_DIR/docs/intelligence/internal/context-intelligence-ledger.md"

# Parse session metadata from stdin
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
REASON=$(echo "$INPUT" | jq -r '.reason // "unknown"')
TRANSCRIPT=$(echo "$INPUT" | jq -r '.transcript_path // "n/a"')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DATE_SLUG=$(date '+%Y-%m-%d')

# Create ledger with header if it doesn't exist
if [ ! -f "$LEDGER" ]; then
  mkdir -p "$(dirname "$LEDGER")"
  cat > "$LEDGER" << 'HEADER'
# Context Intelligence Ledger

Auto-generated session log for marketing organization continuity.
Used by `/analyst` for performance tracking and session-over-session insights.

---

HEADER
fi

# Append session entry
cat >> "$LEDGER" << EOF
### Session: $DATE_SLUG ($SESSION_ID)
- **Ended:** $TIMESTAMP
- **Reason:** $REASON
- **Transcript:** $TRANSCRIPT

---

EOF

exit 0
