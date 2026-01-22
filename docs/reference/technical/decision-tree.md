# {{COMPANY_NAME}} Content Generation Decision Tree Logic

## Overview

This document provides the comprehensive decision tree logic for classifying content as LOCAL (immediate generation) or SYSTEMATIC (Airtable workflow processing). This classification system ensures consistent, predictable content routing for optimal workflow efficiency.

---

## **PRIMARY DECISION TREE**

### **🔄 DECISION FLOW DIAGRAM**

```
Content Request
       ↓
   [CONTENT TYPE CHECK]
       ↓
┌─────────────────────────────┐
│    Blog Post / Location     │ → [COMPLEXITY CHECK] → [REVIEW CHECK] → [TIMELINE CHECK]
│         Social Media        │ → [ALWAYS LOCAL]
└─────────────────────────────┘
       ↓
   [FINAL CLASSIFICATION]
       ↓
┌─────────────────┬───────────────────┐
│     LOCAL       │    SYSTEMATIC     │
│  (Generate Now) │ (Airtable Queue)  │
└─────────────────┴───────────────────┘
```

---

## **CLASSIFICATION CRITERIA**

### **🚀 LOCAL Generation (Immediate Processing)**

**AUTOMATIC LOCAL TRIGGERS:**
1. **Long-form Blog Posts** (>1000 words, research-intensive content)
2. **Comprehensive Guides** (educational, evergreen content)
3. **Location Page Content** (detailed service descriptions)
4. **Text-Heavy Content** (articles, detailed explanations)
5. **Urgent Text-Only Updates** (emergency communications, quick announcements)

**LOCAL DECISION FACTORS:**
```
IF Content Type = "Blog Post" AND Word Count > 1000
   → CLASSIFICATION = LOCAL

ELSE IF Content Type = "Location Page" AND Complexity = "Standard"
   → CLASSIFICATION = LOCAL

ELSE IF Timeline = "Emergency" AND Format = "Text Only"
   → CLASSIFICATION = LOCAL

ELSE IF Content Format = "Long Form Article" OR "Educational Guide"
   → CLASSIFICATION = LOCAL

ELSE
   → Continue to SYSTEMATIC evaluation
```

### **📋 SYSTEMATIC Generation (Airtable Workflow)**

**AUTOMATIC SYSTEMATIC TRIGGERS:**
1. **All Social Media Posts** (platform-specific formatting, image generation, style workflows)
2. **Visual Content Requirements** (posts needing images, graphics, custom formatting)
3. **Platform-Specific Content** (Facebook, Instagram, LinkedIn, Twitter optimization)
4. **Campaign Content** (coordinated multi-platform releases)
5. **Marketing Materials** (branded content with specific style requirements)

**SYSTEMATIC DECISION FACTORS:**
```
IF Content Type = "Social Media Post"
   → CLASSIFICATION = SYSTEMATIC

ELSE IF Visual Elements = "Required" (Images, Graphics, Custom Format)
   → CLASSIFICATION = SYSTEMATIC

ELSE IF Platform Optimization = "Specific" (Facebook, Instagram, LinkedIn, etc.)
   → CLASSIFICATION = SYSTEMATIC

ELSE IF Campaign Coordination = TRUE
   → CLASSIFICATION = SYSTEMATIC

ELSE IF Brand Workflow = "Custom Style Requirements"
   → CLASSIFICATION = SYSTEMATIC
```

---

## **DETAILED CLASSIFICATION MATRIX**

### **Content Type Classification Table**

| Content Type | Default Classification | Override Conditions | Final Decision |
|---|---|---|---|
| **Social Media Posts** | 📋 SYSTEMATIC | Emergency text-only | **SYSTEMATIC** |
| **Blog Posts (>1000 words)** | ✅ LOCAL | Visual-heavy or campaign | Context-dependent |
| **Blog Posts (<1000 words)** | 📋 SYSTEMATIC | Long-form text focus | Context-dependent |
| **Location Pages (Standard)** | ✅ LOCAL | Visual/campaign requirements | Context-dependent |
| **Location Pages (Complex)** | 📋 SYSTEMATIC | Text-heavy descriptions | Context-dependent |
| **Visual Content** | 📋 SYSTEMATIC | Text-only emergency | **SYSTEMATIC** |
| **Campaign Content** | 📋 SYSTEMATIC | Individual long-form | Context-dependent |
| **Platform-Specific Content** | 📋 SYSTEMATIC | None (always SYSTEMATIC) | **SYSTEMATIC** |

### **Complexity Assessment Criteria**

**LOW COMPLEXITY (→ LOCAL):**
- Long-form text content (blog posts, articles)
- Single-platform focus
- Research-based content (>1000 words)
- Educational/informational content
- Text-heavy location descriptions

