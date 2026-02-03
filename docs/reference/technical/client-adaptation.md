# Client System Adaptation Guide

**Version**: 1.0 (Work in Progress)  
**Purpose**: Complete documentation for adapting the {{COMPANY_NAME}} Content Marketing Hub for any client  
**Target**: Making the system client-agnostic and easily configurable

---

## 🔄 Update (Config Layer Implemented)

You can now adapt client‑specific elements without code changes using a small configuration layer:

- File: `config/client.config.json` (override with `CLIENT_CONFIG_PATH` env var)
- Loader: `automation/config.js`

What you can configure per client:
- Airtable connection: `airtable.webhookUrl`, `airtable.baseId`, `airtable.tableId` (and `AIRTABLE_API_KEY` via env)
- Airtable field names: `fields.*` (e.g., rename `serviceCategory` → `Service Type`)
- Display labels (non‑Airtable): `labels.entitySubtypeLabel` (e.g., "Service Type", "Category", "Specialty")
- Drive folders per content type: `drive.folders.*`

Already wired to config:
- `automation/sync_bridge.js`: polling, Content ID assignment, direct API submission, CSV export, Google Drive workspace creation, and Markdown summaries.

This enables fast cloning across clients: duplicate `config/client.config.json`, change field names/IDs, set environment variables, and you’re ready.

---

## 🎯 Overview

This guide documents all elements needed to transform the {{COMPANY_NAME}}-specific content marketing system into a generic, client-adaptable solution. The system currently includes hardcoded client-specific data that must be made configurable.

---

## 🔧 Core System Architecture

### Major Components to Adapt

1. **Dashboard GUI** - Interactive planning interface
2. **Airtable Integration** - Content tracking and management
3. **API Services** - Webhook and data endpoints
4. **Automation Scripts** - Content generation and sync processes
5. **Content Templates** - Industry-specific content structures
6. **Brand Guidelines** - Client-specific messaging and voice

### Brand Materials & Templates
To include qualitative brand and product materials inside the system without code changes:

1. Configure brand references in `config/client.config.json`:
```
{
  "brand": {
    "guidelines": ["docs/brand-guidelines/core-messaging-template.md", "<your/brand/guide.md>"],
    "voiceGuide": "<path/to/voice_guide.md>",
    "personas": "<path/to/personas.md>",
    "styleGuide": "<path/to/style_guide.md>",
    "assetsDir": "<path/to/assets_dir>",
    "knowledge": ["<path/to/extra.pdf>", "<path/to/one-pager.docx>"]
  },
  "templates": {
    "blogOutline": "<path/to/blog_outline_template.md>",
    "blogDraft": "<path/to/blog_draft_template.md>",
    "socialPost": "<path/to/social_post_template.md>",
    "locationPage": "<path/to/location_page_template.md>"
  }
}
```

2. The sync bridge automatically surfaces these in generated Markdown files under “Brand References,” so collaborators always see the right context.

3. For clients with materials in an external Claude Code project, you can reference absolute paths or shared folders in `brand.knowledge` and `brand.assetsDir`.

---

## 📊 Airtable Integration Requirements

### Current Hardcoded Values
- **Base ID**: `YOUR_AIRTABLE_BASE_ID` (client-specific)
- **Content Table ID**: `YOUR_AIRTABLE_TABLE_ID`
- **API Key**: `YOUR_AIRTABLE_API_KEY`
- **Webhook URL**: `{{WEBHOOK_URL}}`

