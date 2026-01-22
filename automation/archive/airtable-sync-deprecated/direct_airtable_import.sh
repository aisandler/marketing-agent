#!/bin/bash

# Client Direct Airtable Import Script
# Usage: ./direct_airtable_import.sh "Description" "Content Type" "Priority" "Location" "Service Category" "Format" "Season" "Keyword" "Volume" "Difficulty" "Notes"

# Load client configuration
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/config_loader.sh"
load_client_config
validate_config

DESCRIPTION="$1"
CONTENT_TYPE="$2"
PRIORITY="$3"
TARGET_LOCATION="$4"
SERVICE_CATEGORY="$5"
CONTENT_FORMAT="$6"
SEASONAL_RELEVANCE="$7"
PRIMARY_KEYWORD="$8"
SEARCH_VOLUME="$9"
KEYWORD_DIFFICULTY="${10}"
NOTES="${11}"

# Direct webhook call - no approval needed
curl -X POST "$AIRTABLE_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"body\": {
      \"operation\": \"airtable\",
      \"subOperation\": 4,
      \"baseId\": \"$AIRTABLE_BASE_ID\",
      \"tableId\": \"$AIRTABLE_TABLE_ID\",
      \"fields\": {
        \"Description\": \"$DESCRIPTION\",
        \"Content Type\": \"$CONTENT_TYPE\",
        \"Priority\": \"$PRIORITY\",
        \"Target Location\": \"$TARGET_LOCATION\",
        \"Service Category\": \"$SERVICE_CATEGORY\",
        \"Content Format\": \"$CONTENT_FORMAT\",
        \"Seasonal Relevance\": \"$SEASONAL_RELEVANCE\",
        \"Primary Keyword\": \"$PRIMARY_KEYWORD\",
        \"Search Volume\": $SEARCH_VOLUME,
        \"Keyword Difficulty\": \"$KEYWORD_DIFFICULTY\",
        \"Notes\": \"$NOTES\"
      }
    }
  }"

echo "✅ Record sent to Airtable: $DESCRIPTION"