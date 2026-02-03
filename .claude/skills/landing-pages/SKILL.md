---
name: landing-pages
description: Create high-converting landing pages with optimized copy and production-ready code. Use when building lead generation, SaaS product, e-commerce, or event landing pages. Provides 5-phase workflow combining conversion psychology with visual implementation via UI style skills (soft-ui, sharp-ui, glass-ui, glossy-ui, retro-ui).
tags:
  - marketing
archetype: meta
---

# Landing Page Creator

Create high-converting landing pages through a 5-phase workflow that combines conversion psychology, compelling copy, and production-ready code.

## Overview

This skill guides landing page creation through 5 phases:
1. **Context Gathering** - Understand business, audience, and goals
2. **Page Strategy** - Design section structure and conversion flow
3. **Copy Creation** - Write conversion-optimized copy
4. **Implementation** - Generate production-ready code
5. **Review** - Validate conversion readiness

## Quick Start

Begin by identifying the essentials:

1. **Page type**: What kind of landing page?
   - **Lead Generation**: Capture emails, signups, demo requests
   - **SaaS Product**: Drive trials, demos, subscriptions
   - **E-commerce**: Product pages, sales, purchases
   - **Event**: Webinars, workshops, registrations

2. **Business type**: B2B or B2C?

3. **Output mode**:
   - **Strategy only**: Structure, copy direction, no code
   - **Full implementation**: Complete HTML/React code with copy

---

## Phase 1: Context Gathering

### Goal
Understand the business, audience, and conversion objectives before designing anything.

### Essential Questions

