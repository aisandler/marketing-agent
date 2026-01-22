# {{COMPANY_NAME}} Orchestration Implementation Guide

## Overview

This guide provides step-by-step execution patterns for implementing the orchestration layer in Claude Code sessions. It bridges the strategic pathways defined in `strategic-pathways.md` with concrete implementation steps for content creation workflow.

---

## **PHASE 1: Strategic Pathway Initiation**

### **Trigger Recognition**
**When user says: "let's plan"**

**Immediate Response Pattern:**
```markdown
I'll help you plan your {{COMPANY_NAME}} content strategy. Here are your strategic pathways:

## 🎯 **Content Planning Pathways** *(Ready to Execute)*

### **Monthly Content Calendar**
Create comprehensive 30-day content strategy with publication schedule
→ **Deliverable**: 15-20 content records with optimal timing and coordination

### **Seasonal Campaign Development** 
Build targeted campaign content for upcoming seasonal opportunity
→ **Deliverable**: 8-12 content records for cohesive seasonal campaign

### **New Service Launch Content**
Develop complete launch content suite ready for deployment
→ **Deliverable**: 10-15 content records supporting new service launch

### **Seasonal Service Campaign**
Create time-sensitive seasonal content calendar
→ **Deliverable**: 12-18 content records with seasonal focus

## 📊 **Market Intelligence Pathways** *(Requires Your Input)*

### **Market Opportunity Analysis** 🔍
Analyze performance gaps and content opportunities  
→ **Required**: Website analytics, traffic data, budget constraints

### **Performance Review & Optimization** 🔍  
Audit content performance with specific improvement actions
→ **Required**: Content performance data, engagement metrics, ranking positions

### **Competitive Response Strategy** 🔄
Strategic response to competitive threats/opportunities
→ **Mixed**: Web research + your positioning data

## 🚀 **Strategic Development Pathways** *(Ready to Execute)*

### **Keyword Strategy Development**
Research comprehensive keyword targeting strategy
→ **Deliverable**: Keyword strategy report + 8-12 keyword-optimized content records

### **Location Expansion Content**
Develop content strategy for new service areas
→ **Deliverable**: 10-15 location-specific content records

### **Social Media Content Blitz**
Create coordinated social media campaign
→ **Deliverable**: 20-25 social media posts with platform optimization

**Which pathway would you like to pursue?**
```

---

## **PHASE 2: Pathway-Specific Execution Patterns**

### **Pattern A: Ready to Execute Pathways**

#### **Agent Team Coordination**
**Step 1: Agent Team Assembly**
```markdown
I'm assembling the [PATHWAY NAME] team:
- [PRIMARY AGENT] (lead coordination)
- [SUPPORTING AGENTS] (specific roles)
- [FLEX AGENTS] (adaptive support)

Let me coordinate with the team to develop your strategy.
```

**Step 2: Research Phase Execution**
Use Task tool to launch relevant agents with specific prompts based on pathway:

**Monthly Content Calendar Example:**
```
Task: general-purpose agent
Prompt: "You are the Content Marketing Strategist leading Monthly Content Calendar development for {{COMPANY_NAME}} {{INDUSTRY}}.

OBJECTIVE: Create comprehensive 30-day content strategy with publication schedule

RESEARCH REQUIREMENTS:
1. Analyze upcoming seasonal opportunities and industry patterns for {{SERVICE_AREA}}
2. Review current month + next 30 days for optimal content timing
3. Research seasonal {{INDUSTRY}} challenges and service opportunities
4. Identify content gaps and opportunities across Blog Posts, Social Media, Location Pages

BRAND GUIDELINES REFERENCE: docs/brand-guidelines/ and docs/client-context/
- Core message: 'Shield your Home. Protect your Family.'  
- Focus: Family safety, local expertise, eco-friendly methods
- Content themes: Family Health Protection, Seasonal Prevention, Local Challenges, Eco-Friendly Methods
- Company context: docs/client-context/company/ (profiles, service areas)
- Keywords: docs/client-context/keywords/ (SEO research, search volumes)
- StoryBrand framework: docs/client-context/branding/

DELIVERABLE: Present 15-20 specific content record recommendations with:
- Content type (Blog Post, Social Media Post, Location Page)
- Target timing and seasonal alignment
- Keywords and search volume estimates (for Blog/Location content)
- Priority level (HIGH/MEDIUM/LOW)
- Target location (Illinois/Iowa/Wisconsin)
- Robust descriptions (15+ words each)

Format recommendations for user approval before record creation."
```

