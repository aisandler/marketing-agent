# Marketing Resources - Airtable Schema Template

> **TEMPLATE** - Configure your Airtable structure during `/onboard`.

**Base ID:** `[Configure in /onboard]`

---

## Tables Overview

Configure these tables for your marketing system:

| Table | Purpose | Notes |
|-------|---------|-------|
| **Content Calendar** | Main posting table | Scheduled content |
| **Content Archive** | Historical posts | Archived content |
| **Deals/Projects** | Source material | Deal-based content |

---

## Content Calendar - Field Schema

### Core Identification

| Field | Type | Purpose |
|-------|------|---------|
| **Date** | Date | Scheduled publish date |
| **Post Topic** | Single Line Text | Content headline/topic |

### Posting Assignment

| Field | Type | Options | Purpose |
|-------|------|---------|---------|
| **Posting Account** | Single Select | (Your accounts) | Which account publishes this |
| **Platform** | Single Select | LinkedIn, Instagram, Facebook, TikTok, X | Target platform |
| **Posting Time** | Single Select | Morning, Midday, Afternoon, Evening | Daily queue order |
| **Queue Position** | Number | 1, 2, 3... | Order within same day |

### Content Tracking

| Field | Type | Options |
|-------|------|---------|
| **Post Type** | Single Select | Original, Repost, Link Share |
| **Source Post** | Link to Record | Links to original (for reposts) |
| **Content Pillar** | Single Select | (Your pillars) |
| **Focus** | Single Select | (Your focus areas) |

### Copy & Assets

| Field | Type | Purpose |
|-------|------|---------|
| **Copy** | Long Text | Post text content |
| **Copy With Disclaimer** | Formula | Auto-appends disclaimer if needed |
| **Image Brief** | Long Text | Instructions for image generation |
| **Video Script** | Long Text | Script for video content |
| **Image** | Attachment | Visual asset |
| **Video** | Attachment | Video asset |
| **Needs Asset** | Checkbox | Flag posts needing visual assets |

### Status Tracking

| Field | Type | Options |
|-------|------|---------|
| **Copy Status** | Single Select | Draft, Ready for Review, Approved, Needs Revision |
| **Asset Status** | Single Select | Draft, Ready for Review, Approved, Needs Revision |
| **Post Status** | Single Select | Drafting, Ready for Review, Approved, Scheduled, Posted, Needs Revision |
| **Post URL** | URL | Link to live post after publishing |
| **Posted Date** | Date | Actual publish date |

### Notes

| Field | Type | Purpose |
|-------|------|---------|
| **Competitive Insight** | Long Text | Win theme or market opportunity addressed |
| **Notes** | Long Text | Internal notes |

---

## Content Archive - Field Schema

Historical posts moved from Content Calendar.

| Field | Type | Purpose |
|-------|------|---------|
| **Date** | Date | Original publish date |
| **Post Topic** | Single Line Text | Content headline/topic |
| **Posting Account** | Single Select | Which account posted |
| **Platform** | Single Select | Target platform |
| **Post Type** | Single Select | Original, Repost, Link Share |
| **Content Pillar** | Single Select | Content category |
| **Focus** | Single Select | Focus area |
| **Copy** | Long Text | Post text content |
| **Post Status** | Single Select | Status |
| **Post URL** | URL | Link to live post |
| **Notes** | Long Text | Internal notes |
| **Original Record ID** | Single Line Text | Reference to original record ID |

---

## Posting Account Options

Configure during `/onboard`:

| Account | Profile | Notes |
|---------|---------|-------|
| Company | Firm account | Posts firm content + native reposts |
| Partner 1 | Individual account | Expertise focus |
| Partner 2 | Individual account | Expertise focus |

---

## Workflow States

### Content Creation Flow

```
Drafting → Ready for Review → Approved → Scheduled → Posted
                    ↓
              Needs Revision → Drafting
```

### Repost Flow

1. Partner posts original content
2. System creates repost record (Post Type = "Repost", Source Post = original)
3. Company account uses platform native share feature
4. Mark repost as Posted

---

## API Integration

### Environment Variables

```bash
AIRTABLE_BASE_ID=[your-base-id]
AIRTABLE_API_KEY=pat...
```

### Table IDs

Configure these values from your Airtable base:

| Table | ID |
|-------|-----|
| Content Calendar | tbl... |
| Content Archive | tbl... |

---

*Configure this schema for your specific Airtable structure during `/onboard`.*
