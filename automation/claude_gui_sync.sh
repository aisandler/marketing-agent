#!/bin/bash

# Marketing Engine Claude Code ↔ GUI Synchronization Script
# Enables real-time sync between Claude Code planning and GUI interface

SYNC_BRIDGE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/sync_bridge.js"
STATE_FILE="/tmp/marketing_planning_state.json"
SESSION_ID=""

# Initialize sync system
init_sync() {
    echo "🔄 Initializing Claude Code ↔ GUI sync system..."
    
    # Start new planning session
    SESSION_ID=$(node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        console.log(bridge.startPlanningSession());
    ")
    
    echo "✅ Planning session started: $SESSION_ID"
    echo "✅ GUI can now connect to state file: $STATE_FILE"
    
    export MARKETING_PLANNING_SESSION="$SESSION_ID"
}

# Add content records from Claude Code planning
add_content() {
    local content_json="$1"
    
    echo "📝 Adding content to synchronized state..."
    
    node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        const content = $content_json;
        const records = bridge.addContentFromClaude(content);
        console.log('✅ Added ' + content.length + ' records to GUI state');
        console.log('📊 Total records: ' + records.length);
    "
}

# Update existing content from Claude Code
update_content() {
    local updates_json="$1"
    
    echo "🔄 Updating content in synchronized state..."
    
    node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        const updates = $updates_json;
        const records = bridge.updateContentFromClaude(updates);
        console.log('✅ Updated ' + updates.length + ' records in GUI state');
        console.log('📊 Total records: ' + records.length);
    "
}

# Remove content from Claude Code
remove_content() {
    local identifiers_json="$1"
    
    echo "🗑️ Removing content from synchronized state..."
    
    node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        const identifiers = $identifiers_json;
        const records = bridge.removeContentFromClaude(identifiers);
        console.log('✅ Removed content from GUI state');
        console.log('📊 Remaining records: ' + records.length);
    "
}

# Get current state summary
get_summary() {
    echo "📊 Current Planning Session Summary:"
    echo "=================================="
    
    node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        const summary = bridge.generateSummary();
        
        console.log('Session ID: ' + summary.session_id);
        console.log('Total Records: ' + summary.total_records);
        console.log('Selected Records: ' + summary.selected_records);
        console.log('Last Updated: ' + summary.last_updated);
        console.log('');
        console.log('Content Breakdown:');
        Object.entries(summary.breakdown.by_type).forEach(([type, count]) => {
            console.log('  ' + type + ': ' + count);
        });
        console.log('');
        console.log('Priority Breakdown:');
        Object.entries(summary.breakdown.by_priority).forEach(([priority, count]) => {
            console.log('  ' + priority + ': ' + count);
        });
    "
}

# Get selected records for Airtable submission
get_selected() {
    echo "📋 Selected Records for Airtable Submission:"
    echo "=========================================="
    
    node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        const selected = bridge.getSelectedRecords();
        
        selected.forEach((record, index) => {
            console.log((index + 1) + '. ' + record.description);
            console.log('   Type: ' + (record.contentType || record.content_type));
            console.log('   Priority: ' + record.priority);
            console.log('   Location: ' + (record.targetLocation || record.target_location));
            console.log('');
        });
        
        console.log('Total Selected: ' + selected.length);
    "
}

# Submit selected records to Airtable
submit_selected() {
    echo "🚀 Submitting selected records to Airtable..."
    
    local selected_records=$(node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        const selected = bridge.getSelectedRecords();
        console.log(JSON.stringify(selected));
    ")
    
    if [ "$selected_records" = "[]" ]; then
        echo "❌ No records selected for submission"
        return 1
    fi
    
    echo "$selected_records" | jq -r '.[] | @base64' | while read -r record; do
        # Decode and format for webhook
        local decoded=$(echo "$record" | base64 -d)
        local description=$(echo "$decoded" | jq -r '.description // .Description')
        local content_type=$(echo "$decoded" | jq -r '.contentType // .content_type // "Blog Post"')
        local priority=$(echo "$decoded" | jq -r '.priority // "MEDIUM"')
        local target_location=$(echo "$decoded" | jq -r '.targetLocation // .target_location // "Multi-State"')
        local service_type=$(echo "$decoded" | jq -r '.serviceType // .service_type // "General"')
        local content_format=$(echo "$decoded" | jq -r '.contentFormat // .content_format // "WordPress Blog"')
        local seasonal_relevance=$(echo "$decoded" | jq -r '.seasonalRelevance // .seasonal_relevance // "Year-Round"')
        local primary_keyword=$(echo "$decoded" | jq -r '.primaryKeyword // .primary_keyword // ""')
        local search_volume=$(echo "$decoded" | jq -r '.searchVolume // .search_volume // 0')
        local keyword_difficulty=$(echo "$decoded" | jq -r '.keywordDifficulty // .keyword_difficulty // "Low"')
        local notes=$(echo "$decoded" | jq -r '.notes // ""')
        
        echo "📝 Submitting: $description"
        
        # Submit to Airtable via webhook
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
                \"Service Type\": \"$service_type\",
                \"Content Format\": \"$content_format\",
                \"Seasonal Relevance\": \"$seasonal_relevance\",
                \"Primary Keyword\": \"$primary_keyword\",
                \"Search Volume\": $search_volume,
                \"Keyword Difficulty\": \"$keyword_difficulty\",
                \"Notes\": \"$notes\"
              }
            }
          }" > /dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Submitted: $description"
        else
            echo "❌ Failed: $description"
        fi
        
        sleep 0.3  # Rate limiting
    done
    
    echo "🎉 Submission completed!"
}

