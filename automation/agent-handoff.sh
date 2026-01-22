#!/bin/bash

# Agent Handoff Management Script
# BMAD-inspired context preservation between marketing agents

set -euo pipefail

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HANDOFFS_DIR="$PROJECT_ROOT/client-context/handoffs"
SESSION_DIR="$HANDOFFS_DIR/session-state"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Usage function
usage() {
    cat << EOF
Usage: $0 <command> [options]

Commands:
    create <source> <target>    Create new handoff context
    validate <source> <target>  Validate handoff completeness
    activate <source> <target>  Activate handoff for agent transition
    archive <source> <target>   Archive completed handoff
    list                        List all available handoffs
    status                      Show current handoff status

Examples:
    $0 create cmo content       Create CMO to Content Creator handoff
    $0 validate analyst cmo     Validate Analyst to CMO handoff
    $0 activate onboard operations  Activate onboarding handoff
    $0 list                     Show all handoff templates

EOF
}

# Create handoff context
create_handoff() {
    local source="$1"
    local target="$2"
    local handoff_key="${source}-to-${target}"
    local handoff_dir="$HANDOFFS_DIR/$handoff_key"

    log "Creating handoff context: $handoff_key"

    if [[ ! -d "$handoff_dir" ]]; then
        error "Handoff template not found: $handoff_key"
        echo "Available handoffs:"
        find "$HANDOFFS_DIR" -type d -mindepth 1 -maxdepth 1 -exec basename {} \;
        exit 1
    fi

    local template_file="$handoff_dir/handoff-template.json"
    local active_file="$handoff_dir/active-handoff.json"

    if [[ ! -f "$template_file" ]]; then
        error "Template file not found: $template_file"
        exit 1
    fi

    # Create active handoff from template
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local expires_at=$(date -u -d "+24 hours" +"%Y-%m-%dT%H:%M:%SZ")

    # Copy template and update metadata
    jq --arg timestamp "$timestamp" \
       --arg created_by "${USER:-system}" \
       --arg expires_at "$expires_at" \
       '.timestamp = $timestamp | .created_by = $created_by | .expires_at = $expires_at | .validation_status = "pending"' \
       "$template_file" > "$active_file"

    success "Created active handoff: $handoff_key"
    log "Location: $active_file"
    log "Expires: $expires_at"
}

# Validate handoff completeness
validate_handoff() {
    local source="$1"
    local target="$2"
    local handoff_key="${source}-to-${target}"
    local handoff_dir="$HANDOFFS_DIR/$handoff_key"
    local active_file="$handoff_dir/active-handoff.json"

    log "Validating handoff: $handoff_key"

    if [[ ! -f "$active_file" ]]; then
        error "No active handoff found: $handoff_key"
        echo "Use: $0 create $source $target"
        exit 1
    fi

    # Check if handoff is expired
    local expires_at=$(jq -r '.expires_at' "$active_file")
    local current_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    if [[ "$current_time" > "$expires_at" ]]; then
        warning "Handoff has expired: $expires_at"
    fi

    # Validate structure based on handoff type
    local handoff_type=$(jq -r '.handoff_type' "$active_file")

    case "$handoff_type" in
        "cmo_to_content")
            validate_cmo_to_content "$active_file"
            ;;
        "analyst_to_cmo")
            validate_analyst_to_cmo "$active_file"
            ;;
        "onboard_to_operations")
            validate_onboard_to_operations "$active_file"
            ;;
        *)
            warning "Unknown handoff type: $handoff_type"
            ;;
    esac

    success "Handoff validation completed"
}

# Validate CMO to Content handoff
validate_cmo_to_content() {
    local handoff_file="$1"
    local score=0
    local max_score=10

    log "Validating CMO to Content handoff..."

    # Check required fields
    local primary_goal=$(jq -r '.strategic_context.campaign_objectives.primary_goal' "$handoff_file")
    if [[ "$primary_goal" != "null" && "$primary_goal" != "" ]]; then
        ((score++))
        echo "✅ Campaign objectives defined"
    else
        echo "❌ Campaign objectives missing"
    fi

    local brand_voice=$(jq -r '.strategic_context.brand_voice.tone_attributes | length' "$handoff_file")
    if [[ "$brand_voice" -gt 0 ]]; then
        ((score++))
        echo "✅ Brand voice attributes defined"
    else
        echo "❌ Brand voice attributes missing"
    fi

    local content_types=$(jq -r '.execution_guidance.content_requirements.formats | length' "$handoff_file")
    if [[ "$content_types" -gt 0 ]]; then
        ((score++))
        echo "✅ Content requirements specified"
    else
        echo "❌ Content requirements missing"
    fi

    # Update validation status
    local percentage=$((score * 100 / max_score))
    local status="incomplete"

    if [[ $percentage -ge 80 ]]; then
        status="complete"
    elif [[ $percentage -ge 60 ]]; then
        status="partial"
    fi

    jq --arg status "$status" '.validation_status = $status' "$handoff_file" > "$handoff_file.tmp" && mv "$handoff_file.tmp" "$handoff_file"

    echo "📊 Validation Score: $score/$max_score ($percentage%)"
    echo "📋 Status: $status"
}

# Validate Analyst to CMO handoff
validate_analyst_to_cmo() {
    local handoff_file="$1"
    log "Validating Analyst to CMO handoff..."

    # Implementation similar to above but for analyst-specific fields
    echo "✅ Analyst handoff validation (implementation pending)"
}

