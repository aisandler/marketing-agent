# {{COMPANY_NAME}} Content Templates & Format Specifications

## Overview

This document consolidates all content templates for the {{COMPANY_NAME}} Marketing Organization orchestration layer. These templates ensure consistent, high-quality content generation across all content types while leveraging LOCAL and SYSTEMATIC generation pathways.

**Template Sources:** Organized from {{CLIENT_CONTACT}} original template specifications and N8N workflow integration patterns.

## **🗓️ SEASONAL {{INDUSTRY}} CALENDAR FOR CONTENT RELEVANCE**

Use this calendar to determine which {{INDUSTRY}} services and topics are most relevant for content timing:

### Spring (March, April, May)
{{SPRING_SERVICES}} - Example: Spring preparation, preventive services, seasonal maintenance

### Summer (June, July, August)
{{SUMMER_SERVICES}} - Example: Peak season services, maintenance, emergency response

### Fall (September, October, November)
{{FALL_SERVICES}} - Example: Preparation for winter, preventive measures, seasonal transitions

### Winter (December, January, February)
{{WINTER_SERVICES}} - Example: Winter-specific services, emergency response, indoor focus

### Year-Round
{{YEAR_ROUND_SERVICES}} - Example: Regular maintenance, emergency services, consultations

---

## **TEMPLATE CLASSIFICATION BY GENERATION TYPE**

### **🚀 LOCAL Generation Templates**
*For immediate Claude Code generation of text-heavy, research-intensive content*

**Content Types:**
- **Long-form Blog Posts** (>1000 words)
- **Location Page Content** (detailed service descriptions)
- **Educational Guides** (comprehensive information)
- **Research-based Articles** (in-depth pest control content)

### **📋 SYSTEMATIC Generation Templates** 
*For Airtable workflow processing with platform optimization and visual elements*

**Content Types:**
- **Social Media Posts** (Facebook, Instagram, LinkedIn)
- **Campaign Content** (coordinated multi-platform)
- **Visual Content** (image requirements, branded elements)
- **Platform-Specific Content** (optimized formatting)

---

## **📝 BLOG POST TEMPLATES**

### **LOCAL Generation Blog Post Template**
*Use for immediate generation of comprehensive blog content*

```markdown
# LOCAL Blog Post Generation Template

**Classification:** LOCAL (>1000 words, text-focused, research-intensive)

## Content Specifications
- **Length:** 1,000-1,500 words (comprehensive educational format)
- **Format:** WordPress-ready with HTML structure
- **Content Ratio:** 70% education, 30% professional service promotion
- **SEO Requirements:** Local optimization with intensive regional focus
- **Brand Alignment:** {{COMPANY_NAME}} messaging and family safety focus throughout
- **Writing Restrictions:** NO em dashes, emojis, fictional examples, made-up information, specific people/names
- **Tone:** Empathetic, competent, neighborly - customer-centered, not company-centered
- **Reading Level:** Accessible for average homeowners - assume beginners
- **Authority Building:** Reference 20+ years experience, cite credible sources (EPA, universities)

## Template Structure
### 1. SEO-Optimized Title
**Format:** "[Primary Keyword] in [Location] - [Benefit/Solution]"
**Example:** "Termite Control in Rockford - Protect Your Family Home"

### 2. Meta Description (150-160 characters)
**Template:** "Professional [pest type] control in [location]. {{COMPANY_NAME}}'s family-safe treatments provide guaranteed results. Free inspection available."

### 3. Opening Hook (200-300 words)
Focus on family safety concerns and local relevance
- Start with detailed relatable family scenario
- Establish specific seasonal/weather context
- Present regional pest patterns with local expertise
- Create urgency without fear-mongering
- First strategic CTA: "Concerned about [pest]? Call (815) 284-4101 for free inspection."

### 4. Main Content Structure (70% Education / 30% Professional Service)

**H2: Understanding [Pest Type] Behavior in [Location] (600-800 words)**
- Regional species identification with specific Midwest varieties
- Seasonal activity patterns and climate influence
- Why [pest] thrive in [location] conditions
- Breeding cycles and population dynamics
- Environmental factors unique to Illinois/Iowa/Wisconsin
- Second strategic CTA: "Need professional identification? Free inspection: (815) 284-4101"

**H2: Comprehensive [Pest Type] Identification Guide (400-600 words)**
- Visual identification with detailed descriptions
- Behavior patterns homeowners notice
- Damage signs and health implications
- Species-specific traits and habits
- When immediate action is required

**H2: Preventing [Pest Type] in [Location] - Complete Guide (500-700 words)**
- Location-specific prevention strategies
- Seasonal maintenance calendar
- DIY prevention methods with step-by-step instructions
- Environmental modifications for long-term control
- When DIY methods reach their limits
- Third strategic CTA: "Ready for professional prevention? Call (815) 284-4101"

**H2: {{COMPANY_NAME}}'s Professional [Pest Type] Treatment Process (300-400 words)**
- Comprehensive inspection methodology
- Treatment process with family safety protocols
- Timeline, guarantees, and follow-up procedures
- Local expertise and community connection

**H2: Protecting Your [Location] Home Year-Round (200-300 words)**
- Seasonal maintenance recommendations
- Pests Protection Club benefits
- Long-term prevention strategies

### 5. Call-to-Action
**Template:** "Don't let [pest type] threaten your family's safety. Contact {{COMPANY_NAME}} today for your free [location] pest inspection: (815) 284-4101"

## Brand Guidelines Integration
- Core Message: "Shield your Home. Protect your Family."
- Tone: Trustworthy, family-focused, locally connected
- Value Props: Local expertise, eco-friendly methods, guaranteed results
- Target: Homeowners, property managers, business owners

## SEO Requirements
- Primary keyword in title, first H2, and naturally throughout (5-7 occurrences)
- Location mentioned in title and 5-7 times per 1,000 words (8-15 total mentions)
- Seasonal keywords integrated 3-4 times (weather, season, timing)
- Long-tail location-seasonal combinations: "[Pest] in [Location] [Season]"
- Internal linking to related services and location pages
- Schema markup suggestions for LocalBusiness and Article
```

