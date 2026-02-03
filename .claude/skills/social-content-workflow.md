# Social Content Workflow

Unified workflow for creating brand-aligned social media content.

> **Canonical rules reference:** `docs/reference/social-content-rules.md`

## Overview

This skill ensures all social content:
- Reflects your brand architecture and positioning
- Uses correct partner/team voice profiles
- Passes content quality filters
- Follows the content bank → publishing pipeline
- Maintains consistent quality across all accounts

## Quick Reference

### Posting Accounts & Voice

Configure your posting accounts in `/onboard`. Example structure:

| Account | Voice | Focus | Cadence |
|---------|-------|-------|---------|
| **Partner LinkedIn** | Clear, direct, mentor-like | Industry expertise | 2-3x/week |
| **Founder LinkedIn** | Warm, accessible | Company culture, insights | Daily |
| **Company LinkedIn** | Professional, team-focused | Announcements, positioning | Daily |
| **Company Instagram** | Shorter, visual-first | Tips, culture | Daily |

### Content Pillars

Define your content pillars during `/onboard`:

| Pillar | Description | Use For |
|--------|-------------|---------|
| **Thought Leadership** | Expert insights, industry trends | Partner accounts |
| **Customer Success** | Case studies, testimonials | Company accounts |
| **Culture & Values** | Team stories, behind-the-scenes | All accounts |
| **Educational** | How-to content, tips | All accounts |

---

## Workflow: Content Bank → Publishing

```
1. CHECK CONTENT BANK     content/social/content-bank.md
   └── Find AVAILABLE theme or create new topic

2. APPLY VOICE PROFILE    Based on Posting Account
   └── Partner voices: expansions/partner-voice-template/ (customize)
   └── Company voice: client-context/brand/voice-and-tone-guide.md

3. APPLY QUALITY FILTER
   └── Test: "Would our target audience find this valuable?"

4. IDENTIFY COMPETITIVE ANGLE
   └── docs/reference/competitive-win-themes.md
   └── Which competitive advantage does this content highlight?

5. GENERATE COPY          Using appropriate template
   └── LinkedIn: 150-300 words, short paragraphs, hook in first 2 lines
   └── Instagram: Shorter, visual-friendly, flag "Needs Asset"

6. PUSH TO AIRTABLE       (Configure during /onboard)
   └── Set: Date, Post Topic, Posting Account, Platform, Copy
   └── Set: Copy Status = "Approved", Post Status = "Scheduled"
   └── Set: Content Pillar, Focus, Post Type

7. UPDATE CONTENT BANK    Mark theme as PUBLISHED with record ID
```

---

## Competitive Win Themes

Every post should tie to a competitive advantage. Configure these during `/onboard`.

### Example Win Themes

| Theme | Against | Use When Content Shows |
|-------|---------|------------------------|
| **Service Excellence** | Large competitors | Personalized attention + capability |
| **Industry Expertise** | Generalist competitors | Deep domain knowledge |
| **Responsive Partnership** | Slow-moving competitors | Direct access, quick turnaround |
| **Integrated Approach** | Siloed competitors | End-to-end solutions |
| **Modern Capabilities** | Traditional competitors | Digital presence, innovation |

### Competitive Insight Field Format

```
WIN THEME [#]: [Theme Name]
"[Key quote or concept from content]"

[Why this matters competitively - 1-2 sentences]
```

**Full reference:** `docs/reference/competitive-win-themes.md`

---

## Voice Profiles

### Partner/Expert Voice (Template)

**Characteristics:**
- Clear - no jargon
- Direct and honest
- Mentor mindset - coaches and teaches
- Accessible

**Signature Phrases:**
- Define 3-5 signature phrases during onboarding

**Topics:**
- Core expertise areas
- Industry insights
- Common questions/misconceptions

**See:** `expansions/partner-voice-template/` for full template

---

### Company Voice

**Characteristics:**
- Professional, authoritative, team-focused
- Celebrates achievements and team collaboration
- Amplifies partner content

**Use For:**
- Announcements
- Company positioning statements
- Native reposts of partner content (24-48 hours later)
- Educational content about your approach

---

## Repost Workflow

Amplify partner content through LinkedIn's native repost feature. This extends reach without creating duplicate copy.

### When to Create a Repost
- 24-48 hours after a partner's original post
- For partner originals worth amplifying
- Not for every post—select high-value content

### Repost Record Setup

```
Post Type:      Repost
Copy Status:    Repost
Copy:           (leave empty)
Source Post:    Link to original record
Post Topic:     Same as original
Posting Account: Company LinkedIn
Date:           24-48 hours after original
```

### What NOT to Do
- Don't duplicate the copy text
- Don't write "NATIVE SHARE" or similar in Copy field
- Don't set Copy Status to "Draft" or "Approved"

