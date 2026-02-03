#!/bin/bash

# Marketing Engine Direct Airtable Push from Claude Code
# Bypasses GUI dashboard commit feature for reliable LOCAL content submission
# Includes AUTO_INITIALIZE trigger for automated content processing

set -e

# Airtable Configuration - Load from environment or config
BASE_ID="${AIRTABLE_BASE_ID:-appYourBaseId}"
TABLE_ID="${AIRTABLE_TABLE_ID:-tblYourTableId}"
API_KEY="${AIRTABLE_API_KEY:-your_api_key}"

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
    "Target Location": "Multi-State",
    "Service Category": "General",
    "Content Format": "$content_format",
    "Seasonal Relevance": "Fall",
    "Notes": "LOCAL generation - AUTO_INITIALIZE_TRIGGER - Direct Claude Code submission with content quality validation"
EOF
)

    # Add optional fields based on content type
    if [[ -n "$keywords" ]]; then
        payload+=", \"Primary Keyword\": \"$keywords\""
    fi

    if [[ -n "$search_volume" ]]; then
        payload+=", \"Search Volume\": $search_volume"
        payload+=", \"Keyword Difficulty\": \"Medium\""
    fi

    # Note: Publication date not supported in current Airtable schema
    # Optional field removed based on API response testing

    # Close the payload
    payload+="  }
}"

    echo "🚀 Creating Airtable record..."
    echo "Content Type: $content_type"
    echo "Priority: $priority"
    echo "Description: $description"

    # Create the record
    local response=$(curl -s -X POST "https://api.airtable.com/v0/$BASE_ID/$TABLE_ID" \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d "$payload")

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

            curl -s -X PATCH "https://api.airtable.com/v0/$BASE_ID/$TABLE_ID/$record_id" \
              -H "Authorization: Bearer $API_KEY" \
              -H "Content-Type: application/json" \
              -d "$text_payload" > /dev/null

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
    cat <<EOF
Marketing Engine Direct Airtable Push - Claude Code Integration

Usage:
  $0 [OPTIONS]

Required Arguments:
  --description "Description (50+ characters for blogs)"
  --type "Blog Post|Social Media|Location Page"
  --priority "HIGH|MEDIUM|LOW"

Optional Arguments:
  --keywords "comma,separated,keywords"
  --search-volume "number"
  --publication-date "YYYY-MM-DD"
  --source-file "/path/to/content/file.md"

Examples:
  # Blog Post with full metadata
  $0 --description "Comprehensive fall service preparation guide" \\
     --type "Blog Post" \\
     --priority "HIGH" \\
     --keywords "fall service tips,seasonal maintenance,home preparation" \\
     --search-volume "8200" \\
     --publication-date "2024-09-20" \\
     --source-file "content/blog-posts/fall-guide.md"

  # Social Media Post
  $0 --description "Fall service alert for homeowners" \\
     --type "Social Media" \\
     --priority "MEDIUM" \\
     --publication-date "2024-09-18"

Notes:
  - Blog Posts require keywords and search volume for content quality
  - All content includes AUTO_INITIALIZE_TRIGGER for automated processing
  - Source files are validated for content quality guidelines (1,000+ words for blogs)
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