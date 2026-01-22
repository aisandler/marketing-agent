#!/bin/bash

# Microbrief Generation Script
# Generates visual and video briefs for content requiring visual elements

set -e

CONTENT_FILE="$1"
BRIEF_TYPE="$2"  # visual or video
OUTPUT_DIR="$3"

if [[ -z "$CONTENT_FILE" || -z "$BRIEF_TYPE" || -z "$OUTPUT_DIR" ]]; then
    echo "Usage: $0 <content_file> <brief_type> <output_dir>"
    echo "Brief types: visual, video"
    exit 1
fi

# Validate brief type
if [[ "$BRIEF_TYPE" != "visual" && "$BRIEF_TYPE" != "video" ]]; then
    echo "❌ Error: Brief type must be 'visual' or 'video'"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Extract content title from filename
CONTENT_TITLE=$(basename "$CONTENT_FILE" .md | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
BRIEF_FILENAME="${OUTPUT_DIR}/$(basename "$CONTENT_FILE" .md)-${BRIEF_TYPE}-brief.md"

# Load appropriate template
TEMPLATE_FILE="templates/microbrief-${BRIEF_TYPE}-template.md"

if [[ ! -f "$TEMPLATE_FILE" ]]; then
    echo "❌ Error: Template file not found: $TEMPLATE_FILE"
    exit 1
fi

# Generate microbrief from template
cp "$TEMPLATE_FILE" "$BRIEF_FILENAME"

# Replace template variables with defaults
sed -i '' "s/{{CONTENT_TITLE}}/$CONTENT_TITLE/g" "$BRIEF_FILENAME"
sed -i '' "s|{{CONTENT_FILE_PATH}}|$CONTENT_FILE|g" "$BRIEF_FILENAME"
sed -i '' "s/{{GENERATION_DATE}}/$(date '+%Y-%m-%d %H:%M')/g" "$BRIEF_FILENAME"

# Set common defaults based on brief type
if [[ "$BRIEF_TYPE" == "visual" ]]; then
    sed -i '' "s/{{VISUAL_DESCRIPTION}}/Professional image supporting the content theme/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{AI_GENERATION_PROMPT}}/Create a professional, modern image that supports the content theme with brand-appropriate colors and clean composition/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{DIMENSIONS}}/1200x630 (social media optimized)/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{FORMAT}}/PNG or JPG/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{RESOLUTION}}/300 DPI for print, 72 DPI for web/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{BRAND_ELEMENTS}}/Brand colors, logo placement as appropriate/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{PRIMARY_USE}}/Social media and blog featured image/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{SECONDARY_USES}}/Email campaigns, website banners/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{CAMPAIGN_INTEGRATION}}/Supports main content messaging and brand consistency/g" "$BRIEF_FILENAME"
elif [[ "$BRIEF_TYPE" == "video" ]]; then
    sed -i '' "s/{{VIDEO_CONCEPT}}/Engaging video content that brings the written content to life/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{STORYBOARD_DESCRIPTION}}/Visual sequence that guides viewers through key content points/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{VIDEO_PRODUCTION_PROMPT}}/Create an engaging video with clear narrative flow, professional visuals, and strong call to action/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{DURATION}}/60-90 seconds/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{VIDEO_FORMAT}}/MP4/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{VIDEO_RESOLUTION}}/1920x1080 (Full HD)/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{ASPECT_RATIO}}/16:9 (landscape) or 9:16 (mobile)/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{BRAND_ELEMENTS}}/Brand colors, logo, consistent typography/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{MUSIC_STYLE}}/Professional, upbeat, brand-appropriate/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{VOICEOVER_REQUIREMENTS}}/Clear, professional voice matching brand tone/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{SOUND_EFFECTS}}/Minimal, supporting the narrative/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{PRIMARY_PLATFORM}}/Social media (Instagram, LinkedIn, Facebook)/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{SECONDARY_PLATFORMS}}/Website, email campaigns/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{CAMPAIGN_INTEGRATION}}/Reinforces written content with visual storytelling/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{OPENING_SCENE}}/Hook that captures attention and introduces topic/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{MAIN_CONTENT_SCENE}}/Core message delivery with supporting visuals/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{CTA_SCENE}}/Clear call to action with contact information/g" "$BRIEF_FILENAME"
    sed -i '' "s/{{CLOSING_SCENE}}/Brand reinforcement and memorable conclusion/g" "$BRIEF_FILENAME"
fi

echo "✅ Generated $BRIEF_TYPE microbrief: $BRIEF_FILENAME"
echo "📝 Review and customize the brief before using for visual production"

# Return the filename for potential script chaining
echo "$BRIEF_FILENAME"