**MEDIUM COMPLEXITY (→ Context-Dependent):**
- Mixed content requirements (text + visual elements)
- Platform-specific but simple formatting
- Moderate visual requirements
- Campaign coordination needed
- Cross-platform considerations

**HIGH COMPLEXITY (→ SYSTEMATIC):**
- Multi-platform social media campaigns
- Custom visual/graphic requirements
- Platform-specific optimization (Facebook, Instagram, LinkedIn)
- Brand workflow integration
- Image generation and styling needed

---

## **DECISION TREE IMPLEMENTATION LOGIC**

### **Step 1: Primary Content Type Filter**
```python
def classify_content_type(content_type):
    if content_type == "Social Media Post":
        return "LOCAL"
    elif content_type in ["Blog Post", "Location Page"]:
        return "EVALUATE_FURTHER"
    elif content_type in ["Service Page", "Press Release"]:
        return "SYSTEMATIC"
    else:
        return "EVALUATE_FURTHER"
```

### **Step 2: Complexity and Timeline Assessment**
```python
def evaluate_complexity_timeline(word_count, timeline, stakeholders, research_hours):
    # Timeline urgency check
    if timeline in ["Urgent", "Same Day", "Next 24 hours"]:
        return "LOCAL"
    
    # High complexity indicators
    if stakeholders > 1 or research_hours > 3:
        return "SYSTEMATIC"
    
    # Word count and complexity combination
    if word_count <= 1500 and research_hours <= 1:
        return "LOCAL"
    elif word_count > 2000:
        return "SYSTEMATIC"
    
    # Default to LOCAL for faster execution
    return "LOCAL"
```

### **Step 3: Final Classification Logic**
```python
def final_classification(primary_result, secondary_result, override_factors):
    # Check for absolute overrides
    if "LEGAL_REVIEW" in override_factors:
        return "SYSTEMATIC"
    if "URGENT" in override_factors:
        return "LOCAL"
    
    # Combine primary and secondary results
    if primary_result == "LOCAL" and secondary_result == "LOCAL":
        return "LOCAL"
    elif primary_result == "SYSTEMATIC" or secondary_result == "SYSTEMATIC":
        return "SYSTEMATIC"
    
    # Default to LOCAL for speed
    return "LOCAL"
```

---

## **PRACTICAL APPLICATION EXAMPLES**

### **LOCAL Classification Examples**

**✅ Comprehensive Blog Post - "Complete Guide to Spring Pest Prevention"**
- Content Type: Blog Post
- Word Count: ~1500 words
- Format: Long-form educational content
- Visual Requirements: Minimal (text-focused)
- **CLASSIFICATION: LOCAL**

**✅ Location Page - Detailed Service Description**
- Content Type: Location Page
- Content: Text-heavy service descriptions
- Complexity: Standard template with extensive content
- Visual Requirements: Standard layout
- **CLASSIFICATION: LOCAL**

**✅ Educational Guide - "Seasonal Pest Patterns in Illinois"**
- Content Type: Blog Post
- Word Count: ~2000 words
- Format: Research-intensive, informational
- Focus: Long-form text content
- **CLASSIFICATION: LOCAL**

### **SYSTEMATIC Classification Examples**

**📋 Instagram Post - Spring Termite Prevention**
- Content Type: Social Media Post → Automatic SYSTEMATIC
- Platform: Instagram (requires optimized formatting + images)
- Visual Requirements: Custom graphics, branded styling
- **CLASSIFICATION: SYSTEMATIC**

**📋 Facebook Campaign - Seasonal Pest Prevention**
- Content Type: Social Media Campaign
- Platform: Facebook (specific format requirements)
- Visual Elements: Branded images, call-to-action buttons
- Coordination: Multi-post series with timing
- **CLASSIFICATION: SYSTEMATIC**

**📋 LinkedIn Business Post - Commercial Pest Services**
- Content Type: Social Media Post
- Platform: LinkedIn (professional formatting)
- Visual Requirements: Professional imagery, company branding
- Style: Platform-specific tone and formatting
- **CLASSIFICATION: SYSTEMATIC**

### **Context-Dependent Examples**

**🔄 Seasonal Blog Post - "Preparing for Spring Pests"**
```
EVALUATION:
- Content Type: Blog Post → Continue evaluation
- Word Count: 1200 words → Lean LOCAL
- Timeline: Time-sensitive (spring approach) → LOCAL
- Complexity: Medium (seasonal research) → Neutral
- Stakeholders: Content team only → LOCAL

FINAL CLASSIFICATION: LOCAL
```