**Page fundamentals:**
- Page type (lead gen/SaaS/e-commerce/event)
- Business type (B2B vs B2C)
- Industry/market
- The offer (what they're promoting)

**Audience understanding:**
- Target audience profile
- Key pain points and challenges
- Common objections or hesitations
- What motivates them to act

**Conversion specifics:**
- Primary conversion goal (signup/demo/purchase)
- Secondary goals if any
- Current traffic sources
- Competitive landscape

**Brand and style:**
- Brand voice and tone
- Visual preferences (if any)
- Existing brand assets

### Deliverable
Completed context brief summarizing business, audience, and goals.

**Detailed guidance:** See `references/conversion-psychology.md`

---

## Phase 2: Page Strategy

### Goal
Design the section structure and conversion flow.

### Process

1. **Load page type guide** from `references/page-types/`:
   - `lead-generation.md` - Forms, lead magnets
   - `saas-product.md` - Trials, demos, features
   - `ecommerce-product.md` - Product pages, buy boxes
   - `event-registration.md` - Webinars, workshops

2. **Plan section order** based on page type and goal

3. **Map visitor journey** from landing to conversion

4. **Identify psychological triggers** to apply:
   - Social proof placement
   - Urgency elements (if authentic)
   - Objection handling points
   - Trust signal placement

5. **Apply B2B/B2C adaptations**

### Deliverable
Page strategy document with section outline and conversion flow.

**Section patterns:** See `references/section-patterns.md`
**B2B/B2C guide:** See `references/b2b-vs-b2c.md`

---

## Phase 3: Copy Creation

### Goal
Write conversion-optimized copy for all page sections.

### Process

1. **Write hero copy**
   - Headline (primary value proposition)
   - Subheadline (supporting detail + credibility)
   - Primary CTA

2. **Write section copy**
   - Problem/pain agitation
   - Solution/benefits
   - Features (if needed)
   - How it works

3. **Create social proof**
   - Testimonials
   - Stats/metrics
   - Trust signals

4. **Handle objections**
   - FAQ content
   - Guarantee copy
   - Risk reducers

5. **Write CTAs**
   - Primary button text
   - Supporting text
   - Urgency elements

### Deliverable
Complete copy for all page sections.

**Copy frameworks:** See `references/copy-frameworks.md`

---

## Phase 4: Implementation

### Goal
Generate production-ready landing page code.

### Visual Design

For aesthetic direction, **apply one of the UI style skills**:
- `soft-ui-system` - Rounded, gradients, soft shadows
- `sharp-ui-system` - Angular, brutalist, HUD-style
- `glass-ui-system` - Glassmorphism, blur, translucent
- `glossy-ui-system` - Premium polish, reflections, shine
- `retro-ui-system` - 8-bit, synthwave, CRT effects

This skill provides:
- Conversion structure and flow
- Section patterns and layouts
- Copy and messaging

The UI style skills provide:
- Typography and visual hierarchy
- Color palettes and theme variants
- Motion and animations
- Distinctive visual styling

**Color options:**
- Use the style's default palette
- Apply a preset theme: Ocean, Sunset, Forest, or Monochrome
- Provide custom brand colors (hex, RGB, HSL, or plain language)

**Apply both:** conversion-optimized structure + distinctive visual design.

### Process

1. Apply chosen UI style for visual direction
2. Generate responsive HTML or React code
3. Integrate copy from Phase 3
4. Implement conversion elements:
   - Forms with validation
   - CTA buttons with hover states
   - Social proof displays
   - Trust badges
5. Apply accessibility best practices
6. Ensure mobile responsiveness

### Deliverable
Complete landing page code with copy integrated.

**Output format:** See `assets/templates/page-output.md`

---

## Phase 5: Review

### Goal
Validate conversion readiness before launch.

### Conversion Checklist

**Above the fold:**
- [ ] Value proposition clear within 5 seconds
- [ ] Primary CTA visible without scrolling
- [ ] Headline speaks to target audience

**Throughout page:**
- [ ] Single conversion goal maintained
- [ ] Social proof present and credible
- [ ] Objections addressed
- [ ] Benefits emphasized over features
- [ ] CTAs repeated at decision points

**Trust and credibility:**
- [ ] Trust signals visible
- [ ] Guarantee or risk reducer present
- [ ] Contact/credibility information available

**Technical:**
- [ ] Mobile responsive
- [ ] Page loads under 3 seconds
- [ ] Forms functional
- [ ] All links work

### Deliverable
Final page with implementation notes and testing recommendations.

---

## Core Conversion Principles

### Single Goal
Every element moves toward ONE conversion action. No competing CTAs.

### Above-Fold Clarity
Visitors should understand WHAT, WHO, and WHAT TO DO in 5 seconds.

### Value Before Ask
Lead with what they GET, not what you want them to DO.

### Social Proof Hierarchy
Logos → Metrics → Testimonials → Case Studies (escalating depth)

### Objection Handling
Address top 3-5 objections directly on the page. Don't leave doubts unanswered.

**Full principles:** See `references/conversion-psychology.md`

---

## Page Type Quick Reference

### Lead Generation
**Sections:** Hero + Form → Problem → Value → Social Proof → FAQ → CTA
**CTA:** "Get Your Free [Resource]" / "Download Now"
**Key:** Minimize form fields, clear value exchange

### SaaS Product
**Sections:** Hero → Logos → Features → How It Works → Social Proof → Pricing → FAQ → CTA
**CTA:** "Start Free Trial" / "Book a Demo"
**Key:** Show the product, emphasize outcomes

### E-commerce
**Sections:** Hero/Product → Benefits → Reviews → Features → Guarantee → Urgency → CTA
**CTA:** "Add to Cart" / "Buy Now"
**Key:** High-quality images, prominent reviews, clear pricing

### Event Registration
**Sections:** Hero → Value/Agenda → Speaker → Social Proof → Urgency → CTA
**CTA:** "Register Now" / "Save Your Spot"
**Key:** Date/time visible, speaker credibility, limited seats

**Detailed patterns:** See `references/page-types/`

---

## B2B vs B2C Quick Reference

| Element | B2B | B2C |
|---------|-----|-----|
| **Headline** | ROI/outcome focused | Benefit/emotion focused |
| **Tone** | Professional, peer-to-peer | Conversational, warm |
| **Social Proof** | Logos, case studies | Reviews, testimonials |
| **CTAs** | Demo, trial, consultation | Buy, sign up, get started |
| **Content Depth** | More detail, longer | Scannable, visual |
| **Urgency** | Subtle, value-focused | Direct, time-sensitive |

**Full guide:** See `references/b2b-vs-b2c.md`

---

## Section Patterns

### Hero
Headline + Subheadline + CTA + Visual (product shot or video)

### Problem
Acknowledge pain → Agitate consequences → Transition to solution

### Benefits
3-pillar format with icons: Title + Description for each

### Social Proof
Logos bar (early) + Testimonials (mid) + Case studies (if B2B)

### How It Works
3-step process: Step → Step → Outcome

### Pricing
Clear tiers or single price with included features

### FAQ
Top 4-6 objections phrased as questions

### Final CTA
Headline + Supporting text + Button + Trust element

**Full patterns:** See `references/section-patterns.md`

---

## Copy Formulas

### Headlines
- **Problem-Solution:** "Stop [Pain Point] [Timeframe]"
- **Outcome:** "Get [Result] Without [Pain]"
- **Specific Claim:** "[Metric] in [Timeframe]"
- **Question:** "Ready to [Transformation]?"

### CTAs
- "Start [Action] Free"
- "Get [Benefit] Now"
- "[Action] Your [Noun]"
- "Join [Number]+ [Noun]"

### Supporting Text
- "No credit card required"
- "Cancel anytime"
- "30-day money-back guarantee"

**Full frameworks:** See `references/copy-frameworks.md`

---

## Quick Reference

### Reference Files
- `references/conversion-psychology.md` - Persuasion principles and psychology
- `references/section-patterns.md` - Section layouts and structures
- `references/copy-frameworks.md` - Headlines, CTAs, testimonials
- `references/b2b-vs-b2c.md` - Audience adaptations
- `references/page-types/` - Type-specific patterns

### Output Templates
- `assets/templates/page-output.md` - Full implementation format
- `assets/templates/strategy-output.md` - Strategy-only format

---

## Keywords

landing page, conversion page, lead generation, lead gen page, squeeze page, opt-in page, sales page, product page, SaaS landing page, e-commerce product page, webinar registration, event page, hero section, call to action, CTA, above the fold, conversion optimization, high-converting
