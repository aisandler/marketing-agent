# Claude Code Preview System for {{COMPANY_NAME}} Content

**Purpose**: Review content entries in formatted table before Airtable submission  
**Created**: August 19, 2025  
**Workflow**: Strategy → Preview Table → Confirm → Submit  

---

## 🎯 **PREVIEW WORKFLOW**

### Your New Process:
1. **Strategy & Planning**: Discuss content needs with Claude Code
2. **Generate Preview**: Claude Code creates formatted table showing all entries
3. **Review & Confirm**: You review the table and approve submission
4. **Execute**: Records submitted to Airtable only after your confirmation

---

## 📊 **PREVIEW TABLE FORMAT**

### Summary Table View:
```
📋 CONTENT PREVIEW - Ready for Airtable Submission
==================================================
ID   | Description                         | Content Type | Priority | Target Location | Pest Type
------+-------------------------------------+--------------+----------+-----------------+------------
1    | October Rodent Proofing Dixon IL    | Blog Post    | HIGH     | Dixon IL        | Rodents
2    | Winter Spider Control Sycamore      | Blog Post    | HIGH     | Sycamore IL     | Spiders  
3    | Fall Pest Prevention Tips          | Social Media | MEDIUM   | Multi-State     | General
4    | November Ant Alert                 | Social Media | MEDIUM   | Multi-State     | Ants
5    | DeKalb Termite Treatment Guide     | Blog Post    | HIGH     | DeKalb IL       | Termites

📝 DETAILED VIEW (First 3 Records):
===================================

Record #1:
  Description: October Rodent Proofing Dixon IL
  Content Type: Blog Post
  Priority: HIGH
  Target Location: Dixon IL
  Pest Type: Rodents
  Content Format: WordPress Blog
  Primary Keyword: rodent proofing Dixon IL
  Search Volume: 380
  Keyword Difficulty: Medium
  Seasonal Relevance: Fall
  Notes: Office location priority

Record #2:
  Description: Winter Spider Control Sycamore IL
  Content Type: Blog Post
  Priority: HIGH
  Target Location: Sycamore IL
  Pest Type: Spiders
  Content Format: WordPress Blog
  Primary Keyword: winter spider control Sycamore
  Search Volume: 220
  Keyword Difficulty: Low
  Seasonal Relevance: Winter
  Notes: Indoor migration focus

Record #3:
  Description: Fall Pest Prevention Tips
  Content Type: Social Media
  Priority: MEDIUM
  Target Location: Multi-State
  Pest Type: General
  Content Format: Facebook Post
  Primary Keyword: fall pest prevention
  Search Volume: 650
  Keyword Difficulty: Low
  Seasonal Relevance: Fall
  Notes: Location-agnostic per {{CLIENT_CONTACT}} rules

📊 Total Records Ready: 5

🤔 Submit all 5 records to Airtable? (y/n):
```

---

## 💻 **CLAUDE CODE IMPLEMENTATION**

### How Claude Code Will Use This:

#### Step 1: Build Preview During Planning
```bash
# Claude Code builds preview as we discuss strategy
source /Users/adamsandler/projects/marketing-team-base/automation/preview_and_submit.sh

# Add each planned content piece to preview
add_to_preview "October Rodent Proofing Dixon IL" "Blog Post" "HIGH" "Dixon IL" "Rodents" "WordPress Blog" "Fall" "rodent proofing Dixon IL" 380 "Medium" "Office location priority"

add_to_preview "Winter Spider Control Sycamore" "Blog Post" "HIGH" "Sycamore IL" "Spiders" "WordPress Blog" "Winter" "winter spider control Sycamore" 220 "Low" "Indoor migration focus"

add_to_preview "Fall Pest Prevention Tips" "Social Media" "MEDIUM" "Multi-State" "General" "Facebook Post" "Fall" "fall pest prevention" 650 "Low" "Location-agnostic per {{CLIENT_CONTACT}} rules"
```

#### Step 2: Show Complete Preview
```bash
# Display formatted table for your review
show_preview_table
```

#### Step 3: Execute After Confirmation
```bash
# Only submit if you approve
if [ "$USER_CONFIRMS" = "yes" ]; then
    submit_to_airtable
else
    cancel_submission
fi
```

---

## 🔄 **EXAMPLE PLANNING SESSION**

### Conversation Flow:

**You**: "I need 8 pieces of content for November - mix of blog posts and social media focusing on winter pest preparation"

**Claude Code**: 
"Let me plan November winter preparation content. I'll focus on seasonal pest migration, home preparation, and family safety messaging.

Building content preview...

*[Adds each piece to preview table]*

Here's what I've planned:"

