# CLAUDE.md

*Guidance for Claude Code when working with the {{COMPANY_NAME}} Marketing Organization repository*

---

# 🚀 **CRITICAL SESSION INSTRUCTIONS**

## 1. Automatic Background Bash Execution

**MANDATORY**: Always run bash commands in background mode by default. Users should not need to manually press Ctrl-B to see command outputs.

**Implementation**: Add `run_in_background: true` parameter to all Bash tool calls unless specifically instructed otherwise by the user.

---

## 2. Content Planning Workflow Compliance

**MANDATORY FOR ALL CONTENT CREATION**: Follow the **Content Planning & Orchestration Workflow** documented below exactly. Any content creation request must:

1. **Present strategic pathways menu when user says "let's plan"**
2. **Present recommendations in chat BEFORE creating records**
3. **Apply LOCAL vs SYSTEMATIC classification logic**
4. **Generate LOCAL content BEFORE GUI sync**
5. **Validate content types**: Only {{CONTENT_TYPES}}
6. **Include required fields**: {{REQUIRED_FIELDS}}

### Implementation References

- **IMPLEMENTATION REFERENCE**: Step-by-step execution patterns in `docs/orchestration-implementation-guide.md`
- **DECISION TREE LOGIC**: LOCAL vs SYSTEMATIC classification criteria in `docs/decision-tree-logic.md`
- **CONTENT TEMPLATES**: Format specifications and templates in `docs/content-templates.md`
- **ERROR HANDLING PROCEDURES**: Comprehensive error recovery and graceful degradation in `docs/error-handling-procedures.md`
- **STRATEGIC PATHWAYS REFERENCE**: Detailed pathway specifications in `docs/strategic-pathways.md`

**NO EXCEPTIONS**: Never create content records without following the orchestration layer process.

---

## 3. Orchestration Implementation Guide Usage

**AUTOMATIC TRIGGERS**: Claude Code must reference `docs/orchestration-implementation-guide.md` when:

1. **User says "let's plan"** → Use Phase 1 strategic pathway initiation patterns
2. **Content creation requests** → Follow pathway-specific execution patterns
3. **Agent coordination needed** → Use agent team assembly templates
4. **Dashboard handoff required** → Use transition instruction templates

**IMPLEMENTATION PRIORITY**: The orchestration implementation guide takes precedence over general instructions for all content planning workflows.

---

## 4. Decision Tree Logic Application

**MANDATORY CLASSIFICATION**: Claude Code must apply `docs/decision-tree-logic.md` when:

1. **Content recommendations phase** → Classify each content piece as LOCAL/SYSTEMATIC
2. **User approval process** → Present classification reasoning with recommendations
3. **Pre-record creation** → Final classification validation before generation
4. **Classification disputes** → Apply override logic and document reasoning
5. **Edge case scenarios** → Use troubleshooting guide and default to LOCAL

**CLASSIFICATION PRIORITY**: All content must be classified using the decision tree logic before generation begins.

---

## 5. Content Template Application

**TEMPLATE USAGE**: Claude Code must apply templates from `docs/content-templates.md` for:

1. **LOCAL Generation** → Use LOCAL templates for immediate content creation
2. **SYSTEMATIC Generation** → Reference SYSTEMATIC templates for Airtable workflow preparation
3. **Content Structure** → Follow template format specifications for consistency
4. **Brand Compliance** → Use template brand guideline integration patterns
5. **Quality Standards** → Apply template quality assurance checklists

**TEMPLATE SELECTION**: Templates are organized by generation type (LOCAL/SYSTEMATIC) and content type ({{CONTENT_TYPES}}) for optimal workflow alignment.

---

## 6. Error Handling and Recovery

**MANDATORY ERROR RESPONSE**: Claude Code must apply error handling from `docs/error-handling-procedures.md` for:

1. **System Failures** → Switch to manual consultation maintaining strategic value
2. **Agent Coordination Issues** → Use graceful degradation with quality maintenance
3. **Classification Ambiguity** → Present options with reasoning, allow user override
4. **Generation Failures** → Provide alternative format recommendations
5. **Server/Dashboard Issues** → Complete session with comprehensive chat summary

