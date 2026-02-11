#!/bin/bash
# Event forwarder hook — reads Claude Code hook JSON from stdin,
# enriches with timestamp, and POSTs to the command center event server.
# Designed to be fast (<100ms) and fail silently.

INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ENRICHED=$(echo "$INPUT" | jq --arg ts "$TIMESTAMP" '. + {received_at: $ts}' 2>/dev/null)

# If jq failed, use raw input
if [ -z "$ENRICHED" ]; then
  ENRICHED="$INPUT"
fi

# Fire-and-forget POST — backgrounded, never blocks Claude Code
curl -s -X POST http://localhost:3457/events \
  -H "Content-Type: application/json" \
  -d "$ENRICHED" \
  --connect-timeout 1 \
  --max-time 2 \
  > /dev/null 2>&1 &

exit 0