# Export current state to CSV
export_csv() {
    local filename="${1:-marketing_planning_$(date +%Y%m%d_%H%M%S).csv}"
    
    echo "📄 Exporting to CSV: $filename"
    
    node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        const csv = bridge.exportToCSV();
        console.log(csv);
    " > "$filename"
    
    echo "✅ Exported to: $filename"
}

# Clear all records
clear_all() {
    echo "🗑️ Clearing all records from synchronized state..."
    
    node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        bridge.clearAllRecords();
        console.log('✅ All records cleared');
    "
}

# NEW CONTENT ID INTEGRATION FUNCTIONS

# Create unified content with Content ID integration
create_unified_content() {
    local content_json="$1"
    
    echo "🚀 Creating unified content with Content ID integration..."
    
    node -e "
        (async () => {
            try {
                const ClaudeGUIBridge = require('$SYNC_BRIDGE');
                const bridge = new ClaudeGUIBridge();
                const contentData = $content_json;
                const result = await bridge.createUnifiedContent(contentData);
                console.log('🎉 Unified content creation completed!');
                console.log('📂 Content ID: ' + result.contentId);
                console.log('📁 Local file: ' + (result.localFilePath || 'Not created'));
                console.log('☁️ Google Drive: ' + (result.googleDriveFolder || 'Not created'));
            } catch (error) {
                console.error('❌ Error creating unified content:', error.message);
            }
        })();
    "
}

# Get Content ID for existing content
get_content_id() {
    local content_json="$1"
    
    echo "🆔 Getting Content ID from Airtable..."
    
    node -e "
        (async () => {
            try {
                const ClaudeGUIBridge = require('$SYNC_BRIDGE');
                const bridge = new ClaudeGUIBridge();
                const contentData = $content_json;
                const result = await bridge.getNextContentId(contentData);
                console.log('✅ Content ID assigned: ' + result.contentId);
                console.log('📋 Airtable Record ID: ' + result.recordId);
            } catch (error) {
                console.error('❌ Error getting Content ID:', error.message);
            }
        })();
    "
}