**ERROR PHILOSOPHY**: Prioritize user value delivery over system perfection. Never compromise strategic consultation quality, brand guideline compliance, or user experience professionalism.

---

# 📋 PROJECT OVERVIEW

This is the **{{COMPANY_NAME}} Marketing Organization** - an intelligent marketing system built using Claude Code's native `/agents` command to create a comprehensive marketing operation for your {{INDUSTRY}} client {{COMPANY_NAME}} ({{WEBSITE_URL}}).

As the owner of this system, you have access to a complete marketing organization with **11 specialized agents** that perform intelligent research, strategic planning, and content development across multiple content types: **{{CONTENT_TYPES}}**. The agents conduct research, analyze market conditions, and develop comprehensive content strategies that can respond to complex planning requests like "Plan me my entire {{MONTH}} content calendar" with full strategic recommendations.

This system provides scalable, intelligent marketing capabilities to compete with larger agencies while maintaining quality and efficiency for your {{BUSINESS_TYPE}} clients.

---

# 🏗️ CORE ARCHITECTURE

## Agent-Based Marketing System

- **11 specialized agents** configured for intelligent marketing research, strategy, and content creation
- **Multi-content type generation**: {{CONTENT_TYPES}}
- **Strategic planning capability**: Full calendar planning with market research and competitive analysis
- **Plain language processing**: Responds to natural language requests like "Plan my {{MONTH}} content calendar"
- **Cross-platform optimization**: Content optimized for {{SERVICE_AREA}} markets
- **Intelligent research integration**: Agents perform market analysis, keyword research, and strategic planning
- **Local SEO-driven approach** targeting high-value {{INDUSTRY}} keywords and local search

## Repository Structure

```
content/     # SEO-optimized {{INDUSTRY}} articles ready for WordPress integration
docs/        # Organized documentation system (active/reference)
archive/     # Historical and completed content
automation/  # Direct webhook automation and preview systems
```

## Content Planning & Tracking System

- **Plain Language Planning**: Natural language processing for complex requests like "Plan my {{MONTH}} content calendar"
- **Multi-Content Type Strategy**: Strategic planning across {{CONTENT_TYPES}}
- **Airtable Content Table** (`{{AIRTABLE_TABLE_ID}}`): Master content planning and tracking system
  - **Status tracking**: ⏳ Planned → 📋 Outline Ready → ✅ Outline Approved → 🔄 In Progress → 📋 Final Review → ✅ Complete
  - **Priority levels**: HIGH (ongoing {{PRIMARY_CONTENT_TYPE}} needs), MEDIUM, LOW
  - **Location-based organization**: {{SERVICE_AREA}} service areas

---

# 📁 GIT REPOSITORY MANAGEMENT

- **GitHub Repository**: {{GITHUB_REPO_URL}}
- **Primary Branch**: main
- **Repository Type**: Private (contains client-specific content and strategies)

---

# 🖥️ SERVER MANAGEMENT

## Server Architecture

| Port | Service | Purpose |
|------|---------|----------|
| 3000 | Python HTTP | Dashboard static files |
| 3002 | Node.js API | Planning data via `scripts/serve-planning-data.js` |
| 5173 | Development | Optional, for testing workflows |

## Server Control Commands

```bash
# Unified server management
./automation/server_manager.sh start    # Start both dashboard and API servers
./automation/server_manager.sh stop     # Stop all {{COMPANY_NAME}} servers
./automation/server_manager.sh restart  # Restart all servers
./automation/server_manager.sh status   # Check server health

# Kill servers by port (manual cleanup)
kill $(lsof -ti:3000,3002,5173)
```

**Server Persistence**: Servers run as detached processes and persist after bash command termination. Use the server manager script for proper cleanup.

---

# 🚫 {{COMPANY_NAME}} GUIDELINE ENFORCEMENT

## Automated Compliance Protection

