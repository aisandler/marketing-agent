#!/bin/bash

# Client Configuration Loader
# Common functions for loading client-specific configuration from config/client.config.json

# Get the project root directory
get_project_root() {
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    echo "$(dirname "$script_dir")"
}

# Load configuration value using jq
load_config() {
    local key="$1"
    local config_file="$(get_project_root)/config/client.config.json"

    if [ ! -f "$config_file" ]; then
        echo "❌ Client configuration not found: $config_file" >&2
        echo "Please copy config/client.config.template.json to config/client.config.json and configure it." >&2
        exit 1
    fi

    local value=$(jq -r "$key // empty" "$config_file" 2>/dev/null)

    if [ -z "$value" ] || [ "$value" = "null" ]; then
        echo "❌ Configuration key '$key' not found or empty" >&2
        exit 1
    fi

    echo "$value"
}

# Load all basic client config variables
load_client_config() {
    export CLIENT_NAME=$(load_config '.client.name')
    export CLIENT_INDUSTRY=$(load_config '.client.industry')
    export CLIENT_BUSINESS_TYPE=$(load_config '.client.businessType')
    export CLIENT_WEBSITE=$(load_config '.client.website')
    export CLIENT_PHONE=$(load_config '.client.phone')
    export CLIENT_EMAIL=$(load_config '.client.email')

    export PRIMARY_LOCATION=$(load_config '.client.serviceArea.primary')
    export STATE=$(load_config '.client.serviceArea.state')
    export REGION=$(load_config '.client.serviceArea.region')

    export AIRTABLE_WEBHOOK_URL=$(load_config '.airtable.webhookUrl')
    export AIRTABLE_BASE_ID=$(load_config '.airtable.baseId')
    export AIRTABLE_TABLE_ID=$(load_config '.airtable.tableId')

    export PRIMARY_MESSAGE=$(load_config '.branding.primaryMessage')
    export TAGLINE=$(load_config '.branding.tagline')
    export BRAND_TONE=$(load_config '.branding.tone')
}

# Get dashboard filename
get_dashboard_filename() {
    local client_name_lower=$(echo "$CLIENT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
    echo "${client_name_lower}-interactive-dashboard.html"
}

# Get system name for display
get_system_name() {
    echo "$CLIENT_NAME $(echo "$CLIENT_BUSINESS_TYPE" | tr '[:lower:]' '[:upper:]') System"
}

# Validate required configuration
validate_config() {
    local required_vars=(
        "CLIENT_NAME"
        "CLIENT_INDUSTRY"
        "AIRTABLE_BASE_ID"
        "AIRTABLE_TABLE_ID"
        "AIRTABLE_WEBHOOK_URL"
    )

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "❌ Required configuration variable $var is not set" >&2
            exit 1
        fi
    done

    echo "✅ Configuration validation passed"
}

# Get service-specific content based on industry
get_industry_content() {
    local industry=$(echo "$CLIENT_INDUSTRY" | tr '[:upper:]' '[:lower:]')

    case "$industry" in
        "legal_services"|"legal services")
            echo "legal services"
            ;;
        "real_estate"|"real estate")
            echo "real estate services"
            ;;
        "financial_services"|"financial services")
            echo "financial services"
            ;;
        "professional_services"|"professional services")
            echo "professional services"
            ;;
        "healthcare")
            echo "healthcare services"
            ;;
        *)
            echo "professional services"
            ;;
    esac
}

# Get location-specific references
get_multi_state_reference() {
    local locations=$(load_config '.client.serviceArea.secondary[]' 2>/dev/null | tr '\n' ', ' | sed 's/, $//')
    if [ -n "$locations" ]; then
        echo "Multi-State ($locations)"
    else
        echo "Multi-Location"
    fi
}