# Update Airtable status for Content ID
update_content_status() {
    local content_id="$1"
    local status="$2"
    local options_json="${3:-{}}"
    
    echo "🔄 Updating Content ID $content_id status to: $status"
    
    node -e "
        (async () => {
            try {
                const ClaudeGUIBridge = require('$SYNC_BRIDGE');
                const bridge = new ClaudeGUIBridge();
                const options = $options_json;
                const result = await bridge.updateAirtableStatus('$content_id', '$status', options);
                console.log('✅ Status updated successfully');
            } catch (error) {
                console.error('❌ Error updating status:', error.message);
            }
        })();
    "
}

# Create Google Drive workspace for Content ID
create_google_workspace() {
    local content_id="$1"
    local content_type="${2:-Blog Post}"
    
    echo "📁 Creating Google Drive workspace for Content ID: $content_id"
    
    node -e "
        (async () => {
            try {
                const ClaudeGUIBridge = require('$SYNC_BRIDGE');
                const bridge = new ClaudeGUIBridge();
                const result = await bridge.createGoogleDriveWorkspace('$content_id', '$content_type');
                console.log('✅ Google Drive workspace created');
                console.log('📂 Folder ID: ' + result.folderId);
                console.log('📄 Document ID: ' + result.documentId);
            } catch (error) {
                console.error('❌ Error creating Google Drive workspace:', error.message);
            }
        })();
    "
}

# Enhanced content creation with automatic routing and metadata generation
create_content() {
    local description="$1"
    local content_type="${2:-Blog Post}"
    local generation_type="${3:-LOCAL}"
    local priority="${4:-MEDIUM}"
    local keywords="${5:-}"
    local search_volume="${6:-0}"
    local target_location="${7:-Illinois}"
    local publication_date="${8:-}"
    
    echo "🎯 Creating content: $description"
    echo "📝 Type: $content_type | Generation: $generation_type | Priority: $priority"
    
    # AUTO-GENERATE MISSING METADATA
    if [ -z "$keywords" ] && [ "$content_type" != "Social Media Post" ]; then
        echo "🔍 Auto-generating keywords for $content_type..."
        keywords="professional services, expert guidance, trusted advisors, $target_location services"
        search_volume=850
        echo "📈 Generated keywords: $keywords (Est. volume: $search_volume)"
    fi
    
    if [ -z "$publication_date" ]; then
        if [ "$content_type" = "Social Media Post" ]; then
            # Social media: 2-3 days out for review
            publication_date=$(date -d "+3 days" +"%Y-%m-%d" 2>/dev/null || date -v "+3d" +"%Y-%m-%d" 2>/dev/null || date +"%Y-%m-%d")
        else
            # Blog posts: 5-7 days out for production
            publication_date=$(date -d "+7 days" +"%Y-%m-%d" 2>/dev/null || date -v "+7d" +"%Y-%m-%d" 2>/dev/null || date +"%Y-%m-%d")
        fi
        echo "📅 Auto-generated publication date: $publication_date"
    fi
    
    if [ -n "$publication_date" ]; then
        echo "📅 Publication Date: $publication_date"
    fi
    
    # Build content JSON with keyword support, publication date, and proper SYSTEMATIC handling
    local content_json="{
        \"description\": \"$description\",
        \"contentType\": \"$content_type\",
        \"generationType\": \"$generation_type\",
        \"priority\": \"$priority\",
        \"keywords\": \"$keywords\",
        \"searchVolume\": $search_volume,
        \"targetLocation\": \"$target_location\",
        \"publicationDate\": \"$publication_date\",
        \"useContentId\": $([ "$generation_type" = "SYSTEMATIC" ] && echo "true" || echo "false"),
        \"createLocalFile\": $([ "$generation_type" = "LOCAL" ] && echo "true" || echo "false")
    }"
    
    create_unified_content "$content_json"
}

# NEW: Two-Stage Workflow Commands

