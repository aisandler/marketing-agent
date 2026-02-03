---
name: email-drip-campaigns
description: Create strategic email drip campaigns for onboarding, nurture, re-engagement, and sales sequences. Use when users need email sequences, drip campaigns, automated email series, marketing automation content, or lead nurturing workflows. Supports B2B and B2C with strategy-only or full copy output modes.
---

# Email Drip Campaign Creator

Create effective email sequences through a 4-phase workflow that adapts to your business type, industry, and campaign goals.

## Overview

This skill guides drip campaign creation through 4 phases:
1. **Context Gathering** - Understand business, audience, and goals
2. **Strategy Design** - Map the sequence structure and themes
3. **Content Creation** - Produce email copy or strategy outlines
4. **Review** - Validate and optimize the campaign

## Quick Start

Begin by identifying the essentials:

1. **Campaign type**: Which do you need?
   - **Onboarding**: Welcome new users, drive activation
   - **Nurture**: Educate leads, build trust over time
   - **Re-engagement**: Win back inactive users
   - **Sales**: Move prospects toward purchase

2. **Business type**: B2B or B2C?

3. **Output mode**:
   - **Strategy mode**: Sequence structure, themes, timing recommendations
   - **Copy mode**: Full ready-to-send emails with subject lines, body, CTAs

---

## Phase 1: Context Gathering

### Goal
Understand the business, audience, and campaign objectives before creating anything.

### Process

Ask these essential questions:

**Campaign Fundamentals:**
- Campaign type (onboarding/nurture/re-engagement/sales)
- Business type (B2B vs B2C)
- Industry/vertical (let user describe)
- Product or service being promoted

**Audience Understanding:**
- Target segment and characteristics
- Key pain points and challenges
- Common objections or hesitations
- Decision-making process

**Campaign Specifics:**
- Trigger event (what starts the sequence)
- Primary conversion goal
- Brand voice and tone
- Sequence length preference (or suggest based on type)
- Available personalization data

### Deliverable
A completed context brief summarizing business, audience, and goals.

**Detailed guidance:** See `references/context-gathering.md`

---

## Phase 2: Strategy Design

### Goal
Create the campaign structure, sequence map, and email themes.

### Process

1. Load the appropriate sequence type guide from `references/sequence-types/`:
   - `onboarding.md` - Welcome and activation sequences
   - `nurture.md` - Education and trust-building sequences
   - `re-engagement.md` - Win-back campaigns
   - `sales.md` - Purchase conversion sequences

2. Adapt the structure based on business type:
   - B2B: Longer sequences, wider spacing, professional tone
   - B2C: Shorter sequences, tighter timing, conversational tone

3. Map the customer journey:
   - Define psychological states at each stage
   - Assign themes and goals to each email
   - Plan timing between emails
   - Identify personalization opportunities

4. Document the sequence outline with:
   - Email themes and goals
   - Timing recommendations
   - Subject line directions
   - CTA strategy

### Deliverable
Campaign strategy document with sequence map.

**Business type guidance:** See `references/b2b-vs-b2c.md`

---

## Phase 3: Content Creation

### Goal
Produce email content based on the selected output mode.

### Strategy Mode Output

Generate a strategic overview including:
- Campaign overview with key parameters
- Sequence outline with themes and goals for each email
- Subject line directions (approach, not final copy)
- CTA recommendations
- Timing recommendations with rationale
- Personalization opportunities
- A/B testing suggestions
- Success metrics and targets

**Output format:** See `assets/templates/strategy-output.md`

### Copy Mode Output

Generate complete emails including:
- Subject lines with A/B variants
- Preview text (preheader)
- Full email body copy
- CTAs with button text
- Personalization tokens with fallbacks
- Design and technical notes

**Output format:** See `assets/templates/email-output.md`
**Writing guidance:** See `references/copy-guidelines.md`

### Deliverable
Complete strategy document OR full email drafts for the sequence.

---

## Phase 4: Review

### Goal
Validate and optimize the campaign before implementation.

### Process

Review the complete sequence for:

**Consistency:**
- Tone alignment across all emails
- Progressive messaging (building, not repeating)
- CTA escalation makes sense
- Timing feels natural

**Effectiveness:**
- Subject lines are specific and compelling
- Opening lines hook attention
- CTAs are clear and action-oriented
- Personalization is meaningful

**Technical:**
- Personalization tokens have fallbacks
- Links are specified
- Segmentation is defined
- Exit conditions are clear

### Deliverable
Final campaign package with implementation notes.

---

## Core Principles

### One Goal Per Email
Each email should have a single primary CTA. Multiple asks dilute conversion.

### Value Before Ask
Lead with value, earn the right to sell. Aim for 70% value, 30% ask.

### Subject Line is 80%
Invest heavily in subject lines. Specific beats clever. Front-load key words for mobile.

### Progressive Commitment
Start with small asks, escalate over time. People who take small actions take bigger ones later.

### Relevance Over Volume
Fewer, targeted emails beat many generic ones. Personalize based on behavior and context.

---

## B2B vs B2C Quick Reference

| Aspect | B2B | B2C |
|--------|-----|-----|
| Tone | Professional, ROI-focused | Conversational, emotional |
| Length | 8-15 emails, longer gaps | 3-7 emails, tighter timing |
| CTAs | Demo, consultation, download | Buy, sign up, claim offer |
| Content | Case studies, whitepapers | Stories, social proof, urgency |
| Timing | Business hours, Tue-Thu | Evenings, weekends often work |

**Detailed guidance:** See `references/b2b-vs-b2c.md`

---

## Sequence Type Defaults

### Onboarding (5-7 emails)
Welcome → Feature intro → Setup → Social proof → Advanced features → Check-in → Milestone

### Nurture (7-12 emails)
Welcome → Pain point → Solution → Case study → Mistakes → Insights → Comparison → FAQ → Soft CTA → Final nudge

### Re-engagement (3-5 emails)
We miss you → Comeback offer → FOMO/proof → Last chance → Goodbye

### Sales (5-8 emails)
Introduction → Problem → Solution → Proof → Objections → Comparison → Offer → Urgency

**Detailed patterns:** See `references/sequence-types/`

---

## Anti-Patterns

Avoid these common mistakes:

- **Generic subject lines**: "Newsletter" or "Update" get ignored
- **Walls of text**: Dense paragraphs kill engagement
- **Multiple CTAs**: Competing actions dilute conversion
- **Selling too early**: Build trust before asking
- **Ignoring mobile**: 60%+ read on phones
- **Clickbait disconnect**: Subjects must match content

**Full principles:** See `references/email-principles.md`

---

## Quick Reference

### Reference Files
- `references/context-gathering.md` - Question framework and context brief template
- `references/email-principles.md` - Core principles and anti-patterns
- `references/b2b-vs-b2c.md` - Business type adaptations
- `references/copy-guidelines.md` - Writing guidelines for email copy
- `references/sequence-types/` - Detailed patterns per campaign type

### Output Templates
- `assets/templates/strategy-output.md` - Strategy mode format
- `assets/templates/email-output.md` - Copy mode format

---

## Keywords

drip campaign, email sequence, automated email, nurture sequence, onboarding emails, welcome series, re-engagement, win-back campaign, sales sequence, email automation, marketing automation, lead nurturing, email funnel, lifecycle email, triggered email, behavioral email
