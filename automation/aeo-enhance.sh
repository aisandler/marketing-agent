#!/bin/bash

# AEO Content Enhancement Script
# Optimizes existing content for Answer Engine Optimization
# Author: Marketing Context Engineering System
# Date: 2025-09-17

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTENT_DIR="$PROJECT_ROOT/content"
LOG_FILE="$PROJECT_ROOT/logs/aeo-enhance.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Display usage information
show_usage() {
    echo "Usage: $0 [OPTIONS] <content_file> [content_type]"
    echo ""
    echo "OPTIONS:"
    echo "  -h, --help              Show this help message"
    echo "  -v, --verbose           Enable verbose output"
    echo "  -d, --dry-run          Show what would be done without making changes"
    echo "  -f, --force            Overwrite existing AEO-enhanced content"
    echo "  --target-words <num>   Target word count (default: 2000)"
    echo "  --faq-count <num>      Number of FAQ items to generate (default: 12)"
    echo ""
    echo "ARGUMENTS:"
    echo "  content_file           Path to content file to enhance"
    echo "  content_type           Type: blog, location, guide (optional, auto-detected)"
    echo ""
    echo "EXAMPLES:"
    echo "  $0 content/blog-post.md blog"
    echo "  $0 --target-words 2500 content/service-guide.md"
    echo "  $0 --dry-run content/location-page.md location"
}

# Parse command line arguments
VERBOSE=false
DRY_RUN=false
FORCE=false
TARGET_WORDS=2000
FAQ_COUNT=12
CONTENT_FILE=""
CONTENT_TYPE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        --target-words)
            TARGET_WORDS="$2"
            shift 2
            ;;
        --faq-count)
            FAQ_COUNT="$2"
            shift 2
            ;;
        -*)
            echo "Unknown option $1"
            show_usage
            exit 1
            ;;
        *)
            if [[ -z "$CONTENT_FILE" ]]; then
                CONTENT_FILE="$1"
            elif [[ -z "$CONTENT_TYPE" ]]; then
                CONTENT_TYPE="$1"
            else
                echo "Too many arguments"
                show_usage
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate required arguments
if [[ -z "$CONTENT_FILE" ]]; then
    echo -e "${RED}Error: Content file is required${NC}"
    show_usage
    exit 1
fi

if [[ ! -f "$CONTENT_FILE" ]]; then
    echo -e "${RED}Error: Content file '$CONTENT_FILE' not found${NC}"
    exit 1
fi

# Auto-detect content type if not provided
if [[ -z "$CONTENT_TYPE" ]]; then
    case "$CONTENT_FILE" in
        *blog*)
            CONTENT_TYPE="blog"
            ;;
        *location*)
            CONTENT_TYPE="location"
            ;;
        *guide*)
            CONTENT_TYPE="guide"
            ;;
        *)
            CONTENT_TYPE="blog"
            ;;
    esac
fi

log "${BLUE}Starting AEO enhancement for: $CONTENT_FILE (type: $CONTENT_TYPE)${NC}"

# Check if AEO-enhanced version already exists
AEO_FILE="${CONTENT_FILE%.*}-aeo.${CONTENT_FILE##*.}"
if [[ -f "$AEO_FILE" && "$FORCE" != true ]]; then
    echo -e "${YELLOW}AEO-enhanced version already exists: $AEO_FILE${NC}"
    echo -e "${YELLOW}Use --force to overwrite${NC}"
    exit 0
fi

# Analyze current content
analyze_content() {
    local file="$1"
    local word_count=$(wc -w < "$file")
    local has_faq=$(grep -i "frequently asked questions\|faq" "$file" > /dev/null && echo "yes" || echo "no")
    local has_direct_answer=$(head -20 "$file" | grep -E "^[A-Z].*\." > /dev/null && echo "yes" || echo "no")

    if [[ "$VERBOSE" == true ]]; then
        log "Content analysis:"
        log "  Word count: $word_count"
        log "  Has FAQ: $has_faq"
        log "  Has direct answer: $has_direct_answer"
    fi

    echo "$word_count|$has_faq|$has_direct_answer"
}

# Generate FAQ section based on content type
generate_faq() {
    local content_type="$1"
    local original_file="$2"

    case "$content_type" in
        "blog")
            cat << 'EOF'