---

## Content Quality Filter

Before publishing content, apply this test:

> "Would our target audience find this valuable, or would they think 'who doesn't know this?'"

### FAILS the filter (don't post):
- Basic explanations your audience already knows
- Generic advice without specifics
- Content that doesn't match the account voice

### PASSES the filter (post it):
- Specific insights your audience can use
- Unique perspectives or experiences
- Content that positions you as an authority

---

## Content Structure by Platform

### LinkedIn Post Structure

```
[HOOK - 1-2 lines that stop the scroll]

[INSIGHT - 2-3 short paragraphs]
- Keep paragraphs to 1-2 sentences
- Use line breaks for mobile readability
- Include the key takeaway

[CLOSE - Thought-provoking statement or soft CTA]

*[Your disclaimer if required]*
```

**Length:** 150-300 words (excluding disclaimer)
**Character limit:** First 210 characters show in preview - make them count

### Instagram Post Structure

```
[HOOK - Shorter, punchier]

[CORE MESSAGE - 2-3 sentences max]

[HASHTAGS - 3-5 relevant]
```

**Flag:** All Instagram posts need visual asset

---

## Airtable Schema Reference

Configure your Airtable during `/onboard`. Example schema:

| Field | Type | Values |
|-------|------|--------|
| Date | Date | YYYY-MM-DD |
| Post Topic | Text | Descriptive title |
| Posting Account | Single Select | (Your accounts) |
| Platform | Single Select | LinkedIn, Instagram, etc. |
| Copy | Long Text | Full post copy (empty for reposts) |
| Copy Status | Single Select | Draft, Approved, Repost |
| Post Status | Single Select | Scheduled, Posted |
| Post Type | Single Select | Original, Repost |
| Source Post | Link to Record | Links repost to its original |
| Content Pillar | Single Select | (Your pillars) |

### Field Notes
- **Copy**: Empty for reposts (LinkedIn native share handles it)
- **Copy Status**: Use "Repost" for reposts, "Draft" → "Approved" for originals
- **Source Post**: Only used for reposts—links to the original partner post

---

## Content Theme Sources

| Source | Location | Description |
|--------|----------|-------------|
| Call Transcripts | `onboarding/call-transcripts/` | Insights from team calls |
| Brand Pillars | Evergreen themes | Core positioning themes |
| Industry Events | Current events | Timely commentary |

---

## Rules

### Never Do:
- Post outside your scheduled days (configure in /onboard)
- Use emojis (unless part of brand voice)
- Make up testimonials or case studies
- Mix messaging inappropriately between accounts

### Always Do:
- Include required disclaimers
- Apply quality filter to content
- Flag posts that need visual assets
- Update content-bank.md when themes are used
- Match voice to posting account
- Test hooks for scroll-stopping power

### Cadence Rules:
- Configure per-account posting frequency during `/onboard`
- Company account typically handles daily reposts and announcements

### Repost Rules:
- Company reposts partner content 24-48 hours after original
- Set Post Type = "Repost", Copy Status = "Repost"
- Leave Copy field empty
- Link Source Post to original record

---

## Example: Complete Workflow

**Request:** "Create a partner post about [topic]"

**Step 1: Check Content Bank**
→ Found relevant theme

**Step 2: Apply Partner Voice Profile**
→ Clear, direct, mentor-like

**Step 3: Apply Quality Filter**
→ Specific insight = PASSES

**Step 4: Generate Copy**
```
[Hook that captures attention]

[2-3 paragraphs of insight with specific details]

[Closing thought or CTA]

*[Disclaimer if required]*
```

**Step 5: Push to Airtable**
- Date: [scheduled date]
- Post Topic: [descriptive title]
- Posting Account: [partner account]
- Copy Status: Approved
- Content Pillar: [relevant pillar]

**Step 6: Update Content Bank**
- Mark theme as PUBLISHED
- Record ID: [airtable record]

---

## Related Resources

### Brand Context
- `client-context/brand/brand-architecture-framework.md` - Full brand framework
- `client-context/brand/voice-and-tone-guide.md` - Voice execution guide
- `client-context/brand/messaging-framework.md` - Key messages

### Voice Profiles
- `expansions/partner-voice-template/` - Template for partner voices

### Content Pipeline
- `content/social/content-bank.md` - Local content source of truth
- `docs/reference/technical/airtable-schema-template.md` - Full Airtable reference

### Agents That Can Help
- `monthly-content-planner` - Batch planning for calendar
- `social-media-strategist` - Platform strategy
- `content-marketing-strategist` - Overall content strategy
- `lead-writer` - Long-form content generation

---

## Keywords

social media, linkedin, instagram, content workflow, partner voice, brand aligned, content calendar, airtable
