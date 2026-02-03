# Fresh Session Startup Guide - {{COMPANY_NAME}} Content System

**Quick Start**: Everything you need to resume {{COMPANY_NAME}} content planning in a new Claude Code session  
**Created**: August 19, 2025  
**Context**: Full system documentation for immediate productivity  

---

## 🚀 **IMMEDIATE CONTEXT SUMMARY**

### What You Have Built:
1. **Complete Content Planning System** with voice-to-execution workflow
2. **Direct Webhook Integration** to Airtable (no approval needed)
3. **Preview System** with formatted tables before submission
4. **Master Brand Guidelines** for consistent content creation
5. **N8N Automation Workflows** for content generation
6. **12 Specialized Agents** for professional services content expertise

### Current Status:
- **Airtable Integration**: ✅ Working (Table ID: `YOUR_CONTENT_TABLE_ID`)
- **Webhook Endpoint**: ✅ Active (`{{WEBHOOK_URL}}`)
- **Preview System**: ✅ Ready (`automation/preview_and_submit.sh`)
- **Agent System**: ✅ Configured with 12 specialized agents
- **Brand Guidelines**: ✅ Complete (`{{COMPANY_NAME}}_MASTER_BRAND_GUIDELINES.md`)

---

## 📋 **ESSENTIAL FILES FOR NEW SESSIONS**

### Core Documentation (Read These First):
1. **`CLAUDE.md`** - Complete project context and architecture
2. **`{{COMPANY_NAME}}_MASTER_BRAND_GUIDELINES.md`** - Brand voice, messaging, seasonal strategy
3. **`{{COMPANY_NAME}}_WEBHOOK_API_DOCUMENTATION.md`** - Complete API reference
4. **`CLAUDE_CODE_DIRECT_PLANNING_SYSTEM.md`** - Strategy → execution workflow
5. **`CLAUDE_CODE_PREVIEW_SYSTEM.md`** - Table preview before submission

### Agent Configuration:
- **`agents/monthly-content-planner.md`** - Voice/text planning specialist
- **`agents/[other-agents].md`** - 11 additional specialized agents for content creation

### Automation Scripts:
- **`automation/direct_airtable_import.sh`** - Single record creation (no approval)
- **`automation/bulk_planning_import.sh`** - CSV batch import (no approval)
- **`automation/preview_and_submit.sh`** - Table review system

---

## ⚡ **QUICK START COMMANDS**

### Test System Connectivity:
```bash
# Verify webhook is working
curl -X POST {{WEBHOOK_URL}} -H "Content-Type: application/json" -d '{"test":true}'

# Test Airtable integration
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 2,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_CONTENT_TABLE_ID"
    }
  }'
```

### Load Preview System:
```bash
# Source the preview functions
source /Users/adamsandler/projects/marketing-team-base/automation/preview_and_submit.sh
```

### Agent Activation:
```bash
# Access specialized agents
/agents

# Or directly reference specific agents:
# - monthly-content-planner: Voice/text to CSV conversion
# - content-marketing-strategist: Overall strategy and SEO
# - brand-strategy-consultant: {{COMPANY_NAME}} positioning and messaging
```

---

## 🎯 **TYPICAL PLANNING SESSION FLOW**

### 1. Strategy Discussion:
**You**: "I need December content focusing on winter seasonal preparation"

**Claude Code**:
- Reviews seasonal patterns from brand guidelines
- Considers {{SERVICE_AREA}} market priorities
- Suggests content mix (blog posts, social media, location pages)
- Leverages market research and competitive intelligence agents

### 2. Content Planning:
**Claude Code**:
- Uses monthly-content-planner agent for structured approach
- Applies local SEO research for keyword targeting
- Generates specific content titles and descriptions
- Builds preview table with all details

### 3. Preview & Approval:
```
📋 CONTENT PREVIEW - Ready for Airtable Submission
==================================================
ID   | Description                    | Content Type | Priority | Target Location | Service Category
------+--------------------------------+--------------+----------+-----------------+------------------
1    | December Service Guide Market A| Blog Post    | HIGH     | Market A        | Core Services
2    | Winter Prep Social             | Social Media | MEDIUM   | Multi-Market    | General
[...]

📊 Total Records Ready: 8
🤔 Submit all 8 records to Airtable? (y/n):
```

### 4. Execution:
**You**: "Yes"

**Claude Code**: 
- Submits all records directly to Airtable
- Reports Content IDs assigned (e.g., C150-C157)
- Confirms readiness for N8N content generation workflows

---

## 🛠️ **CURRENT CAPABILITIES**

### Planning Features:
- ✅ Voice input processing (via monthly-content-planner agent)
- ✅ Strategic content recommendations
- ✅ Local SEO keyword research
- ✅ Seasonal timing alignment
- ✅ Brand guideline adherence
- ✅ Multi-location targeting
- ✅ Priority assignment based on business strategy

### Execution Features:
- ✅ Direct Airtable record creation (no approval)
- ✅ Bulk CSV import automation
- ✅ Table preview before submission
- ✅ Google Drive folder organization
- ✅ Content ID correlation system
- ✅ Status tracking and workflow management

### Integration Features:
- ✅ N8N workflow triggering
- ✅ Webhook API for all operations
- ✅ Agent coordination for specialized tasks
- ✅ Brand consistency across all content
- ✅ Seasonal content calendar alignment

---

## 📊 **AIRTABLE INTEGRATION STATUS**

