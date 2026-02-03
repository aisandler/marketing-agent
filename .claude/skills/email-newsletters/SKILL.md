---
name: email-newsletters
description: Create strategic email newsletters for audience engagement and retention. Use when users need recurring newsletters, content digests, company updates, editorial emails, or regular subscriber communications. Supports B2B and B2C with strategy-only or full copy output modes.
---

# Email Newsletter Creator

Create effective newsletters through a 4-phase workflow that adapts to your business type, content strategy, and audience needs.

## Overview

This skill guides newsletter creation through 4 phases:
1. **Context Gathering** - Understand audience, goals, and content sources
2. **Content Strategy** - Design section structure and content organization
3. **Content Creation** - Produce newsletter copy or strategy outlines
4. **Review** - Validate quality and plan for ongoing optimization

## Quick Start

Begin by identifying the essentials:

1. **Newsletter type**: Which do you need?
   - **Content/Editorial**: Thought leadership, industry insights
   - **Company Updates**: Product news, announcements, milestones
   - **Digest/Roundup**: Curated content, weekly/monthly summaries
   - **Hybrid**: Combination of multiple formats

2. **Business type**: B2B or B2C?

3. **Output mode**:
   - **Strategy mode**: Section structure, content directions, subject line approaches
   - **Copy mode**: Full ready-to-send newsletter with all sections

---

## Phase 1: Context Gathering

### Goal
Understand the audience, newsletter purpose, and operational context before creating anything.

### Process

Ask these essential questions:

**Newsletter Fundamentals:**
- Newsletter type (content/company updates/digest/hybrid)
- Business type (B2B vs B2C)
- Industry/vertical
- Primary newsletter goal (engagement, retention, traffic, etc.)

**Audience Understanding:**
- Target subscriber segment
- What they value and need
- Content consumption preferences
- Current relationship with your brand

**Operational Context:**
- Publication frequency (weekly, bi-weekly, monthly)
- Available content sources
- Brand voice and tone
- Team capacity for content creation

**This Issue Specifics:**
- Theme or focus for this issue (if applicable)
- Timely content or announcements to include
- Any special circumstances

### Deliverable
A completed context brief summarizing audience, goals, and constraints.

---

## Phase 2: Content Strategy

### Goal
Design the newsletter structure, sections, and content organization.

### Process

1. Load the appropriate newsletter type guide from `references/newsletter-types/`:
   - `content-editorial.md` - Thought leadership newsletters
   - `company-updates.md` - Product and company news
   - `digest-roundup.md` - Curated content roundups
   - `hybrid-newsletter.md` - Multi-format combinations

2. Adapt the structure based on business type:
   - B2B: More depth, professional tone, business value focus
   - B2C: More conversational, personal benefits, entertainment value

3. Design the section structure:
   - Define sections and their purposes
   - Plan content flow and hierarchy
   - Identify recurring vs. variable sections
   - Allocate approximate lengths

4. Plan subject line and CTA strategy:
   - Subject line approach for this issue
   - Preview text strategy
   - Primary and secondary CTAs

### Deliverable
Newsletter strategy document with section outline.

**Business type guidance:** See `../email-drip-campaigns/references/b2b-vs-b2c.md`

---

## Phase 3: Content Creation

### Goal
Produce newsletter content based on the selected output mode.

### Strategy Mode Output

Generate a strategic overview including:
- Newsletter overview with key parameters
- Section structure with purposes and content directions
- Subject line directions (approach, not final copy)
- CTA recommendations
- Scheduling recommendations
- Personalization opportunities
- A/B testing suggestions
- Success metrics and targets

**Output format:** See `assets/templates/strategy-output.md`

### Copy Mode Output

Generate complete newsletter including:
- Subject lines with A/B variants
- Preview text (preheader)
- Full content for each section
- CTAs with button text
- Personalization tokens with fallbacks
- Design and technical notes

**Output format:** See `assets/templates/newsletter-output.md`
**Writing guidance:** See `../email-drip-campaigns/references/copy-guidelines.md`

### Deliverable
Complete strategy document OR full newsletter draft.

---

## Phase 4: Review

### Goal
Validate quality and plan for ongoing optimization.

### Process

Review the complete newsletter for:

