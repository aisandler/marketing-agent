#!/bin/bash

# /setup-client Implementation
# Guided client onboarding with interactive prompts

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}===================================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}===================================================${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[INPUT NEEDED]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Get client name from command line or prompt
CLIENT_NAME="$1"
if [ -z "$CLIENT_NAME" ]; then
    print_warning "Enter client name (lowercase, hyphens for spaces):"
    read -r CLIENT_NAME
fi

# Validate client name format
if [[ ! "$CLIENT_NAME" =~ ^[a-z0-9-]+$ ]]; then
    print_error "Client name must be lowercase letters, numbers, and hyphens only"
    exit 1
fi

print_header "🚀 CLIENT ONBOARDING: $CLIENT_NAME"
print_info "This guided setup will take 15-20 minutes and establish complete brand context."
echo ""

# Check if client already exists
if git show-ref --verify --quiet "refs/heads/client-$CLIENT_NAME"; then
    print_error "Client branch 'client-$CLIENT_NAME' already exists!"
    print_info "Use /update-client-context instead to modify existing client."
    exit 1
fi

# Create client directory for storing responses
CLIENT_DIR="deployment/clients/$CLIENT_NAME"
mkdir -p "$CLIENT_DIR"

print_step "Phase 1: Business Fundamentals"
echo ""

# Business Fundamentals
print_warning "Company Name (full business name):"
read -r COMPANY_NAME

print_warning "Industry Type:"
echo "  1) Legal Services"
echo "  2) Real Estate"
echo "  3) Financial Services"
echo "  4) Professional Services"
echo "  5) Healthcare"
echo "  6) Technology"
echo "  7) Other (specify)"
read -r INDUSTRY_CHOICE

case $INDUSTRY_CHOICE in
    1) INDUSTRY="legal_services" ;;
    2) INDUSTRY="real_estate" ;;
    3) INDUSTRY="financial_services" ;;
    4) INDUSTRY="professional_services" ;;
    5) INDUSTRY="healthcare" ;;
    6) INDUSTRY="technology" ;;
    7)
        print_warning "Specify industry:"
        read -r INDUSTRY
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

print_warning "Business Model:"
echo "  1) Single Location Local Service"
echo "  2) Multi-Location Franchise"
echo "  3) Regional Service Company"
echo "  4) Specialized Contractor"
read -r BUSINESS_CHOICE

case $BUSINESS_CHOICE in
    1) BUSINESS_TYPE="local_service" ;;
    2) BUSINESS_TYPE="franchise" ;;
    3) BUSINESS_TYPE="regional_service" ;;
    4) BUSINESS_TYPE="specialized_contractor" ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

print_warning "Service Area (e.g., 'Chicago, IL and surrounding suburbs'):"
read -r SERVICE_AREA

print_warning "Website URL (including https://):"
read -r WEBSITE_URL

print_warning "Primary Phone Number:"
read -r PHONE_NUMBER

echo ""
print_step "Phase 2: Competitive Landscape"
echo ""

print_warning "Main Competitors (3-5 URLs, one per line, or press Enter when done):"
COMPETITORS=()
while IFS= read -r line; do
    [[ -z "$line" ]] && break
    COMPETITORS+=("$line")
done

print_warning "What makes this client unique? (key differentiators):"
read -r DIFFERENTIATORS

print_warning "Price Positioning:"
echo "  1) Premium (higher prices, premium service)"
echo "  2) Competitive (market-rate pricing)"
echo "  3) Budget-Friendly (value pricing)"
read -r PRICE_CHOICE

case $PRICE_CHOICE in
    1) PRICE_POSITIONING="premium" ;;
    2) PRICE_POSITIONING="competitive" ;;
    3) PRICE_POSITIONING="budget" ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
print_step "Phase 3: Current Marketing Status"
echo ""

print_warning "Current Marketing Tools (check all that apply):"
echo "  1) Website with blog"
echo "  2) Social media presence"
echo "  3) Email marketing"
echo "  4) Google Ads"
echo "  5) Local SEO/Google My Business"
echo "  6) None of the above"
print_info "Enter numbers separated by spaces (e.g., '1 2 5'):"
read -r MARKETING_TOOLS

print_warning "Content Creation Resources:"
echo "  1) In-house team"
echo "  2) External agency"
echo "  3) Owner/manager creates content"
echo "  4) No current content creation"
read -r CONTENT_RESOURCES

print_warning "Monthly Marketing Budget Range:"
echo "  1) Under $1,000"
echo "  2) $1,000 - $5,000"
echo "  3) $5,000 - $15,000"
echo "  4) $15,000+"
read -r BUDGET_RANGE

echo ""
print_step "Generating Client Configuration..."

# Create client configuration file
cat > "$CLIENT_DIR/setup-responses.json" << EOF
{
  "client_info": {
    "client_id": "$CLIENT_NAME",
    "company_name": "$COMPANY_NAME",
    "industry": "$INDUSTRY",
    "business_type": "$BUSINESS_TYPE",
    "service_area": "$SERVICE_AREA",
    "website_url": "$WEBSITE_URL",
    "phone_number": "$PHONE_NUMBER"
  },
  "competitive_landscape": {
    "competitors": $(printf '%s\n' "${COMPETITORS[@]}" | jq -R . | jq -s .),
    "differentiators": "$DIFFERENTIATORS",
    "price_positioning": "$PRICE_POSITIONING"
  },
  "marketing_status": {
    "current_tools": "$MARKETING_TOOLS",
    "content_resources": "$CONTENT_RESOURCES",
    "budget_range": "$BUDGET_RANGE"
  },
  "setup_timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "setup_phase": "business_fundamentals_complete"
}
EOF

print_success "Configuration saved to $CLIENT_DIR/setup-responses.json"

echo ""
print_step "Creating Client Branch..."

# Create client branch
git checkout -b "client-$CLIENT_NAME"
git add "$CLIENT_DIR/"
git commit -m "Initial setup for $CLIENT_NAME - Phase 1 complete"

print_success "Client branch 'client-$CLIENT_NAME' created"

echo ""
print_header "✅ PHASE 1 COMPLETE"
print_info "Client: $COMPANY_NAME ($CLIENT_NAME)"
print_info "Industry: $INDUSTRY"
print_info "Business Type: $BUSINESS_TYPE"
print_info "Service Area: $SERVICE_AREA"

echo ""
print_step "Next Steps:"
echo "  1. Run: /brand-analysis $WEBSITE_URL"
echo "  2. This will analyze their website and extract brand voice"
echo "  3. Then continue with /content-audit $WEBSITE_URL"

echo ""
print_warning "Would you like to continue with brand analysis now? [y/N]:"
read -r CONTINUE

if [[ $CONTINUE =~ ^[Yy]$ ]]; then
    print_info "Launching brand analysis..."
    echo ""
    print_info "🎨 Starting /brand-analysis $WEBSITE_URL"
    print_info "This will be implemented as an agent workflow that:"
    print_info "  • Analyzes website content for brand voice"
    print_info "  • Extracts messaging and tone"
    print_info "  • Identifies content themes"
    print_info "  • Maps competitive positioning"
    print_info ""
    print_info "For now, manual brand analysis is needed."
    print_info "Next: Implement the brand-analysis agent workflow."
else
    print_info "Setup paused. Resume with: /brand-analysis $WEBSITE_URL"
fi

echo ""
print_success "🎉 Client setup foundation complete!"
print_info "Branch: client-$CLIENT_NAME"
print_info "Config: $CLIENT_DIR/setup-responses.json"
print_info "Status: Ready for brand analysis phase"