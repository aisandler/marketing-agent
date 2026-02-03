#!/bin/bash
# SessionStart hook: Check if brand onboarding has been completed
# If onboarding IS complete, report intelligence freshness status
# Outputs context hint to Claude if client-context/ is not populated

INPUT=$(cat)
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Check if client-context/brand/ exists and has content (the key onboarding output)
if [ ! -d "$PROJECT_DIR/client-context/brand" ] || [ -z "$(ls -A "$PROJECT_DIR/client-context/brand" 2>/dev/null)" ]; then
  jq -n '{
    "hookSpecificOutput": {
      "hookEventName": "SessionStart",
      "additionalContext": "ONBOARDING NEEDED: This project has not been configured for a brand yet. The client-context/brand/ directory is empty or missing. Recommend running /onboard to set up the complete brand architecture (business profile, brand voice, competitive analysis, keyword strategy). Mention this to the user at the start of the session."
    }
  }'
  exit 0
fi

# --- Brand is configured: check intelligence freshness ---

NOW_EPOCH=$(date +%s)
STALE_THRESHOLD=30  # days for intelligence files
REPORT_THRESHOLD=14 # days for website reports
CONTEXT_PARTS=""
STALE_FILES=""

# Read last 3 entries from context intelligence ledger
LEDGER="$PROJECT_DIR/docs/intelligence/internal/context-intelligence-ledger.md"
if [ -f "$LEDGER" ]; then
  # Extract last 3 session blocks (each starts with "### Session:")
  RECENT_SESSIONS=$(grep -A3 "^### Session:" "$LEDGER" | tail -20)
  if [ -n "$RECENT_SESSIONS" ]; then
    CONTEXT_PARTS="RECENT SESSIONS:\n$RECENT_SESSIONS"
  fi
fi

# Check freshness of each intelligence file
INTEL_FILES=(
  "competitive-intelligence-tracking.md"
  "performance-analysis-history.md"
  "seasonal-patterns.md"
)

for FILE in "${INTEL_FILES[@]}"; do
  FILEPATH="$PROJECT_DIR/docs/intelligence/internal/$FILE"
  if [ ! -f "$FILEPATH" ]; then
    STALE_FILES="$STALE_FILES\n- $FILE: Missing"
    continue
  fi

  LAST_UPDATED=$(grep -m1 '^\*\*Last Updated:\*\*' "$FILEPATH" | sed 's/\*\*Last Updated:\*\* *//')
  if [ -z "$LAST_UPDATED" ] || [ "$LAST_UPDATED" = "Never" ]; then
    STALE_FILES="$STALE_FILES\n- $FILE: Never updated"
    continue
  fi

  # Parse the date (macOS date -j -f)
  FILE_EPOCH=$(date -j -f "%Y-%m-%d" "$LAST_UPDATED" +%s 2>/dev/null || echo "0")
  if [ "$FILE_EPOCH" != "0" ]; then
    AGE_DAYS=$(( (NOW_EPOCH - FILE_EPOCH) / 86400 ))
    if [ "$AGE_DAYS" -gt "$STALE_THRESHOLD" ]; then
      STALE_FILES="$STALE_FILES\n- $FILE: Last updated $LAST_UPDATED ($AGE_DAYS days ago - STALE)"
    fi
  fi
done

# Check website report freshness
REPORT_STATE="$PROJECT_DIR/.website-report-state.json"
if [ -f "$REPORT_STATE" ]; then
  LAST_REPORT=$(jq -r '.lastRunDate // "unknown"' "$REPORT_STATE")
  if [ "$LAST_REPORT" != "unknown" ]; then
    REPORT_EPOCH=$(date -j -f "%Y-%m-%d" "$LAST_REPORT" +%s 2>/dev/null || echo "0")
    if [ "$REPORT_EPOCH" != "0" ]; then
      REPORT_AGE=$(( (NOW_EPOCH - REPORT_EPOCH) / 86400 ))
      if [ "$REPORT_AGE" -gt "$REPORT_THRESHOLD" ]; then
        STALE_FILES="$STALE_FILES\n- Website report: Last run $LAST_REPORT ($REPORT_AGE days ago - consider running /report)"
      fi
    fi
  fi
else
  STALE_FILES="$STALE_FILES\n- Website report: Never run (use /report-setup then /report)"
fi

# Build output if there's anything to report
if [ -n "$CONTEXT_PARTS" ] || [ -n "$STALE_FILES" ]; then
  OUTPUT="INTELLIGENCE STATUS:"
  if [ -n "$CONTEXT_PARTS" ]; then
    OUTPUT="$OUTPUT\n$CONTEXT_PARTS"
  fi
  if [ -n "$STALE_FILES" ]; then
    OUTPUT="$OUTPUT\nSTALE OR MISSING INTELLIGENCE FILES:$STALE_FILES\nConsider running /analyst to refresh intelligence data."
  fi

  # Escape for JSON
  JSON_OUTPUT=$(printf '%b' "$OUTPUT" | jq -Rs .)

  jq -n --argjson ctx "$JSON_OUTPUT" '{
    "hookSpecificOutput": {
      "hookEventName": "SessionStart",
      "additionalContext": $ctx
    }
  }'
else
  exit 0
fi