**Step 3: Strategic Consultation**
Present agent findings with targeted questions:
```markdown
Based on the team's research, here are our strategic insights:

**MARKET OPPORTUNITIES IDENTIFIED:**
- [Specific seasonal opportunities]
- [Content gaps discovered]
- [Competitive advantages available]

**STRATEGIC RECOMMENDATIONS:**
[Present 3-5 key strategic questions to guide content direction]

**PROPOSED CONTENT MIX:**
- X Blog Posts (targeting high-value keywords)
- Y Social Media Posts (engagement and awareness)
- Z Location Pages (local SEO optimization)

**KEY DECISION POINTS:**
1. [Strategic question 1]
2. [Strategic question 2] 
3. [Strategic question 3]

How would you like to proceed with these recommendations?
```

### **Pattern B: Input-Required Pathways**

#### **Data Collection Phase**
**Step 1: Requirement Gathering**
```markdown
To execute [PATHWAY NAME], I need the following information from you:

**REQUIRED DATA:**
- [Specific data requirement 1]
- [Specific data requirement 2]
- [Specific data requirement 3]

**ANALYSIS SCOPE:**
- [What will be analyzed]
- [Expected insights]
- [Strategic outcomes]

Please provide this information so I can coordinate with the intelligence team.
```

**Step 2: Custom Research Coordination**
Once data provided, use Task tool with user-specific context:
```
Task: general-purpose agent
Prompt: "You are the Marketing Analytics Specialist leading [PATHWAY NAME] for {{COMPANY_NAME}}.

USER PROVIDED DATA:
[Insert actual user data]

OBJECTIVE: [Pathway-specific outcome]

ANALYSIS REQUIREMENTS:
[Pathway-specific analysis steps using provided data]

DELIVERABLE: Strategic analysis report with actionable content recommendations"
```

---

## **PHASE 3: Content Record Generation**

### **LOCAL vs SYSTEMATIC Classification Logic**

**LOCAL Generation Triggers:**
- Time-sensitive seasonal content (spring prep, summer alerts)
- Standard blog posts under 1500 words
- Social media posts (all types)
- Simple location pages
- Content with clear templates and patterns

**SYSTEMATIC Generation Triggers:**
- Complex cornerstone content requiring multi-stakeholder review
- Content requiring extensive approval chains
- Strategic campaign content with multiple dependencies
- Content requiring custom workflow integration

### **Pre-Approval Content Presentation**
```markdown
## Content Recommendations for Approval

Based on our strategic consultation, here are the recommended content records:

**CONTENT RECORD 1**
- **Type**: Blog Post
- **Description**: [15+ word description with value prop and target audience]
- **Keywords**: [keyword 1 (volume), keyword 2 (volume), keyword 3 (volume), ...]
- **Priority**: HIGH/MEDIUM/LOW
- **Target Location**: Illinois/Iowa/Wisconsin
- **Classification**: LOCAL (will generate immediately) / SYSTEMATIC (Airtable workflow)
- **Estimated Timeline**: [timing guidance]

[Repeat for all recommended records]

**GENERATION APPROACH:**
- LOCAL content will be generated immediately and ready for dashboard review
- SYSTEMATIC content will create structured records for workflow processing

**Do you approve these content recommendations?**
```

### **Post-Approval Processing**

**Step 1: LOCAL Content Generation**
For approved LOCAL content:
```markdown
Generating LOCAL content for immediate review:

[Use appropriate content creation tools/agents for each approved LOCAL record]

Content generated and ready for dashboard review.
```

