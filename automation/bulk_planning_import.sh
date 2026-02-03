#!/bin/bash

# Marketing Engine Bulk Planning Import Script
# Usage: ./bulk_planning_import.sh planning_session.csv

CSV_FILE="$1"

if [ ! -f "$CSV_FILE" ]; then
    echo "❌ CSV file not found: $CSV_FILE"
    exit 1
fi

echo "🚀 Starting bulk import from $CSV_FILE"

# Skip header line, process each data row
tail -n +2 "$CSV_FILE" | while IFS=',' read -r content_id description publish_date status content_type priority target_location service_category primary_keyword content_format seasonal_relevance search_volume keyword_difficulty notes; do
    
    # Clean up fields (remove quotes and whitespace)
    description=$(echo "$description" | tr -d '"' | xargs)
    content_type=$(echo "$content_type" | tr -d '"' | xargs)
    priority=$(echo "$priority" | tr -d '"' | xargs)
    target_location=$(echo "$target_location" | tr -d '"' | xargs)
    service_category=$(echo "$service_category" | tr -d '"' | xargs)
    content_format=$(echo "$content_format" | tr -d '"' | xargs)
    seasonal_relevance=$(echo "$seasonal_relevance" | tr -d '"' | xargs)
    primary_keyword=$(echo "$primary_keyword" | tr -d '"' | xargs)
    search_volume=$(echo "$search_volume" | tr -d '"' | xargs)
    keyword_difficulty=$(echo "$keyword_difficulty" | tr -d '"' | xargs)
    notes=$(echo "$notes" | tr -d '"' | xargs)
    
    # Skip empty rows
    if [ -z "$description" ]; then
        continue
    fi
    
    echo "📝 Importing: $description"
    
    # Direct webhook call - no approval needed
    curl -s -X POST ${WEBHOOK_URL:-"https://your-webhook-url.com/webhook"} \
      -H "Content-Type: application/json" \
      -d "{
        \"body\": {
          \"operation\": \"airtable\",
          \"subOperation\": 4,
          \"baseId\": \"${AIRTABLE_BASE_ID}\",
          \"tableId\": \"${AIRTABLE_CONTENT_TABLE_ID}\",
          \"fields\": {
            \"Description\": \"$description\",
            \"Content Type\": \"$content_type\",
            \"Priority\": \"$priority\",
            \"Target Location\": \"$target_location\",
            \"Service Category\": \"$service_category\",
            \"Content Format\": \"$content_format\",
            \"Seasonal Relevance\": \"$seasonal_relevance\",
            \"Primary Keyword\": \"$primary_keyword\",
            \"Search Volume\": ${search_volume:-0},
            \"Keyword Difficulty\": \"$keyword_difficulty\",
            \"Notes\": \"$notes\"
          }
        }
      }"
    
    echo "✅ Imported: $description"
    sleep 0.5  # Small delay to avoid rate limiting
done

echo "🎉 Bulk import completed!"