#!/bin/bash

# Update All Clients Script
# Pushes improvements from main branch to all client branches

set -e

echo "🚀 Starting multi-client update process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "CLAUDE.md" ] || [ ! -d "deployment" ]; then
    print_error "Must be run from the marketing-team-base root directory"
    exit 1
fi

# Make sure we're on main branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
    print_warning "Switching from $current_branch to main branch"
    git checkout main
fi

# Check if main branch has uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    print_error "Main branch has uncommitted changes. Please commit or stash them first."
    exit 1
fi

# Get list of client branches
client_branches=$(git branch -a | grep "client-" | sed 's/.*client-/client-/' | sed 's/\*//g' | tr -d ' ' | sort | uniq)

if [ -z "$client_branches" ]; then
    print_warning "No client branches found. Create client branches first with:"
    echo "  git checkout -b client-[CLIENT-NAME]"
    exit 0
fi

print_status "Found client branches:"
echo "$client_branches" | sed 's/^/  - /'

# Ask for confirmation
echo ""
read -p "Update all client branches with latest main changes? [y/N]: " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Update cancelled"
    exit 0
fi

# Track success/failure
successful_updates=0
failed_updates=0
failed_clients=()

# Update each client branch
for client in $client_branches; do
    print_status "Updating $client..."

    # Checkout client branch
    if git checkout "$client" >/dev/null 2>&1; then
        print_status "✓ Checked out $client"
    else
        print_error "✗ Failed to checkout $client"
        failed_updates=$((failed_updates + 1))
        failed_clients+=("$client")
        continue
    fi

    # Merge from main
    if git merge main --no-edit >/dev/null 2>&1; then
        print_status "✓ Merged latest changes from main"
    else
        print_error "✗ Merge conflicts in $client - manual resolution required"
        print_warning "Run: git mergetool && git commit"
        failed_updates=$((failed_updates + 1))
        failed_clients+=("$client")
        continue
    fi

    # Push to remote
    if git push origin "$client" >/dev/null 2>&1; then
        print_success "✓ Successfully updated $client"
        successful_updates=$((successful_updates + 1))
    else
        print_error "✗ Failed to push $client to remote"
        failed_updates=$((failed_updates + 1))
        failed_clients+=("$client")
    fi

    echo ""
done

# Return to main branch
git checkout main >/dev/null 2>&1

# Summary
echo "📊 Update Summary:"
echo "  ✅ Successful: $successful_updates clients"
echo "  ❌ Failed: $failed_updates clients"

if [ $failed_updates -gt 0 ]; then
    echo ""
    print_warning "Failed clients require manual attention:"
    for client in "${failed_clients[@]}"; do
        echo "  - $client"
    done
    echo ""
    echo "To manually fix merge conflicts:"
    echo "  git checkout client-[CLIENT-NAME]"
    echo "  git merge main"
    echo "  # Resolve conflicts in your editor"
    echo "  git commit"
    echo "  git push origin client-[CLIENT-NAME]"
fi

if [ $successful_updates -gt 0 ]; then
    print_success "🎉 $successful_updates clients successfully updated with latest improvements!"
fi

echo ""
print_status "All clients now have access to your latest system improvements."
print_status "Each client maintains their unique branding and configuration."