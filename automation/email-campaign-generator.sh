#!/bin/bash

# Email Campaign Generator Script
# Usage: Generate email campaigns using templates and client configuration

# Load client configuration
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/config_loader.sh"
load_client_config
validate_config

# Set project directory
PROJECT_DIR="/Users/adamsandler/projects/Marketing-team-base"
EMAIL_TEMPLATES_DIR="$PROJECT_DIR/content/templates/email"
OUTPUT_DIR="$PROJECT_DIR/content/email-campaigns"

# Email campaign types
CAMPAIGN_TYPES=(
    "newsletter"
    "promotional"
    "drip-sequence"
    "transactional"
    "seasonal-reminder"
    "reactivation"
)

# Function to display usage
show_usage() {
    echo "🏗️ Email Campaign Generator"
    echo ""
    echo "Usage: $0 [CAMPAIGN_TYPE] [OPTIONS]"
    echo ""
    echo "Campaign Types:"
    echo "  newsletter        - Monthly newsletter campaign"
    echo "  promotional       - Promotional/offer campaign"
    echo "  drip-sequence     - Automated email sequence"
    echo "  transactional     - Service-related emails"
    echo "  seasonal-reminder - Seasonal service reminders"
    echo "  reactivation      - Win-back customer campaigns"
    echo ""
    echo "Options:"
    echo "  --subject TEXT    - Custom subject line"
    echo "  --offer TEXT      - Promotional offer details"
    echo "  --season TEXT     - Seasonal context (spring, summer, fall, winter)"
    echo "  --service TEXT    - Specific service type"
    echo "  --location TEXT   - Target location"
    echo "  --urgency LEVEL   - Urgency level (low, medium, high)"
    echo "  --output FILE     - Output filename"
    echo "  --preview         - Generate preview only"
    echo "  --validate        - Run content validation"
    echo ""
    echo "Examples:"
    echo "  $0 newsletter --season fall"
    echo "  $0 promotional --offer '20% off' --urgency high"
    echo "  $0 drip-sequence --service 'commercial leasing' --output welcome-series"
    echo ""
}

# Function to validate campaign type
validate_campaign_type() {
    local type="$1"
    for valid_type in "${CAMPAIGN_TYPES[@]}"; do
        if [ "$type" = "$valid_type" ]; then
            return 0
        fi
    done
    return 1
}

# Function to get current season
get_current_season() {
    local month=$(date +%m)
    case $month in
        03|04|05) echo "spring" ;;
        06|07|08) echo "summer" ;;
        09|10|11) echo "fall" ;;
        12|01|02) echo "winter" ;;
        *) echo "spring" ;;
    esac
}

# Function to get seasonal context
get_seasonal_context() {
    local season="$1"
    case $season in
        "spring")
            echo "Spring preparation and seasonal service needs"
            ;;
        "summer")
            echo "Peak activity protection and immediate service needs"
            ;;
        "fall")
            echo "Winter preparation and preventive services"
            ;;
        "winter")
            echo "Indoor comfort and spring planning"
            ;;
        *)
            echo "Year-round protection and maintenance"
            ;;
    esac
}

# Function to generate personalization variables
generate_variables() {
    local campaign_type="$1"
    local season="$2"
    local service="$3"
    local location="$4"
    local offer="$5"

    cat << EOF
# Email Campaign Variables
# Generated: $(date)
# Campaign Type: $campaign_type

CLIENT_NAME="$CLIENT_NAME"
INDUSTRY_TYPE="$INDUSTRY_TYPE"
BUSINESS_TYPE="$BUSINESS_TYPE"
WEBSITE_URL="$WEBSITE_URL"
SERVICE_AREA="$SERVICE_AREA"
BRAND_VOICE="$BRAND_VOICE_ATTRIBUTES"
CORE_MESSAGE="$CORE_MESSAGE"
YEARS_EXPERIENCE="$YEARS_EXPERIENCE"

# Campaign-specific variables
CAMPAIGN_TYPE="$campaign_type"
SEASON="$season"
SEASONAL_CONTEXT="$(get_seasonal_context "$season")"
SERVICE_FOCUS="$service"
TARGET_LOCATION="$location"
OFFER_DETAILS="$offer"

# Current date variables
CURRENT_MONTH="$(date +%B)"
CURRENT_YEAR="$(date +%Y)"
CURRENT_DATE="$(date +%Y-%m-%d)"

# Email metadata
GENERATED_BY="Email Campaign Generator"
TEMPLATE_VERSION="1.0"
EOF
}

# Function to process template with variables
process_template() {
    local template_file="$1"
    local variables_file="$2"
    local output_file="$3"

    if [ ! -f "$template_file" ]; then
        echo "❌ Template file not found: $template_file"
        return 1
    fi

    # Source variables
    source "$variables_file"

    # Process template substitutions
    sed -e "s/{{CLIENT_NAME}}/$CLIENT_NAME/g" \
        -e "s/{{INDUSTRY_TYPE}}/$INDUSTRY_TYPE/g" \
        -e "s/{{BUSINESS_TYPE}}/$BUSINESS_TYPE/g" \
        -e "s/{{WEBSITE_URL}}/$WEBSITE_URL/g" \
        -e "s/{{SERVICE_AREA}}/$SERVICE_AREA/g" \
        -e "s/{{BRAND_VOICE}}/$BRAND_VOICE_ATTRIBUTES/g" \
        -e "s/{{CORE_MESSAGE}}/$CORE_MESSAGE/g" \
        -e "s/{{YEARS_EXPERIENCE}}/$YEARS_EXPERIENCE/g" \
        -e "s/{{SEASON}}/$SEASON/g" \
        -e "s/{{SEASONAL_CONTEXT}}/$SEASONAL_CONTEXT/g" \
        -e "s/{{SERVICE_FOCUS}}/$SERVICE_FOCUS/g" \
        -e "s/{{TARGET_LOCATION}}/$TARGET_LOCATION/g" \
        -e "s/{{OFFER_DETAILS}}/$OFFER_DETAILS/g" \
        -e "s/{{CURRENT_MONTH}}/$CURRENT_MONTH/g" \
        -e "s/{{CURRENT_YEAR}}/$CURRENT_YEAR/g" \
        -e "s/{{CURRENT_DATE}}/$CURRENT_DATE/g" \
        "$template_file" > "$output_file"
}

