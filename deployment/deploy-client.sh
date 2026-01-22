#!/bin/bash

# Marketing Engine Client Deployment Script
# Usage: ./deploy-client.sh <client-config-name> [target-directory]

set -e  # Exit on any error

# Configuration
CLIENT_NAME=$1
TARGET_DIR=${2:-"/Users/adamsandler/projects"}
CONFIG_FILE="deployment/sample-configs/${CLIENT_NAME}.json"
TEMPLATE_DIR="$(pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validation
if [ -z "$CLIENT_NAME" ]; then
    log_error "Usage: $0 <client-config-name> [target-directory]"
    log_info "Available configs:"
    ls deployment/sample-configs/*.json 2>/dev/null | sed 's/.*\//  - /' | sed 's/\.json$//' || echo "  No sample configs found"
    exit 1
fi

if [ ! -f "$CONFIG_FILE" ]; then
    log_error "Configuration file not found: $CONFIG_FILE"
    log_info "Available configs:"
    ls deployment/sample-configs/*.json 2>/dev/null | sed 's/.*\//  - /' | sed 's/\.json$//' || echo "  No sample configs found"
    exit 1
fi

# Read client configuration
CLIENT_DATA=$(cat "$CONFIG_FILE")
BUSINESS_NAME=$(echo "$CLIENT_DATA" | python3 -c "import json,sys; print(json.load(sys.stdin)['client']['name'])")
INDUSTRY=$(echo "$CLIENT_DATA" | python3 -c "import json,sys; print(json.load(sys.stdin)['client']['industry'])")
PROJECT_DIR="${TARGET_DIR}/marketing-team-$(echo "$BUSINESS_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')"

log_info "Deploying Marketing Engine for: $BUSINESS_NAME ($INDUSTRY)"
log_info "Target directory: $PROJECT_DIR"

# Create project directory
if [ -d "$PROJECT_DIR" ]; then
    if [ -n "$FORCE_YES" ]; then
        log_warning "Directory already exists: $PROJECT_DIR (FORCE_YES set, continuing)"
    else
        log_warning "Directory already exists: $PROJECT_DIR"
        read -p "Continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled"
            exit 0
        fi
    fi
fi

mkdir -p "$PROJECT_DIR"

# Copy template structure
log_info "Copying template structure..."
cp -r docs/ "$PROJECT_DIR/"
cp -r deployment/ "$PROJECT_DIR/"
mkdir -p "$PROJECT_DIR/content"
mkdir -p "$PROJECT_DIR/.claude/agents"

# Create customized CLAUDE.md
log_info "Creating customized CLAUDE.md..."
python3 deployment/customize-claude.py "$CONFIG_FILE" "$PROJECT_DIR/CLAUDE.md"

# Create customized README.md  
log_info "Creating customized README.md..."
if [ -f "deployment/customize-readme.py" ]; then
    python3 deployment/customize-readme.py "$CONFIG_FILE" "$PROJECT_DIR/README.md"
else
    log_warning "Missing deployment/customize-readme.py - copying base README.md instead"
    cp README.md "$PROJECT_DIR/README.md"
fi

# Copy and customize agent configurations
log_info "Setting up agent configurations..."
if [ -d ".claude/agents" ]; then
    if [ -f "deployment/customize-agent.py" ]; then
        for agent_file in .claude/agents/*.md; do
            if [ -f "$agent_file" ]; then
                agent_name=$(basename "$agent_file")
                python3 deployment/customize-agent.py "$CONFIG_FILE" "$agent_file" "$PROJECT_DIR/.claude/agents/$agent_name"
            fi
        done
    else
        log_warning "Missing deployment/customize-agent.py - copying agent files as-is"
        cp -R .claude/agents "$PROJECT_DIR/.claude/agents"
    fi
else
    log_warning "No .claude/agents directory found - skipping agent setup"
fi

# Create content templates
log_info "Creating content templates..."
mkdir -p "$PROJECT_DIR/content/templates"
if [ -f "deployment/create-content-templates.py" ]; then
    python3 deployment/create-content-templates.py "$CONFIG_FILE" "$PROJECT_DIR/content/templates"
else
    log_warning "Missing deployment/create-content-templates.py - created empty templates directory"
fi

# Initialize git repository
if [ -d ".git" ]; then
    log_info "Initializing git repository..."
    cd "$PROJECT_DIR"
    git init
    git add .
    git commit -m "Initial deployment for $BUSINESS_NAME marketing engine"
    cd "$TEMPLATE_DIR"
fi

log_success "Deployment completed!"
log_info "Project created at: $PROJECT_DIR"
log_info "Next steps:"
echo "  1. cd $PROJECT_DIR"
echo "  2. Review and customize CLAUDE.md"
echo "  3. Run: /agents to set up your marketing team"
echo "  4. Start creating content for $BUSINESS_NAME"

log_info "Quick start command:"
echo "  cd $PROJECT_DIR && code . && /agents"