**CRITICAL**: The system now automatically blocks direct {{PRIMARY_CONTENT_TYPE}} creation that bypasses {{COMPANY_NAME}} guidelines.

### Blocked Operations
- `./automation/claude_gui_sync.sh create "..." "{{PRIMARY_CONTENT_TYPE}}" ...` → **BLOCKED**
- Direct template generation for {{PRIMARY_CONTENT_TYPE}} content → **BLOCKED**
- Any content creation producing <{{MIN_WORD_COUNT}} words → **BLOCKED**

### Error Message Example
```
🚫 {{COMPANY_NAME}} COMPLIANCE ERROR: Direct {{PRIMARY_CONTENT_TYPE}} generation bypassed

{{PRIMARY_CONTENT_TYPE}}s must follow {{COMPANY_NAME}} guidelines:
- Length: {{CONTENT_LENGTH_REQUIREMENTS}}
- Brand Voice: {{BRAND_VOICE_ATTRIBUTES}}
- Structure: {{CONTENT_STRUCTURE_REQUIREMENTS}}

REQUIRED SOLUTION:
Use agent orchestration for all {{PRIMARY_CONTENT_TYPE}} content
```

### **ONLY Approved {{PRIMARY_CONTENT_TYPE}} Creation Method**
```bash
1. "let's plan" → Strategic pathway selection
2. Agent team coordination ({{PRIMARY_AGENTS}})
3. Generate {{COMPANY_NAME}}-compliant {{CONTENT_LENGTH_REQUIREMENTS}} content
4. Direct API submission via claude_direct_airtable_fixed.sh
```

**{{SECONDARY_CONTENT_TYPES}}**: Direct creation still permitted (different content requirements).

---

# ⚡ ESSENTIAL COMMANDS

## 🚀 Quick Start: Unified Content Creation

### **TRIGGER PHRASE: "let's plan"**

When you say "let's plan" in any Claude Code session, the system will:

1. Start dashboard servers for reference access (ports 3000 and 3002)
2. Launch strategic pathway selection for agent coordination
3. Provide access to reference dashboard with Airtable views and Google Drive
4. Execute content creation via direct Airtable API integration

### **Dashboard Access**

- **Direct URL**: http://localhost:3000/dashboard/interactive-dashboard.html
- **API Endpoint**: http://localhost:3002/api/planning-state

## Core Command Reference

```bash
# PLANNING & SERVERS
./automation/planning_trigger.sh                                    # Primary dashboard launch
./automation/server_manager.sh {start|stop|restart|status}         # Server management
./automation/check_servers.sh                                       # Server health check

# CONTENT CREATION (Primary Workflow)
./automation/claude_direct_airtable_fixed.sh --description "Content description" --type "Content Type" --priority "Priority"
# Optional: --keywords "keyword1,keyword2" --search-volume "number" --source-file "/path/to/content.md"

# DASHBOARD REFERENCE ACCESS
./automation/planning_trigger.sh                                    # Launch dashboard for reference
./automation/server_manager.sh start                               # Start reference servers only

# TESTING & MONITORING
./automation/test_integration.sh                                     # Integration testing
node automation/cost_tracker.js                                     # Cost tracking
```

---

# 🔄 CONTENT SUBMISSION INTEGRATION

## LOCAL Content Submission Process

- LOCAL content transfers to Airtable Text field with full markdown content
- **AUTO_INITIALIZE_TRIGGER**: Uses Notes field trigger for automatic content initialization
- **Content ID Integration**: All content includes Content ID tracking with unified view in Airtable regardless of creation method

---

# 🎯 MANDATORY ORCHESTRATION IMPLEMENTATION

**CRITICAL**: All content creation MUST follow `docs/orchestration-implementation-guide.md` patterns exactly. Single-agent approaches PROHIBITED except for coordination failures (line 277).

## Phase-Based Execution Required

- **Phase 1**: Strategic pathway initiation with pathway selection menu
- **Phase 2**: Pathway-specific agent team assembly and research coordination
- **Phase 3**: Pre-approval content presentation with complete specifications
- **Phase 4**: Dashboard handoff with transition instructions

