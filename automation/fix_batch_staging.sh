#!/bin/bash

# Fixed batch staging function

# Load client configuration
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/config_loader.sh"
load_client_config
validate_config
batch_stage_session_fixed() {
    local session_date="${1:-$(date +%Y-%m-%d)}"
    
    echo "📦 FIXED BATCH STAGING SESSION CONTENT"
    echo "================================="
    echo "🗓️  Session Date: $session_date"
    
    # Find all LOCAL content files from the session
    local content_dir="content/local-generation"
    local session_files=$(find "$content_dir" -name "$session_date-*.md" -type f 2>/dev/null || true)
    
    if [ -z "$session_files" ]; then
        echo "❌ No LOCAL content found for session: $session_date"
        return 1
    fi
    
    local file_count=$(echo "$session_files" | wc -l)
    echo "📄 Found $file_count LOCAL content files"
    
    # Build JSON array
    local batch_json="["
    local first_file=true
    
    echo "🔍 Processing files..."
    while IFS= read -r file_path; do
        if [ ! -f "$file_path" ]; then continue; fi
        
        # Extract metadata from filename
        local filename=$(basename "$file_path" .md)
        local description=$(echo "$filename" | sed "s/^$session_date-//" | sed 's/-/ /g')
        
        # Extract title from markdown file PROPERLY
        local title=""
        if [ -f "$file_path" ]; then
            title=$(grep "^# " "$file_path" | head -1 | sed 's/^# //')
        fi
        if [ -z "$title" ]; then
            title="$description"
        fi
        
        # Determine content type
        local content_type="Blog Post"
        if echo "$description" | grep -qi "social\|campaign\|post\|facebook\|instagram\|linkedin"; then
            content_type="Social Media Post"
        elif echo "$description" | grep -qi "location\|page"; then
            content_type="Location Page"
        fi
        
        # Generate keywords based on industry and location
        local keywords=""
        local search_volume=""
        local industry_content=$(get_industry_content)
        if [ "$content_type" = "Blog Post" ] || [ "$content_type" = "Location Page" ]; then
            # Generate industry-appropriate keywords
            keywords="$industry_content $STATE, professional $industry_content, reliable $industry_content, $industry_content services"
            search_volume="1,200+ monthly searches"
        fi
        
        # Set proper publication date in YYYY-MM-DD format
        local publication_date=""
        if echo "$description" | grep -qi "emergency\|urgent"; then
            publication_date="2025-09-08"
        elif echo "$description" | grep -qi "seasonal\|fall\|spring\|summer\|winter"; then
            publication_date="2025-09-15"
        elif echo "$description" | grep -qi "social\|campaign"; then
            publication_date="2025-09-10"
        else
            publication_date="2025-09-30"
        fi
        
        # Add to JSON array
        if [ "$first_file" = true ]; then
            first_file=false
        else
            batch_json="$batch_json,"
        fi
        
        # Properly escape the title for JSON
        title=$(echo "$title" | sed 's/"/\\"/g')
        description=$(echo "$description" | sed 's/"/\\"/g')
        
        batch_json="$batch_json{
            \"id\": \"batch_$(date +%s)_$(echo "$filename" | tail -c 10)\",
            \"title\": \"$title\",
            \"description\": \"$description\",
            \"contentType\": \"$content_type\",
            \"priority\": \"HIGH\",
            \"generationType\": \"LOCAL\",
            \"status\": \"📋 Content Generated\",
            \"keywords\": \"$keywords\",
            \"searchVolume\": \"$search_volume\",
            \"publicationDate\": \"$publication_date\",
            \"targetPublishDate\": \"$publication_date\",
            \"sessionDate\": \"$session_date\",
            \"filePath\": \"$file_path\",
            \"source\": \"planning_session\"
        }"
        
        echo "   ✅ $title"
        echo "      📝 Type: $content_type"
        if [ -n "$keywords" ]; then
            echo "      🔍 Keywords: ${keywords:0:50}..."
        fi
        echo "      📅 Publication: $publication_date"
    done <<< "$session_files"
    
    batch_json="$batch_json]"
    
    echo ""
    echo "🚀 Staging $file_count content pieces to API..."
    
    # Send to API
    curl -X POST http://localhost:3002/api/planning-state \
        -H "Content-Type: application/json" \
        -d "{\"action\":\"add_multiple\",\"records\":$batch_json}" \
        -s > /dev/null
    
    echo "✅ Content staged successfully!"
    echo ""
    dashboard_file="$(get_dashboard_filename)"
    echo "📊 Dashboard: http://localhost:3000/dashboard/$dashboard_file"
}

# Run the fixed function
batch_stage_session_fixed "$1"