# Stage 1: Plan and review generation (pre-dashboard)
plan_and_review() {
    echo "📋 CONTENT GENERATION PLAN"
    echo "=========================="
    
    node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        const plan = bridge.getGenerationPlan();
        
        if (plan.systematic.length > 0) {
            console.log('\\n✅ SYSTEMATIC (Ready for dashboard):');
            plan.systematic.forEach((record, index) => {
                console.log(\`\${index + 1}. \"\${record.description}\" - \${record.contentType} - \${record.priority}\`);
            });
        }
        
        if (plan.localReady.length > 0) {
            console.log('\\n📝 LOCAL GENERATED (Ready for dashboard):');
            plan.localReady.forEach((record, index) => {
                console.log(\`\${index + 1}. \"\${record.description}\" - \${record.contentType} - \${record.wordCount} words\`);
            });
        }
        
        if (plan.localPending.length > 0) {
            console.log('\\n⚡ LOCAL GENERATION RECOMMENDED:');
            plan.localPending.forEach((record, index) => {
                console.log(\`\${index + 1}. \"\${record.description}\" - \${record.contentType} - \${record.priority}\`);
                console.log(\`   Est: \${record.estimatedWords} words\`);
            });
        }
        
        console.log('\\n📊 SUMMARY:');
        console.log(\`Total Records: \${plan.summary.totalRecords}\`);
        console.log(\`Ready for Dashboard: \${plan.summary.readyForDashboard}\`);
        console.log(\`Pending Approval: \${plan.summary.pendingApproval}\`);
        
        if (plan.summary.pendingApproval > 0) {
            console.log(\`Estimated Generation Time: \${plan.summary.estimatedGenerationTime}\`);
        }
        
        // Return pending record IDs for approval
        const pendingIds = plan.localPending.map(r => r.id);
        console.log('\\nPENDING_IDS=' + JSON.stringify(pendingIds));
    "
}

# Stage 2: Generate approved LOCAL content
generate_approved_content() {
    local record_ids_json="$1"
    
    if [ -z "$record_ids_json" ]; then
        echo "❌ Error: Record IDs required"
        echo "Usage: $0 generate-approved '[\"id1\",\"id2\"]'"
        return 1
    fi
    
    echo "🚀 Generating approved LOCAL content..."
    
    node -e "
        (async () => {
            try {
                const ClaudeGUIBridge = require('$SYNC_BRIDGE');
                const bridge = new ClaudeGUIBridge();
                const recordIds = $record_ids_json;
                
                const results = await bridge.generateApprovedLocalContent(recordIds);
                
                const successCount = results.filter(r => r.success).length;
                const failCount = results.filter(r => !r.success).length;
                
                console.log('\\n🎉 Generation Results:');
                console.log('✅ Successful:', successCount);
                console.log('❌ Failed:', failCount);
                
                results.filter(r => r.success).forEach(result => {
                    console.log(\`📝 Generated: \${result.description} (\${result.wordCount} words)\`);
                });
                
                if (failCount > 0) {
                    console.log('\\n❌ Failed Records:');
                    results.filter(r => !r.success).forEach(result => {
                        console.log(\`   \${result.description}: \${result.error}\`);
                    });
                }
                
            } catch (error) {
                console.error('❌ Generation error:', error.message);
            }
        })();
    "
}

# Batch stage all LOCAL content from a planning session
batch_stage_session() {
    local session_date="${1:-$(date +%Y-%m-%d)}"
    
    echo "📦 BATCH STAGING SESSION CONTENT"
    echo "================================="
    echo "🗓️  Session Date: $session_date"
    
    # Find all LOCAL content files from the session
    local content_dir="content/local-generation"
    local session_files=$(find "$content_dir" -name "$session_date-*.md" -type f 2>/dev/null || true)
    
    if [ -z "$session_files" ]; then
        echo "❌ No LOCAL content found for session: $session_date"
        echo "📁 Searched in: $content_dir"
        echo "🔍 Pattern: $session_date-*.md"
        return 1
    fi
    
    local file_count=$(echo "$session_files" | wc -l)
    echo "📄 Found $file_count LOCAL content files"
    
    # Build JSON array for batch processing
    local batch_json="["
    local first_file=true
    
    echo "🔍 Processing files..."
    while IFS= read -r file_path; do
        if [ ! -f "$file_path" ]; then continue; fi
        
        # Extract metadata from filename
        local filename=$(basename "$file_path" .md)
        local description=$(echo "$filename" | sed "s/^$session_date-//" | sed 's/-/ /g' | sed 's/\b\w/\u&/g')
        
        # Extract title from markdown file PROPERLY - fixed variable scope issue
        local title=""
        if [ -f "$file_path" ]; then
            title=$(grep "^# " "$file_path" | head -1 | sed 's/^# //')
        fi
        if [ -z "$title" ]; then
            title="$description"
        fi
        
        # Determine content type from description
        local content_type="Blog Post"
        if echo "$description" | grep -qi "social\|campaign\|post\|facebook\|instagram\|linkedin"; then
            content_type="Social Media Post"
        fi
        
        # Extract keywords and search volumes from content (enhanced approach)
        local keywords=""
        local search_volume=""
        
        if command -v grep >/dev/null 2>&1; then
            # Extract primary keywords from content with search volume estimates
            local primary_keyword=""
            local keyword_list=()
            
            # Determine primary keyword and search volume based on content type and focus
            if echo "$description" | grep -qi "commercial\|leasing"; then
                primary_keyword="commercial real estate attorney"
                search_volume="800+ monthly searches"
                keyword_list+=("commercial real estate attorney" "commercial leasing lawyer" "NYC commercial real estate" "office lease attorney" "retail lease lawyer")
            elif echo "$description" | grep -qi "residential"; then
                primary_keyword="residential real estate attorney"
                search_volume="1,200+ monthly searches"
                keyword_list+=("residential real estate attorney" "home closing lawyer" "real estate closing attorney" "house purchase lawyer" "title attorney")
            elif echo "$description" | grep -qi "1031\|exchange"; then
                primary_keyword="1031 exchange attorney"
                search_volume="600+ monthly searches"
                keyword_list+=("1031 exchange attorney" "tax deferred exchange lawyer" "like-kind exchange" "investment property attorney" "1031 specialist")
            elif echo "$description" | grep -qi "estate\|planning"; then
                primary_keyword="estate planning attorney"
                search_volume="900+ monthly searches"
                keyword_list+=("estate planning attorney" "wills and trusts lawyer" "estate planning NYC" "trust attorney" "succession planning")
            elif echo "$description" | grep -qi "social\|campaign\|education"; then
                # Social media posts - use campaign-specific keywords
                primary_keyword="real estate law firm"
                search_volume="500+ monthly searches"
                keyword_list+=("real estate law firm" "property attorney" "real estate legal services" "closing attorney NYC" "real estate lawyer")
            else
                # Default professional services keywords
                primary_keyword="real estate attorney NYC"
                search_volume="2,500+ monthly searches"
                keyword_list+=("real estate attorney NYC" "real estate lawyer" "property closing attorney" "commercial real estate lawyer" "residential closing lawyer")
            fi
            
            # Build keywords string
            keywords=$(printf '%s, ' "${keyword_list[@]}" | sed 's/, $//')
        fi
        
        # Determine publication date based on content type and timing
        local publication_date=""
        if echo "$description" | grep -qi "october"; then
            publication_date="2025-10-01"
        elif echo "$description" | grep -qi "week 1"; then
            publication_date="2025-10-01"  
        elif echo "$description" | grep -qi "fall\|seasonal"; then
            publication_date="2025-09-15"
        elif echo "$description" | grep -qi "winter"; then
            publication_date="2025-11-01"
        elif echo "$description" | grep -qi "emergency\|urgent"; then
            publication_date="2025-09-08"
        else
            # Default to current month for blog posts, immediate for social media
            if [ "$content_type" = "Blog Post" ]; then
                publication_date="2025-10-15"
            else
                publication_date="2025-09-10"
            fi
        fi
        
        # Read the actual content from the markdown file
        local content_text=""
        if [ -f "$file_path" ]; then
            # Read file content and escape for JSON
            content_text=$(cat "$file_path" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
        fi
        
        # Add to JSON array
        if [ "$first_file" = true ]; then
            first_file=false
        else
            batch_json="$batch_json,"
        fi
        
        batch_json="$batch_json{
            \"id\": \"batch_$(date +%s)_$(basename "$file_path" .md | tail -c 10)\",
            \"title\": \"$title\",
            \"description\": \"$description\",
            \"contentType\": \"$content_type\",
            \"priority\": \"HIGH\",
            \"generationType\": \"LOCAL\",
            \"status\": \"📋 Content Generated\",
            \"keywords\": \"$keywords\",
            \"searchVolume\": \"$search_volume\",
            \"publicationDate\": \"$publication_date\",
            \"text\": \"$content_text\",
            \"sessionDate\": \"$session_date\",
            \"filePath\": \"$file_path\",
            \"source\": \"planning_session\"
        }"
        
        echo "   ✅ $title"
        echo "      📝 Type: $content_type"
        if [ "$content_type" = "Blog Post" ]; then
            echo "      🔍 Keywords: $keywords"
            echo "      📊 Search Volume: $search_volume"
        fi
        echo "      📅 Publication: $publication_date"
    done <<< "$session_files"
    
    batch_json="$batch_json]"
    
    echo ""
    echo "🚀 Staging $file_count content pieces to GUI..."
    
    # Use existing add_content function
    add_content "$batch_json"
    
    echo ""
    echo "🎉 BATCH STAGING COMPLETE!"
    echo "📊 Staged: $file_count content pieces from $session_date planning session"
    echo "🎯 Ready for review in GUI dashboard: http://localhost:3000/dashboard/interactive-dashboard.html"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Review content in GUI dashboard"
    echo "   2. Select pieces for publication"
    echo "   3. Use 'Submit Selected' to transfer to Airtable"
}

# Combined workflow: Plan → Approve → Generate → Dashboard
plan_and_generate() {
    echo "🎯 TWO-STAGE CONTENT WORKFLOW"
    echo "=============================="
    
    # Stage 1: Show plan
    plan_and_review
    
    # Extract pending IDs
    local pending_output=$(node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        const plan = bridge.getGenerationPlan();
        const pendingIds = plan.localPending.map(r => r.id);
        console.log(JSON.stringify(pendingIds));
    ")
    
    if [ "$pending_output" = "[]" ]; then
        echo ""
        echo "✅ All content ready for dashboard! No generation needed."
        echo "🎯 Ready to sync to dashboard for final review and commit."
        return 0
    fi
    
    # Stage 2: Interactive approval
    echo ""
    echo "🤔 Approve LOCAL content generation?"
    read -p "Generate all recommended LOCAL content? (y/n): " approval
    
    if [ "$approval" = "y" ] || [ "$approval" = "Y" ]; then
        generate_approved_content "$pending_output"
        echo ""
        echo "🎯 Content generation complete! Ready to sync to dashboard."
        echo "🚀 Next: Run dashboard to review and commit to Airtable"
    else
        echo "⏸️ Generation cancelled. Records remain in pending state."
        echo "💡 You can generate individual pieces later or run this command again."
    fi
}

# Show Content ID integration status
show_content_id_status() {
    echo "🆔 Content ID Integration Status"
    echo "==============================="
    
    node -e "
        const ClaudeGUIBridge = require('$SYNC_BRIDGE');
        const bridge = new ClaudeGUIBridge();
        const records = bridge.getAllRecords();
        
        let totalRecords = records.length;
        let withContentId = records.filter(r => r.contentId && !r.contentId.startsWith('temp_')).length;
        let withAirtableLink = records.filter(r => r.airtableRecordId).length;
        let withGoogleDrive = records.filter(r => r.googleDriveFolder).length;
        let systematic = records.filter(r => r.generationType === 'SYSTEMATIC').length;
        let local = records.filter(r => r.generationType === 'LOCAL').length;
        
        console.log('Total Records: ' + totalRecords);
        console.log('With Content ID: ' + withContentId);
        console.log('Linked to Airtable: ' + withAirtableLink);
        console.log('Google Drive Integration: ' + withGoogleDrive);
        console.log('');
        console.log('Generation Types:');
        console.log('  LOCAL: ' + local);
        console.log('  SYSTEMATIC: ' + systematic);
        console.log('');
        
        if (withContentId > 0) {
            console.log('Recent Content IDs:');
            records.filter(r => r.contentId && !r.contentId.startsWith('temp_'))
                   .slice(-5)
                   .forEach(r => {
                       console.log('  ' + r.contentId + ': ' + (r.description || 'No description'));
                   });
        }
    "
}

# Submit selected records using streamlined workflow with text content
submit_streamlined() {
    echo "🚀 Submitting selected records using streamlined workflow..."
    
    node -e "
        (async () => {
            try {
                const ClaudeGUIBridge = require('$SYNC_BRIDGE');
                const bridge = new ClaudeGUIBridge();
                const selectedRecords = bridge.getSelectedRecordsForStreamlined();
                
                if (selectedRecords.length === 0) {
                    console.log('❌ No records selected for streamlined submission');
                    return;
                }
                
                console.log('📊 Selected records for streamlined submission:', selectedRecords.length);
                
                const results = await bridge.submitToAirtableWithText(selectedRecords);
                
                const successCount = results.filter(r => r.success).length;
                const failCount = results.filter(r => !r.success).length;
                
                console.log('🎉 Streamlined submission completed!');
                console.log('✅ Successful:', successCount);
                console.log('❌ Failed:', failCount);
                
                // Show Content IDs assigned
                results.filter(r => r.success).forEach(result => {
                    console.log('📋 Content ID:', result.contentId, '-', result.description);
                });
                
            } catch (error) {
                console.error('❌ Streamlined submission error:', error.message);
            }
        })();
    "
}

# Watch for GUI changes (for debugging)
watch_changes() {
    echo "👀 Watching for GUI changes... (Press Ctrl+C to stop)"
    
    while true; do
        if [ -f "$STATE_FILE" ]; then
            local last_updated=$(jq -r '.last_updated' "$STATE_FILE" 2>/dev/null)
            echo "$(date): Last updated: $last_updated"
        fi
        sleep 2
    done
}

# Help function
show_help() {
    echo "Marketing Engine Claude Code ↔ GUI Synchronization Script"
    echo "=============================================="
    echo ""
    echo "Usage: $0 [command] [arguments]"
    echo ""
    echo "Basic Commands:"
    echo "  init                    Initialize sync system"
    echo "  summary                 Show current session summary"
    echo "  selected                Show selected records"
    echo "  submit                  Submit selected records to Airtable"
    echo "  export [filename]       Export to CSV"
    echo "  clear                   Clear all records"
    echo "  watch                   Watch for GUI changes"
    echo ""
    echo "Content Management:"
    echo "  add '[json_array]'      Add content from Claude Code"
    echo "  update '[json_array]'   Update existing content"
    echo "  remove '[json_array]'   Remove content by identifiers"
    echo ""
    echo "NEW: Two-Stage Content Workflow:"
    echo "  plan-and-generate       Complete two-stage workflow (recommended)"
    echo "  plan-and-review         Stage 1: Show generation plan for approval"
    echo "  generate-approved '[ids]' Stage 2: Generate approved LOCAL content"
    echo ""
    echo "Content ID Integration:"
    echo "  create \"description\" [type] [generation] [priority] [keywords] [search_volume] [location] [publication_date]"
    echo "                          Create unified content with auto-routing, SEO data, and publication scheduling"
    echo "  get-id '[json]'         Get Content ID from Airtable"
    echo "  update-status \"id\" \"status\" '[options]'"
    echo "                          Update Content ID status in Airtable"
    echo "  create-workspace \"id\" [type]"
    echo "                          Create Google Drive workspace for Content ID"
    echo "  content-id-status       Show Content ID integration status"
    echo "  unified '[json]'        Create unified content with full integration"
    echo "  streamlined-submit      Submit selected records with text content and auto-initialization"
    echo ""
    echo "Examples:"
    echo "  $0 init"
    echo "  $0 plan-and-generate    # RECOMMENDED: Complete two-stage workflow"
    echo "  $0 plan-and-review      # Stage 1: Review generation plan"
    echo "  $0 create \"Fall Ant Prevention Guide\" \"Blog Post\" \"SYSTEMATIC\" \"HIGH\""
    echo "  $0 get-id '{\"description\":\"Test Content\",\"contentType\":\"Blog Post\"}'"
    echo "  $0 update-status \"C123\" \"🔄 In Progress\" '{\"notes\":\"Started work\"}'"
    echo "  $0 content-id-status"
    echo "  $0 summary"
}

# Main command dispatcher
case "$1" in
    "init")
        init_sync
        ;;
    "add")
        if [ -z "$2" ]; then
            echo "❌ Error: Content JSON required"
            echo "Usage: $0 add '[{\"description\":\"Content\",\"contentType\":\"Blog Post\"}]'"
            exit 1
        fi
        add_content "$2"
        ;;
    "update")
        if [ -z "$2" ]; then
            echo "❌ Error: Updates JSON required"
            exit 1
        fi
        update_content "$2"
        ;;
    "remove")
        if [ -z "$2" ]; then
            echo "❌ Error: Identifiers JSON required"
            exit 1
        fi
        remove_content "$2"
        ;;
    "summary")
        get_summary
        ;;
    "selected")
        get_selected
        ;;
    "submit")
        submit_selected
        ;;
    "export")
        export_csv "$2"
        ;;
    "clear")
        clear_all
        ;;
    "watch")
        watch_changes
        ;;
    # NEW CONTENT ID INTEGRATION COMMANDS
    "create")
        if [ -z "$2" ]; then
            echo "❌ Error: Content description required"
            echo "Usage: $0 create \"description\" [type] [generation] [priority]"
            exit 1
        fi
        create_content "$2" "$3" "$4" "$5" "$6" "$7" "$8" "$9"
        ;;
    "get-id")
        if [ -z "$2" ]; then
            echo "❌ Error: Content JSON required"
            echo "Usage: $0 get-id '{\"description\":\"Content\",\"contentType\":\"Blog Post\"}'"
            exit 1
        fi
        get_content_id "$2"
        ;;
    "update-status")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "❌ Error: Content ID and status required"
            echo "Usage: $0 update-status \"content_id\" \"status\" '[options_json]'"
            exit 1
        fi
        update_content_status "$2" "$3" "$4"
        ;;
    "create-workspace")
        if [ -z "$2" ]; then
            echo "❌ Error: Content ID required"
            echo "Usage: $0 create-workspace \"content_id\" [content_type]"
            exit 1
        fi
        create_google_workspace "$2" "$3"
        ;;
    "content-id-status")
        show_content_id_status
        ;;
    "streamlined-submit")
        submit_streamlined
        ;;
    "unified")
        if [ -z "$2" ]; then
            echo "❌ Error: Content JSON required"
            echo "Usage: $0 unified '{\"description\":\"Content\",\"contentType\":\"Blog Post\"}'"
            exit 1
        fi
        create_unified_content "$2"
        ;;
    # NEW: Two-Stage Workflow Commands
    "plan-and-generate")
        plan_and_generate
        ;;
    "plan-and-review")
        plan_and_review
        ;;
    "generate-approved")
        if [ -z "$2" ]; then
            echo "❌ Error: Record IDs JSON required"
            echo "Usage: $0 generate-approved '[\"id1\",\"id2\"]'"
            exit 1
        fi
        generate_approved_content "$2"
        ;;
    # NEW: Session Content Management
    "batch-stage-session")
        batch_stage_session "$2"
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        show_help
        exit 1
        ;;
esac