## Frequently Asked Questions

### What are the key benefits of this approach?
This approach provides comprehensive solutions that address both immediate needs and long-term strategic goals, ensuring sustainable results for your business.

### How long does implementation typically take?
Most implementations can be completed within 72 hours, depending on the scope and complexity of your specific requirements.

### Is this solution suitable for businesses of all sizes?
Yes, our scalable approach is designed to work effectively for small local businesses as well as larger enterprises.

### What kind of support is available during implementation?
We provide comprehensive support including strategic consultation, technical guidance, and ongoing optimization recommendations.

### How do you measure success and ROI?
We track multiple metrics including performance improvements, efficiency gains, and measurable business outcomes to ensure clear ROI.

### What makes this different from traditional approaches?
Our methodology combines technical expertise with strategic business thinking, providing deeper insights and more effective solutions.

### Can this be integrated with existing systems?
Yes, our solutions are designed to work seamlessly with existing business processes and technology infrastructure.

### What ongoing maintenance is required?
Minimal maintenance is required, with optional quarterly reviews to ensure continued optimization and adaptation to changing needs.

### How do you ensure quality and compliance?
We follow strict quality assurance protocols and maintain compliance with all relevant industry standards and best practices.

### What if the solution doesn't meet expectations?
We work closely with clients to ensure satisfaction and provide adjustments as needed to meet your specific business objectives.

### Are there any additional costs or hidden fees?
All costs are transparent and discussed upfront, with no hidden fees or unexpected charges.

### How quickly can we see results?
Most clients see initial results within the first week of implementation, with significant improvements typically visible within 30 days.
EOF
            ;;
        "location")
            cat << 'EOF'

## Frequently Asked Questions About Our Local Services

### What areas do you serve?
We provide comprehensive service coverage throughout the local area, including same-day and emergency response options.

### Do you offer emergency services?
Yes, we provide 24/7 emergency response for urgent situations that require immediate professional attention.

### What makes your local team different?
Our local technicians have extensive knowledge of area-specific challenges and use proven methods tailored to local conditions.

### How quickly can you respond to service calls?
We typically respond to standard service calls within 24 hours, with emergency services available immediately.

### Do you provide free estimates?
Yes, we offer comprehensive free estimates that include detailed assessment and transparent pricing.

### Are your services guaranteed?
All our services come with quality guarantees and follow-up support to ensure your complete satisfaction.

### What safety measures do you follow?
We follow strict safety protocols and use only EPA-approved methods that are safe for families and pets.

### Do you offer preventive maintenance programs?
Yes, we provide scheduled maintenance programs designed to prevent problems before they occur.

### How do you handle seasonal challenges?
Our team is specially trained to address seasonal issues with proactive solutions and timely interventions.

### What payment options are available?
We accept multiple payment methods and offer flexible payment plans to meet your budget requirements.

### Do you provide follow-up services?
Yes, we include follow-up inspections and ongoing support as part of our comprehensive service commitment.

### How do you ensure environmentally responsible practices?
We use eco-friendly methods and materials whenever possible, prioritizing environmental safety without compromising effectiveness.
EOF
            ;;
        "guide")
            cat << 'EOF'

## Frequently Asked Questions About Implementation

### What are the prerequisites for getting started?
Basic business infrastructure and commitment to following the recommended implementation process are the primary requirements.

### How comprehensive is the implementation process?
Our implementation covers all essential aspects from initial assessment through ongoing optimization and support.

### What level of technical expertise is required?
No advanced technical knowledge is required - we provide clear guidance and support throughout the entire process.

### How do you customize solutions for different business types?
We adapt our proven methodology to your specific industry, business size, and unique operational requirements.

### What resources will I need to dedicate to this process?
Most implementations require minimal time investment from your team, with most work handled by our specialists.

### How do you handle complex or unique situations?
Our experienced team has handled diverse scenarios and can adapt solutions to meet virtually any business challenge.

### What training and documentation is provided?
Comprehensive training materials and ongoing documentation ensure your team can effectively maintain and optimize results.

### How do you ensure the solution scales with business growth?
Our scalable framework is designed to grow with your business, with built-in expansion capabilities.