### **SYSTEMATIC Blog Post Template**
*For shorter blog posts requiring visual elements or campaign coordination*

```markdown
# SYSTEMATIC Blog Post Generation Template

**Classification:** SYSTEMATIC (<1000 words, visual elements, campaign coordination)

## Airtable Field Integration
**Required Fields:**
- Target Location: {{Target Location}}
- Pest Type: {{Pest Type}}
- Primary Keyword: {{Primary Keyword}}
- Seasonal Relevance: {{Seasonal Relevance}}
- {{CLIENT_CONTACT}} Notes: {{{{CLIENT_CONTACT}} Notes}}

## AI Prompt Template for N8N Workflow
You are a professional pest control content writer creating SEO-optimized blog posts for {{COMPANY_NAME}}.

BRAND GUIDELINES: [Reference docs/brand-guidelines/ and docs/client-context/]
- Core message: "Shield your Home. Protect your Family."
- Family-focused, trustworthy, locally connected tone

CONTENT REQUIREMENTS:
- Target Location: {{$node["Airtable"].json["Target Location"]}}
- Pest Type: {{$node["Airtable"].json["Pest Type"]}}
- Primary Keyword: {{$node["Airtable"].json["Primary Keyword"]}}
- Seasonal Relevance: {{$node["Airtable"].json["Seasonal Relevance"]}}

BLOG POST SPECIFICATIONS:
- Length: 600-1,000 words
- Format: WordPress-ready HTML
- Include H2 headers with local keywords
- Meta description (150-160 characters)
- Strong CTA for Free Pest Inspection
- Phone: (815) 284-4101

## Visual Elements Required
- Header image: Professional pest control context
- Process infographic: Treatment steps
- Before/after comparison: Results showcase
- Family safety imagery: Brand positioning
```

---

## **📱 SOCIAL MEDIA TEMPLATES**

### **Facebook Post Template**
*Always SYSTEMATIC - Platform optimization and image generation*

