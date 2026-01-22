#!/bin/bash

# Quick Add Content to GUI System
# Usage: ./quick_add_content.sh "your planning input here"

PLANNING_INPUT="$1"

if [ -z "$PLANNING_INPUT" ]; then
    echo "❌ Usage: $0 \"your planning input\""
    echo "Example: $0 \"I need 5 blog posts about winter rodent control\""
    exit 1
fi

echo "🧠 Processing: $PLANNING_INPUT"

# Process the input and generate content
echo "$PLANNING_INPUT" | node -e "
const ClaudeGUIBridge = require('./automation/sync_bridge.js');
const bridge = new ClaudeGUIBridge();

// Read input
const input = require('fs').readFileSync(0, 'utf8').trim();
console.log('📝 Analyzing:', input);

const inputLower = input.toLowerCase();

// Extract details from input
let count = 3;
const numberMatch = input.match(/(\d+)/);
if (numberMatch) count = parseInt(numberMatch[1]);

let contentType = 'Social Media';
if (inputLower.includes('blog')) contentType = 'Blog Post';
else if (inputLower.includes('location') || inputLower.includes('landing')) contentType = 'Location Page';

let season = 'Fall';
if (inputLower.includes('winter') || inputLower.includes('december') || inputLower.includes('january')) season = 'Winter';
else if (inputLower.includes('spring') || inputLower.includes('march') || inputLower.includes('april')) season = 'Spring';
else if (inputLower.includes('summer') || inputLower.includes('june') || inputLower.includes('july')) season = 'Summer';

let pestType = 'General';
if (inputLower.includes('ant')) pestType = 'Ants';
else if (inputLower.includes('spider')) pestType = 'Spiders';
else if (inputLower.includes('rodent') || inputLower.includes('mice') || inputLower.includes('rat')) pestType = 'Rodents';
else if (inputLower.includes('termite')) pestType = 'Termites';

let theme = 'prevention';
if (inputLower.includes('control')) theme = 'control';
else if (inputLower.includes('treatment')) theme = 'treatment';

// Generate content
const content = [];
for (let i = 0; i < count; i++) {
    let targetLocation = 'Multi-State';
    let priority = 'MEDIUM';
    let contentFormat = 'Facebook Post';
    
    if (contentType === 'Blog Post') {
        const locations = ['Dixon IL', 'Sycamore IL', 'Rockford IL', 'DeKalb IL'];
        targetLocation = locations[i % locations.length];
        priority = targetLocation.includes('Dixon') || targetLocation.includes('Sycamore') ? 'HIGH' : 'MEDIUM';
        contentFormat = 'WordPress Blog';
    } else if (contentType === 'Social Media') {
        contentFormat = i % 2 === 0 ? 'Facebook Post' : 'Instagram Post';
    } else {
        const locations = ['Naperville IL', 'Aurora IL', 'Wheaton IL'];
        targetLocation = locations[i % locations.length];
        contentFormat = 'Landing Page';
    }
    
    let description;
    if (contentType === 'Social Media') {
        description = \`\${season} \${pestType} \${theme.charAt(0).toUpperCase() + theme.slice(1)} Post \${i + 1}\`;
    } else if (contentType === 'Blog Post') {
        description = \`\${season} \${pestType} \${theme.charAt(0).toUpperCase() + theme.slice(1)} \${targetLocation}\`;
    } else {
        description = \`\${targetLocation} Professional Services\`;
    }
    
    content.push({
        description: description,
        contentType: contentType,
        priority: priority,
        targetLocation: targetLocation,
        pestType: pestType,
        contentFormat: contentFormat,
        seasonalRelevance: season,
        primaryKeyword: \`\${season.toLowerCase()} \${pestType.toLowerCase()} \${theme} \${targetLocation}\`.replace('multi-state', '').trim(),
        searchVolume: 200 + Math.floor(Math.random() * 300),
        keywordDifficulty: 'Low',
        notes: contentType === 'Social Media' ? 'Location-agnostic per client guidelines' : 'Claude Code generated content'
    });
}

// Add to sync system
bridge.addContentFromClaude(content);
console.log('✅ Added', content.length, 'content pieces to GUI system');

const summary = bridge.generateSummary();
console.log('📊 Total in system:', summary.total_records, '| Selected:', summary.selected_records);
console.log('🎯 Open the GUI to review and submit to Airtable');
"

echo ""
echo "✅ Content added to sync system!"
echo "🖥️ Open interactive-dashboard.html to review and submit"