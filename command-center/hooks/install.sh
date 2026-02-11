#!/bin/bash
# Install event forwarder hooks into .claude/settings.json
# Merges new hook entries WITHOUT overwriting existing SessionStart/SessionEnd hooks.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SETTINGS="$PROJECT_DIR/.claude/settings.json"
FORWARDER="$SCRIPT_DIR/event-forwarder.sh"

# Make forwarder executable
chmod +x "$FORWARDER"

if [ ! -f "$SETTINGS" ]; then
  echo "Error: $SETTINGS not found"
  exit 1
fi

echo "Installing event forwarder hooks into $SETTINGS"
echo "Forwarder script: $FORWARDER"

# Build the forwarder hook command using absolute path
HOOK_CMD="\"$FORWARDER\""

# Use jq to merge new hook entries alongside existing ones
# For each hook event type, add a new matcher group with the forwarder
TMP=$(mktemp)

jq --arg cmd "$HOOK_CMD" '
  # Helper: the forwarder entry for a given matcher
  def forwarder_entry(m):
    {
      "matcher": m,
      "hooks": [{"type": "command", "command": $cmd, "async": true}]
    };

  # Hook events that need the forwarder
  .hooks = (
    .hooks // {} |

    # SessionStart — add forwarder alongside existing startup hook
    .SessionStart = (.SessionStart // []) + [forwarder_entry("*")] |

    # SessionEnd — add forwarder alongside existing ledger hook
    .SessionEnd = (.SessionEnd // []) + [forwarder_entry("*")] |

    # New hook events (no existing entries)
    .PreToolUse = (.PreToolUse // []) + [forwarder_entry("*")] |
    .PostToolUse = (.PostToolUse // []) + [forwarder_entry("*")] |
    .PostToolUseFailure = (.PostToolUseFailure // []) + [forwarder_entry("*")] |
    .SubagentStart = (.SubagentStart // []) + [forwarder_entry("*")] |
    .SubagentStop = (.SubagentStop // []) + [forwarder_entry("*")] |
    .Stop = (.Stop // []) + [forwarder_entry("*")]
  )
' "$SETTINGS" > "$TMP"

if [ $? -eq 0 ]; then
  mv "$TMP" "$SETTINGS"
  echo "Hooks installed successfully."
  echo ""
  echo "Hook events configured:"
  echo "  - SessionStart (added alongside existing)"
  echo "  - SessionEnd (added alongside existing)"
  echo "  - PreToolUse"
  echo "  - PostToolUse"
  echo "  - PostToolUseFailure"
  echo "  - SubagentStart"
  echo "  - SubagentStop"
  echo "  - Stop"
  echo ""
  echo "All hooks are async (non-blocking)."
else
  rm -f "$TMP"
  echo "Error: Failed to merge hooks. settings.json unchanged."
  exit 1
fi
