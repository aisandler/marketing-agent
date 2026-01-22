#!/bin/bash

# Expansion Pack Manager
# BMAD-inspired industry-specific module management for marketing engine

set -euo pipefail

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPANSIONS_DIR="$PROJECT_ROOT/expansions"
CLIENT_CONTEXT="$PROJECT_ROOT/client-context"
CLIENT_BRAND="$PROJECT_ROOT/client-brand"
CLAUDE_FILE="$PROJECT_ROOT/CLAUDE.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[EXPANSION]${NC} $1"
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
    list                        List all available expansion packs
    info <expansion>            Show detailed information about an expansion
    install <expansion>         Install an expansion pack
    uninstall <expansion>       Remove an expansion pack
    status                      Show installed expansions status
    create <name>               Create new expansion pack template
    validate <expansion>        Validate expansion pack structure

Examples:
    $0 list                     Show all available expansions
    $0 info legal-services      Show legal services expansion details
    $0 install legal-services   Install legal services specialization
    $0 status                   Check installed expansions

EOF
}

# List available expansion packs
list_expansions() {
    log "Available expansion packs:"

    if [[ ! -d "$EXPANSIONS_DIR" ]]; then
        error "Expansions directory not found: $EXPANSIONS_DIR"
        return 1
    fi

    local expansions_found=false

    for expansion_dir in "$EXPANSIONS_DIR"/*; do
        if [[ -d "$expansion_dir" ]]; then
            local expansion_name=$(basename "$expansion_dir")
            local expansion_file="$expansion_dir/expansion.json"

            if [[ -f "$expansion_file" ]]; then
                expansions_found=true
                local description
                local version
                local industry

                if command -v jq &> /dev/null; then
                    description=$(jq -r '.description // "No description"' "$expansion_file" 2>/dev/null)
                    version=$(jq -r '.version // "unknown"' "$expansion_file" 2>/dev/null)
                    industry=$(jq -r '.industry // "general"' "$expansion_file" 2>/dev/null)
                else
                    description="Install jq to see descriptions"
                    version="unknown"
                    industry="unknown"
                fi

                local status="available"
                if is_expansion_installed "$expansion_name"; then
                    status="installed"
                fi

                echo ""
                echo "📦 $expansion_name ($status)"
                echo "   Version: $version"
                echo "   Industry: $industry"
                echo "   Description: $description"
            fi
        fi
    done

    if [[ "$expansions_found" == false ]]; then
        warning "No expansion packs found in $EXPANSIONS_DIR"
        echo ""
        echo "To create an expansion pack:"
        echo "  $0 create <industry-name>"
    fi
}

# Show expansion information
show_expansion_info() {
    local expansion_name="$1"
    local expansion_dir="$EXPANSIONS_DIR/$expansion_name"
    local expansion_file="$expansion_dir/expansion.json"

    log "Expansion information: $expansion_name"

    if [[ ! -f "$expansion_file" ]]; then
        error "Expansion not found: $expansion_name"
        echo "Available expansions:"
        list_available_names
        return 1
    fi

    if ! command -v jq &> /dev/null; then
        error "jq is required to display expansion information"
        return 1
    fi

    echo ""
    echo "📋 EXPANSION DETAILS"
    echo "===================="

    local name=$(jq -r '.name' "$expansion_file")
    local version=$(jq -r '.version' "$expansion_file")
    local description=$(jq -r '.description' "$expansion_file")
    local industry=$(jq -r '.industry' "$expansion_file")
    local author=$(jq -r '.author // "Unknown"' "$expansion_file")

    echo "Name: $name"
    echo "Version: $version"
    echo "Industry: $industry"
    echo "Author: $author"
    echo "Description: $description"
    echo ""

    echo "📦 COMPONENTS:"
    jq -r '.components | to_entries[] | "  \(.key): \(.value | length) items"' "$expansion_file"
    echo ""

    echo "🎯 CONTENT TYPES:"
    jq -r '.configuration_overrides.content_types[]? // empty' "$expansion_file" | sed 's/^/  - /'
    echo ""

    echo "📅 SEASONAL STRATEGIES:"
    jq -r '.configuration_overrides.seasonal_strategies[]?.season // empty' "$expansion_file" | sed 's/^/  - /'
    echo ""

    if is_expansion_installed "$expansion_name"; then
        echo "✅ Status: INSTALLED"
    else
        echo "📭 Status: Available for installation"
    fi
}

# Install expansion pack
install_expansion() {
    local expansion_name="$1"
    local expansion_dir="$EXPANSIONS_DIR/$expansion_name"
    local expansion_file="$expansion_dir/expansion.json"

    log "Installing expansion: $expansion_name"

    # Validate expansion exists
    if [[ ! -f "$expansion_file" ]]; then
        error "Expansion not found: $expansion_name"
        return 1
    fi

    # Check if already installed
    if is_expansion_installed "$expansion_name"; then
        warning "Expansion already installed: $expansion_name"
        echo "Use 'uninstall' first if you want to reinstall"
        return 1
    fi

    # Validate expansion structure
    if ! validate_expansion_structure "$expansion_name"; then
        error "Expansion validation failed"
        return 1
    fi

    # Create installation directories
    create_installation_directories "$expansion_name"

    # Copy expansion components
    install_expansion_components "$expansion_name"

    # Update configuration files
    update_configuration_for_expansion "$expansion_name"

    # Mark as installed
    mark_expansion_installed "$expansion_name"

    success "Expansion installed successfully: $expansion_name"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Review generated configuration in client-context/"
    echo "  2. Run ./automation/validate-config.sh to verify setup"
    echo "  3. Update CLAUDE.md with industry-specific settings"
}

# Uninstall expansion pack
uninstall_expansion() {
    local expansion_name="$1"

    log "Uninstalling expansion: $expansion_name"

    if ! is_expansion_installed "$expansion_name"; then
        error "Expansion not installed: $expansion_name"
        return 1
    fi

    # Remove expansion-specific directories
    local industry_dir="$CLIENT_CONTEXT/industry-specific/$expansion_name"
    if [[ -d "$industry_dir" ]]; then
        rm -rf "$industry_dir"
        success "Removed industry-specific configuration"
    fi

    # Remove from installed list
    local installed_file="$CLIENT_CONTEXT/.installed-expansions"
    if [[ -f "$installed_file" ]]; then
        grep -v "^$expansion_name$" "$installed_file" > "$installed_file.tmp" || true
        mv "$installed_file.tmp" "$installed_file"
    fi

    success "Expansion uninstalled: $expansion_name"
    warning "Manual cleanup may be required for CLAUDE.md configuration"
}

# Show installation status
show_status() {
    log "Expansion pack status:"

    local installed_file="$CLIENT_CONTEXT/.installed-expansions"

    if [[ -f "$installed_file" && -s "$installed_file" ]]; then
        echo ""
        echo "✅ INSTALLED EXPANSIONS:"
        while IFS= read -r expansion; do
            if [[ -n "$expansion" ]]; then
                local expansion_file="$EXPANSIONS_DIR/$expansion/expansion.json"
                if [[ -f "$expansion_file" ]] && command -v jq &> /dev/null; then
                    local version=$(jq -r '.version // "unknown"' "$expansion_file")
                    local industry=$(jq -r '.industry // "unknown"' "$expansion_file")
                    echo "  📦 $expansion (v$version) - $industry"
                else
                    echo "  📦 $expansion"
                fi
            fi
        done < "$installed_file"
    else
        echo ""
        echo "📭 No expansions currently installed"
    fi

    echo ""
    echo "📋 AVAILABLE EXPANSIONS:"
    list_available_names
}

# Create new expansion template
create_expansion_template() {
    local expansion_name="$1"
    local expansion_dir="$EXPANSIONS_DIR/$expansion_name"

    log "Creating expansion template: $expansion_name"

    if [[ -d "$expansion_dir" ]]; then
        error "Expansion already exists: $expansion_name"
        return 1
    fi

    # Create directory structure
    mkdir -p "$expansion_dir/brand-frameworks"
    mkdir -p "$expansion_dir/content-themes"
    mkdir -p "$expansion_dir/keyword-strategies"
    mkdir -p "$expansion_dir/competitive-intelligence"

    # Create expansion.json template
    cat > "$expansion_dir/expansion.json" << EOF
{
  "name": "$expansion_name",
  "version": "1.0.0",
  "description": "Marketing specialization for $expansion_name industry",
  "industry": "$expansion_name",
  "compatibility": ["marketing-engine-1.0"],
  "author": "Your Name",
  "created_at": "$(date +%Y-%m-%d)",
  "components": {
    "brand_frameworks": [
      "storybrand-$expansion_name",
      "golden-circle-$expansion_name"
    ],
    "content_themes": [
      "seasonal-$expansion_name",
      "educational-$expansion_name"
    ],
    "keyword_strategies": [
      "local-$expansion_name-seo",
      "industry-specific-keywords"
    ],
    "competitive_intelligence": [
      "$expansion_name-competitive-analysis"
    ]
  },
  "configuration_overrides": {
    "content_types": [
      "industry-specific-content",
      "service-explanations",
      "educational-resources"
    ],
    "seasonal_strategies": [
      {
        "season": "spring",
        "focus": "$expansion_name-specific-spring-focus",
        "content_themes": ["spring-preparation"],
        "keywords": ["spring $expansion_name services"]
      }
    ],
    "brand_voice_attributes": [
      "professional",
      "trustworthy",
      "knowledgeable"
    ]
  },
  "installation_requirements": {
    "directories": [
      "client-context/industry-specific/$expansion_name",
      "content/templates/$expansion_name"
    ],
    "configuration_updates": [
      "CLAUDE.md",
      "client-context/business/industry-profile.json"
    ]
  }
}
EOF

    # Create README
    cat > "$expansion_dir/README.md" << EOF
# $expansion_name Expansion Pack

## Overview
Marketing specialization for the $expansion_name industry.

## Components
- Brand frameworks adapted for $expansion_name
- Industry-specific content themes
- Keyword strategies for $expansion_name services
- Competitive intelligence templates

## Installation
\`\`\`bash
./automation/expansion-manager.sh install $expansion_name
\`\`\`

## Development
Edit the files in this directory to customize the expansion for your specific $expansion_name business needs.
EOF

    success "Expansion template created: $expansion_dir"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Edit expansion.json with industry-specific details"
    echo "  2. Create brand framework files in brand-frameworks/"
    echo "  3. Add content themes in content-themes/"
    echo "  4. Develop keyword strategies in keyword-strategies/"
    echo "  5. Test with: $0 validate $expansion_name"
}

# Validate expansion structure
validate_expansion_structure() {
    local expansion_name="$1"
    local expansion_dir="$EXPANSIONS_DIR/$expansion_name"
    local expansion_file="$expansion_dir/expansion.json"

    local validation_passed=true

    # Check required files
    if [[ ! -f "$expansion_file" ]]; then
        error "Missing expansion.json"
        validation_passed=false
    fi

    # Check required directories
    local required_dirs=(
        "brand-frameworks"
        "content-themes"
        "keyword-strategies"
        "competitive-intelligence"
    )

    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$expansion_dir/$dir" ]]; then
            error "Missing directory: $dir"
            validation_passed=false
        fi
    done

    # Validate JSON structure
    if [[ -f "$expansion_file" ]] && command -v jq &> /dev/null; then
        if ! jq . "$expansion_file" > /dev/null 2>&1; then
            error "Invalid JSON in expansion.json"
            validation_passed=false
        fi

        # Check required fields
        local required_fields=("name" "version" "description" "components")
        for field in "${required_fields[@]}"; do
            if ! jq -e ".$field" "$expansion_file" > /dev/null 2>&1; then
                error "Missing required field: $field"
                validation_passed=false
            fi
        done
    fi

    if [[ "$validation_passed" == true ]]; then
        success "Expansion validation passed: $expansion_name"
        return 0
    else
        error "Expansion validation failed: $expansion_name"
        return 1
    fi
}

# Helper functions
is_expansion_installed() {
    local expansion_name="$1"
    local installed_file="$CLIENT_CONTEXT/.installed-expansions"

    [[ -f "$installed_file" ]] && grep -q "^$expansion_name$" "$installed_file"
}

mark_expansion_installed() {
    local expansion_name="$1"
    local installed_file="$CLIENT_CONTEXT/.installed-expansions"

    mkdir -p "$(dirname "$installed_file")"
    echo "$expansion_name" >> "$installed_file"
}

list_available_names() {
    if [[ -d "$EXPANSIONS_DIR" ]]; then
        find "$EXPANSIONS_DIR" -name "expansion.json" -exec dirname {} \; | \
            xargs -I {} basename {} | \
            sed 's/^/  - /'
    fi
}

create_installation_directories() {
    local expansion_name="$1"
    local expansion_file="$EXPANSIONS_DIR/$expansion_name/expansion.json"

    # Create industry-specific directory
    mkdir -p "$CLIENT_CONTEXT/industry-specific/$expansion_name"

    # Create other required directories if specified
    if command -v jq &> /dev/null; then
        jq -r '.installation_requirements.directories[]? // empty' "$expansion_file" | while read -r dir; do
            if [[ -n "$dir" ]]; then
                mkdir -p "$PROJECT_ROOT/$dir"
                log "Created directory: $dir"
            fi
        done
    fi
}

install_expansion_components() {
    local expansion_name="$1"
    local expansion_dir="$EXPANSIONS_DIR/$expansion_name"
    local target_dir="$CLIENT_CONTEXT/industry-specific/$expansion_name"

    # Copy all expansion components
    cp -r "$expansion_dir"/* "$target_dir/"
    success "Copied expansion components to $target_dir"
}

update_configuration_for_expansion() {
    local expansion_name="$1"

    # Create industry profile
    local industry_profile="$CLIENT_CONTEXT/business/industry-profile.json"
    mkdir -p "$(dirname "$industry_profile")"

    cat > "$industry_profile" << EOF
{
  "industry": "$expansion_name",
  "expansion_installed": true,
  "installation_date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "specialization": "Industry-specific marketing optimization"
}
EOF

    success "Created industry profile: $industry_profile"
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
        list)
            list_expansions
            ;;
        info)
            if [[ $# -ne 1 ]]; then
                error "info requires expansion name"
                usage
                exit 1
            fi
            show_expansion_info "$1"
            ;;
        install)
            if [[ $# -ne 1 ]]; then
                error "install requires expansion name"
                usage
                exit 1
            fi
            install_expansion "$1"
            ;;
        uninstall)
            if [[ $# -ne 1 ]]; then
                error "uninstall requires expansion name"
                usage
                exit 1
            fi
            uninstall_expansion "$1"
            ;;
        status)
            show_status
            ;;
        create)
            if [[ $# -ne 1 ]]; then
                error "create requires expansion name"
                usage
                exit 1
            fi
            create_expansion_template "$1"
            ;;
        validate)
            if [[ $# -ne 1 ]]; then
                error "validate requires expansion name"
                usage
                exit 1
            fi
            validate_expansion_structure "$1"
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
        warning "jq not found. Some features will be limited."
        echo "Install jq for full functionality: brew install jq"
    fi
}

# Initialize
check_dependencies
main "$@"