```
📋 CONTENT PREVIEW - Ready for Airtable Submission
==================================================
ID   | Description                         | Content Type | Priority | Target Location | Pest Type
------+-------------------------------------+--------------+----------+-----------------+------------
1    | November Rodent Home Prep Dixon     | Blog Post    | HIGH     | Dixon IL        | Rodents
2    | Winter Spider Prevention Sycamore   | Blog Post    | HIGH     | Sycamore IL     | Spiders
3    | Cold Weather Pest Proofing Rockford | Blog Post    | HIGH     | Rockford IL     | General
4    | Winter Pest Alert Social           | Social Media | MEDIUM   | Multi-State     | General
5    | Rodent Season Preparation Social    | Social Media | MEDIUM   | Multi-State     | Rodents
6    | Home Winterization Pest Tips       | Social Media | MEDIUM   | Multi-State     | General
7    | Family Safe Winter Treatment       | Social Media | HIGH     | Multi-State     | General
8    | Professional Winter Service Alert  | Social Media | MEDIUM   | Multi-State     | General

📝 DETAILED VIEW (First 3 Records):
===================================

Record #1:
  Description: November Rodent Home Prep Dixon IL
  Content Type: Blog Post
  Priority: HIGH
  Target Location: Dixon IL
  Pest Type: Rodents
  Content Format: WordPress Blog
  Primary Keyword: november rodent prevention Dixon IL
  Search Volume: 290
  Keyword Difficulty: Low
  Seasonal Relevance: Fall
  Notes: Office location - seasonal preparation timing

[Additional detailed records...]

📊 Total Records Ready: 8

🤔 Submit all 8 records to Airtable? (y/n):
```

**You**: "Yes, looks great!"

**Claude Code**: 
```
🚀 Submitting to Airtable...

Submitting Record #1...
✅ Submitted: November Rodent Home Prep Dixon IL

Submitting Record #2...
✅ Submitted: Winter Spider Prevention Sycamore

[...]

🎉 All 8 records submitted successfully!
Content IDs assigned: C145-C152
Ready for N8N content generation workflows.
```

---

## 🛠️ **ADVANCED PREVIEW FEATURES**

### Edit Before Submit:
```bash
# You can request changes before submission
# "Change record #3 priority to HIGH"
# "Update record #5 target location to Illinois only" 
# "Add note to record #2 about seasonal timing"
```

### Batch Operations:
```bash
# Preview multiple content types together
# "Show me blog posts and social media in separate sections"
# "Group by priority level"
# "Sort by target location"
```

### Export Options:
```bash
# Save preview for later review
save_preview_csv november_content_preview.csv
save_preview_markdown november_content_plan.md
```

---

## 📋 **PREVIEW TABLE CUSTOMIZATION**

### Quick View (Default):
- Essential fields only
- Truncated descriptions
- Summary statistics

### Detailed View:
- All field values
- Complete descriptions  
- SEO data included
- Notes and context

### Custom Columns:
```bash
# Configure which columns to show
set_preview_columns "Description,Priority,Target Location,Pest Type,Search Volume"

# Group by specific fields
group_preview_by "Content Type"
group_preview_by "Priority"
group_preview_by "Target Location"
```

---

## ✅ **BENEFITS OF PREVIEW SYSTEM**

### For Planning Quality:
- **Visual Validation**: See all content in organized table format
- **Gap Identification**: Spot missing priorities or locations easily
- **Balance Check**: Ensure proper content mix and distribution
- **Error Prevention**: Catch mistakes before Airtable submission

### For Workflow Control:
- **Approval Gate**: Nothing submitted without your explicit confirmation
- **Modification Opportunity**: Request changes before execution
- **Documentation**: Preview serves as planning record
- **Confidence**: Know exactly what will be created

### For Efficiency:
- **Batch Review**: See entire planning session at once
- **Quick Decisions**: Clear formatting enables fast approval
- **Context Preservation**: Detailed view maintains all planning context
- **Seamless Execution**: One confirmation submits everything

---

## 🎯 **USAGE PATTERNS**

### Daily Planning:
```
You: "3 social media posts for this week"
Claude: [Shows 3-row preview table]
You: "Approved"
Claude: [Submits to Airtable]
```

### Weekly Strategy:
```
You: "Plan next week's content - 5 blog posts, 10 social"
Claude: [Shows 15-row preview with detailed breakdown]
You: "Change blog #3 to Illinois focus, then submit"
Claude: [Updates preview, resubmits for approval]
You: "Perfect, submit all"
Claude: [Executes 15 submissions]
```

### Monthly Campaigns:
```
You: "December holiday pest prevention campaign"
Claude: [Shows large campaign preview with grouping]
You: "Looks comprehensive, submit everything"
Claude: [Batch submits entire campaign]
```

---

**Ready to Use**: The preview system is configured and ready. Your next planning conversation will automatically show formatted tables before any Airtable submissions.

**Test It**: Try saying "I need 2 blog posts about winter rodent control" and see the preview system in action!