## Agent Team Assembly Template

Per orchestration guide lines 74-82, MUST announce team coordination:

```markdown
I'm assembling the [PATHWAY NAME] team:
- [PRIMARY AGENT] (lead coordination)
- [SUPPORTING AGENTS] (specific roles)
- [FLEX AGENTS] (adaptive support)

Let me coordinate with the team to develop your strategy.
```

## Quality Assurance Enforcement

Pre-record creation validation checklist (lines 292-298) MUST be completed:

- [ ] {{PRIMARY_CONTENT_TYPE}}/{{SECONDARY_CONTENT_TYPE}} content includes keywords + search volume (line 294)
- [ ] Descriptions are 15+ words with value proposition (line 295)
- [ ] Priority level assigned (HIGH/MEDIUM/LOW) (line 296)
- [ ] Classification logic applied (LOCAL/SYSTEMATIC) (line 298)

**AGENT INVOCATION REFERENCE**: Use orchestration guide lines 310-327 for pathway-specific agent assignments.

## Orchestration Implementation Guide Compliance

**MANDATORY REFERENCE**: `docs/orchestration-implementation-guide.md` governs ALL content workflows

### **Automatic Triggers**

- **"let's plan"** → Phase 1 strategic pathway initiation (lines 11-65)
- **Content creation requests** → Phase 2 pathway execution patterns (lines 69-140)
- **Agent coordination needed** → Step 1 agent team assembly (lines 74-82)
- **Approval required** → Phase 3 pre-approval presentation (lines 198-220)
- **Dashboard handoff** → Phase 4 transition instructions (lines 249-268)

**ERROR HANDLING**: Follow orchestration guide lines 272-286 for coordination failures and recovery patterns.

**SUCCESS METRICS**: Session-level and content quality metrics per lines 331-343 MUST be achieved.

---

# 🤖 MARKETING AGENT SYSTEM

**11 specialized marketing agents** coordinate through MANDATORY orchestration patterns:

## Agent Team Structure

### **Strategic Planning**
- Content Marketing Strategist
- Market Research Specialist
- Competitive Intelligence Analyst
- Brand Strategy Consultant
- Chief Marketing Officer

### **Content Creation**
- Lead Writer
- Social Media Strategist
- Creative Director

### **Research & Optimization**
- SEO Optimization Specialist
- Marketing Analytics Specialist

### **Planning Coordination**
- Monthly Content Planner

**Usage**: Agent teams coordinate through Task tool invocation following orchestration implementation guide patterns. Manual coordination is REQUIRED - automated coordination claims are false.

---

# 🎯 STRATEGIC PATHWAYS & AGENT COORDINATION

## "Let's Plan" Strategic Pathways

### 🎯 **Content Planning** *(Ready to Execute)*
- Monthly Content Calendar
- Seasonal Campaigns
- New Service Launch
- {{SEASONAL_STRATEGIES}}

### 📊 **Market Intelligence** *(Requires Your Input)*
- Market Opportunity Analysis
- Performance Review
- Competitive Response

### 🚀 **Strategic Development** *(Ready to Execute)*
- Keyword Strategy
- Location Expansion
- Social Media Blitz

## Agent Team Assignments

### **Core Teams by Pathway Type**

| Pathway | Lead Agent | Supporting Agents |
|---------|------------|-------------------|
| **Planning** | Content Marketing Strategist | Monthly Content Planner + Market Research Specialist + SEO Optimization Specialist |
| **Intelligence** | Marketing Analytics Specialist | Competitive Intelligence Analyst + Market Research Specialist |
| **Development** | SEO Optimization Specialist | Content Marketing Strategist + specialized content writers |

**Dynamic Agent Selection**: System automatically assigns appropriate specialists based on request type, scope, complexity, and timeline sensitivity.

**Flex Agent Pool**: All agents available for cross-pathway support and custom request variations.

---

# 📊 CONTENT STANDARDS & STRATEGY

