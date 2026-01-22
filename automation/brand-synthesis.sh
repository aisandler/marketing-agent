#!/bin/bash

# Brand Synthesis Automation Script
# Generates portable brand documents from current brand architecture
# Usage: ./automation/brand-synthesis.sh <type> [output-file]

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BRAND_DIR="$PROJECT_ROOT/client-brand"
TEMPLATES_DIR="$PROJECT_ROOT/content/templates"
EXPORTS_DIR="$BRAND_DIR/exports"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

# Validate directories exist
if [ ! -d "$BRAND_DIR" ]; then
    log_warning "Brand directory not found. Run /onboard first to set up brand architecture."
    exit 1
fi

if [ ! -d "$EXPORTS_DIR" ]; then
    mkdir -p "$EXPORTS_DIR"
    log_info "Created exports directory: $EXPORTS_DIR"
fi

# Main export function
export_brand() {
    local export_type="$1"
    local output_file="${2:-brand-${export_type}-$(date +%Y%m%d).md}"
    local template_file=""

    case "$export_type" in
        "summary")
            template_file="$TEMPLATES_DIR/brand-export-1page.md"
            ;;
        "detailed")
            template_file="$TEMPLATES_DIR/brand-export-2page.md"
            ;;
        "guide")
            # For guide, we'll use the detailed template as base and expand
            template_file="$TEMPLATES_DIR/brand-export-2page.md"
            ;;
        *)
            echo "Usage: $0 <summary|detailed|guide> [output-file]"
            exit 1
            ;;
    esac

    if [ ! -f "$template_file" ]; then
        log_warning "Template not found: $template_file"
        exit 1
    fi

    log_info "Generating $export_type brand export..."
    log_info "Template: $(basename "$template_file")"
    log_info "Output: $EXPORTS_DIR/$output_file"

    # Copy template to exports directory
    # Note: Variable replacement would happen in the AI agent, not here
    cp "$template_file" "$EXPORTS_DIR/$output_file"

    log_success "Brand $export_type export created: $EXPORTS_DIR/$output_file"
    log_info "Next: The AI agent will populate brand variables and finalize the document"

    return 0
}

# Check arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 <summary|detailed|guide> [output-file]"
    echo ""
    echo "Export Types:"
    echo "  summary  - 1-page executive brand summary"
    echo "  detailed - 2-page comprehensive overview"
    echo "  guide    - Complete brand implementation guide"
    exit 1
fi

# Execute export
export_brand "$1" "$2"