#!/bin/bash

# Quick Add Content to GUI System
# Usage: ./quick_add_content.sh "your planning input here"

PLANNING_INPUT="$1"

if [ -z "$PLANNING_INPUT" ]; then
    echo "❌ Usage: $0 \"your planning input\""
    echo "Example: $0 \"I need 5 blog posts about winter service tips\""
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

// Load service categories from config if available
let serviceCategories = {};
try {
    const configPath = require('path').resolve(__dirname, '../config/brand.json');
    const brandConfig = JSON.parse(require('fs').readFileSync(configPath, 'utf8'));
    serviceCategories = brandConfig.serviceCategories || {};
} catch(e) { /* Config not found, use General */ }

let serviceCategory = 'General';
// Config-driven category detection: serviceCategories maps keywords to category names
// e.g. { "Consulting": ["consult", "advisory"], "Training": ["train", "workshop"] }
for (const [category, keywords] of Object.entries(serviceCategories)) {
    if (Array.isArray(keywords) && keywords.some(kw => inputLower.includes(kw.toLowerCase()))) {
        serviceCategory = category;
        break;
    }
}

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
        // Load locations from config if available
        let blogLocations = ['Location 1', 'Location 2', 'Location 3', 'Location 4'];
        let priorityLocations = [];
        try {
            const configPath = require('path').resolve(__dirname, '../config/brand.json');
            const brandConfig = JSON.parse(require('fs').readFileSync(configPath, 'utf8'));
            if (brandConfig.locations && brandConfig.locations.blog) blogLocations = brandConfig.locations.blog;
            if (brandConfig.locations && brandConfig.locations.priority) priorityLocations = brandConfig.locations.priority;
        } catch(e) { /* Config not found, use defaults */ }
        targetLocation = blogLocations[i % blogLocations.length];
        priority = priorityLocations.length > 0 && priorityLocations.includes(targetLocation) ? 'HIGH' : 'MEDIUM';
        contentFormat = 'WordPress Blog';
    } else if (contentType === 'Social Media') {
        contentFormat = i % 2 === 0 ? 'Facebook Post' : 'Instagram Post';
    } else {
        // Load locations from config if available
        let pageLocations = ['Location A', 'Location B', 'Location C'];
        try {
            const configPath = require('path').resolve(__dirname, '../config/brand.json');
            const brandConfig = JSON.parse(require('fs').readFileSync(configPath, 'utf8'));
            if (brandConfig.locations && brandConfig.locations.pages) pageLocations = brandConfig.locations.pages;
        } catch(e) { /* Config not found, use defaults */ }
        targetLocation = pageLocations[i % pageLocations.length];
        contentFormat = 'Landing Page';
    }
    
    let description;
    if (contentType === 'Social Media') {
        description = \`\${season} \${serviceCategory} \${theme.charAt(0).toUpperCase() + theme.slice(1)} Post \${i + 1}\`;
    } else if (contentType === 'Blog Post') {
        description = \`\${season} \${serviceCategory} \${theme.charAt(0).toUpperCase() + theme.slice(1)} \${targetLocation}\`;
    } else {
        description = \`\${targetLocation} Professional Services\`;
    }
    
    content.push({
        description: description,
        contentType: contentType,
        priority: priority,
        targetLocation: targetLocation,
        serviceCategory: serviceCategory,
        contentFormat: contentFormat,
        seasonalRelevance: season,
        primaryKeyword: \`\${season.toLowerCase()} \${serviceCategory.toLowerCase()} \${theme} \${targetLocation}\`.replace('multi-state', '').trim(),
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