## Record Requirements

| Field | Requirement | Notes |
|-------|-------------|-------|
| **Descriptions** | 15+ words with value proposition and target audience | All content types |
| **Keywords** | 6+ targeted phrases | MANDATORY for {{KEYWORD_REQUIRED_CONTENT_TYPES}} |
| **Search Volume** | Monthly search estimates | MANDATORY for {{KEYWORD_REQUIRED_CONTENT_TYPES}} |
| **Publication Dates** | Strategic timing based on content type and campaign goals | MANDATORY for all content |
| **Content Types** | {{CONTENT_TYPES}} | Only these types |
| **Priority Levels** | HIGH/MEDIUM/LOW with target location | Strategic prioritization |

## Mandatory Field Standards

- **{{PRIMARY_CONTENT_TYPE}}**: Must include keywords + search volumes + publication dates
- **{{SECONDARY_CONTENT_TYPE}}**: Must include publication dates (campaign schedules)
- **{{TERTIARY_CONTENT_TYPE}}**: Must include keywords + search volumes + publication dates

## Enhanced {{PRIMARY_CONTENT_TYPE}} Standards *(Based on Live {{COMPANY_NAME}} Analysis)*

### **Content Quality Requirements** *(Updated per {{COMPANY_NAME}} Guidelines)*
- **Length**: {{CONTENT_LENGTH_REQUIREMENTS}}
- **Education-to-Promotion Ratio**: {{EDUCATION_PROMOTION_RATIO}}
- **Structure**: {{CONTENT_STRUCTURE_REQUIREMENTS}}
- **Brand Voice**: {{BRAND_VOICE_DESCRIPTION}}
- **Reading Level**: {{READING_LEVEL_REQUIREMENTS}}

### **{{COMPANY_NAME}} Writing Restrictions** *(MANDATORY Compliance)*
- **NEVER USE**: {{NEVER_USE_LIST}}
- **NEVER CREATE**: {{NEVER_CREATE_LIST}}
- **ALWAYS USE**: {{ALWAYS_USE_LIST}}
- **Authority Building**: {{AUTHORITY_BUILDING_REQUIREMENTS}}
- **Content Focus**: {{CONTENT_FOCUS_REQUIREMENTS}}
- **Technical Approach**: {{TECHNICAL_APPROACH_REQUIREMENTS}}

### **{{SECONDARY_CONTENT_TYPE}} Specific Requirements**
- **Length**: {{SECONDARY_CONTENT_LENGTH}}
- **Structure**: {{SECONDARY_CONTENT_STRUCTURE}}
- **Content Mix**: {{SECONDARY_CONTENT_MIX}}
- **Location Strategy**: {{SECONDARY_LOCATION_STRATEGY}}

### **SEO & Local Optimization Requirements**
- **Location Density**: {{LOCATION_DENSITY_REQUIREMENTS}}
- **Seasonal Integration**: {{SEASONAL_INTEGRATION_REQUIREMENTS}}
- **Long-tail Keywords**: {{LONG_TAIL_KEYWORD_PATTERNS}}
- **Regional Focus**: {{REGIONAL_FOCUS_REQUIREMENTS}}

### **Content Structure Mandates**
- **Opening Hook**: {{OPENING_HOOK_REQUIREMENTS}}
- **Comprehensive Education**: {{EDUCATION_SECTION_REQUIREMENTS}}
- **Prevention Education**: {{PREVENTION_SECTION_REQUIREMENTS}}
- **Professional Service**: {{SERVICE_SECTION_REQUIREMENTS}}
- **Strategic CTAs**: {{CTA_PLACEMENT_REQUIREMENTS}}