```markdown
# Facebook Post Template

**Classification:** SYSTEMATIC (platform-specific, visual elements, brand workflow)

## Content Specifications
- Length: 50-150 words maximum
- Tone: Empathetic, competent, neighborly - customer-centered
- Hashtags: 3-5 relevant tags
- CTA: Strong action with phone number
- CRITICAL: NO location-specific references (works across IL, IA, WI)
- **Writing Restrictions:** NO em dashes, emojis, fictional examples, made-up information, specific people/names
- **Content Mix:** 40% problem/solution, 30% educational, 20% Google reviews, 10% seasonal
- **Authority Building:** Use real Google reviews, reference 20+ years experience

## Template Structure
### Opening Hook (20-30 words)
**Question Format:** "Worried about [pest type] threatening your family's safety this [season]?"
**Alert Format:** "[Season] is [pest type] season - is your home protected?"

### Problem/Concern (40-60 words)
Focus on family safety and peace of mind
- Emphasize protection of children/pets
- Seasonal timing and urgency
- Common homeowner concerns

### Solution/Prevention (40-60 words)
{{COMPANY_NAME}}'s family-safe approach
- Professional expertise
- Eco-friendly methods
- Guaranteed results

### Call-to-Action (20-30 words)
**Template:** "Don't wait until it's too late. Call {{COMPANY_NAME}} today for your free pest inspection: (815) 284-4101 #PestControl #FamilySafety #HomeSafety"

## Visual Requirements
- Dimensions: 1200x630px
- Style: Family-friendly, professional, reassuring
- Elements: Happy family, safe home, seasonal context
- Branding: {{COMPANY_NAME}} logo placement
- Text overlay: Key message or CTA
```

### **Instagram Post Template**
*Always SYSTEMATIC - Visual storytelling and hashtag optimization*

```markdown
# Instagram Post Template

**Classification:** SYSTEMATIC (visual-first platform, hashtag strategy, image focus)

## Content Specifications
- Length: 50-150 words maximum
- Style: Visual storytelling
- Tone: Empathetic, competent, neighborly - customer-centered
- Hashtags: 10-15 strategic tags
- CTA: Clear action with phone number
- CRITICAL: NO location-specific references (works across IL, IA, WI)
- **Writing Restrictions:** NO em dashes, emojis, fictional examples, made-up information, specific people/names

## Template Structure
### Hook Opening (15-25 words)
**Question Format:** "Is your family protected from [pest type] this [season]?"
**Alert Style:** "[Season] pest alert: [Pest type] activity increasing!"
**NO EMOJIS OR EM DASHES ALLOWED**

### Quick Solution/Tip (30-50 words)
Professional guidance in digestible format
- One key prevention tip
- Family safety emphasis
- Professional recommendation

### Call-to-Action (25-35 words)
**Template:** "Keep your family safe. Call {{COMPANY_NAME}} for expert pest protection: (815) 284-4101"

### Hashtag Strategy
**Primary:** #PestControl #FamilySafety #HomeSafety #EcoFriendly
**Seasonal:** #SpringPests #SummerProtection #FallPrevention #WinterMaintenance
**Local:** #Illinois #Iowa #Wisconsin #Midwest
**Service:** #PestPrevention #ProfessionalPestControl #GuaranteedResults

## Visual Requirements
- Dimensions: 1080x1080px (square format)
- Style: Clean, modern, family-focused
- Elements: Lifestyle imagery, seasonal context
- Branding: Subtle logo integration
- Text: Minimal, impactful overlay
```

---

## **🏠 LOCATION PAGE TEMPLATES**

### **LOCAL Generation Location Page Template**
*For detailed, text-heavy location page content*

```markdown
# LOCAL Location Page Template

**Classification:** LOCAL (detailed service descriptions, extensive content)

## Content Specifications
- Length: 800-1,200 words
- Format: WordPress landing page
- Local optimization: Heavy city/region focus
- Unique content: NO template variables, genuine local insights

## Template Structure
### 1. Local Hero Section
**H1 Format:** "[Service Type] in [City, State] - Local Pest Control Experts"
**Subheadline:** "{{COMPANY_NAME}} provides professional pest control services to [City] families and businesses with guaranteed results since [year]."

### 2. City-Specific Pest Challenges (200-300 words)
**H2:** "Common Pest Problems in [City], [State]"
- Regional pest species and patterns
- Local climate impact on pest activity
- Geographic factors (rivers, forests, urban density)
- Seasonal pest cycles specific to region

### 3. Local Service Advantages (200-300 words)
**H2:** "Why [City] Residents Choose {{COMPANY_NAME}}"
- Local expertise and community connection
- Understanding of regional pest patterns
- Proximity and response time benefits
- Local testimonials and success stories

### 4. Service Area Details (150-200 words)
**H2:** "{{COMPANY_NAME}} Service Areas Around [City]"
- Specific neighborhoods and suburbs covered
- Service radius and response times
- Local landmarks and geographic references
- Commercial and residential service distinction

### 5. Local Contact & Scheduling (100-150 words)
**H2:** "Schedule Your [City] Pest Inspection"
- Local scheduling information
- Emergency service availability
- Preferred contact methods
- Local office/service details

## Local SEO Requirements
- City name in title, all H2 headers, and 8-10 times throughout
- Mention local landmarks, geographic features, or climate
- Address regional pest patterns specific to area
- Include local phone number and service details
- Internal links to related local content
```