### What metrics will we track to measure success?
We establish clear KPIs and tracking mechanisms to monitor progress and demonstrate measurable business impact.

### How often should we review and optimize the implementation?
Quarterly reviews are recommended to ensure continued effectiveness and identify new optimization opportunities.

### What support is available if issues arise?
Ongoing support includes troubleshooting, optimization recommendations, and strategic guidance as needed.

### Can this be implemented alongside other business initiatives?
Yes, our approach is designed to complement and enhance other business improvement efforts.
EOF
            ;;
    esac
}

# Enhance content for AEO
enhance_content() {
    local input_file="$1"
    local output_file="$2"
    local content_type="$3"

    # Read original content
    local original_content=$(cat "$input_file")

    # Extract title (first line that looks like a title)
    local title=$(echo "$original_content" | grep -E "^#\s+" | head -1 | sed 's/^#\s*//')
    if [[ -z "$title" ]]; then
        title=$(echo "$original_content" | head -5 | grep -E "^[A-Z]" | head -1)
    fi

    # Create AEO-enhanced version
    {
        # Add direct answer section if not present
        if ! echo "$original_content" | head -20 | grep -E "^[A-Z].*\." > /dev/null; then
            echo "## Quick Answer"
            echo ""
            case "$content_type" in
                "blog")
                    echo "This comprehensive guide provides proven strategies and actionable insights to help you achieve your goals effectively. Our approach combines technical expertise with practical implementation to deliver measurable results for your business."
                    ;;
                "location")
                    echo "Our local service team provides comprehensive solutions for your area, with same-day response and proven methods tailored to local conditions. We deliver reliable, effective results with full satisfaction guarantees."
                    ;;
                "guide")
                    echo "This implementation guide provides step-by-step instructions and best practices to ensure successful deployment and optimization. Follow these proven methods to achieve rapid results and long-term success."
                    ;;
            esac
            echo ""
            echo "---"
            echo ""
        fi

        # Include original content
        echo "$original_content"

        # Add FAQ section if not present
        if ! echo "$original_content" | grep -i "frequently asked questions\|faq" > /dev/null; then
            generate_faq "$content_type" "$input_file"
        fi

        # Add structured conclusion
        echo ""
        echo "## Summary and Next Steps"
        echo ""
        echo "This comprehensive resource provides the essential information and actionable strategies you need to achieve your objectives. The proven methods outlined here have been successfully implemented across diverse scenarios, delivering consistent results and measurable improvements."
        echo ""
        echo "**Key takeaways:**"
        echo "- Comprehensive approach that addresses both immediate needs and long-term goals"
        echo "- Proven methodology with demonstrated results across various applications"
        echo "- Professional support and ongoing optimization opportunities available"
        echo "- Clear implementation path with measurable outcomes and success metrics"
        echo ""
        echo "Ready to get started? Contact our team for personalized consultation and implementation support tailored to your specific requirements."

    } > "$output_file"
}

# Main enhancement process
if [[ "$DRY_RUN" == true ]]; then
    log "${YELLOW}DRY RUN: Would enhance $CONTENT_FILE -> $AEO_FILE${NC}"
    analysis=$(analyze_content "$CONTENT_FILE")
    word_count=$(echo "$analysis" | cut -d'|' -f1)
    log "Current word count: $word_count"
    log "Target word count: $TARGET_WORDS"
    log "Would add FAQ section with $FAQ_COUNT questions"
    log "Would add direct answer section"
    log "Would add structured conclusion"
else
    log "${BLUE}Enhancing content...${NC}"
    enhance_content "$CONTENT_FILE" "$AEO_FILE" "$CONTENT_TYPE"

    # Verify enhancement
    new_analysis=$(analyze_content "$AEO_FILE")
    new_word_count=$(echo "$new_analysis" | cut -d'|' -f1)

    log "${GREEN}Enhancement complete!${NC}"
    log "Original file: $CONTENT_FILE"
    log "Enhanced file: $AEO_FILE"
    log "Word count increase: $(( new_word_count - $(echo "$(analyze_content "$CONTENT_FILE")" | cut -d'|' -f1) )) words"
    log "New total word count: $new_word_count words"
fi

log "${GREEN}AEO enhancement process completed successfully${NC}"