# Validate Onboard to Operations handoff
validate_onboard_to_operations() {
    local handoff_file="$1"
    log "Validating Onboard to Operations handoff..."

    # Check brand architecture completeness
    local company_name=$(jq -r '.brand_architecture.business_foundation.company_profile.name' "$handoff_file")
    local framework_type=$(jq -r '.brand_architecture.brand_strategy.brand_framework_applied.framework_type' "$handoff_file")

    local score=0
    local max_score=5

    if [[ "$company_name" != "null" && "$company_name" != "" ]]; then
        ((score++))
        echo "✅ Company profile complete"
    else
        echo "❌ Company profile missing"
    fi

    if [[ "$framework_type" != "null" && "$framework_type" != "" ]]; then
        ((score++))
        echo "✅ Brand framework applied"
    else
        echo "❌ Brand framework missing"
    fi

    echo "📊 Validation Score: $score/$max_score"
}

# Activate handoff for agent transition
activate_handoff() {
    local source="$1"
    local target="$2"
    local handoff_key="${source}-to-${target}"

    log "Activating handoff: $handoff_key"

    # Validate first
    validate_handoff "$source" "$target"

    # Create session state entry
    local session_file="$SESSION_DIR/current-session.json"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    mkdir -p "$SESSION_DIR"

    cat > "$session_file" << EOF
{
  "workflow": "agent_handoff",
  "handoff_type": "$handoff_key",
  "started_at": "$timestamp",
  "status": "active",
  "source_agent": "$source",
  "target_agent": "$target",
  "context_preserved": true,
  "handoff_location": "$HANDOFFS_DIR/$handoff_key/active-handoff.json"
}
EOF

    success "Handoff activated: $handoff_key"
    log "Session state: $session_file"
    log "Target agent can now access context from handoff"
}

# Archive completed handoff
archive_handoff() {
    local source="$1"
    local target="$2"
    local handoff_key="${source}-to-${target}"
    local handoff_dir="$HANDOFFS_DIR/$handoff_key"
    local active_file="$handoff_dir/active-handoff.json"

    log "Archiving handoff: $handoff_key"

    if [[ ! -f "$active_file" ]]; then
        error "No active handoff to archive: $handoff_key"
        exit 1
    fi

    # Create archive directory
    local archive_dir="$handoff_dir/archive"
    mkdir -p "$archive_dir"

    # Move to archive with timestamp
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local archive_file="$archive_dir/handoff_$timestamp.json"

    mv "$active_file" "$archive_file"

    success "Handoff archived: $archive_file"
}

# List available handoffs
list_handoffs() {
    log "Available handoff templates:"

    if [[ ! -d "$HANDOFFS_DIR" ]]; then
        error "Handoffs directory not found: $HANDOFFS_DIR"
        exit 1
    fi

    for handoff_dir in "$HANDOFFS_DIR"/*; do
        if [[ -d "$handoff_dir" && "$(basename "$handoff_dir")" != "session-state" ]]; then
            local handoff_name=$(basename "$handoff_dir")
            local template_file="$handoff_dir/handoff-template.json"
            local active_file="$handoff_dir/active-handoff.json"

            echo -n "  $handoff_name"

            if [[ -f "$active_file" ]]; then
                echo " (active)"
            elif [[ -f "$template_file" ]]; then
                echo " (template only)"
            else
                echo " (incomplete)"
            fi
        fi
    done
}

# Show current handoff status
show_status() {
    log "Current handoff status:"

    local session_file="$SESSION_DIR/current-session.json"

    if [[ -f "$session_file" ]]; then
        local workflow=$(jq -r '.workflow' "$session_file")
        local handoff_type=$(jq -r '.handoff_type' "$session_file")
        local status=$(jq -r '.status' "$session_file")
        local started_at=$(jq -r '.started_at' "$session_file")

        echo "  Active Session: $workflow"
        echo "  Handoff: $handoff_type"
        echo "  Status: $status"
        echo "  Started: $started_at"
    else
        echo "  No active session"
    fi

    echo ""
    echo "Active handoffs:"

    find "$HANDOFFS_DIR" -name "active-handoff.json" -exec dirname {} \; | while read -r handoff_dir; do
        local handoff_name=$(basename "$handoff_dir")
        local active_file="$handoff_dir/active-handoff.json"
        local created_at=$(jq -r '.timestamp' "$active_file")
        local validation_status=$(jq -r '.validation_status' "$active_file")

        echo "  $handoff_name ($validation_status) - created $created_at"
    done
}

# Main command handling
main() {
    if [[ $# -eq 0 ]]; then
        usage
        exit 1
    fi

    local command="$1"
    shift

    case "$command" in
        create)
            if [[ $# -ne 2 ]]; then
                error "create requires source and target arguments"
                usage
                exit 1
            fi
            create_handoff "$1" "$2"
            ;;
        validate)
            if [[ $# -ne 2 ]]; then
                error "validate requires source and target arguments"
                usage
                exit 1
            fi
            validate_handoff "$1" "$2"
            ;;
        activate)
            if [[ $# -ne 2 ]]; then
                error "activate requires source and target arguments"
                usage
                exit 1
            fi
            activate_handoff "$1" "$2"
            ;;
        archive)
            if [[ $# -ne 2 ]]; then
                error "archive requires source and target arguments"
                usage
                exit 1
            fi
            archive_handoff "$1" "$2"
            ;;
        list)
            list_handoffs
            ;;
        status)
            show_status
            ;;
        *)
            error "Unknown command: $command"
            usage
            exit 1
            ;;
    esac
}

# Check dependencies
check_dependencies() {
    if ! command -v jq &> /dev/null; then
        error "jq is required but not installed. Please install jq to use this script."
        exit 1
    fi
}

# Initialize
check_dependencies
main "$@"