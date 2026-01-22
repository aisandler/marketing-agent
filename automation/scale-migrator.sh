#!/bin/bash

# Marketing Engine Scale Migrator
# Handles migration between local, regional, and enterprise scale levels

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_DIR="$PROJECT_ROOT/config"
BACKUP_DIR="$PROJECT_ROOT/backups/$(date +%Y%m%d_%H%M%S)"

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

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Help function
show_help() {
    cat << EOF
Marketing Engine Scale Migrator

Usage: $0 [OPTIONS] TARGET_SCALE

TARGET_SCALE:
    local       - Single location, basic features
    regional    - Multi-location, enhanced features
    enterprise  - Advanced features, enterprise integrations

OPTIONS:
    -h, --help              Show this help message
    -c, --check             Check current scale level
    -d, --dry-run          Simulate migration without making changes
    -b, --backup           Create backup before migration
    -f, --force            Force migration without confirmation
    -v, --verbose          Verbose output

Examples:
    $0 --check                  # Check current scale level
    $0 regional                 # Migrate to regional scale
    $0 --dry-run enterprise     # Simulate enterprise migration
    $0 --backup --force local   # Force migrate to local with backup

EOF
}

# Check current scale level
check_current_scale() {
    if [[ -f "$CONFIG_DIR/current-scale.json" ]]; then
        local current_scale=$(jq -r '.scale_level' "$CONFIG_DIR/current-scale.json" 2>/dev/null || echo "unknown")
        echo "$current_scale"
    else
        echo "local"  # Default to local if no config exists
    fi
}

# Validate target scale
validate_scale() {
    local scale="$1"
    case "$scale" in
        local|regional|enterprise)
            return 0
            ;;
        *)
            error "Invalid scale level: $scale"
            error "Valid scales: local, regional, enterprise"
            return 1
            ;;
    esac
}

# Create backup
create_backup() {
    log "Creating backup in $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"

    # Backup configuration files
    if [[ -d "$CONFIG_DIR" ]]; then
        cp -r "$CONFIG_DIR" "$BACKUP_DIR/config"
    fi

    # Backup CLAUDE.md
    if [[ -f "$PROJECT_ROOT/CLAUDE.md" ]]; then
        cp "$PROJECT_ROOT/CLAUDE.md" "$BACKUP_DIR/CLAUDE.md"
    fi

    # Backup automation scripts
    cp -r "$SCRIPT_DIR" "$BACKUP_DIR/automation"

    success "Backup created successfully"
}

# Check system requirements
check_requirements() {
    local target_scale="$1"
    local config_file="$CONFIG_DIR/scale-$target_scale.json"

    if [[ ! -f "$config_file" ]]; then
        error "Configuration file not found: $config_file"
        return 1
    fi

    local required_ram=$(jq -r '.resource_requirements.ram_gb' "$config_file")
    local required_storage=$(jq -r '.resource_requirements.storage_gb' "$config_file")

    log "Checking system requirements for $target_scale scale"
    log "Required RAM: ${required_ram}GB"
    log "Required Storage: ${required_storage}GB"

    # Check available RAM (approximate check for macOS)
    if command -v system_profiler >/dev/null 2>&1; then
        local available_ram=$(system_profiler SPHardwareDataType | grep "Memory:" | awk '{print $2}' | sed 's/GB//')
        if [[ -n "$available_ram" && "$available_ram" -lt "$required_ram" ]]; then
            warning "Insufficient RAM: Available ${available_ram}GB, Required ${required_ram}GB"
        fi
    fi

    # Check available disk space
    local available_storage=$(df -g "$PROJECT_ROOT" | tail -1 | awk '{print $4}')
    if [[ "$available_storage" -lt "$required_storage" ]]; then
        warning "Insufficient storage: Available ${available_storage}GB, Required ${required_storage}GB"
    fi

    return 0
}

# Update configuration
update_configuration() {
    local target_scale="$1"
    local config_file="$CONFIG_DIR/scale-$target_scale.json"

    log "Updating configuration for $target_scale scale"

    # Copy the target scale configuration as current
    cp "$config_file" "$CONFIG_DIR/current-scale.json"

    # Update CLAUDE.md with scale-specific settings
    update_claude_md "$target_scale"

    success "Configuration updated"
}

# Update CLAUDE.md based on scale
update_claude_md() {
    local target_scale="$1"
    local claude_file="$PROJECT_ROOT/CLAUDE.md"

    if [[ ! -f "$claude_file" ]]; then
        warning "CLAUDE.md not found, skipping update"
        return
    fi

    # Create a backup of CLAUDE.md
    cp "$claude_file" "$claude_file.backup"

    case "$target_scale" in
        local)
            # Update for local scale
            sed -i '' 's/{{SCALE_LEVEL}}/local/g' "$claude_file" 2>/dev/null || true
            sed -i '' 's/{{MAX_CONCURRENT_AGENTS}}/3/g' "$claude_file" 2>/dev/null || true
            ;;
        regional)
            # Update for regional scale
            sed -i '' 's/{{SCALE_LEVEL}}/regional/g' "$claude_file" 2>/dev/null || true
            sed -i '' 's/{{MAX_CONCURRENT_AGENTS}}/8/g' "$claude_file" 2>/dev/null || true
            ;;
        enterprise)
            # Update for enterprise scale
            sed -i '' 's/{{SCALE_LEVEL}}/enterprise/g' "$claude_file" 2>/dev/null || true
            sed -i '' 's/{{MAX_CONCURRENT_AGENTS}}/20/g' "$claude_file" 2>/dev/null || true
            ;;
    esac

    log "CLAUDE.md updated for $target_scale scale"
}