### Required Configuration System
```javascript
// Proposed client configuration structure
const clientConfig = {
  client: {
    name: "{{COMPANY_NAME}}", // → "Client Name"
    industry: "home_services", // → "industry_type"
    brandName: "Your Brand Name Here", // → "Brand Display Name"
    domain: "{{WEBSITE_URL}}" // → "client_domain"
  },
  airtable: {
    baseId: "YOUR_BASE_ID", // → Client's base ID
    contentTableId: "YOUR_CONTENT_TABLE_ID", // → Client's content table
    apiKey: "pataGikJDZvBzgIDE...", // → Client's API key
    embedViews: {
      calendar: "shr9MzUotKm1GFD3C", // → Client's calendar view
      planning: "shrXePkz0qqKaflso", // → Client's planning view
      tracking: "shrLHz4uxUAYFwsaj" // → Client's tracking view
    }
  },
  n8n: {
    webhookUrl: "{{WEBHOOK_URL}}", // → Client's webhook
    workflowIds: {
      contentGeneration: "workflow_id_1",
      publishing: "workflow_id_2"
    }
  },
  googleDrive: {
    folderId: "root_folder_id", // → Client's content folder
    templateFolderId: "template_folder_id"
  }
}
```

### Files Requiring Airtable Adaptation

#### 1. Dashboard HTML (`dashboard/client-interactive-dashboard.html`)
**Lines to Make Configurable**:
- Line 6: `<title>{{COMPANY_NAME}} Interactive Content Planning Dashboard</title>`
- Line 2571: `<h1>🐛 {{COMPANY_NAME}} Content Planning Hub</h1>`
- Line 2675: Airtable base URL `https://airtable.com/YOUR_BASE_ID/`
- Line 2691-2716: All embed URLs with base ID `YOUR_BASE_ID`
- Line 3041: Hardcoded API key
- Line 3044: API URL structure

#### 2. Sync Bridge (`automation/sync_bridge.js`)
**Configuration Points**:
- Airtable API integration
- Content ID generation logic
- Google Drive workspace creation
- Webhook endpoints

#### 3. API Scripts
**Files Needing Updates**:
- All files in `automation/api/`
- Webhook URL references
- Base ID and Table ID hardcoding

---

## 🏢 Client-Specific Elements Requiring Customization

### 1. Industry-Specific Data

#### Example Industry-Specific Elements
```javascript
// Example industry-specific data (configured via /onboard)
const clientData = {
  serviceAreas: ["State 1", "State 2", "State 3"],
  serviceTypes: ["Service A", "Service B", "Service C", "Service D", "Service E"],
  contentTypes: ["Blog Post", "Service Page", "Location Page", "Social Media"],
  seasonalFocus: ["Spring Prevention", "Summer Active Season", "Fall Preparation", "Winter Planning"]
}
```

#### Generic Industry Configuration Needed
```javascript
// Proposed generic structure
const industryConfig = {
  serviceAreas: [], // Client's service locations
  serviceTypes: [], // Client's services/products
  contentCategories: [], // Content types relevant to industry
  seasonalContent: [], // Seasonal messaging relevant to industry
  targetAudiences: [], // Client's customer segments
  competitiveTerms: [] // Industry-specific keywords
}
```

### 2. Brand-Specific Elements

#### Current {{COMPANY_NAME}} Branding
- Company name: (configured in config/brand.json)
- Tagline: (configured in client-context/brand/)
- Primary CTA: (configured in client-context/brand/)
- Color scheme: (configured in config/brand.json)
- Voice: (configured in client-context/brand/voice-and-tone-guide.md)

#### Generic Brand Configuration
```javascript
const brandConfig = {
  companyName: "", // Full legal name
  displayName: "", // Marketing name
  tagline: "", // Primary value proposition
  primaryCTA: "", // Main call-to-action
  colorScheme: {
    primary: "#color",
    secondary: "#color",
    accent: "#color"
  },
  voiceAttributes: [], // Brand voice characteristics
  messaging: {
    coreValue: "", // Primary value prop
    differentiators: [], // Key competitive advantages
    audienceMessages: {} // Persona-specific messaging
  }
}
```

### 3. Content Structure Elements

#### Current {{COMPANY_NAME}} Content Fields
- Location-based content (from config service areas)
- Service-specific categories
- Seasonal timing
- Commercial vs residential focus

---

## 🔨 Required Admin Panel Components

### Priority 1: GUI Configuration Panel
Create an admin interface within the dashboard for:

