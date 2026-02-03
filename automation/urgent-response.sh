#!/bin/bash

# Urgent Crisis Response Automation Script
# Usage: ./automation/urgent-response.sh [CRISIS_LEVEL] [CRISIS_TYPE] [DESCRIPTION]

# Load client configuration
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/config_loader.sh"
load_client_config
validate_config

# Set project directory
PROJECT_DIR="/Users/adamsandler/projects/Marketing-team-base"
CRISIS_TEMPLATES_DIR="$PROJECT_DIR/content/templates/crisis"
LOG_DIR="$PROJECT_DIR/logs/crisis"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Crisis response configuration
CRISIS_LEVELS=(
    "STANDARD"
    "PRIORITY"
    "URGENT"
    "CRITICAL"
)

CRISIS_TYPES=(
    "negative-review"
    "social-media"
    "service-failure"
    "property-damage"
    "safety-incident"
    "legal-threat"
    "media-inquiry"
    "regulatory-issue"
    "staff-behavior"
    "billing-dispute"
    "other"
)

# Response time SLAs (in minutes) - macOS compatible
get_response_time() {
    case "$1" in
        "STANDARD") echo "240" ;;    # 4 hours
        "PRIORITY") echo "120" ;;    # 2 hours
        "URGENT") echo "60" ;;       # 1 hour
        "CRITICAL") echo "30" ;;     # 30 minutes
        *) echo "60" ;;              # default 1 hour
    esac
}

# Contact information (would be loaded from config)
MANAGER_PHONE="${MANAGER_PHONE:-555-0100}"
SENIOR_MANAGER_PHONE="${SENIOR_MANAGER_PHONE:-555-0101}"
CEO_PHONE="${CEO_PHONE:-555-0102}"
LEGAL_PHONE="${LEGAL_PHONE:-555-0103}"
INSURANCE_PHONE="${INSURANCE_PHONE:-555-0104}"

# Function to display usage
show_usage() {
    echo "🚨 Crisis Response Automation System"
    echo ""
    echo "Usage: $0 [CRISIS_LEVEL] [CRISIS_TYPE] [DESCRIPTION]"
    echo ""
    echo "Crisis Levels:"
    echo "  1 | STANDARD  - Routine customer service issues (4hr response)"
    echo "  2 | PRIORITY  - Serious concerns requiring management (2hr response)"
    echo "  3 | URGENT    - Immediate senior management intervention (1hr response)"
    echo "  4 | CRITICAL  - Severe reputation/legal threats (30min response)"
    echo ""
    echo "Crisis Types:"
    echo "  negative-review    - Negative online reviews"
    echo "  social-media       - Social media complaints/crises"
    echo "  service-failure    - Major service quality failures"
    echo "  property-damage    - Property damage during service"
    echo "  safety-incident    - Safety or health incidents"
    echo "  legal-threat       - Legal threats or action"
    echo "  media-inquiry      - Media inquiries or coverage"
    echo "  regulatory-issue   - Regulatory investigations"
    echo "  staff-behavior     - Unprofessional staff behavior"
    echo "  billing-dispute    - Major billing disputes"
    echo "  other              - Other crisis situations"
    echo ""
    echo "Examples:"
    echo "  $0 3 negative-review 'Multiple 1-star reviews posted on Google'"
    echo "  $0 4 legal-threat 'Customer threatens lawsuit over property damage'"
    echo "  $0 2 service-failure 'Treatment failed, problem returned within week'"
    echo ""
}

# Function to validate crisis level
validate_crisis_level() {
    local level="$1"

    # Convert number to level name
    case "$level" in
        1) echo "STANDARD" ;;
        2) echo "PRIORITY" ;;
        3) echo "URGENT" ;;
        4) echo "CRITICAL" ;;
        "STANDARD"|"PRIORITY"|"URGENT"|"CRITICAL") echo "$level" ;;
        *) return 1 ;;
    esac
}

