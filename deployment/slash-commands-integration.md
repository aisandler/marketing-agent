# Slash Commands Integration Guide

## 🎯 Overview

This guide shows how to integrate the guided client onboarding slash commands into your Claude Code environment.

## 📋 Quick Setup

### 1. Add to CLAUDE.md

Add this section to your CLAUDE.md file in the commands section:

```bash
# CLIENT ONBOARDING SLASH COMMANDS

# Phase 1: Initial Setup
/setup-client [client-name]     # ./deployment/setup-client.sh [client-name]

# Phase 2: Brand Discovery
/brand-analysis [url]          # [AGENT WORKFLOW] Brand Strategy + Market Research + Creative Director

# Phase 3: Content Strategy
/content-audit [url]           # [AGENT WORKFLOW] Content Marketing + SEO + Social Media Strategist

# Phase 4: Industry Configuration
/industry-config [industry]    # [AGENT WORKFLOW] Apply industry templates and best practices

# Phase 5: System Deployment
/deploy-client [client-name]   # ./deployment/deploy-client.sh [client-name]

# Phase 6: Quality Assurance
/validate-setup [client-name] # ./deployment/validate-setup.sh [client-name]

# Support Commands
/update-client [client-name]   # Modify existing client configuration
/export-package [client-name] # Generate client handoff materials
```

### 2. Agent Workflow Integration

For phases that trigger agent workflows, add this to your agent coordination section:

```markdown
## CLIENT ONBOARDING AGENT WORKFLOWS

### /brand-analysis Workflow
**Trigger**: When user runs `/brand-analysis [url]`
**Team Assembly**:
- Brand Strategy Consultant (lead coordination)
- Market Research Specialist (competitive analysis)
- Creative Director (visual identity assessment)

**Execution Pattern**:
1. Fetch and analyze website content
2. Extract brand voice and messaging
3. Analyze competitive positioning
4. Generate brand context profile
5. Save to client configuration

### /content-audit Workflow
**Trigger**: When user runs `/content-audit [url]`
**Team Assembly**:
- Content Marketing Strategist (lead coordination)
- SEO Optimization Specialist (keyword analysis)
- Social Media Strategist (platform assessment)

**Execution Pattern**:
1. Audit existing content themes
2. Identify content gaps and opportunities
3. Develop content calendar framework
4. Generate SEO keyword strategy
5. Save to client content strategy

### /industry-config Workflow
**Trigger**: When user runs `/industry-config [industry]`
**Team Assembly**:
- Market Research Specialist (lead coordination)
- Content Marketing Strategist (template application)
- SEO Optimization Specialist (industry keywords)

**Execution Pattern**:
1. Load industry-specific templates
2. Apply seasonal content calendar
3. Configure industry compliance requirements
4. Set up local SEO keyword strategy
5. Save industry configuration
```

## 🚀 Current Implementation Status

### ✅ Ready to Use
- **`/setup-client`** - Fully implemented guided setup script
- **Client branch creation** - Automated Git workflow
- **Configuration storage** - JSON-based client profiles
- **Progress tracking** - Phase-based onboarding system

### 🔄 Next Development Priority
- **`/brand-analysis`** - Agent workflow for website analysis
- **`/content-audit`** - Agent workflow for content strategy
- **`/industry-config`** - Template application system
- **`/deploy-client`** - Final deployment automation

## 📝 Usage Examples

### New Client Onboarding Session

```
User: /setup-client comfort-aire-hvac

🚀 CLIENT ONBOARDING: comfort-aire-hvac
This guided setup will take 15-20 minutes and establish complete brand context.

[STEP] Phase 1: Business Fundamentals

[INPUT NEEDED] Company Name (full business name):
> Example Law Firm

[INPUT NEEDED] Industry Type:
  1) Legal Services  ←
  2) Real Estate
  3) Financial Services
  [etc...]

[Interactive setup continues...]

✅ PHASE 1 COMPLETE
Client: Example Law Firm (example-law-firm)
Industry: legal_services
Business Type: professional_service
Service Area: New York, NY and surrounding areas

Next Steps:
  1. Run: /brand-analysis https://example-lawfirm.com
  2. This will analyze their website and extract brand voice
  3. Then continue with /content-audit https://comfort-aire.com
```

### Brand Analysis Session

```
User: /brand-analysis https://comfort-aire.com

🎨 I'm assembling the Brand Analysis team:
- Brand Strategy Consultant (lead coordination)
- Market Research Specialist (competitive analysis)
- Creative Director (visual identity assessment)

Let me coordinate with the team to analyze Comfort-Aire's brand identity.

[Agent coordination proceeds...]

✅ Brand analysis complete! Key findings:
- Brand Voice: Professional, trustworthy, family-focused
- Key Messages: "Comfort you can trust", 24/7 emergency service
- Competitive Position: Premium service with personal touch
- Visual Identity: Clean, professional, blue/orange palette

Saved to: deployment/clients/comfort-aire-hvac/brand-profile.json

Next: /content-audit https://comfort-aire.com
```

## 🔧 Technical Implementation

### Slash Command Detection

Claude Code can detect these patterns and trigger the appropriate workflows:

```javascript
// Pattern matching for slash commands
const slashCommands = {
  '/setup-client': 'deployment/setup-client.sh',
  '/brand-analysis': 'AGENT_WORKFLOW:brand-analysis',
  '/content-audit': 'AGENT_WORKFLOW:content-audit',
  '/industry-config': 'AGENT_WORKFLOW:industry-config',
  '/deploy-client': 'deployment/deploy-client.sh',
  '/validate-setup': 'deployment/validate-setup.sh'
};
```

### Agent Workflow Triggers

For agent workflows, Claude Code recognizes the pattern and:
1. **Assembles the specified agent team**
2. **Loads client context** from previous phases
3. **Executes the guided workflow** with user interaction
4. **Saves results** to client configuration files
5. **Provides next step guidance**

## 🎯 Benefits of This Approach

### For You (System Owner)
- **Consistent onboarding** - Every client gets complete setup
- **Guided experience** - Step-by-step process prevents missed steps
- **Automated documentation** - Client context automatically captured
- **Quality assurance** - Validation built into each phase
- **Scalable process** - Easy to onboard multiple clients efficiently

### For Clients
- **Professional experience** - Guided, thorough setup process
- **Comprehensive context** - Deep brand understanding from day one
- **Industry expertise** - Templates and best practices applied automatically
- **Ready-to-use system** - Fully configured marketing system at handoff

### For Your Business
- **Faster onboarding** - 2-3 hours vs days of manual setup
- **Higher quality** - Systematic brand context establishment
- **Better retention** - Clients see immediate professional value
- **Competitive advantage** - Superior onboarding experience vs other agencies

## 🚀 Getting Started

1. **Add slash commands to CLAUDE.md** (copy sections above)
2. **Test with first client**: `/setup-client test-client`
3. **Develop agent workflows** for brand analysis and content audit
4. **Refine based on first client experience**
5. **Scale to multiple clients**

The foundation is ready - now we can build out the agent workflows to complete the guided onboarding experience!