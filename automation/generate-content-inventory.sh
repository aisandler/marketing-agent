#!/bin/bash

# Content Inventory Generation Script
# Creates approval checkpoint for content generation

set -e

CAMPAIGN_NAME="$1"
STRATEGIC_OBJECTIVE="$2"
OUTPUT_DIR="${3:-strategic-output/content-inventory}"

if [[ -z "$CAMPAIGN_NAME" || -z "$STRATEGIC_OBJECTIVE" ]]; then
    echo "Usage: $0 <campaign_name> <strategic_objective> [output_dir]"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Generate inventory filename
INVENTORY_FILE="${OUTPUT_DIR}/$(echo "$CAMPAIGN_NAME" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')-inventory-$(date +%Y%m%d-%H%M).md"

# Copy template
cp "templates/content-inventory-template.md" "$INVENTORY_FILE"

# Replace basic variables
sed -i '' "s/{{CAMPAIGN_NAME}}/$CAMPAIGN_NAME/g" "$INVENTORY_FILE"
sed -i '' "s/{{STRATEGIC_OBJECTIVE}}/$STRATEGIC_OBJECTIVE/g" "$INVENTORY_FILE"
sed -i '' "s/{{GENERATION_DATE}}/$(date '+%Y-%m-%d %H:%M')/g" "$INVENTORY_FILE"

echo "✅ Generated content inventory template: $INVENTORY_FILE"
echo "📝 This template needs to be populated with specific content details"
echo "🔄 Return filename for script chaining"

# Return the filename for potential script chaining
echo "$INVENTORY_FILE"