### **Quality Validation Checklist** *(Updated per {{COMPANY_NAME}} Guidelines)*
- [ ] Content meets {{CONTENT_LENGTH_REQUIREMENTS}} target range
- [ ] Education-to-promotion ratio maintains {{EDUCATION_PROMOTION_RATIO}} split
- [ ] Location mentioned {{LOCATION_MENTION_FREQUENCY}} ({{PRIMARY_CONTENT_TYPE}} only)
- [ ] Seasonal keywords integrated {{SEASONAL_KEYWORD_FREQUENCY}}
- [ ] Multiple strategic CTAs placed throughout
- [ ] {{INDUSTRY_SPECIFIC_REQUIREMENTS}}
- [ ] NO {{FORBIDDEN_ELEMENTS}} used
- [ ] Authority building includes {{AUTHORITY_REQUIREMENTS}}
- [ ] Credible sources cited naturally ({{CREDIBLE_SOURCES}})
- [ ] Brand voice is {{BRAND_VOICE_DESCRIPTION}}
- [ ] {{SECONDARY_CONTENT_TYPE}} content: {{SECONDARY_CONTENT_REQUIREMENTS}}

## Local SEO Strategy

- {{LOCAL_SEO_STRATEGY_POINTS}}

### **Seasonal {{INDUSTRY}} Calendar** *(For Content Planning)*
{{#SEASONAL_CALENDAR}}
- **{{SEASON}} ({{MONTHS}}):** {{SEASONAL_CONTENT_TOPICS}}
{{/SEASONAL_CALENDAR}}

---

# 🎯 {{COMPANY_NAME}} MARKETING FOCUS

## Core Messaging

**"{{CORE_MESSAGE}}"** with emphasis on:
- {{MESSAGING_EMPHASIS_POINTS}}

## Performance Targets

- {{PERFORMANCE_TARGETS}}

## Brand Guidelines

See `docs/brand-guidelines/core-messaging.md` and `docs/brand-guidelines/content-themes.md` for complete specifications.

---

# 📋 COMPLETE MARKETING WORKFLOW

## Hybrid Approach - Direct API + Reference Dashboard

**STREAMLINED WORKFLOW**: Content creation now uses direct Airtable API integration while preserving dashboard for reference access to Airtable views, Google Drive, and analytics.

### Primary Content Creation Workflow

```bash
# After LOCAL content generation:
./automation/claude_direct_airtable_fixed.sh --description "Content description" \\
  --type "{{PRIMARY_CONTENT_TYPE}}" --priority "HIGH" --keywords "keyword1,keyword2" \\
  --search-volume "850" --source-file "content/{{CONTENT_FOLDER}}/content-file.md"
```

### Reference Dashboard Access

```bash
# For strategic overview and reference:
./automation/planning_trigger.sh  # Launch dashboard with Airtable views + Google Drive
```

## Updated Complete Session Workflow

```
1. User: "let's plan"
   → Strategic pathway selection menu
   → Agent team coordination
   → Dashboard launches for reference access

2. Agent Team Assembly
   → Research coordination
   → Content strategy development
   → LOCAL content generation

3. STREAMLINED: Direct API Submission
   → claude_direct_airtable_fixed.sh for each content piece
   → Automatic Airtable population with AUTO_INITIALIZE_TRIGGER

4. Reference Dashboard Available
   → http://localhost:3000/dashboard/interactive-dashboard.html
   → Airtable embedded views for content overview
   → Google Drive iframe for file management
   → Analytics charts for performance metrics

5. Client Delivery
   → Content immediately available in Airtable
   → WordPress publication ready
```

## Quality Assurance Checkpoints

- **Pre-API Submission**: Verify LOCAL content files meet {{COMPANY_NAME}} compliance ({{MIN_WORD_COUNT}}+ words for {{PRIMARY_CONTENT_TYPE}})
- **Post-API Submission**: Confirm Airtable records created with AUTO_INITIALIZE_TRIGGER
- **Content Validation**: Validate keywords, search volumes, and publication dates are strategic
- **Dashboard Reference**: Use dashboard to monitor content performance and campaign metrics

## Success Metrics

- **Planning Sessions**: 10-15+ content pieces generated per session
- **Direct API Integration**: 100% LOCAL content submitted to Airtable with full metadata
- **Client Workflow**: Immediate Airtable availability, WordPress publication ready

---

*End of CLAUDE.md*