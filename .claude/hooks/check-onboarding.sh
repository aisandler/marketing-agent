#!/bin/bash
# SessionStart hook: Check if brand onboarding has been completed
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
else
  exit 0
fi