**Content Quality:**
- Value delivery in each section
- Appropriate depth and length
- Tone consistency throughout
- Clear and compelling hooks

**Technical Quality:**
- Subject line freshness (not repeating recent issues)
- Preview text complements subject
- CTAs are clear and actionable
- Links are correct and working
- Personalization tokens have fallbacks

**Audience Fit:**
- Content matches subscriber expectations
- Appropriate for the business type
- Timing and frequency are right

### Deliverable
Final newsletter with publishing notes and optimization recommendations.

---

## Core Principles

### Value First, Always
Every issue should deliver clear value. Subscribers gave you permission to reach their inbox - respect it.

### Consistency Builds Trust
Same day, same time, same quality. Predictability builds habits and trust.

### Respect Reader Time
Most newsletters are too long. Get to the value quickly and keep it scannable.

### Your Voice is the Product
Particularly for content newsletters - your unique perspective and curation is why people subscribe.

### Quality Over Quantity
Fewer, better sections beat more mediocre content. Curate ruthlessly.

**Full principles:** See `../email-drip-campaigns/references/email-principles.md`

---

## Newsletter Type Quick Reference

| Type | Primary Purpose | Typical Frequency | Key Sections |
|------|-----------------|-------------------|--------------|
| Content/Editorial | Thought leadership | Weekly/Bi-weekly | Feature, insights, resources |
| Company Updates | Customer communication | Monthly | Updates, tips, customer spotlight |
| Digest/Roundup | Content curation | Weekly | Top picks, quick hits, resource |
| Hybrid | Multiple goals | Varies | Mix based on strategy |

**Detailed patterns:** See `references/newsletter-types/`

---

## B2B vs B2C Quick Reference

| Aspect | B2B | B2C |
|--------|-----|-----|
| Tone | Professional, analytical | Conversational, relatable |
| Length | Can be comprehensive | Usually shorter, scannable |
| Content | Industry insights, strategy | Lifestyle, personal value |
| CTAs | Learn more, register, demo | Shop, try, share |
| Timing | Business hours, Tue-Thu | Evenings, weekends often work |

**Detailed guidance:** See `../email-drip-campaigns/references/b2b-vs-b2c.md`

---

## Subject Line Quick Reference

### For Recurring Newsletters

**Hybrid approach (recommended):**
> "[Newsletter Name]: [Specific hook for this issue]"

**Curiosity-first:**
> "[Compelling hook without newsletter name]"

**Consistency-first:**
> "[Newsletter Name] #[Number] - [Date]"

**Strategies for avoiding fatigue:**
- Rotate subject line types
- Vary opening words
- Mix question, statement, fragment formats

**Full guidance:** See `references/recurring-subject-lines.md`

---

## Anti-Patterns

Avoid these common mistakes:

- **Too long**: Respect reader time, get to value quickly
- **No clear value**: Every section should deliver something useful
- **Inconsistent schedule**: Missed sends erode trust
- **Same subject lines**: Repetitive patterns get ignored
- **All promotion**: Keep it 80%+ value, 20% ask
- **No personality**: Generic newsletters don't stand out

---

## Quick Reference

### Reference Files

**Newsletter-specific:**
- `references/newsletter-types/` - Detailed patterns per newsletter type
- `references/content-curation.md` - Sourcing and organizing content
- `references/scheduling-calendar.md` - Frequency and timing guidance
- `references/recurring-subject-lines.md` - Subject line strategies for series
- `references/newsletter-metrics.md` - KPIs and analytics guidance

**Shared with Email Drip Campaigns:**
- `../email-drip-campaigns/references/email-principles.md` - Core email best practices
- `../email-drip-campaigns/references/copy-guidelines.md` - Writing guidelines
- `../email-drip-campaigns/references/b2b-vs-b2c.md` - Business type adaptations

### Output Templates
- `assets/templates/strategy-output.md` - Strategy mode format
- `assets/templates/newsletter-output.md` - Copy mode format

---

## Related Skills

For **triggered email sequences** (not recurring newsletters), see the `email-drip-campaigns` skill.

---

## Keywords

newsletter, email newsletter, digest, roundup, content newsletter, editorial email, company updates, product newsletter, subscriber email, recurring email, weekly newsletter, monthly newsletter, curated content, thought leadership email, company news, customer newsletter
