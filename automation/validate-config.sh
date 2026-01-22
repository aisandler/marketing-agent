#!/bin/bash

# Marketing Configuration Validation Script
# BMAD-inspired validation system for marketing engine readiness

set -euo pipefail

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLIENT_CONTEXT="$PROJECT_ROOT/client-context"
CLIENT_BRAND="$PROJECT_ROOT/client-brand"
CLAUDE_FILE="$PROJECT_ROOT/CLAUDE.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global validation state
TOTAL_SCORE=0
MAX_SCORE=0
VALIDATION_ERRORS=()
VALIDATION_WARNINGS=()
VALIDATION_SUCCESS=()

# Logging functions
log() {
    echo -e "${BLUE}[VALIDATE]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    VALIDATION_ERRORS+=("$1")
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    VALIDATION_SUCCESS+=("$1")
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    VALIDATION_WARNINGS+=("$1")
}

# Scoring functions
add_score() {
    local points="$1"
    TOTAL_SCORE=$((TOTAL_SCORE + points))
}

add_max_score() {
    local points="$1"
    MAX_SCORE=$((MAX_SCORE + points))
}

# Directory structure validation
validate_directory_structure() {
    log "Validating directory structure..."

    local required_dirs=(
        "client-context/business"
        "client-context/brand"
        "client-context/competitors"
        "client-context/keywords"
        "client-context/handoffs"
        "client-context/validation"
        "client-brand/current"
        "onboarding/intake"
        "onboarding/templates"
    )

    local missing_dirs=()
    local existing_dirs=()

    for dir in "${required_dirs[@]}"; do
        add_max_score 1
        if [[ -d "$PROJECT_ROOT/$dir" ]]; then
            existing_dirs+=("$dir")
            add_score 1
        else
            missing_dirs+=("$dir")
        fi
    done

    if [[ ${#missing_dirs[@]} -eq 0 ]]; then
        success "All required directories exist (${#existing_dirs[@]}/${#required_dirs[@]})"
    else
        warning "Missing directories: ${#missing_dirs[@]}/${#required_dirs[@]}"
        for dir in "${missing_dirs[@]}"; do
            error "Missing: $dir"
        done
    fi
}

# CLAUDE.md configuration validation
validate_claude_configuration() {
    log "Validating CLAUDE.md configuration..."

    add_max_score 10

    if [[ ! -f "$CLAUDE_FILE" ]]; then
        error "CLAUDE.md not found"
        return
    fi

    # Check for placeholders
    local placeholders
    placeholders=$(grep -o '{{[^}]*}}' "$CLAUDE_FILE" 2>/dev/null || true)

    if [[ -n "$placeholders" ]]; then
        local placeholder_count
        placeholder_count=$(echo "$placeholders" | wc -l)
        warning "Found $placeholder_count unconfigured placeholders"
        echo "$placeholders" | while read -r placeholder; do
            error "Placeholder: $placeholder"
        done
        add_score 5  # Partial score for existing but incomplete file
    else
        success "CLAUDE.md fully configured (no placeholders)"
        add_score 10
    fi

    # Check for required sections
    local required_sections=(
        "Business Configuration"
        "Content Requirements"
        "Marketing Focus"
        "System Overview"
        "Quick Start"
    )

    local missing_sections=()
    for section in "${required_sections[@]}"; do
        if ! grep -q "$section" "$CLAUDE_FILE"; then
            missing_sections+=("$section")
        fi
    done

    if [[ ${#missing_sections[@]} -eq 0 ]]; then
        success "All required sections present"
    else
        warning "Missing sections: ${missing_sections[*]}"
    fi
}

# Business foundation validation
validate_business_foundation() {
    log "Validating business foundation..."

    local business_dir="$CLIENT_CONTEXT/business"
    add_max_score 15

    if [[ ! -d "$business_dir" ]]; then
        error "Business directory not found"
        return
    fi

    local business_files
    business_files=$(find "$business_dir" -type f 2>/dev/null | wc -l)

    if [[ $business_files -eq 0 ]]; then
        error "No business documentation found"
        return
    fi

    add_score 5  # Basic directory exists with files

    # Check for specific business documentation
    local required_elements=(
        "company profile"
        "services"
        "target audience"
        "value proposition"
    )

    local found_elements=0
    for element in "${required_elements[@]}"; do
        if find "$business_dir" -type f -exec grep -l -i "$element" {} \; 2>/dev/null | head -1 | grep -q .; then
            ((found_elements++))
            success "Found: $element documentation"
        else
            warning "Missing: $element documentation"
        fi
    done

    add_score $((found_elements * 2))  # 2 points per element

    if [[ $found_elements -eq ${#required_elements[@]} ]]; then
        success "Business foundation complete"
        add_score 2  # Bonus for completeness
    fi
}

# Brand strategy validation
validate_brand_strategy() {
    log "Validating brand strategy..."

    local brand_dir="$CLIENT_CONTEXT/brand"
    add_max_score 15

    if [[ ! -d "$brand_dir" ]]; then
        error "Brand directory not found"
        return
    fi

    local brand_files
    brand_files=$(find "$brand_dir" -type f 2>/dev/null | wc -l)

    if [[ $brand_files -eq 0 ]]; then
        error "No brand strategy documentation found"
        return
    fi

    add_score 5  # Basic directory exists with files

    # Check for specific brand elements
    local required_elements=(
        "brand voice"
        "messaging"
        "positioning"
        "framework"
    )

    local found_elements=0
    for element in "${required_elements[@]}"; do
        if find "$brand_dir" -type f -exec grep -l -i "$element" {} \; 2>/dev/null | head -1 | grep -q .; then
            ((found_elements++))
            success "Found: $element documentation"
        else
            warning "Missing: $element documentation"
        fi
    done

    add_score $((found_elements * 2))

    # Check for brand framework application
    if find "$brand_dir" -type f -exec grep -l -i "storybrand\|golden circle\|value proposition\|blue ocean\|jobs to be done" {} \; 2>/dev/null | head -1 | grep -q .; then
        success "Brand framework applied"
        add_score 3
    else
        warning "No brand framework detected"
    fi
}

# Content strategy validation
validate_content_strategy() {
    log "Validating content strategy..."

    local keywords_dir="$CLIENT_CONTEXT/keywords"
    add_max_score 10

    if [[ ! -d "$keywords_dir" ]]; then
        error "Keywords directory not found"
        return
    fi

    local keyword_files
    keyword_files=$(find "$keywords_dir" -type f 2>/dev/null | wc -l)

    if [[ $keyword_files -eq 0 ]]; then
        warning "No keyword strategy documentation found"
        return
    fi

    add_score 5

    # Check for content strategy elements
    local strategy_elements=(
        "keywords"
        "content types"
        "themes"
        "calendar"
    )

    local found_elements=0
    for element in "${strategy_elements[@]}"; do
        if find "$keywords_dir" -type f -exec grep -l -i "$element" {} \; 2>/dev/null | head -1 | grep -q .; then
            ((found_elements++))
            success "Found: $element strategy"
        else
            warning "Missing: $element strategy"
        fi
    done

    add_score $found_elements

    if [[ $found_elements -eq ${#strategy_elements[@]} ]]; then
        success "Content strategy complete"
        add_score 1
    fi
}

# User-accessible brand validation
validate_user_brand_access() {
    log "Validating user-accessible brand documentation..."

    local current_dir="$CLIENT_BRAND/current"
    add_max_score 5

    if [[ ! -d "$current_dir" ]]; then
        error "User brand directory not found"
        return
    fi

    local brand_files
    brand_files=$(find "$current_dir" -type f 2>/dev/null | wc -l)

    if [[ $brand_files -eq 0 ]]; then
        warning "No user-accessible brand documentation"
        return
    fi

    add_score 3

    # Check for user-friendly documentation
    if find "$current_dir" -name "*.md" -o -name "*.txt" 2>/dev/null | grep -q .; then
        success "User-friendly brand documentation exists"
        add_score 2
    else
        warning "Brand documentation may not be user-friendly"
    fi
}

# Agent configuration validation
validate_agent_configuration() {
    log "Validating agent configurations..."

    local agents_dir="$PROJECT_ROOT/.claude/commands"
    add_max_score 10

    if [[ ! -d "$agents_dir" ]]; then
        error "Agents directory not found"
        return
    fi

    local required_agents=(
        "cmo.md"
        "onboard.md"
        "analyst.md"
    )

    local existing_agents=0
    for agent in "${required_agents[@]}"; do
        if [[ -f "$agents_dir/$agent" ]]; then
            ((existing_agents++))
            success "Agent configured: $agent"
        else
            error "Missing agent: $agent"
        fi
    done

    add_score $((existing_agents * 3))

    if [[ $existing_agents -eq ${#required_agents[@]} ]]; then
        success "All core agents configured"
        add_score 1
    fi
}

# Handoff system validation
validate_handoff_system() {
    log "Validating handoff system..."

    local handoffs_dir="$CLIENT_CONTEXT/handoffs"
    add_max_score 8

    if [[ ! -d "$handoffs_dir" ]]; then
        error "Handoffs directory not found"
        return
    fi

    add_score 2

    # Check for handoff templates
    local handoff_types=(
        "cmo-to-content"
        "analyst-to-cmo"
        "onboard-to-operations"
    )

    local template_count=0
    for handoff_type in "${handoff_types[@]}"; do
        local template_file="$handoffs_dir/$handoff_type/handoff-template.json"
        if [[ -f "$template_file" ]]; then
            ((template_count++))
            success "Handoff template: $handoff_type"
        else
            warning "Missing handoff template: $handoff_type"
        fi
    done

    add_score $((template_count * 2))
}

# Generate validation report
generate_report() {
    local percentage
    if [[ $MAX_SCORE -gt 0 ]]; then
        percentage=$(( (TOTAL_SCORE * 100) / MAX_SCORE ))
    else
        percentage=0
    fi

    echo ""
    echo "=================================================="
    echo "          MARKETING ENGINE VALIDATION REPORT"
    echo "=================================================="
    echo ""
    echo "📊 Overall Score: $TOTAL_SCORE/$MAX_SCORE ($percentage%)"
    echo ""

    # Determine status
    local status="INCOMPLETE"
    local status_emoji="❌"

    if [[ $percentage -ge 90 ]]; then
        status="EXCELLENT"
        status_emoji="🏆"
    elif [[ $percentage -ge 80 ]]; then
        status="READY"
        status_emoji="✅"
    elif [[ $percentage -ge 60 ]]; then
        status="PARTIAL"
        status_emoji="⚠️"
    fi

    echo "🎯 Status: $status_emoji $status"
    echo ""

    # Show summary
    if [[ ${#VALIDATION_SUCCESS[@]} -gt 0 ]]; then
        echo "✅ SUCCESSFUL VALIDATIONS (${#VALIDATION_SUCCESS[@]}):"
        printf '%s\n' "${VALIDATION_SUCCESS[@]}" | head -5
        if [[ ${#VALIDATION_SUCCESS[@]} -gt 5 ]]; then
            echo "   ... and $((${#VALIDATION_SUCCESS[@]} - 5)) more"
        fi
        echo ""
    fi

    if [[ ${#VALIDATION_WARNINGS[@]} -gt 0 ]]; then
        echo "⚠️  WARNINGS (${#VALIDATION_WARNINGS[@]}):"
        printf '%s\n' "${VALIDATION_WARNINGS[@]}" | head -5
        if [[ ${#VALIDATION_WARNINGS[@]} -gt 5 ]]; then
            echo "   ... and $((${#VALIDATION_WARNINGS[@]} - 5)) more"
        fi
        echo ""
    fi

    if [[ ${#VALIDATION_ERRORS[@]} -gt 0 ]]; then
        echo "❌ ERRORS (${#VALIDATION_ERRORS[@]}):"
        printf '%s\n' "${VALIDATION_ERRORS[@]}" | head -5
        if [[ ${#VALIDATION_ERRORS[@]} -gt 5 ]]; then
            echo "   ... and $((${#VALIDATION_ERRORS[@]} - 5)) more"
        fi
        echo ""
    fi

    # Recommendations
    echo "📋 RECOMMENDATIONS:"
    if [[ $percentage -lt 60 ]]; then
        echo "   1. Run /onboard to set up brand architecture"
        echo "   2. Complete business and brand documentation"
    elif [[ $percentage -lt 80 ]]; then
        echo "   1. Complete remaining brand strategy elements"
        echo "   2. Enhance content strategy documentation"
    elif [[ $percentage -lt 90 ]]; then
        echo "   1. Review and complete all configuration elements"
        echo "   2. Ensure all agent handoff templates are configured"
    else
        echo "   🎉 Marketing engine is ready for full operations!"
        echo "   → Launch strategic planning with /cmo"
        echo "   → Begin intelligence gathering with /analyst"
    fi

    echo ""

    # Save report
    local report_file="$CLIENT_CONTEXT/validation/validation-report-$(date +%Y%m%d_%H%M%S).json"
    mkdir -p "$(dirname "$report_file")"

    cat > "$report_file" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "score": $TOTAL_SCORE,
  "max_score": $MAX_SCORE,
  "percentage": $percentage,
  "status": "$status",
  "success_count": ${#VALIDATION_SUCCESS[@]},
  "warning_count": ${#VALIDATION_WARNINGS[@]},
  "error_count": ${#VALIDATION_ERRORS[@]},
  "details": {
    "successes": $(printf '%s\n' "${VALIDATION_SUCCESS[@]}" | jq -R . | jq -s .),
    "warnings": $(printf '%s\n' "${VALIDATION_WARNINGS[@]}" | jq -R . | jq -s .),
    "errors": $(printf '%s\n' "${VALIDATION_ERRORS[@]}" | jq -R . | jq -s .)
  }
}
EOF

    echo "💾 Validation report saved: $report_file"
}

# Main validation function
main() {
    echo "🔍 Starting Marketing Engine Configuration Validation"
    echo "=================================================="

    validate_directory_structure
    validate_claude_configuration
    validate_business_foundation
    validate_brand_strategy
    validate_content_strategy
    validate_user_brand_access
    validate_agent_configuration
    validate_handoff_system

    generate_report

    # Exit with appropriate code
    local percentage
    if [[ $MAX_SCORE -gt 0 ]]; then
        percentage=$(( (TOTAL_SCORE * 100) / MAX_SCORE ))
    else
        percentage=0
    fi

    if [[ $percentage -ge 80 ]]; then
        exit 0  # Ready for operations
    elif [[ $percentage -ge 60 ]]; then
        exit 1  # Partial - needs work
    else
        exit 2  # Incomplete - significant work needed
    fi
}

# Check dependencies
check_dependencies() {
    if ! command -v jq &> /dev/null; then
        echo "Warning: jq not found. Some features may be limited."
    fi
}

# Run validation
check_dependencies
main "$@"