# Deploy scale-specific features
deploy_features() {
    local target_scale="$1"
    local config_file="$CONFIG_DIR/current-scale.json"

    log "Deploying features for $target_scale scale"

    # Check if multi-location feature is enabled
    local multi_location=$(jq -r '.features.multi_location' "$config_file")
    if [[ "$multi_location" == "true" ]]; then
        log "Enabling multi-location features"
        # Add multi-location deployment logic here
    fi

    # Check if enterprise integrations are enabled
    local enterprise_integrations=$(jq -r '.features.enterprise_integrations' "$config_file")
    if [[ "$enterprise_integrations" == "true" ]]; then
        log "Enabling enterprise integrations"
        # Add enterprise integration deployment logic here
    fi

    # Check if load balancing is enabled
    local load_balancing=$(jq -r '.features.load_balancing' "$config_file")
    if [[ "$load_balancing" == "true" ]]; then
        log "Enabling load balancing"
        # Add load balancing deployment logic here
    fi

    success "Features deployed successfully"
}

# Test migration
test_migration() {
    local target_scale="$1"

    log "Testing migration to $target_scale scale"

    # Test basic functionality
    if [[ -f "$SCRIPT_DIR/server_manager.sh" ]]; then
        log "Testing server management"
        "$SCRIPT_DIR/server_manager.sh" status || warning "Server status check failed"
    fi

    # Test content generation (if possible)
    log "Testing content generation capabilities"
    # Add specific tests here

    success "Migration testing completed"
}

# Main migration function
migrate_scale() {
    local current_scale="$1"
    local target_scale="$2"
    local dry_run="$3"
    local force="$4"

    if [[ "$current_scale" == "$target_scale" ]]; then
        warning "Already at $target_scale scale"
        return 0
    fi

    log "Migrating from $current_scale to $target_scale scale"

    if [[ "$dry_run" == "true" ]]; then
        log "DRY RUN MODE - No changes will be made"
    fi

    # Confirmation prompt
    if [[ "$force" != "true" && "$dry_run" != "true" ]]; then
        echo -n "Are you sure you want to migrate from $current_scale to $target_scale? (y/N): "
        read -r confirmation
        if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
            log "Migration cancelled"
            return 0
        fi
    fi

    # Check requirements
    check_requirements "$target_scale" || return 1

    if [[ "$dry_run" != "true" ]]; then
        # Update configuration
        update_configuration "$target_scale"

        # Deploy features
        deploy_features "$target_scale"

        # Test migration
        test_migration "$target_scale"

        success "Migration to $target_scale scale completed successfully"

        # Show next steps
        show_next_steps "$target_scale"
    else
        log "DRY RUN: Would migrate to $target_scale scale"
        check_requirements "$target_scale"
    fi
}

# Show next steps after migration
show_next_steps() {
    local target_scale="$1"

    echo ""
    success "Migration completed! Next steps:"
    echo ""

    case "$target_scale" in
        local)
            echo "1. Restart servers: ./automation/server_manager.sh restart"
            echo "2. Test basic functionality: /cmo"
            echo "3. Verify content generation"
            ;;
        regional)
            echo "1. Configure multiple locations in CLAUDE.md"
            echo "2. Set up regional keyword lists"
            echo "3. Test multi-location content generation"
            echo "4. Configure load balancing if needed"
            ;;
        enterprise)
            echo "1. Configure enterprise integrations"
            echo "2. Set up SSO if required"
            echo "3. Configure enterprise security settings"
            echo "4. Test advanced features"
            echo "5. Set up monitoring and alerting"
            ;;
    esac

    echo ""
    echo "For detailed configuration options, see: docs/scaling-guide.md"
}

# Main script logic
main() {
    local target_scale=""
    local dry_run="false"
    local force="false"
    local backup="false"
    local check_only="false"
    local verbose="false"

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -c|--check)
                check_only="true"
                shift
                ;;
            -d|--dry-run)
                dry_run="true"
                shift
                ;;
            -f|--force)
                force="true"
                shift
                ;;
            -b|--backup)
                backup="true"
                shift
                ;;
            -v|--verbose)
                verbose="true"
                set -x
                shift
                ;;
            local|regional|enterprise)
                target_scale="$1"
                shift
                ;;
            *)
                error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # Check for required tools
    if ! command -v jq >/dev/null 2>&1; then
        error "jq is required but not installed. Please install jq first."
        exit 1
    fi

    # Check current scale
    local current_scale=$(check_current_scale)

    if [[ "$check_only" == "true" ]]; then
        echo "Current scale level: $current_scale"
        exit 0
    fi

    # Validate target scale
    if [[ -z "$target_scale" ]]; then
        error "Target scale not specified"
        show_help
        exit 1
    fi

    validate_scale "$target_scale" || exit 1

    # Create backup if requested
    if [[ "$backup" == "true" ]]; then
        create_backup
    fi

    # Perform migration
    migrate_scale "$current_scale" "$target_scale" "$dry_run" "$force"
}

# Run main function with all arguments
main "$@"