### Current Configuration:
- **Base ID**: `YOUR_BASE_ID`
- **Table ID**: `YOUR_CONTENT_TABLE_ID` *(Verified working)*
- **Webhook**: `{{WEBHOOK_URL}}`
- **Records Created**: 125+ content pieces (as of August 2025)

### Recent Successful Operations:
- ✅ September Instagram posts (C118-C125) - 8 records
- ✅ Status updates and workflow management
- ✅ Bulk imports via CSV processing
- ✅ Google Drive folder creation with Content ID correlation

### Field Mapping (Confirmed Working):
```json
{
  "Description": "Content title/description",
  "Content Type": "Blog Post | Social Media | Location Page",
  "Priority": "HIGH | MEDIUM | LOW", 
  "Target Location": "Specific city/state or Multi-State",
  "Service Category": "Specific service or General",
  "Content Format": "WordPress Blog | Instagram Post | Facebook Post | Landing Page",
  "Seasonal Relevance": "Spring | Summer | Fall | Winter | Year-Round",
  "Primary Keyword": "SEO-focused keyword phrase",
  "Search Volume": "Estimated monthly searches",
  "Keyword Difficulty": "Low | Medium | High",
  "Notes": "Special instructions or context"
}
```

---

## 🎮 **READY-TO-USE COMMANDS**

### Planning Commands:
```bash
# Start planning session
"I need [number] [content type] for [timeframe] focusing on [service/theme]"

# Examples:
"I need 5 blog posts for January focusing on winter seasonal services"
"Create 10 social media posts for holiday service promotions"
"Plan February content for our primary markets - mix of everything"
```

### Execution Commands:
```bash
# Direct submission (after preview approval)
"Yes, submit all records"
"Approve and execute"
"Submit to Airtable"

# Modification requests  
"Change record #3 to HIGH priority"
"Update location for record #5 to primary market only"
"Add seasonal timing note to record #2"
```

### Status Management:
```bash
# Workflow progression
"Move all September content to {{CLIENT_CONTACT}} Review status"
"Update completed content to archive status"
"Promote HIGH priority items to In Progress"
```

---

## 🏗️ **GUI INTERFACE POSSIBILITIES**

### Local Web Interface Options:

#### Option 1: Simple HTML/JavaScript Dashboard
```html
<!-- Local planning interface concept -->
<div class="planning-dashboard">
  <div class="voice-input">
    <button>🎤 Start Voice Planning</button>
    <textarea placeholder="Or type your planning requirements..."></textarea>
  </div>
  
  <div class="preview-table">
    <!-- Dynamic table populated by Claude Code planning -->
  </div>
  
  <div class="actions">
    <button class="submit-all">Submit All to Airtable</button>
    <button class="export-csv">Export CSV</button>
    <button class="modify">Edit Records</button>
  </div>
</div>
```

#### Option 2: Electron Desktop App
- **Voice Integration**: Web Speech API for voice input
- **Table Management**: Editable data grid with validation
- **Direct Integration**: Webhook calls to Airtable
- **Agent Access**: Interface to Claude Code agents
- **Offline Capability**: Local storage and sync

#### Option 3: Browser Extension
- **Quick Planning**: Right-click planning from any page
- **Content Ideas**: Capture inspiration and convert to structured content
- **Status Tracking**: Monitor Airtable records without leaving browser
- **Brand Guidelines**: Quick reference overlay

### Implementation Complexity:

#### Easy (1-2 hours):
- **Static HTML Interface**: Form-based planning with manual webhook calls
- **Browser Bookmarklet**: Quick content creation with pre-filled forms

#### Medium (1-2 days):
- **Dynamic Web App**: Vue.js/React interface with Claude Code API integration
- **Local Server**: Express.js backend connecting Claude Code to web interface

#### Advanced (1-2 weeks):
- **Electron Desktop App**: Full-featured planning interface with voice integration
- **Claude Code Plugin**: Native extension to Claude Code interface

---

## 🎤 **VOICE PLANNING INTEGRATION**

### Current Capability:
- ✅ Text-based voice simulation via monthly-content-planner agent
- ✅ Natural language processing for content requirements
- ✅ Structured CSV generation from conversational input

### GUI Voice Enhancement:
```javascript
// Voice planning concept
const voicePlanning = {
  startListening: () => {
    // Web Speech API integration
    recognition.start();
  },
  
  processVoiceInput: (transcript) => {
    // Send to Claude Code monthly-content-planner agent
    claudeCode.planContent(transcript);
  },
  
  displayPreview: (contentPlan) => {
    // Populate GUI table with planned content
    updatePreviewTable(contentPlan);
  },
  
  submitToAirtable: () => {
    // Execute webhook calls via automation scripts
    executeWebhookBatch(selectedRecords);
  }
};
```

---

## ✅ **NEXT SESSION CHECKLIST**

### Immediate Setup (30 seconds):
- [ ] Read this startup guide
- [ ] Verify current context with "What's the status of {{COMPANY_NAME}} content system?"
- [ ] Test webhook connectivity if needed

### Planning Session (2-3 minutes):
- [ ] State your content requirements
- [ ] Review generated preview table
- [ ] Confirm submission to Airtable
- [ ] Verify Content IDs assigned

### Advanced Operations (as needed):
- [ ] Use specialized agents for complex strategy
- [ ] Leverage brand guidelines for consistency
- [ ] Coordinate with N8N workflows for content generation

---

**System Status**: ✅ Fully Operational  
**Last Tested**: August 19, 2025  
**Ready for**: Immediate content planning and execution  

**Start Your Session**: Just say "I need [content type] for [timeframe] focusing on [theme]" and the system will handle the rest!