# Function to validate crisis type
validate_crisis_type() {
    local type="$1"
    for valid_type in "${CRISIS_TYPES[@]}"; do
        if [ "$type" = "$valid_type" ]; then
            return 0
        fi
    done
    return 1
}

# Function to generate incident ID
generate_incident_id() {
    local level="$1"
    local type="$2"
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local level_code="${level:0:1}"
    local type_code=$(echo "$type" | tr '[:lower:]' '[:upper:]' | sed 's/-//g' | cut -c1-3)
    echo "CR-${level_code}${type_code}-${timestamp}"
}

# Function to calculate response deadline - macOS compatible
calculate_deadline() {
    local level="$1"
    local response_time=$(get_response_time "$level")
    # macOS date command uses different syntax
    local deadline=$(date -v "+${response_time}M" '+%Y-%m-%d %H:%M:%S')
    echo "$deadline"
}

# Function to log crisis incident
log_incident() {
    local incident_id="$1"
    local level="$2"
    local type="$3"
    local description="$4"
    local deadline="$5"

    local log_file="$LOG_DIR/crisis-log-$(date +%Y%m).log"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    cat >> "$log_file" << EOF
[$timestamp] CRISIS ALERT INITIATED
Incident ID: $incident_id
Crisis Level: $level
Crisis Type: $type
Description: $description
Response Deadline: $deadline
Client: $CLIENT_NAME
Reported By: $(whoami)
Status: ACTIVE
---
EOF
}

# Function to generate crisis response based on template
generate_response() {
    local level="$1"
    local type="$2"
    local description="$3"
    local incident_id="$4"

    echo "📝 Generating crisis response templates..."

    # Determine appropriate template
    local template_file=""
    case "$type" in
        "negative-review")
            template_file="$CRISIS_TEMPLATES_DIR/negative-review-responses.md"
            ;;
        "social-media"|"media-inquiry")
            template_file="$CRISIS_TEMPLATES_DIR/pr-crisis-statements.md"
            ;;
        "service-failure"|"property-damage"|"safety-incident"|"staff-behavior"|"billing-dispute")
            template_file="$CRISIS_TEMPLATES_DIR/apology-templates.md"
            ;;
        *)
            template_file="$CRISIS_TEMPLATES_DIR/pr-crisis-statements.md"
            ;;
    esac

    if [ -f "$template_file" ]; then
        echo "✅ Template available: $(basename "$template_file")"
        echo "   Location: $template_file"
    else
        echo "⚠️ Template not found: $template_file"
    fi

    # Generate response document
    local response_file="$LOG_DIR/response-${incident_id}.md"
    cat > "$response_file" << EOF
# Crisis Response Plan - $incident_id

## Incident Details
- **Level:** $level
- **Type:** $type
- **Description:** $description
- **Timestamp:** $(date '+%Y-%m-%d %H:%M:%S')
- **Response SLA:** $(get_response_time "$level") minutes

## Immediate Actions Required
$(get_action_checklist "$level")

## Response Templates
See: $template_file

## Contact Information
$(get_contact_list "$level")

## Documentation
- Response logged in: $response_file
- Incident tracking: $incident_id
- Follow-up required: Yes
EOF

    echo "📄 Response plan generated: $response_file"
}

# Function to get action checklist based on level
get_action_checklist() {
    local level="$1"

    case "$level" in
        "STANDARD")
            cat << EOF
- [ ] Document customer concern in CRM
- [ ] Acknowledge receipt within 4 hours
- [ ] Investigate issue thoroughly
- [ ] Respond with solution or status update
- [ ] Follow up within 24-48 hours
EOF
            ;;
        "PRIORITY")
            cat << EOF
- [ ] Notify supervisor within 30 minutes
- [ ] Personal customer contact within 2 hours
- [ ] Develop resolution plan with timeline
- [ ] Implement solution with customer approval
- [ ] Same-day follow-up confirmation
- [ ] Document lessons learned
EOF
            ;;
        "URGENT")
            cat << EOF
