# Brand Generalization Implementation Guide

*Complete systematic approach to convert client-specific marketing system into brand-agnostic template*

---

## 🎯 **OBJECTIVE**

Transform this client-specific marketing system into a configurable template that can be rapidly customized for any client across any industry.

## 📊 **AUDIT SUMMARY**

**Critical Issues Identified:**
- **470+ client-specific references** across entire codebase
- **50+ {{CLIENT_CONTACT}} references** in workflows and documentation
- **200+ pest control industry-specific** references
- Client-specific file names, URLs, and configuration hardcoded throughout

---

# 🚀 **PHASE-BY-PHASE IMPLEMENTATION PLAN**

## **PHASE 1: FOUNDATION INFRASTRUCTURE**
*Priority: CRITICAL | Timeline: Week 1*

### Core Configuration System

- [ ] **1.1** Create `config/client.config.template.json` with complete variable system
- [ ] **1.2** Update existing `config/client.config.json` to use template structure
- [ ] **1.3** Create `deployment/customize-claude.py` automation script
- [ ] **1.4** Update `package.json` project name from "marketing-team-client" to "marketing-team-base"

### Master Documentation Files

- [ ] **1.5** Update `CLAUDE.md` - Replace all client-specific references with template variables
- [ ] **1.6** Update `README.md` - Generic project description and setup instructions
- [ ] **1.7** Update `DOCUMENTATION_MAP.md` - Remove client-specific file references

### Quality Check Phase 1
- [ ] **1.8** Run verification script to confirm no hardcoded references in core files
- [ ] **1.9** Test template variable system with sample config

---

## **PHASE 2: FILE NAMING & STRUCTURE**
*Priority: HIGH | Timeline: Week 2*

### Dashboard & UI Components

- [ ] **2.1** Rename `dashboard/client-interactive-dashboard.html` → `dashboard/interactive-dashboard.html`
- [ ] **2.2** Update `dashboard/index.html` references and redirects
- [ ] **2.3** Update all dashboard internal references to use template variables

### Documentation File Restructuring

- [ ] **2.4** Rename all client-specific `*.md` files to generic equivalents:
  - [ ] `CLIENT_MASTER_BRAND_GUIDELINES.md` → `CLIENT_BRAND_GUIDELINES_TEMPLATE.md`
  - [ ] `CLIENT_COMPREHENSIVE_CONTENT_STRATEGY.md` → `CONTENT_STRATEGY_TEMPLATE.md`
  - [ ] `CLIENT_WEBHOOK_API_DOCUMENTATION.md` → `WEBHOOK_API_DOCUMENTATION.md`
- [ ] **2.5** Update all internal file references to new naming convention

### Content Directory Restructuring

- [ ] **2.6** Move `docs/client-context/` → `content/client-samples/`
- [ ] **2.7** Create `content/templates/` directory structure
- [ ] **2.8** Create industry-agnostic content templates

### Quality Check Phase 2
- [ ] **2.9** Verify all file references updated correctly
- [ ] **2.10** Test dashboard loads with new file names

---

## **PHASE 3: CONTENT TEMPLATE VARIABLES**
*Priority: HIGH | Timeline: Week 3*

### Agent Configuration Updates

- [ ] **3.1** Update `.claude/agents/content-marketing-strategist.md` - Remove client-specific guidelines
- [ ] **3.2** Update `.claude/agents/lead-writer.md` - Generic writing guidelines
- [ ] **3.3** Update `.claude/agents/social-media-strategist.md` - Remove pest control specifics
- [ ] **3.4** Update all other agent files to use template variables

### Script & Automation Updates

- [ ] **3.5** Update `automation/claude_direct_airtable_fixed.sh` - Remove hardcoded references
- [ ] **3.6** Update `automation/planning_trigger.sh` - Generic dashboard references
- [ ] **3.7** Update `scripts/serve-planning-data.js` - Template-based state files
- [ ] **3.8** Update `scripts/serve_gui.js` - Generic UI references

### Configuration & Data Files

- [ ] **3.9** Update `data/Client_Content_Import_Data.csv` → `data/sample_content_import_data.csv`
- [ ] **3.10** Replace all hardcoded data with template examples
- [ ] **3.11** Update webhook URLs to use configuration variables

### Quality Check Phase 3
- [ ] **3.12** Automated scan for remaining client-specific references
- [ ] **3.13** Test automation scripts with template variables

---

## **PHASE 4: INDUSTRY-SPECIFIC SAMPLES**
*Priority: MEDIUM | Timeline: Week 4*

### Sample Client Configurations

- [ ] **4.1** Create `deployment/sample-configs/pest-control-client.json` (as example)
- [ ] **4.2** Create `deployment/sample-configs/hvac-client.json`
- [ ] **4.3** Create `deployment/sample-configs/roofing-client.json`
- [ ] **4.4** Create `deployment/sample-configs/landscaping-client.json`
- [ ] **4.5** Create `deployment/sample-configs/general-services.json`

### Content Sample Libraries

- [ ] **4.6** Create `content/templates/blog-post-templates/` by industry
- [ ] **4.7** Create `content/templates/social-media-templates/` by industry
- [ ] **4.8** Create `content/templates/location-page-templates/` by industry
- [ ] **4.9** Organize existing client content as industry-specific sample

### Quality Check Phase 4
- [ ] **4.10** Test each sample configuration independently
- [ ] **4.11** Verify content templates work across industries