**🔄 Service Area Expansion Content**
```
EVALUATION:
- Content Type: Location Pages → Continue evaluation  
- Quantity: 5 new locations → Systematic lean
- Complexity: Custom market research needed → SYSTEMATIC
- Timeline: Strategic rollout → SYSTEMATIC
- Dependencies: Coordinated launch → SYSTEMATIC

FINAL CLASSIFICATION: SYSTEMATIC
```

---

## **EDGE CASE HANDLING**

### **Ambiguous Scenarios**

**When Classification is Unclear:**
1. **Default to LOCAL** for faster execution
2. **Document reasoning** in content record notes
3. **Allow post-classification adjustment** if needed
4. **Escalate to user decision** for critical content

**Override Mechanisms:**
- **User Explicit Request**: "Generate this via SYSTEMATIC workflow"
- **Strategic Importance**: High-value content defaults to SYSTEMATIC
- **Brand Risk Assessment**: Risk-sensitive content → SYSTEMATIC
- **Resource Availability**: Team capacity impacts classification

### **Quality Control Checkpoints**

**Pre-Generation Validation:**
- [ ] Classification logic applied consistently
- [ ] Override factors considered
- [ ] Timeline constraints evaluated
- [ ] Resource requirements assessed

**Post-Classification Review:**
- [ ] Classification rationale documented
- [ ] Expected workflow path confirmed
- [ ] Quality standards maintained regardless of path
- [ ] User expectations aligned

---

## **IMPLEMENTATION INTEGRATION**

### **Claude Code Session Integration**

**When to Apply Decision Tree:**
1. **During Content Recommendations Phase** - Before presenting options to user
2. **In Strategic Consultation** - When discussing content approach
3. **Pre-Record Creation** - Final classification before generation
4. **User Approval Process** - Explain classification reasoning

**Decision Tree Invocation Pattern:**
```markdown
## Content Classification Analysis

**Content Details:**
- Type: [Blog Post/Social Media/Location Page]
- Estimated Word Count: [Number] words
- Timeline: [Urgent/Standard/Strategic]
- Complexity: [Low/Medium/High]
- Research Required: [Hours estimate]
- Stakeholders: [Number and roles]

**Decision Tree Application:**
1. Primary Filter: [Result and reasoning]
2. Complexity Assessment: [Result and reasoning] 
3. Timeline Evaluation: [Result and reasoning]
4. Override Factors: [Any applicable overrides]

**FINAL CLASSIFICATION: LOCAL/SYSTEMATIC**
**Reasoning: [Clear explanation of decision factors]**
```

### **Dashboard Integration**

**Visual Classification Indicators:**
- **🚀 LOCAL**: Green indicator, "Generate Now" button
- **📋 SYSTEMATIC**: Blue indicator, "Queue for Workflow" button
- **🔄 Context-Dependent**: Yellow indicator, "Review Classification"

**Classification Change Process:**
1. Display current classification with reasoning
2. Allow user to request reclassification
3. Apply override logic if user provides justification
4. Update record with new classification and reasoning

---

## **SUCCESS METRICS**

### **Classification Accuracy Targets**
- **90%+ Correct Classifications** on first attempt
- **<5% User Overrides** for standard content types
- **100% Consistency** for absolute classification rules (Social Media → LOCAL)

### **Efficiency Improvements**
- **Reduced Decision Time** from manual evaluation
- **Consistent User Experience** across sessions
- **Predictable Content Delivery** timelines
- **Optimal Resource Allocation** between LOCAL and SYSTEMATIC workflows

---

## **TROUBLESHOOTING GUIDE**

### **Common Classification Issues**

**Issue**: User disagrees with LOCAL classification for complex blog post
**Solution**: Apply complexity override, reclassify as SYSTEMATIC, document reasoning

**Issue**: Time-sensitive content classified as SYSTEMATIC
**Solution**: Apply timeline override, force LOCAL classification, note expedited processing

**Issue**: Simple social media post taking SYSTEMATIC route
**Solution**: System error - social media is always LOCAL, investigate classification logic

**Issue**: Unclear complexity assessment
**Solution**: Default to LOCAL, proceed with generation, allow post-generation feedback

### **Decision Tree Updates**

**When to Modify Classification Logic:**
- User feedback indicates systematic misclassification
- New content types introduced
- Workflow process changes
- Resource capacity changes

**Update Process:**
1. Document current classification issues
2. Propose logic modifications
3. Test with historical content examples
4. Update documentation and implementation
5. Monitor for improved accuracy

---

This decision tree logic ensures predictable, efficient content classification while maintaining flexibility for edge cases and user preferences. The system prioritizes speed (LOCAL default) while ensuring complex content receives appropriate workflow treatment (SYSTEMATIC when needed).