# Function to run content validation
run_validation() {
    local email_file="$1"

    if [ -f "$PROJECT_DIR/validation/validate-content.js" ]; then
        echo "🔍 Running content validation..."
        node "$PROJECT_DIR/validation/validate-content.js" "$email_file"
        return $?
    else
        echo "⚠️ Content validation not available"
        return 0
    fi
}

# Function to generate email campaign
generate_campaign() {
    local campaign_type="$1"
    local subject="$2"
    local offer="$3"
    local season="$4"
    local service="$5"
    local location="$6"
    local urgency="$7"
    local output_filename="$8"
    local preview_only="$9"
    local validate="${10}"

    # Set defaults
    [ -z "$season" ] && season=$(get_current_season)
    [ -z "$service" ] && service="$INDUSTRY_TYPE services"
    [ -z "$location" ] && location="$SERVICE_AREA"
    [ -z "$output_filename" ] && output_filename="${campaign_type}-$(date +%Y%m%d)"

    echo "📧 Generating $campaign_type email campaign..."
    echo "   Season: $season"
    echo "   Service: $service"
    echo "   Location: $location"
    [ -n "$offer" ] && echo "   Offer: $offer"
    [ -n "$subject" ] && echo "   Subject: $subject"
    echo ""

    # Create output directory
    mkdir -p "$OUTPUT_DIR"

    # Generate variables file
    local variables_file="$OUTPUT_DIR/${output_filename}-variables.sh"
    generate_variables "$campaign_type" "$season" "$service" "$location" "$offer" > "$variables_file"

    # Determine template file
    local template_file="$EMAIL_TEMPLATES_DIR/${campaign_type}-template.md"

    # Generate campaign
    local output_file="$OUTPUT_DIR/${output_filename}.md"

    if process_template "$template_file" "$variables_file" "$output_file"; then
        echo "✅ Email campaign generated: $output_file"

        # Add custom subject if provided
        if [ -n "$subject" ]; then
            echo "" >> "$output_file"
            echo "## Custom Subject Line" >> "$output_file"
            echo "$subject" >> "$output_file"
        fi

        # Add urgency indicators
        if [ "$urgency" = "high" ]; then
            echo "" >> "$output_file"
            echo "## Urgency: HIGH PRIORITY" >> "$output_file"
            echo "- Recommend immediate sending" >> "$output_file"
            echo "- Follow up within 24-48 hours" >> "$output_file"
        fi

        # Run validation if requested
        if [ "$validate" = "true" ]; then
            run_validation "$output_file"
        fi

        # Preview mode
        if [ "$preview_only" = "true" ]; then
            echo ""
            echo "📄 PREVIEW MODE - Content generated but not saved to production"
            echo "   File: $output_file"
            echo ""
            echo "First 10 lines:"
            head -10 "$output_file"
            echo "..."
        else
            echo ""
            echo "📁 Campaign files:"
            echo "   Campaign: $output_file"
            echo "   Variables: $variables_file"
            echo ""
            echo "📊 Next steps:"
            echo "   1. Review campaign content"
            echo "   2. Test email rendering"
            echo "   3. Schedule or send campaign"
            echo "   4. Track performance metrics"
        fi

        # Clean up temporary variables file
        rm -f "$variables_file"

    else
        echo "❌ Failed to generate email campaign"
        return 1
    fi
}

# Main script logic
main() {
    # Parse arguments
    local campaign_type=""
    local subject=""
    local offer=""
    local season=""
    local service=""
    local location=""
    local urgency="medium"
    local output_filename=""
    local preview_only="false"
    local validate="false"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --subject)
                subject="$2"
                shift 2
                ;;
            --offer)
                offer="$2"
                shift 2
                ;;
            --season)
                season="$2"
                shift 2
                ;;
            --service)
                service="$2"
                shift 2
                ;;
            --location)
                location="$2"
                shift 2
                ;;
            --urgency)
                urgency="$2"
                shift 2
                ;;
            --output)
                output_filename="$2"
                shift 2
                ;;
            --preview)
                preview_only="true"
                shift
                ;;
            --validate)
                validate="true"
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                if [ -z "$campaign_type" ]; then
                    campaign_type="$1"
                else
                    echo "❌ Unknown option: $1"
                    show_usage
                    exit 1
                fi
                shift
                ;;
        esac
    done

    # Validate required arguments
    if [ -z "$campaign_type" ]; then
        echo "❌ Campaign type is required"
        show_usage
        exit 1
    fi

    if ! validate_campaign_type "$campaign_type"; then
        echo "❌ Invalid campaign type: $campaign_type"
        echo "Valid types: ${CAMPAIGN_TYPES[*]}"
        exit 1
    fi

    # Generate campaign
    generate_campaign "$campaign_type" "$subject" "$offer" "$season" "$service" "$location" "$urgency" "$output_filename" "$preview_only" "$validate"
}

# Run script if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi