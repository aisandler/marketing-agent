# {{COMPANY_NAME}} Context Reference Map

**Purpose**: Single source of truth for all {{COMPANY_NAME}}-specific context materials and their usage in content generation workflows.

**Created**: September 6, 2025  
**Status**: Consolidated and Ready for Use

---

## 📁 **CONSOLIDATED DIRECTORY STRUCTURE**

### **Primary {{COMPANY_NAME}} Context Location**
```
content/client-samples/
├── company/                  # Business profiles and operational details
├── branding/                 # Brand framework and messaging
├── keywords/                 # SEO research and search volume data
├── services/                 # Service descriptions and offerings
└── social-media/             # Example social posts
```

---

## 📋 **CONTENT MATERIALS INVENTORY**

### **Company Context** (`content/client-samples/company/`)
- **company-profile-updated.md** - Complete business overview, services, contact info
- **service-area-updated.md** - Geographic coverage ({{SERVICE_AREAS}})

**Usage**: Reference for business details, service areas, contact information, operational hours.

### **Branding Context** (`content/client-samples/branding/`)
- **brand-framework-complete.md** - Complete brand messaging framework

**Usage**: Core messaging, brand voice, customer journey, problems/solutions framework.

### **Keyword Research** (`content/client-samples/keywords/`)
- **keyword-list-updated.md** - High-intent keywords with search volumes and CPC data

**Usage**: SEO optimization, content targeting, location-specific keyword strategy.

### **Services Context** (`content/client-samples/services/`)
- **services-list-updated.md** - Detailed service descriptions and pricing

**Usage**: Service-specific content creation, feature descriptions, benefit explanations.

### **Social Media Examples** (`content/client-samples/social-media/`)
- **social-media-posts-complete.md** - Proven social media post examples

**Usage**: Format reference, tone consistency, StoryBrand structure examples.

---

## 🔗 **ORCHESTRATION INTEGRATION**

### **Agent References Updated**
- ✅ **Social Media Strategist**: Updated to reference consolidated paths
- ✅ **Content Templates**: Updated with {{COMPANY_NAME}} context references
- ✅ **Orchestration Guide**: Expanded brand guidelines references

### **Template Integration Points**
- **LOCAL Generation**: Direct access to company profile, keywords, StoryBrand
- **SYSTEMATIC Generation**: Template variables populated from context materials
- **Agent Coordination**: All agents reference centralized {{COMPANY_NAME}} context

---

## 🎯 **USAGE GUIDELINES BY CONTENT TYPE**

### **Blog Posts**
**Required Context**:
- Company profile for business details
- Keywords for SEO optimization  
- StoryBrand for messaging framework

**Reference Pattern**:
```
Company: content/client-samples/company/company-profile-updated.md
Keywords: content/client-samples/keywords/keyword-list-updated.md
Messaging: content/client-samples/branding/brand-framework-complete.md
```

### **Social Media Posts**
**Required Context**:
- Social media examples for format
- StoryBrand for messaging structure
- Company profile for contact info

**Reference Pattern**:
```
Examples: content/client-samples/social-media/social-media-posts-complete.md
Framework: content/client-samples/branding/storybrand-framework-complete.md
Contact: content/client-samples/company/company-profile-updated.md
```

### **Location Pages**  
**Required Context**:
- Service areas for geographic targeting
- Keywords for local SEO
- Services for detailed descriptions

**Reference Pattern**:
```
Areas: content/client-samples/company/service-area-updated.md
Keywords: content/client-samples/keywords/keyword-list-updated.md
Services: content/client-samples/services/services-list-updated.md
```

---

## 🔄 **WORKFLOW INTEGRATION**

### **Agent Coordination Pattern**
1. **Context Loading**: Agents access content/client-samples/ for company-specific materials
2. **Brand Compliance**: Cross-reference docs/brand-guidelines/ with {{COMPANY_NAME}} context  
3. **Content Generation**: Apply context materials based on content type requirements
4. **Quality Assurance**: Validate against both brand guidelines and {{COMPANY_NAME}} specifics

### **Template System Integration**
- **Brand Guidelines**: `docs/brand-guidelines/` (universal brand rules)
- **{{COMPANY_NAME}} Context**: `content/client-samples/` (company-specific materials)
- **Combined Reference**: Both directories provide complete context for content generation

---

## ✅ **VALIDATION CHECKLIST**

### **For Content Creators**
- [ ] Company details match content/client-samples/company/company-profile-updated.md
- [ ] Keywords sourced from content/client-samples/keywords/keyword-list-updated.md
- [ ] Messaging follows content/client-samples/branding/storybrand-framework-complete.md
- [ ] Service descriptions align with content/client-samples/services/services-list-updated.md
- [ ] Contact info uses {{PHONE_NUMBER}} from company profile

### **For System Integration**
- [ ] All file paths point to content/client-samples/ structure  
- [ ] Agent references updated to consolidated locations
- [ ] Template integration includes {{COMPANY_NAME}} context variables
- [ ] Workflow documentation references complete context map

---

## 📈 **MAINTENANCE & UPDATES**

### **Content Updates**
- **Company Changes**: Update content/client-samples/company/company-profile-updated.md
- **New Services**: Update content/client-samples/services/services-list-updated.md  
- **Keyword Research**: Update content/client-samples/keywords/keyword-list-updated.md
- **Brand Evolution**: Update content/client-samples/branding/storybrand-framework-complete.md

### **Integration Updates**
- **New Agents**: Reference content/client-samples/ in agent definitions
- **New Templates**: Include {{COMPANY_NAME}} context integration patterns
- **Workflow Changes**: Update orchestration references to consolidated structure

---

## 🚀 **BENEFITS ACHIEVED**

### **Single Source of Truth**
- All {{COMPANY_NAME}} context materials in one logical location
- No confusion about which version to use
- Clear separation of universal brand rules vs. company specifics

### **Improved Workflow Efficiency**  
- Predictable file paths for agent references
- Consistent integration patterns across all content types
- Reduced setup time for new content generation

### **Better Maintenance**
- Centralized updates for company information
- Clear ownership of different context types
- Easy addition of new context materials

---

**Integration Status**: ✅ Complete and Production Ready  
**Next Review**: When significant company changes occur or new context materials are added