### **SYSTEMATIC Location Page Template**
*For location pages requiring visual elements or campaign integration*

```markdown
# SYSTEMATIC Location Page Template

**Classification:** SYSTEMATIC (visual elements, campaign coordination)

## Airtable Field Integration
**Required Fields:**
- Target Location: {{Target Location}}
- Primary Keyword: {{Primary Keyword}}
- Search Volume: {{Search Volume}}
- Keyword Difficulty: {{Keyword Difficulty}}
- {{CLIENT_CONTACT}} Notes: {{{{CLIENT_CONTACT}} Notes}}

## AI Prompt Template for N8N Workflow
You are a local SEO content writer creating location-specific landing pages for {{COMPANY_NAME}}.

BRAND GUIDELINES: [Reference docs/brand-guidelines/ and docs/client-context/]

CONTENT REQUIREMENTS:
- Target Location: {{$node["Airtable"].json["Target Location"]}}
- Primary Keyword: {{$node["Airtable"].json["Primary Keyword"]}}
- Search Volume: {{$node["Airtable"].json["Search Volume"]}}

LOCATION PAGE SPECIFICATIONS:
- Length: 600-900 words
- Format: WordPress landing page HTML
- Heavy local optimization
- Genuine unique content (no template variables)
- Multiple CTAs throughout

## Visual Elements Required
- Local hero banner: City skyline or landmarks
- Service area map: Coverage visualization
- Local testimonial images: Community connection
- Process workflow: Service steps with local context
```

---

## **📊 CAMPAIGN CONTENT TEMPLATES**

### **Seasonal Campaign Template**
*Always SYSTEMATIC - Multi-platform coordination*

```markdown
# Seasonal Campaign Content Template

**Classification:** SYSTEMATIC (multi-platform, coordinated timing, campaign workflow)

## Campaign Structure
### Phase 1: Awareness (Weeks 1-2)
**Blog Post:** "[Season] Pest Prevention Guide for [Region]"
- Educational focus, SEO optimized
- Classification: LOCAL (comprehensive, research-heavy)

**Social Media Series:** Daily tips and alerts
- Facebook: Problem awareness posts
- Instagram: Visual prevention tips
- Classification: SYSTEMATIC (visual, coordinated)

### Phase 2: Solution (Weeks 3-4)
**Location Pages:** Seasonal service focus
- "Professional [Season] Pest Control in [Cities]"
- Classification: Context-dependent (LOCAL if text-heavy, SYSTEMATIC if visual)

**Social Media:** Service-focused content
- Customer success stories
- Treatment process highlights
- Classification: SYSTEMATIC (branded, visual)

### Phase 3: Urgency (Weeks 5-6)
**Blog Post:** "Don't Wait - [Season] Pest Problems Escalate Quickly"
- Classification: LOCAL (urgent, informational)

**Social Media:** Call-to-action focused
- Limited-time inspection offers
- Testimonial highlights
- Classification: SYSTEMATIC (campaign coordination)

## Cross-Platform Consistency
- Unified messaging themes
- Coordinated timing and content releases
- Brand guideline compliance across all content
- Local adaptation while maintaining core campaign structure
```

---

## **🎨 VISUAL CONTENT SPECIFICATIONS**

### **Blog Post Images Template**
```markdown
# Blog Post Image Requirements

**Dimensions:** 1200x630px (blog header optimized)
**Style:** Professional, family-friendly, reassuring
**Elements Required:**
- {{COMPANY_NAME}} branding/logo placement area
- Family home context
- Professional pest control elements
- Seasonal relevance when applicable

**Visual Themes:**
- Family safety and home protection
- Professional pest control service
- Clean, trustworthy presentation
- Seasonal appropriate settings

**Avoid:** Scary pest imagery, fear-inducing elements
```

### **Social Media Images Template**
```markdown
# Social Media Image Requirements

**Dimensions:** 
- Instagram: 1080x1080px (square)
- Facebook: 1200x630px (landscape)

**Style:** Engaging, family-focused, professional
**Elements Required:**
- {{COMPANY_NAME}} logo prominently placed
- Key message text overlay
- Brand colors (professional blue/green with safety accents)
- Clear, readable font for key messages

**Visual Elements:**
- Happy family in safe home environment
- Professional pest control context
- Strong call-to-action placement
- Seasonal relevance when appropriate
```

