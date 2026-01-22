# CLAUDE.md Template

*Brand-Specific Configuration Template for Marketing Organization Branches*

---

> **Instructions**:
> 1. Copy this template to `CLAUDE.md` in your brand-specific branch
> 2. Replace all `[PLACEHOLDER]` values with your brand information
> 3. Configure `.claude/settings.local.json` with brand-specific welcome message
> 4. Create `.claude/memory/brand-core.md` for detailed brand foundation

---

# Welcome Message

Add this to `.claude/settings.local.json` in your brand branch:

```json
{
  "permissions": {
    "allow": [
      "Bash(python3:*)",
      "Read(//tmp/**)",
      "Bash(chmod:*)",
      "Bash(find:*)",
      "Bash(sed:*)",
      "Bash(grep:*)",
      "Bash(node:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git merge:*)",
      "Bash(git branch:*)",
      "Bash(git checkout:*)",
      "Bash(git push:*)",
      "Bash(git tag:*)",
      "Bash(gh repo create:*)",
      "Bash(git remote remove:*)",
      "Bash(git remote add:*)",
      "Bash(mkdir:*)",
      "Bash(mv:*)",
      "Bash(./automation/planning_trigger.sh:*)",
      "Bash(./automation/server_manager.sh:*)",
      "Bash(./automation/urgent-response.sh:*)",
      "Bash(./automation/scale-migrator.sh:*)",
      "Bash(./automation/aeo-enhance.sh:*)",
      "Bash(./automation/check_servers.sh:*)",
      "Bash(./automation/email-campaign-generator.sh:*)",
      "Bash(./automation/claude_direct_airtable_fixed.sh:*)",
      "Bash(node validation/consistency-checker.js:*)",
      "WebSearch",
      "WebFetch(domain:docs.github.com)",
      "WebFetch(domain:docs.claude.com)",
      "WebFetch(domain:[YOUR_BRAND_DOMAIN])",
      "mcp__playwright-ms__browser_navigate",
      "mcp__playwright-ms__browser_click",
      "mcp__perplexity__perplexity_ask",
      "Read(//Users/adamsandler/projects/**)",
      "Bash(npm install:*)",
      "Bash(./automation/validate-config.sh:*)",
      "Bash(./automation/expansion-manager.sh:*)",
      "Bash(./automation/agent-handoff.sh list:*)",
      "Bash(git stash:*)",
      "Bash(./automation/generate-content-inventory.sh:*)",
      "Bash(./automation/generate-microbrief.sh:*)",
      "Bash(cat:*)",
      "Bash(tree:*)"
    ],
    "deny": [],
    "ask": []
  },
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "printf '🚀 **[YOUR BRAND NAME] Marketing Engine**\\n\\n**First time?** `/onboard` | **Configured?** `/cmo` | **Need help?** `/discover`\\n\\n---\\n\\nType a command above or describe your marketing needs in natural language.'"
          }
        ]
      }
    ]
  }
}
```

---

# ⚙️ **BUSINESS CONFIGURATION**

## Client Information
- **Company**: [COMPANY_NAME]
- **Industry**: [INDUSTRY]
- **Business Type**: [B2B/B2C/SaaS/E-commerce/Service Provider]
- **Website**: [WEBSITE_URL]
- **Service Areas**: [GEOGRAPHIC_REGIONS]

## Content Requirements
- **Content Types**: [Blog posts, social media, email campaigns, case studies, whitepapers, etc.]
- **Primary Content**: [Main content focuses - educational, product-focused, thought leadership, etc.]
- **Content Length**: [Blog posts (X words), social posts (X words), email (X words)]
- **Brand Voice**: [Voice attributes - professional, casual, authoritative, friendly, etc.]

## Marketing Focus
- **Core Message**: [Primary value proposition or positioning statement]
- **Performance Targets**: [Year 1 goals, KPIs, growth objectives]
- **Seasonal Strategy**: [Seasonal campaigns, peak periods, industry-specific timing]

---

# 📊 **BRAND CONFIGURATION**

## Brand Foundation
- **Core Voice**: [Brand voice attributes and personality]
- **Primary Message**: [Main value proposition]
- **Authority Position**: [Market positioning - category creator, thought leader, disruptor, etc.]
- **Target Audience**: [Primary customer segments with demographics and psychographics]

## Content Configuration
- **Primary Content Types**: [Content formats prioritized for this brand]
- **Content Focus**: [Main content themes and topics]
- **Performance Targets**: [Content-specific goals and metrics]
- **Seasonal Strategy**: [Content calendar approach and seasonal considerations]

*Detailed content standards and brand guidelines are maintained in:*
- `client-context/templates/brand-voice-template.md`
- `client-context/templates/content-standards-template.md`
- `docs/brand-guidelines/` (configured instances)

---

# 🎯 **GETTING STARTED**

## For New Users

1. **Business Onboarding**: Use `/onboard` to configure your complete brand architecture
2. **Strategic Planning**: Use `/cmo` to begin marketing campaign development
3. **Intelligence Analysis**: Use `/analyst` to optimize performance and strategy
4. **System Discovery**: Use `/discover` to explore all capabilities

## For Returning Users

Your marketing organization is ready for strategic operations:
- `/cmo plan January content calendar`
- `/analyst audit our marketing performance`
- `/discover` to explore all capabilities

---

# 📁 **ADDITIONAL RESOURCES**

## Documentation
- **Strategic Planning**: `docs/strategic-pathways.md`
- **Brand Architecture**: `client-context/` (your configured brand)
- **Content Standards**: `client-context/templates/` (guidelines templates)
- **Technical Reference**: `docs/orchestration-implementation-guide.md`

## Repository
- **GitHub**: [Repository URL or "Not configured"]
- **Airtable**: Table ID `[Table ID or "Not configured"]`

---

# 📝 **BRAND MEMORY TEMPLATE**

Create `.claude/memory/brand-core.md` with this structure:

```markdown
# Brand Core - [CLIENT_NAME] Client Memory

*Client-specific brand foundation - auto-loaded at session start*

---

## Business Foundation

**COMPANY_NAME**: [Company Name]
**WEBSITE_URL**: [website.com]
**INDUSTRY**: [Industry]
**BUSINESS_TYPE**: [B2B/B2C/etc.]
**SERVICE_AREA**: [Geographic regions]

## Core Identity (Golden Circle)

### WHY (Purpose/Belief)
[Core purpose and beliefs]

### HOW (Process/Values)
[Unique methodology and values]

### WHAT (Products/Services)
[Primary offerings and outcomes]

## Target Audience
[Detailed audience segments and personas]

## Competitive Positioning
[Market position and competitive advantages]

## Brand Attributes
[Personality, voice, tone guidelines]

## Strategic Priorities
[Business goals and content strategy focus]

## Variables Reference
- {{COMPANY_NAME}}: [Name]
- {{INDUSTRY}}: [Industry]
- {{BUSINESS_TYPE}}: [Type]
- {{WEBSITE_URL}}: [URL]
- {{SERVICE_AREA}}: [Regions]
- {{CORE_MESSAGE}}: [Message]
- {{BRAND_VOICE_ATTRIBUTES}}: [Attributes]
- {{TARGET_AUDIENCE}}: [Audience]
- {{PRIMARY_DIFFERENTIATOR}}: [Differentiator]
```

---

*This template ensures consistent brand-specific configuration across all marketing activities.*
