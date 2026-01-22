#!/bin/bash

# Content Validation Hook
# Usage: ./automation/content-validation-hook.sh <content-file> <content-type> [title]
#
# This script validates content before it gets submitted to Airtable or published
# Integrates with the planning trigger and content generation workflow

set -e  # Exit on any error

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
VALIDATION_DIR="$PROJECT_DIR/validation"

# Check if validation directory exists
if [ ! -d "$VALIDATION_DIR" ]; then
    echo "❌ Validation system not found. Please ensure validation/ directory exists."
    exit 1
fi

# Parse arguments
CONTENT_FILE="$1"
CONTENT_TYPE="${2:-general}"
TITLE="${3:-$(basename "$CONTENT_FILE" .txt)}"

# Validate arguments
if [ -z "$CONTENT_FILE" ]; then
    echo "Usage: $0 <content-file> <content-type> [title]"
    echo "Content types: blogPosts, socialMedia, locationPages, general"
    exit 1
fi

if [ ! -f "$CONTENT_FILE" ]; then
    echo "❌ Content file not found: $CONTENT_FILE"
    exit 1
fi

echo "🔍 CONTENT VALIDATION HOOK ACTIVATED"
echo "📁 File: $(basename "$CONTENT_FILE")"
echo "📝 Type: $CONTENT_TYPE"
echo "🏷️  Title: $TITLE"
echo "==========================================="

# Run comprehensive validation
echo "🚀 Running comprehensive content validation..."

# Execute the master validation script
if node "$VALIDATION_DIR/validate-content.js" "$CONTENT_FILE" "$CONTENT_TYPE" "$TITLE" --add-to-history; then
    echo ""
    echo "✅ VALIDATION PASSED - Content approved for publication"
    echo "📚 Content has been added to history database"
    echo "🎯 Ready for Airtable submission or publishing"

    # Create validation success marker
    VALIDATION_MARKER="$CONTENT_FILE.validated"
    echo "$(date): Validation passed for $CONTENT_TYPE content" > "$VALIDATION_MARKER"

    exit 0
else
    echo ""
    echo "❌ VALIDATION FAILED - Content requires review"
    echo "🔧 Please address the issues above before publication"
    echo "💡 Re-run validation after making changes:"
    echo "   ./automation/content-validation-hook.sh \"$CONTENT_FILE\" \"$CONTENT_TYPE\" \"$TITLE\""
    echo ""
    echo "🚫 Content submission blocked until validation passes"

    # Create validation failure marker
    VALIDATION_MARKER="$CONTENT_FILE.validation_failed"
    echo "$(date): Validation failed for $CONTENT_TYPE content" > "$VALIDATION_MARKER"

    exit 1
fi