---

## **🔧 TEMPLATE USAGE GUIDELINES**

### **LOCAL Generation Implementation**
1. **Agent Coordination:** Use content creation agents (Lead Writer)
2. **Research Integration:** Leverage Market Research Specialist for local insights
3. **SEO Optimization:** Apply SEO Optimization Specialist recommendations
4. **Brand Compliance:** Reference docs/brand-guidelines/ and docs/client-context/ for messaging consistency

### **SYSTEMATIC Generation Integration**
1. **Airtable Field Mapping:** Use template variables from content records
2. **N8N Workflow Prompts:** Copy template prompts into AI generation nodes
3. **Brand Guidelines Reference:** Include complete brand guidelines in system prompts
4. **Quality Validation:** Ensure field data integration and brand compliance

### **Template Selection Logic**
```
IF Content Type = "Social Media Post"
   → Use SYSTEMATIC templates (always)

ELSE IF Content Type = "Blog Post" AND Word Count > 1000
   → Use LOCAL template (text-focused generation)

ELSE IF Content Type = "Blog Post" AND Visual Requirements = TRUE
   → Use SYSTEMATIC template (campaign/visual coordination)

ELSE IF Content Type = "Location Page" AND Complexity = "Standard"
   → Use LOCAL template (detailed local content)

ELSE IF Visual Elements Required OR Campaign Coordination
   → Use SYSTEMATIC template (workflow optimization)

ELSE
   → Default to LOCAL template (speed optimization)
```

---

## **📋 QUALITY ASSURANCE CHECKLIST**

### **All Content Types**
- [ ] Brand guidelines compliance verified
- [ ] Target audience alignment confirmed
- [ ] Call-to-action included with correct phone number
- [ ] {{COMPANY_NAME}} core messaging incorporated
- [ ] Family safety emphasis present
- [ ] Professional tone maintained
- [ ] NO em dashes, emojis, or cringey language used
- [ ] NO fictional examples, made-up information, or fake testimonials
- [ ] Brand voice is empathetic, competent, neighborly (customer-centered)
- [ ] Authority building includes 20+ years experience reference
- [ ] Real Google reviews used for social proof (with privacy protection)

### **LOCAL Generated Content**
- [ ] Content length meets template specifications (Blog: 1,000-1,500 words)
- [ ] SEO requirements fulfilled
- [ ] Local optimization properly implemented
- [ ] Research depth appropriate for content type
- [ ] Internal linking opportunities identified
- [ ] Credible sources cited naturally (EPA, universities, industry associations)
- [ ] Reading level accessible for beginners/new homeowners

### **SYSTEMATIC Generated Content**
- [ ] Airtable field data properly integrated
- [ ] Platform-specific formatting applied
- [ ] Visual requirements documented
- [ ] Campaign coordination maintained
- [ ] Brand workflow compliance ensured
- [ ] Social media: 50-150 words maximum length
- [ ] Social media: NO location-specific references
- [ ] Content mix ratios followed (40% problem/solution, 30% educational, 20% reviews, 10% seasonal)
- [ ] Google review integration follows privacy guidelines (first names/initials only)

---

## **🔗 INTEGRATION REFERENCES**

### **Related Documentation**
- **Brand Guidelines:** `docs/brand-guidelines/core-messaging-template.md`
- **Content Themes:** `docs/brand-guidelines/content-themes-template.md`
- **{{COMPANY_NAME}} Context:** `docs/client-context/` (company profile, keywords, services, StoryBrand)
- **Decision Tree Logic:** `docs/decision-tree-logic.md`
- **Strategic Pathways:** `docs/strategic-pathways.md`
- **N8N Workflow Integration:** `docs/reference/N8N_WORKFLOW_PROMPT_TEMPLATES.md`

### **Template Sources**
- **Local SEO Template:** `docs/templates/client_local_seo_content_template.md`
- **Campaign Strategy:** `docs/templates/campaign_strategy_template.md`
- **N8N Prompt Templates:** `docs/reference/N8N_WORKFLOW_PROMPT_TEMPLATES.md`

---

**Template System Status:** Complete and integrated with orchestration layer
**Last Updated:** Current session
**Integration:** Ready for LOCAL and SYSTEMATIC generation workflows