---

## **PHASE 5: AUTOMATION & DEPLOYMENT**
*Priority: MEDIUM | Timeline: Week 5*

### Customization Script Enhancement

- [ ] **5.1** Complete `deployment/customize-claude.py` with full replacement logic
- [ ] **5.2** Add validation checks to customization script
- [ ] **5.3** Create backup and restore functionality
- [ ] **5.4** Add industry-specific customization options

### Setup Documentation

- [ ] **5.5** Create `docs/SETUP_GUIDE.md` for new client onboarding
- [ ] **5.6** Create `docs/INDUSTRY_CUSTOMIZATION_GUIDE.md`
- [ ] **5.7** Update installation and configuration instructions
- [ ] **5.8** Create troubleshooting guide for common issues

### Quality Check Phase 5
- [ ] **5.9** End-to-end test with completely new client configuration
- [ ] **5.10** Verify no original client references remain anywhere

---

# 🔧 **TEMPLATE VARIABLE SYSTEM**

## Core Variables

```json
{
  "client": {
    "name": "{{CLIENT_NAME}}",           // "Acme Services"
    "brandName": "{{BRAND_NAME}}",       // "Acme Professional Services"
    "domain": "{{CLIENT_DOMAIN}}",       // "acmeservices.com"
    "contact": "{{CLIENT_CONTACT}}",     // "John Smith"
    "phone": "{{CLIENT_PHONE}}",         // "(555) 123-4567"
    "email": "{{CLIENT_EMAIL}}"          // "contact@acmeservices.com"
  },
  "industry": {
    "type": "{{INDUSTRY_TYPE}}",         // "hvac", "pest-control", "roofing"
    "services": ["{{SERVICE_1}}", "{{SERVICE_2}}"],
    "seasonalFocus": "{{SEASONAL_PATTERNS}}",
    "targetAudience": "{{TARGET_AUDIENCE}}"
  },
  "locations": {
    "states": ["{{STATE_1}}", "{{STATE_2}}"],
    "primaryOffices": ["{{OFFICE_1}}", "{{OFFICE_2}}"],
    "serviceAreas": ["{{AREA_1}}", "{{AREA_2}}"]
  },
  "branding": {
    "primaryMessage": "{{PRIMARY_MESSAGE}}",
    "valueProposition": "{{VALUE_PROP}}",
    "brandVoice": "{{BRAND_VOICE}}"
  }
}
```

## Replacement Mapping

| Original | Template Variable | Usage |
|----------|------------------|-------|
| `CLIENT_NAME_EXAMPLE` | `{{CLIENT_NAME}}` | All company name references |
| `Pest Control Consultants` | `{{BRAND_NAME}}` | Full brand name |
| `{{CLIENT_CONTACT}}` | `{{CLIENT_CONTACT}}` | Primary contact person |
| `pest control` | `{{INDUSTRY_TYPE}} services` | Industry references |
| `clientdomain.com` | `{{CLIENT_DOMAIN}}` | Website references |
| `(815) 284-4101` | `{{CLIENT_PHONE}}` | Phone numbers |
| `Illinois, Iowa, Wisconsin` | `{{SERVICE_STATES}}` | Service area states |

---

# ✅ **QUALITY ASSURANCE PROCEDURES**

## Automated Verification Scripts

### Phase Completion Checks
```bash
# Check for remaining hardcoded references
./deployment/verify-generalization.sh

# Test with sample configuration
./deployment/test-client-setup.sh sample-configs/hvac-client.json

# Validate all links and references
./deployment/validate-system.sh
```

### Manual Verification Checklist

- [ ] **Dashboard loads** with generic branding
- [ ] **All agent prompts** use template variables
- [ ] **Sample configs** generate working systems
- [ ] **Documentation** contains no client-specific references
- [ ] **File names** are industry-agnostic
- [ ] **Scripts execute** without hardcoded dependencies

---

# 📋 **SUCCESS CRITERIA**

## Phase 1 Complete
- [ ] Core configuration system implemented
- [ ] Main documentation files generalized
- [ ] Template variable system functional

## Phase 2 Complete
- [ ] All files renamed to generic conventions
- [ ] Content directory restructured
- [ ] Dashboard uses template variables

## Phase 3 Complete
- [ ] All agents use template variables
- [ ] Scripts work with any client config
- [ ] No hardcoded references in automation

## Phase 4 Complete
- [ ] Sample configurations for 4+ industries
- [ ] Content templates by industry type
- [ ] Original client content preserved as sample

## Phase 5 Complete
- [ ] Full automation script functional
- [ ] Setup documentation complete
- [ ] End-to-end testing passed

## Final Success Metrics
- [ ] **Zero hardcoded references** in entire codebase
- [ ] **New client setup** takes < 30 minutes
- [ ] **Industry customization** fully configurable
- [ ] **Original functionality** preserved for all features
- [ ] **Documentation** enables independent setup

---

# 🚨 **CRITICAL IMPLEMENTATION NOTES**

1. **Backup Everything**: Create full backup before starting Phase 1
2. **Test Incrementally**: Verify each phase works before proceeding
3. **Preserve Functionality**: Ensure all features work after generalization
4. **Document Changes**: Track all modifications for rollback if needed
5. **Validate Thoroughly**: Test with multiple industry configurations

---

*This guide ensures systematic, trackable progress toward a completely brand-agnostic marketing system that can be rapidly deployed for any client in any industry.*