**Step 2: Record Creation**
```markdown
Creating content records in planning system:

- ✅ [Content Title 1] - LOCAL (Generated)
- ✅ [Content Title 2] - LOCAL (Generated) 
- ✅ [Content Title 3] - SYSTEMATIC (Structured)

Records created. Use the planning dashboard to review and submit to Airtable.
```

---

## **PHASE 4: Dashboard Handoff**

### **Transition Instructions**
```markdown
## Next Steps: Dashboard Review & Submission

Your content records are now available in the planning dashboard:
**Dashboard URL**: http://localhost:3000/dashboard/client-interactive-dashboard.html

**In the Dashboard:**
1. **Review Generated Content** - LOCAL content is ready for review
2. **Verify Record Details** - Confirm descriptions, keywords, priorities
3. **Select Final Records** - Choose which records to submit to Airtable
4. **Submit to Airtable** - Records will transfer with LOCAL content in Text field

**Airtable Integration:**
- LOCAL content appears in Text field with full markdown
- AUTO_INITIALIZE_TRIGGER uses Notes field for workflow processing
- Content ID tracking provides unified view across all creation methods

**Questions or changes needed before dashboard review?**
```

---

## **Error Handling Patterns**

### **Common Issues & Solutions**

**Issue**: Agent coordination fails
**Solution**: Retry with simplified agent prompt, fall back to single-agent approach

**Issue**: User provides unclear pathway preference
**Solution**: Ask clarifying questions, present 2-3 most relevant pathways with clear outcomes

**Issue**: LOCAL/SYSTEMATIC classification unclear
**Solution**: Default to LOCAL for faster execution, provide classification reasoning

**Issue**: Content requirements missing
**Solution**: Use brand guidelines defaults, note requirements for user confirmation

---

## **Quality Assurance Checklist**

### **Pre-Record Creation Validation**
- [ ] Content type is Blog Post, Social Media Post, or Location Page
- [ ] Blog/Location content includes keywords + search volume
- [ ] Descriptions are 15+ words with value proposition
- [ ] Priority level assigned (HIGH/MEDIUM/LOW)
- [ ] Target location specified
- [ ] Classification logic applied (LOCAL/SYSTEMATIC)

### **Post-Generation Validation**
- [ ] LOCAL content generated before record creation
- [ ] All approved records created in planning system
- [ ] Dashboard handoff instructions provided
- [ ] User clear on next steps

---

## **Agent Invocation Quick Reference**

### **Primary Agents by Pathway**
- **Monthly Content Calendar**: Content Marketing Strategist + Monthly Content Planner
- **Seasonal Campaign**: Content Marketing Strategist + Market Research Specialist
- **New Service Launch**: Brand Strategy Consultant + Content Marketing Strategist
- **Seasonal Prevention**: Market Research Specialist + Content Marketing Strategist
- **Market Opportunity**: Marketing Analytics Specialist + Market Research Specialist
- **Performance Review**: Marketing Analytics Specialist + SEO Optimization Specialist
- **Competitive Response**: Competitive Intelligence Analyst + Brand Strategy Consultant
- **Keyword Strategy**: SEO Optimization Specialist + Market Research Specialist
- **Location Expansion**: Content Marketing Strategist + Market Research Specialist
- **Social Media Blitz**: Social Media Strategist + Creative Director

### **Flex Agent Pool**
Available for dynamic assignment based on specific request needs:
- Lead Writer (specialized writing and content creation)
- Creative Director (formatting/visual)

---

## **Implementation Success Metrics**

### **Session-Level Metrics**
- Strategic pathway selection within first 3 exchanges
- User approval of recommendations within 5 exchanges
- Content record creation completed within session
- Clear dashboard handoff provided

### **Content Quality Metrics**
- All records include required fields (keywords, descriptions, priorities)
- LOCAL content generated before record creation
- Brand guidelines compliance maintained
- User satisfaction with strategic consultation process

---

This implementation guide ensures consistent execution of the orchestration layer across all Claude Code sessions, providing predictable outcomes while maintaining strategic flexibility for custom requests.