1. **Airtable Connection Settings**
   ```javascript
   // Admin panel form fields needed
   const airtableConfig = {
     baseId: "text_input", // Client enters their base ID
     contentTableId: "text_input", // Client enters table ID
     apiKey: "password_input", // Secure API key entry
     testConnection: "button" // Validate connection
   }
   ```

2. **Client Information Setup**
   ```javascript
   const clientSetup = {
     clientName: "text_input",
     industry: "dropdown_select", // Predefined industry templates
     brandName: "text_input",
     domain: "text_input",
     serviceAreas: "multi_input", // Add/remove locations
     saveConfiguration: "button"
   }
   ```

3. **Content Categories Configuration**
   ```javascript
   const contentConfig = {
     contentTypes: "multi_input", // Blog, Service Page, etc.
     serviceTypes: "multi_input", // Industry-specific services
     targetAudiences: "multi_input", // Customer segments
     seasonalContent: "checkbox_options", // Enable/disable seasonal
     saveContentStructure: "button"
   }
   ```

### Priority 2: Template Management
Create industry-specific content templates:

1. **Home Services Template** (HVAC, Plumbing, Lawn Care, etc.)
2. **Specialty Services Template** (Cleaning, Restoration, etc.)
3. **Professional Services Template** (Legal, Accounting, etc.)
4. **E-commerce Template** (Product-based businesses)
5. **SaaS Template** (Software companies)

---

## 🗂️ Configuration File Structure

### Proposed Client Configuration System
```
/config/
  ├── client-config.json       # Master client configuration
  ├── industry-templates/      # Predefined industry setups
  │   ├── home-services.json
  │   ├── professional-services.json
  │   ├── ecommerce.json
  │   └── custom.json
  ├── brand-guidelines/        # Client brand assets
  │   ├── colors.json
  │   ├── messaging.json
  │   └── voice-guide.json
  └── integrations/           # API configurations
      ├── airtable.json
      ├── n8n-workflows.json
      └── google-drive.json
```

---

## ⚡ Implementation Priority Order

### Phase 1: Airtable Configuration (Immediate Priority)
- [ ] Extract all hardcoded Airtable references
- [ ] Create configuration loader system
- [ ] Build admin panel for Airtable settings
- [ ] Add connection testing functionality

### Phase 2: Brand/Client Customization
- [ ] Extract {{COMPANY_NAME}}-specific branding elements
- [ ] Create generic brand configuration system
- [ ] Build client setup wizard
- [ ] Implement industry template system

### Phase 3: Content Structure Adaptation
- [ ] Make content categories configurable
- [ ] Create industry-specific content templates
- [ ] Build content type management interface
- [ ] Implement service area configuration

### Phase 4: Advanced Features
- [ ] Multi-client management system
- [ ] Template marketplace
- [ ] Advanced workflow customization
- [ ] White-label dashboard options

---

## 🔍 Files Requiring Updates

### High Priority (Contains Hardcoded Client Data)
1. `dashboard/client-interactive-dashboard.html` - GUI with {{COMPANY_NAME}} branding
2. `automation/sync_bridge.js` - Airtable integration
3. `scripts/serve-planning-data.js` - API endpoints
4. All files in `automation/api/` - Webhook configurations
5. `CLAUDE.md` - Client-specific instructions

### Medium Priority (Contains References)
1. `automation/claude_gui_sync.sh` - Script naming
2. All content templates in `content/` directory
3. Brand guidelines in `docs/` directory

### Lower Priority (Documentation and Examples)
1. README files
2. Example content
3. Archive content

---

## 🎯 Next Steps

1. **Start with Airtable Admin Panel** - Most critical for multi-client use
2. **Extract configuration to JSON files** - Remove hardcoded values
3. **Create client setup wizard** - Streamline onboarding
4. **Build industry templates** - Accelerate new client setup
5. **Test with second client** - Validate adaptability

---

## 📝 Notes for Development

- All hardcoded strings should be moved to configuration files
- Admin panel should include connection testing
- Configuration should be validatable and exportable
- System should support easy backup/restore of client configs
- Consider security implications of storing API keys
- Plan for multi-tenant usage patterns

---

*This document will be updated as we identify additional elements requiring customization.*
