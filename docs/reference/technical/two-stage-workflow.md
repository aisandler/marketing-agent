# Enhanced Two-Stage Content Workflow Guide

## Overview

The {{COMPANY_NAME}} content system now features an **Enhanced Two-Stage Workflow** that provides complete user control over content generation while ensuring full text content flows through to the dashboard and Airtable.

## Key Benefits

✅ **True Staging Control**: Generate only approved content  
✅ **Rich Dashboard Previews**: See actual content before committing  
✅ **Complete Text Flow**: LOCAL content flows to Airtable Text field  
✅ **Resource Efficiency**: No wasted generation on rejected ideas  
✅ **Unified Content Management**: Both LOCAL and SYSTEMATIC in one flow  

## The Two-Stage Process

### Stage 1: Pre-Dashboard Planning & Approval

**Command**: `./automation/claude_gui_sync.sh plan-and-review`

**What it shows**:
```
📋 CONTENT GENERATION PLAN
==========================

✅ SYSTEMATIC (Ready for dashboard):
1. "Fall Seasonal Service Guide" - Blog Post - HIGH

⚡ LOCAL GENERATION RECOMMENDED:
1. "Winter Maintenance Alert" - Social Media - MEDIUM
   Est: 50-150 words
2. "Emergency Service Protocol" - Email - HIGH
   Est: 200-400 words

📊 SUMMARY:
Total Records: 3
Ready for Dashboard: 1
Pending Approval: 2
Estimated Generation Time: 2-3 minutes
```

### Stage 2: Approved Content Generation

**Command**: `./automation/claude_gui_sync.sh generate-approved '["id1","id2"]'`

**What it does**:
- ✅ Generates MD files for approved LOCAL content only
- ✅ Reads text content into sync bridge memory  
- ✅ Creates content previews (first 200 chars)
- ✅ Calculates accurate word counts
- ✅ Updates generation status to 'generated'

## Complete Workflow Commands

### Option A: Interactive Workflow (Recommended)
```bash
# Complete two-stage workflow with user approval
./automation/claude_gui_sync.sh plan-and-generate

# Shows plan → prompts approval → generates → ready for dashboard
```

### Option B: Manual Control
```bash
# Stage 1: Review the plan
./automation/claude_gui_sync.sh plan-and-review

# Stage 2: Generate specific approved pieces  
./automation/claude_gui_sync.sh generate-approved '["temp_123","temp_124"]'
```

## Enhanced Data Structure

Each content record now includes:

```javascript
{
  // Existing fields
  id: "temp_123",
  description: "Winter Maintenance Alert",
  contentType: "Social Media",
  generationType: "LOCAL",
  
  // NEW: Enhanced workflow fields
  generationStatus: "generated", // pending | generated | failed
  textContent: "Full markdown content...",
  contentPreview: "Winter maintenance helps protect your home when...", 
  wordCount: 147,
  localFilePath: "/path/to/content.md"
}
```

## Dashboard Integration

Dashboard cards now display:

**For LOCAL Generated Content**:
- ✅ Full content preview (expandable)
- ✅ Accurate word count
- ✅ Generation status badge
- ✅ Rich text content for Airtable commit

**For SYSTEMATIC Content**:
- 📋 Metadata preview
- 🚀 "N8N Workflow" indicator  
- ✅ Standard Airtable record creation

## Text Content Flow to Airtable

When committing to Airtable:

1. **SYSTEMATIC Records**: Metadata only (N8N handles content creation)
2. **LOCAL Records**: Full `textContent` flows to Airtable `Text` field
3. **Auto-initialization**: Uses `AUTO_INITIALIZE_TRIGGER` for N8N processing

## Usage Examples

### Example 1: Mixed Content Planning
```bash
# Claude Code planning creates:
# - 1 SYSTEMATIC Blog Post (needs images, complex formatting)
# - 2 LOCAL pieces (quick social media, email)

./automation/claude_gui_sync.sh plan-and-generate
# User sees plan, approves LOCAL generation
# Result: All 3 ready for dashboard with appropriate content
```

### Example 2: All LOCAL Content  
```bash
# Claude Code plans 3 LOCAL pieces
./automation/claude_gui_sync.sh plan-and-review
# Shows all 3 pending approval

./automation/claude_gui_sync.sh generate-approved '["id1","id2"]'  
# Generates 2 of 3 pieces, leaves 1 pending
```

### Example 3: No Generation Needed
```bash  
./automation/claude_gui_sync.sh plan-and-generate
# If only SYSTEMATIC content planned:
# "✅ All content ready for dashboard! No generation needed."
```

## Integration with Existing Systems

- ✅ **Compatible** with existing `streamlined-submit` workflow
- ✅ **Works with** current dashboard UI (enhanced with previews)
- ✅ **Maintains** all existing Content ID integration
- ✅ **Preserves** Airtable webhook and N8N automation

## File Locations

**Generated Content**: `/content/local-generation/`  
**State Management**: `/tmp/client_planning_state.json`  
**Bridge Logic**: `/automation/sync_bridge.js`  
**Commands**: `/automation/claude_gui_sync.sh`  

## Commands Reference

| Command | Purpose | Stage |
|---------|---------|-------|
| `plan-and-review` | Show generation plan | Stage 1 |
| `generate-approved '[ids]'` | Generate specific content | Stage 2 |  
| `plan-and-generate` | Complete interactive workflow | Both |
| `summary` | Current session status | Info |
| `streamlined-submit` | Commit to Airtable | Final |

## Success Metrics

✅ **Content Generation Control**: Only approved content gets generated  
✅ **Rich Dashboard Previews**: Full text content visible before commit  
✅ **Airtable Text Flow**: LOCAL content populates Text field correctly  
✅ **Resource Efficiency**: 0% wasted generation on rejected content  
✅ **User Experience**: Clear two-stage approval process  

---

*Generated via Enhanced Two-Stage Workflow - September 2025*