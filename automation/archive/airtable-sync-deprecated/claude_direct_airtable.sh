#!/bin/bash

# Client Direct Airtable Push from Claude Code
# Bypasses GUI dashboard commit feature for reliable LOCAL content submission
# Includes AUTO_INITIALIZE trigger for automated content processing

set -e

# Load client configuration
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/config_loader.sh"
load_client_config
validate_config

# Airtable Configuration from client config
BASE_ID="$AIRTABLE_BASE_ID"
TABLE_ID="$AIRTABLE_TABLE_ID"

# Function to push LOCAL content directly to Airtable
push_to_airtable() {
    local description="$1"
    local content_type="$2"
    local priority="$3"
    local keywords="$4"
    local search_volume="$5"
    local publication_date="$6"
    local source_file="$7"

    # Content Quality Validation
    if [[ "$content_type" == "Blog Post" ]]; then
        if [[ ${#description} -lt 50 ]]; then
            echo "❌ CONTENT QUALITY ERROR: Blog post descriptions must be 50+ characters"
            echo "Current: ${#description} characters"
            exit 1
        fi

        if [[ -z "$keywords" || -z "$search_volume" ]]; then
            echo "❌ CONTENT QUALITY ERROR: Blog posts require keywords and search volume"
            exit 1
        fi

        if [[ -n "$source_file" && -f "$source_file" ]]; then
            local word_count=$(wc -w < "$source_file" | tr -d ' ')
            if (( word_count < 1000 )); then
                echo "❌ CONTENT QUALITY ERROR: Blog posts must be 1,000+ words (current: $word_count)"
                exit 1
            fi
        fi
    fi

    # Determine content format based on type
    local content_format
    case "$content_type" in
        "Blog Post")
            content_format="WordPress Blog"
            ;;
        "Social Media")
            content_format="Facebook Post"
            ;;
        "Location Page")
            content_format="WordPress Page"
            ;;
        *)
            content_format="General"
            ;;
    esac

    # Create base record payload
    local payload=$(cat <<EOF
{
  "fields": {
    "Description": "$description",
    "Content Type": "$content_type",
    "Priority": "$priority",
    "Target Location": "$(get_multi_state_reference)",
    "Service Category": "General",
    "Content Format": "$content_format",
    "Seasonal Relevance": "Fall",
    "Notes": "LOCAL generation - AUTO_INITIALIZE_TRIGGER - Direct Claude Code submission with content quality validation"
EOF

    # Add optional fields based on content type
    if [[ -n "$keywords" ]]; then
        payload+=", \"Primary Keyword\": \"$keywords\""
    fi

    if [[ -n "$search_volume" ]]; then
        payload+=", \"Search Volume\": $search_volume"
        payload+=", \"Keyword Difficulty\": \"Medium\""
    fi

    if [[ -n "$publication_date" ]]; then
        payload+=", \"Publication Date\": \"$publication_date\""
    fi

    # Close the payload
    payload+="  }
}"

    echo "🚀 Creating Airtable record..."
    echo "Content Type: $content_type"
    echo "Priority: $priority"
    echo "Description: $description"

    # Create the record using webhook
    local webhook_payload=$(cat <<EOF
{
  "operation": "airtable",
  "subOperation": 4,
  "baseId": "$BASE_ID",
  "tableId": "$TABLE_ID",
  $payload
}
EOF
    )

    local response=$(curl -s -X POST "$AIRTABLE_WEBHOOK_URL" \
      -H "Content-Type: application/json" \
      -d "$webhook_payload")

    # Extract record ID from response
    local record_id=$(echo "$response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4 | head -1)

    if [[ -n "$record_id" ]]; then
        echo "✅ Record created successfully: $record_id"

        # If source file provided, add text content
        if [[ -n "$source_file" && -f "$source_file" ]]; then
            echo "📄 Adding text content from: $source_file"

            # Escape content for JSON
            local escaped_content=$(cat "$source_file" | sed 's/"/\\"/g' | sed 's/$/\\n/g' | tr -d '\n' | sed 's/\\n$//')

            # Update record with text content
            local text_payload="{\"fields\": {\"Text\": \"$escaped_content\"}}"

            # Update via webhook for text content
            local text_webhook_payload=$(cat <<EOF
{
  "operation": "airtable",
  "subOperation": 5,
  "baseId": "$BASE_ID",
  "tableId": "$TABLE_ID",
  "recordId": "$record_id",
  "fields": {"Text": "$escaped_content"}
}
EOF
            )

            curl -s -X POST "$AIRTABLE_WEBHOOK_URL" \
              -H "Content-Type: application/json" \
              -d "$text_webhook_payload" > /dev/null

            echo "✅ Text content added successfully"
        fi

        echo ""
        echo "🎯 DIRECT SUBMISSION COMPLETE"
        echo "Record ID: $record_id"
        echo "AUTO_INITIALIZE triggered - Airtable automation will process"
        echo ""

    else
        echo "❌ Failed to create record"
        echo "Response: $response"
        exit 1
    fi
}

# Usage function
show_usage() {
    local industry_content=$(get_industry_content)
    cat <<EOF
$CLIENT_NAME Direct Airtable Push - Claude Code Integration

Usage:
  $0 [OPTIONS]

Required Arguments:
  --description "Description (15+ words for blogs)"
  --type "Blog Post|Social Media|Location Page"
  --priority "HIGH|MEDIUM|LOW"

Optional Arguments:
  --keywords "comma,separated,keywords"
  --search-volume "number"
  --publication-date "YYYY-MM-DD"
  --source-file "/path/to/content/file.md"

Examples:
  # Blog Post with full metadata
  $0 --description "Comprehensive fall $industry_content guide" \\
     --type "Blog Post" \\
     --priority "HIGH" \\
     --keywords "fall $industry_content prevention,maintenance,tips" \\
     --search-volume "8200" \\
     --publication-date "2024-09-20" \\
     --source-file "content/blog-posts/fall-guide.md"

  # Social Media Post
  $0 --description "Fall $industry_content alert for homeowners" \\
     --type "Social Media" \\
     --priority "MEDIUM" \\
     --publication-date "2024-09-18"

Notes:
  - Blog Posts require keywords and search volume for quality compliance
  - All content includes AUTO_INITIALIZE_TRIGGER for automated processing
  - Source files are validated for content guidelines (1,000+ words for blogs)
EOF
}

# Parse command line arguments
DESCRIPTION=""
CONTENT_TYPE=""
PRIORITY=""
KEYWORDS=""
SEARCH_VOLUME=""
PUBLICATION_DATE=""
SOURCE_FILE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --description)
            DESCRIPTION="$2"
            shift 2
            ;;
        --type)
            CONTENT_TYPE="$2"
            shift 2
            ;;
        --priority)
            PRIORITY="$2"
            shift 2
            ;;
        --keywords)
            KEYWORDS="$2"
            shift 2
            ;;
        --search-volume)
            SEARCH_VOLUME="$2"
            shift 2
            ;;
        --publication-date)
            PUBLICATION_DATE="$2"
            shift 2
            ;;
        --source-file)
            SOURCE_FILE="$2"
            shift 2
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate required arguments
if [[ -z "$DESCRIPTION" || -z "$CONTENT_TYPE" || -z "$PRIORITY" ]]; then
    echo "❌ Missing required arguments"
    show_usage
    exit 1
fi

# Call the main function
push_to_airtable "$DESCRIPTION" "$CONTENT_TYPE" "$PRIORITY" "$KEYWORDS" "$SEARCH_VOLUME" "$PUBLICATION_DATE" "$SOURCE_FILE"