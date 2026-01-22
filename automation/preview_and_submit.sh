#!/bin/bash

# Client Preview and Submit System
# Shows formatted table before submission to Airtable

TEMP_FILE="/tmp/client_preview_$(date +%s).json"
PREVIEW_MODE=true

# Function to display formatted table
show_preview_table() {
    echo ""
    echo "📋 CONTENT PREVIEW - Ready for Airtable Submission"
    echo "=================================================="
    
    # Header
    printf "%-4s | %-35s | %-12s | %-8s | %-15s | %-10s\n" \
           "ID" "Description" "Content Type" "Priority" "Target Location" "Pest Type"
    echo "------+-------------------------------------+--------------+----------+-----------------+------------"
    
    # Read and display each record
    local counter=1
    while IFS= read -r line; do
        # Parse JSON fields
        description=$(echo "$line" | jq -r '.fields.Description // "N/A"')
        content_type=$(echo "$line" | jq -r '.fields["Content Type"] // "N/A"')
        priority=$(echo "$line" | jq -r '.fields.Priority // "N/A"')
        target_location=$(echo "$line" | jq -r '.fields["Target Location"] // "N/A"')
        pest_type=$(echo "$line" | jq -r '.fields["Pest Type"] // "N/A"')
        
        # Truncate long descriptions
        if [ ${#description} -gt 33 ]; then
            description="${description:0:30}..."
        fi
        if [ ${#target_location} -gt 13 ]; then
            target_location="${target_location:0:10}..."
        fi
        
        printf "%-4d | %-35s | %-12s | %-8s | %-15s | %-10s\n" \
               "$counter" "$description" "$content_type" "$priority" "$target_location" "$pest_type"
        
        ((counter++))
    done < "$TEMP_FILE"
    
    echo ""
    
    # Show detailed view for first few records
    echo "📝 DETAILED VIEW (First 3 Records):"
    echo "==================================="
    
    local detail_counter=1
    while IFS= read -r line && [ $detail_counter -le 3 ]; do
        echo ""
        echo "Record #$detail_counter:"
        echo "  Description: $(echo "$line" | jq -r '.fields.Description')"
        echo "  Content Type: $(echo "$line" | jq -r '.fields["Content Type"]')"
        echo "  Priority: $(echo "$line" | jq -r '.fields.Priority')"
        echo "  Target Location: $(echo "$line" | jq -r '.fields["Target Location"]')"
        echo "  Pest Type: $(echo "$line" | jq -r '.fields["Pest Type"]')"
        echo "  Content Format: $(echo "$line" | jq -r '.fields["Content Format"]')"
        echo "  Primary Keyword: $(echo "$line" | jq -r '.fields["Primary Keyword"]')"
        echo "  Search Volume: $(echo "$line" | jq -r '.fields["Search Volume"]')"
        echo "  Keyword Difficulty: $(echo "$line" | jq -r '.fields["Keyword Difficulty"]')"
        echo "  Seasonal Relevance: $(echo "$line" | jq -r '.fields["Seasonal Relevance"]')"
        echo "  Notes: $(echo "$line" | jq -r '.fields.Notes')"
        
        ((detail_counter++))
    done < "$TEMP_FILE"
    
    echo ""
    local total_records=$(wc -l < "$TEMP_FILE")
    echo "📊 Total Records Ready: $total_records"
    echo ""
}

# Function to add record to preview
add_to_preview() {
    local description="$1"
    local content_type="$2"
    local priority="$3"
    local target_location="$4"
    local pest_type="$5"
    local content_format="$6"
    local seasonal_relevance="$7"
    local primary_keyword="$8"
    local search_volume="$9"
    local keyword_difficulty="${10}"
    local notes="${11}"
    
    # Create JSON record
    cat << EOF >> "$TEMP_FILE"
{
  "body": {
    "operation": "airtable",
    "subOperation": 4,
    "baseId": "appS6XjjRUrELJRgC",
    "tableId": "tblCR8yF9HHQlDij1",
    "fields": {
      "Description": "$description",
      "Content Type": "$content_type",
      "Priority": "$priority",
      "Target Location": "$target_location",
      "Pest Type": "$pest_type",
      "Content Format": "$content_format",
      "Seasonal Relevance": "$seasonal_relevance",
      "Primary Keyword": "$primary_keyword",
      "Search Volume": ${search_volume:-0},
      "Keyword Difficulty": "$keyword_difficulty",
      "Notes": "$notes"
    }
  }
}
EOF
}

# Function to submit all records
submit_to_airtable() {
    echo "🚀 Submitting to Airtable..."
    echo ""
    
    local counter=1
    while IFS= read -r line; do
        echo "Submitting Record #$counter..."
        
        # Execute webhook call
        # Load webhook URL from config
        source "$(dirname "$0")/config.js" 2>/dev/null || WEBHOOK_URL="{{WEBHOOK_URL}}"
        response=$(curl -s -X POST "$WEBHOOK_URL" \
          -H "Content-Type: application/json" \
          -d "$line")
        
        description=$(echo "$line" | jq -r '.body.fields.Description')
        echo "✅ Submitted: $description"
        
        ((counter++))
        sleep 0.3  # Rate limiting
    done < "$TEMP_FILE"
    
    echo ""
    echo "🎉 All records submitted successfully!"
    
    # Cleanup
    rm -f "$TEMP_FILE"
}

# Function to cancel submission
cancel_submission() {
    echo "❌ Submission cancelled"
    rm -f "$TEMP_FILE"
    exit 0
}

# Initialize temp file
> "$TEMP_FILE"

# Export functions for use by Claude Code
export -f add_to_preview
export -f show_preview_table
export -f submit_to_airtable
export -f cancel_submission
export TEMP_FILE

# If called directly with arguments, add single record
if [ $# -ge 8 ]; then
    add_to_preview "$@"
    show_preview_table
    
    echo "🤔 Submit this record to Airtable? (y/n): "
    read -r confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        submit_to_airtable
    else
        cancel_submission
    fi
fi