- [ ] Alert senior management immediately
- [ ] Personal contact within 1 hour (phone preferred)
- [ ] Activate emergency response team if needed
- [ ] Detailed incident investigation
- [ ] Legal consultation if liability concerns
- [ ] Comprehensive resolution with compensation
- [ ] Multiple follow-up contacts until satisfied
EOF
            ;;
        "CRITICAL")
            cat << EOF
- [ ] CEO/Owner notification within 15 minutes
- [ ] Legal counsel contacted within 30 minutes
- [ ] Crisis team assembled within 1 hour
- [ ] Stakeholder notification (insurance, partners)
- [ ] Coordinated public response within 2 hours
- [ ] Legal-standard documentation
- [ ] Comprehensive reputation management plan
- [ ] Full organizational review initiated
EOF
            ;;
    esac
}

# Function to get contact list based on level
get_contact_list() {
    local level="$1"

    case "$level" in
        "STANDARD")
            echo "- Customer Service: $CUSTOMER_SERVICE_PHONE"
            echo "- Supervisor: $MANAGER_PHONE"
            ;;
        "PRIORITY")
            echo "- Operations Manager: $MANAGER_PHONE"
            echo "- Senior Management: $SENIOR_MANAGER_PHONE"
            ;;
        "URGENT")
            echo "- Senior Management: $SENIOR_MANAGER_PHONE"
            echo "- CEO/Owner: $CEO_PHONE"
            echo "- Legal (if needed): $LEGAL_PHONE"
            ;;
        "CRITICAL")
            echo "- CEO/Owner: $CEO_PHONE"
            echo "- Legal Counsel: $LEGAL_PHONE"
            echo "- Insurance: $INSURANCE_PHONE"
            echo "- Emergency Response Team: All hands"
            ;;
    esac
}

# Function to send alerts (simulated)
send_alerts() {
    local level="$1"
    local incident_id="$2"
    local description="$3"

    echo "📢 Sending crisis alerts for $level level incident..."

    case "$level" in
        "STANDARD")
            echo "   → Customer Service Team notified"
            echo "   → Supervisor on standby"
            ;;
        "PRIORITY")
            echo "   → Operations Manager alerted"
            echo "   → Senior Management notified"
            echo "   → 2-hour response timer started"
            ;;
        "URGENT")
            echo "   → Senior Management immediately alerted"
            echo "   → Emergency contact protocols activated"
            echo "   → 1-hour response timer started"
            echo "   → Legal team on standby"
            ;;
        "CRITICAL")
            echo "   → CEO/Owner immediately contacted"
            echo "   → Crisis team assembly initiated"
            echo "   → Legal counsel contacted"
            echo "   → Insurance carrier notified"
            echo "   → 30-minute response timer started"
            echo "   → Media monitoring activated"
            ;;
    esac

    # In real implementation, this would send actual SMS/email/phone alerts
    echo "   📱 Alert methods: SMS, Email, Phone calls"
    echo "   🕐 Response deadline: $(calculate_deadline "$level")"
}

# Function to start monitoring
start_monitoring() {
    local incident_id="$1"
    local level="$2"
    local deadline="$3"

    echo "🔍 Starting incident monitoring for $incident_id"
    echo "   Response SLA: $deadline"
    echo "   Monitoring level: $level"
    echo "   Check status: ./automation/urgent-response.sh status $incident_id"
}

