# Content Bank Manager

Manage your social content pipeline from local content bank to Airtable.

## Overview

This skill helps you:
- View available content themes by team member
- Generate post copy from themes using voice profiles
- Push approved content to Airtable
- Track content usage and update statuses

## Content Bank Location

**Local source of truth:** `/content/social/content-bank.md`

This file contains:
- Team voice profiles
- Content themes extracted from source material
- Usage tracking with Airtable record IDs
- Quotable moments for copy generation

## Quick Commands

### View Available Content
"Show me available content for [partner/team member]"
→ Lists AVAILABLE themes from content-bank.md

### Generate Post Copy
"Generate a post for [partner] using theme [ID]"
→ Creates copy using the partner's voice profile and theme hook

### Push to Airtable
"Push this post to Airtable for [date]"
→ Creates record in Content Calendar, returns record ID

### Update Content Bank
"Mark [theme ID] as [DRAFTED/IN_AIRTABLE/POSTED] with record [ID]"
→ Updates the content-bank.md tracking

## Workflow

```
1. CHECK BANK          →  Read content-bank.md, find AVAILABLE themes
2. GENERATE COPY       →  Use partner voice profile to write post
3. REVIEW              →  Present copy for approval
4. PUSH TO AIRTABLE    →  Create record with date, account, copy
5. UPDATE BANK         →  Mark theme as IN_AIRTABLE with record ID
6. AFTER POSTING       →  Mark as POSTED with date
```

## Partner Voice Quick Reference

Configure partner voices during `/onboard`. Example structure:

### Partner 1
- **Tone:** Clear, direct, mentor-like
- **Signature phrases:** Key phrases this person uses
- **Filter:** Quality check question
- **Topics:** Areas of expertise

### Partner 2
- **Tone:** Direct, action-oriented, pragmatic
- **Topics:** Market commentary, expertise areas
- **Platforms:** Which platforms they use

### Company Account
- **Tone:** Professional, authoritative, team-focused
- **Role:** Core content, announcements, positioning
- **Message:** Core value proposition

## Airtable Integration

Configure during `/onboard`:

**Base ID:** `[Configure in /onboard]`
**Content Calendar Table:** `[Configure in /onboard]`

**Key Fields:**
- Date, Post Topic, Posting Account, Platform
- Copy, Copy Status, Asset Status, Post Status
- Post Type (Original/Repost), Content Pillar, Focus
- Needs Asset (checkbox for visual posts)

## Content Theme Sources

| Source | File | Description |
|--------|------|-------------|
| Call Transcripts | `onboarding/call-transcripts/` | Insights from interviews |
| Brand Pillars | Evergreen themes | Core positioning themes |

## Example Session

**User:** "I need content for [Partner] this week"

**Process:**
1. Read content-bank.md → Find available themes
2. Present options with hooks
3. User selects theme
4. Generate copy using partner's voice profile
5. User approves → Push to Airtable for scheduled date
6. Update content-bank.md with status and record ID

## Quality Filter

Before finalizing any content, apply the filter:

> "Would the target audience find this valuable, or would they think 'who doesn't know this?'"

**Fails filter:** Basic explanations, generic checklists, obvious advice
**Passes filter:** Hidden complexities, edge cases, specific non-obvious details

## Related Files

- Content Bank: `content/social/content-bank.md`
- Voice Profile Template: `expansions/partner-voice-template/`
- Airtable Schema: `docs/reference/technical/airtable-schema-template.md`

## Keywords

content bank, social media, linkedin, airtable, content calendar, partner voice, content pipeline
