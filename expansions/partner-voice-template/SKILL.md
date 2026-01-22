---
name: partner-voice-template
description: "EXAMPLE TEMPLATE: Transform a partner/expert's insights into marketing content. Copy this folder and customize for each team member who needs a distinct voice profile."
---

# Partner Voice Content Creator Template

> **THIS IS A TEMPLATE** - Copy this folder to `.claude/skills/{{partner-name}}/` and customize all `{{PLACEHOLDER}}` values for your specific team member.

Transform {{PARTNER_NAME}}'s insights and expertise into review-ready marketing content.

## Overview

This skill processes raw content (primarily call transcripts) through a 4-phase workflow to produce email, social, and blog content that:
- Reflects {{PARTNER_NAME}}'s distinctive voice
- Passes the audience quality filter
- Reinforces core positioning

## How to Use This Template

1. **Copy this folder** to `.claude/skills/{{partner-name}}/`
2. **Replace all placeholders** with partner-specific information:
   - `{{PARTNER_NAME}}` - Full name
   - `{{PARTNER_ROLE}}` - Title/role (e.g., "Commercial Practice Lead")
   - `{{EXPERTISE_AREA}}` - Domain expertise
   - `{{TARGET_AUDIENCE}}` - Primary audience
   - `{{VOICE_CHARACTERISTICS}}` - Voice traits
   - `{{SIGNATURE_PHRASES}}` - 3-5 key phrases
3. **Update reference files** in `references/` folder
4. **Customize templates** in `assets/templates/` folder

---

## Quick Start

1. **Input**: What source material do you have?
   - Call transcript (most common)
   - Raw notes or quotes
   - Topic request

2. **Output**: What format do you need?
   - **Email**: Drip additions, newsletter sections
   - **Social**: LinkedIn posts
   - **Blog**: Long-form articles

3. **Process**: Run through the 4 phases below

---

## Phase 1: Intake

### Goal
Understand the source material and target output.

### Process

1. **Identify the source**:
   - Call transcript → Note date, participants, main topics discussed
   - Raw notes → Note context and source
   - Topic request → Clarify what angle {{PARTNER_NAME}} would take

2. **Confirm output format(s)**:
   - Email (drip, newsletter, standalone)
   - Social (LinkedIn post)
   - Blog (article, thought leadership)

3. **Check for related content**:
   - Has this topic been covered before?
   - Are there {{PARTNER_NAME}} quotes we should incorporate?
   - Does this connect to existing campaigns?

### Deliverable
Clear understanding of source material and target output.

---

## Phase 2: Extract

### Goal
Pull the valuable insights from the source material.

### Process

For call transcripts:

1. **Identify key insights**:
   - What did {{PARTNER_NAME}} explain that isn't obvious?
   - What corrections or clarifications were made?
   - What specific examples or stories were shared?

2. **Capture quotable moments**:
   - Direct quotes that capture their voice
   - Memorable phrasing or analogies
   - Specific advice or recommendations

3. **Note topic themes**:
   - What pain points were being addressed?
   - What misconceptions were being corrected?
   - What expertise was being demonstrated?

4. **Flag follow-ups**:
   - Topics that need more depth
   - Case studies or examples to request
   - Questions that came up but weren't answered

### Deliverable
Extracted insights document with quotes, themes, and content opportunities.

**Voice reference:** See `references/voice-profile.md`

---

## Phase 3: Transform

### Goal
Convert insights into draft content that passes the quality filter.

### Process

1. **Load the voice profile**:
   - {{VOICE_CHARACTERISTIC_1}}
   - {{VOICE_CHARACTERISTIC_2}}
   - {{VOICE_CHARACTERISTIC_3}}
   - {{CORE_POSITIONING}}

2. **Apply the quality filter**:
   Before including any insight, ask: "Would {{TARGET_AUDIENCE}} find this valuable, or would they think 'who doesn't know this?'"

   **Fails the filter:**
   - Basic explanations the audience already knows
   - Generic advice without specifics
   - Industry-standard information

   **Passes the filter:**
   - Specific insights from experience
   - Non-obvious implications
   - Actionable expertise

3. **Generate draft content**:
   - Use the appropriate output template
   - Incorporate quotes where natural
   - Maintain their voice throughout
   - Include source references for review

4. **Mark for review**:
   - Flag sections that need confirmation
   - Note any technical details to verify
   - Indicate confidence level on tone/voice

### Deliverable
Draft content in requested format, marked for review.

**Filter guidance:** See `references/sophistication-filter.md`
**Positioning:** See `references/positioning.md`

---

## Phase 4: Output

### Goal
Produce review-ready drafts with clear guidance for reviewers.

### Process

1. **Format the output** using the appropriate template:
   - Email: `assets/templates/email-draft.md`
   - Social: `assets/templates/social-draft.md`
   - Blog: `assets/templates/blog-draft.md`

2. **Include review guidance**:
   - Source reference (which transcript/insight)
   - Confidence level (high/medium/low)
   - Specific questions for {{PARTNER_NAME}}
   - Technical details to verify

3. **Provide alternatives** where appropriate:
   - Subject line variants for email
   - Hook options for social
   - Headline alternatives for blog

### Deliverable
Final draft package ready for review.

---

## Voice Quick Reference

### Characteristics
- **{{VOICE_CHARACTERISTIC_1}}** - Description
- **{{VOICE_CHARACTERISTIC_2}}** - Description
- **{{VOICE_CHARACTERISTIC_3}}** - Description
- **{{VOICE_CHARACTERISTIC_4}}** - Description

### Signature Phrases
- "{{SIGNATURE_PHRASE_1}}"
- "{{SIGNATURE_PHRASE_2}}"
- "{{SIGNATURE_PHRASE_3}}"

### What They Avoid
- {{AVOID_1}}
- {{AVOID_2}}
- {{AVOID_3}}

**Full profile:** See `references/voice-profile.md`

---

## Quality Filter Quick Test

Before including content, ask:

> "Would {{TARGET_AUDIENCE}} find this valuable, or would they think 'who doesn't know this?'"

### Red Flags (Fails Filter)
- Basic industry explanations
- Generic advice
- Information everyone in the field knows

### Green Lights (Passes Filter)
- Specific insights from experience
- Non-obvious implications or connections
- Actionable expertise others can use

**Full criteria:** See `references/sophistication-filter.md`

---

## Target Audience

### Primary: {{PRIMARY_AUDIENCE}} ({{PRIMARY_PERCENTAGE}}%)
- Profile description
- What they already know
- What insights they value
- How they influence decisions

### Secondary: {{SECONDARY_AUDIENCE}} ({{SECONDARY_PERCENTAGE}}%)
- Profile description
- Different content approach needed
- Longer-form educational content

---

## Expertise Areas

Content should cover:
- {{EXPERTISE_AREA_1}}
- {{EXPERTISE_AREA_2}}
- {{EXPERTISE_AREA_3}}

---

## Reference Files

- `references/voice-profile.md` - Voice characteristics and examples
- `references/sophistication-filter.md` - Audience filter with pass/fail examples
- `references/positioning.md` - Core messages and themes
- `references/source-material.md` - How to process different input types

## Output Templates

- `assets/templates/email-draft.md` - Email content format
- `assets/templates/social-draft.md` - LinkedIn post format
- `assets/templates/blog-draft.md` - Long-form content format

---

## Keywords

partner voice, content creator, thought leadership, voice profile, audience filter, content workflow