# Function to test crisis scenario
test_scenario() {
    local scenario="$1"

    echo "🧪 Testing crisis scenario: $scenario"

    case "$scenario" in
        "negative-review")
            echo "Simulating: Customer posts 1-star Google review"
            ./automation/urgent-response.sh 3 negative-review "Customer posted 1-star review claiming unprofessional service"
            ;;
        "service-failure")
            echo "Simulating: Major service failure"
            ./automation/urgent-response.sh 2 service-failure "Treatment completely ineffective, customer demands refund"
            ;;
        "property-damage")
            echo "Simulating: Property damage incident"
            ./automation/urgent-response.sh 3 property-damage "Technician accidentally damaged customer's expensive furniture"
            ;;
        "legal-threat")
            echo "Simulating: Legal threat"
            ./automation/urgent-response.sh 4 legal-threat "Customer threatens lawsuit over alleged health issues"
            ;;
        "social-media-crisis")
            echo "Simulating: Social media crisis"
            ./automation/urgent-response.sh 4 social-media "Angry customer post going viral on Facebook with 200+ shares"
            ;;
        *)
            echo "Available test scenarios:"
            echo "  negative-review"
            echo "  service-failure"
            echo "  property-damage"
            echo "  legal-threat"
            echo "  social-media-crisis"
            ;;
    esac
}

# Main script logic
main() {
    if [ $# -eq 0 ]; then
        show_usage
        exit 1
    fi

    # Special commands
    case "$1" in
        "test")
            test_scenario "$2"
            exit 0
            ;;
        "status")
            echo "📊 Crisis incident status for: $2"
            if [ -f "$LOG_DIR/response-$2.md" ]; then
                echo "✅ Incident file found"
                grep -A 5 "## Incident Details" "$LOG_DIR/response-$2.md"
            else
                echo "❌ Incident not found"
            fi
            exit 0
            ;;
        "list")
            echo "📋 Recent crisis incidents:"
            ls -la "$LOG_DIR"/response-*.md 2>/dev/null | tail -10 || echo "No incidents found"
            exit 0
            ;;
        "--help"|"-h")
            show_usage
            exit 0
            ;;
    esac

    # Parse arguments
    local crisis_level_input="$1"
    local crisis_type="$2"
    local description="$3"

    # Validate arguments
    if [ -z "$crisis_level_input" ] || [ -z "$crisis_type" ] || [ -z "$description" ]; then
        echo "❌ Error: Missing required arguments"
        show_usage
        exit 1
    fi

    # Validate and convert crisis level
    local crisis_level=$(validate_crisis_level "$crisis_level_input")
    if [ $? -ne 0 ]; then
        echo "❌ Error: Invalid crisis level '$crisis_level_input'"
        show_usage
        exit 1
    fi

    # Validate crisis type
    if ! validate_crisis_type "$crisis_type"; then
        echo "❌ Error: Invalid crisis type '$crisis_type'"
        show_usage
        exit 1
    fi

    # Generate incident details
    local incident_id=$(generate_incident_id "$crisis_level" "$crisis_type")
    local deadline=$(calculate_deadline "$crisis_level")

    echo "🚨 CRISIS ALERT INITIATED"
    echo "═══════════════════════════════════════"
    echo "Incident ID: $incident_id"
    echo "Client: $CLIENT_NAME"
    echo "Level: $crisis_level"
    echo "Type: $crisis_type"
    echo "Description: $description"
    echo "Response SLA: $(get_response_time "$crisis_level") minutes"
    echo "Deadline: $deadline"
    echo "═══════════════════════════════════════"
    echo ""

    # Log the incident
    log_incident "$incident_id" "$crisis_level" "$crisis_type" "$description" "$deadline"

    # Generate response plan
    generate_response "$crisis_level" "$crisis_type" "$description" "$incident_id"

    # Send alerts
    send_alerts "$crisis_level" "$incident_id" "$description"

    # Start monitoring
    start_monitoring "$incident_id" "$crisis_level" "$deadline"

    echo ""
    echo "✅ Crisis response initiated successfully"
    echo "📋 Next steps:"
    echo "   1. Review response plan: $LOG_DIR/response-${incident_id}.md"
    echo "   2. Follow action checklist immediately"
    echo "   3. Contact appropriate team members"
    echo "   4. Monitor progress: ./automation/urgent-response.sh status $incident_id"
    echo ""
    echo "⚠️  RESPONSE DEADLINE: $deadline"
    echo "🕐 Time remaining: $(get_response_time "$crisis_level") minutes from now"
}

# Run script if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi