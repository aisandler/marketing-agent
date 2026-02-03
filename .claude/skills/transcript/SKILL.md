---
name: transcript
description: Extract marketing intelligence from call transcripts and meeting notes. Use when users say "process transcript", "extract from call", or reference the /transcript command.
---

# Call Transcript Intake & Extraction

<command-name>transcript</command-name>

## Overview

Extract-only intelligence from call transcripts and meeting notes. Identifies voice observations, content themes, action items, customer language, and key insights, then routes each to its proper home in the context system.

This skill handles extraction only -- no content drafting. Content development from extracted themes is handled by `/cmo`.

Supports both **partner/internal calls** and **client/prospect calls** with type-specific extraction lenses.

## Commands

| Command | Description |
|---------|-------------|
| `/transcript <file>` | Process transcript from a file path |
| `/transcript` (no args) | Prompt for file path or inline paste |
| `/transcript --type partner` | Skip auto-detection, treat as partner call |
| `/transcript --type client` | Skip auto-detection, treat as client call |
| `/transcript log` | List recent extraction logs |

## Quick Start

```
1. Provide transcript  →  file path or paste inline
2. Confirm call type   →  auto-detected, confirm if uncertain
3. Review extraction   →  categories, action items, write-back summary
```

---

## Phase 1: Intake

Accept the transcript via file path or inline paste. Read the full transcript without extracting yet.

Identify from initial read:
- **Context**: What is this call about?
- **Participants**: Who is speaking?
- **Topic**: Primary subject matter
- **Mood/Energy**: Tone of the conversation (enthusiastic, tense, collaborative, etc.)

### Auto-Detection Heuristics

Determine call type automatically. Ask user to confirm if detection is uncertain.

**Partner signals:**
- Speaker names matching entries in `config/partners.json`
- Internal project references, strategy language
- Discussion of content calendars, posting schedules, brand voice

**Client signals:**
- Discovery questions, pain point descriptions
- Pricing/proposal mentions
- Someone explaining the company's services to another person
- Objection handling, sales language

**Mixed signals:**
- Both partner names AND unknown external speakers present
- Apply dual-lens extraction (both partner and client categories)

---

## Phase 2: Extraction

Two-pass extraction process extending the existing `source-material.md` methodology (Steps 1-4).

### Confidence Levels

Tag every extracted item:
- **High** = Direct quote or explicit statement
- **Medium** = Clear pattern from multiple references
- **Low** = Inference from context or single mention

### Extraction Categories by Call Type

| Category | Partner Calls | Client Calls | Both |
|----------|--------------|-------------|------|
| Voice Observations | Quotes, speech patterns, tone markers, language corrections | -- | -- |
| Customer Language | -- | Problem descriptions, service vocabulary, objections | -- |
| Pain Points | -- | Problems, failed prior attempts, hesitations | -- |
| Content Themes | Topics with passion, corrected misconceptions, stories | Questions as blog/FAQ, education gaps | Yes |
| Action Items | Tasks, follow-ups, approvals, deadlines | Proposals, follow-ups, info requests | Yes |
| Key Insights | Business intelligence, strategic decisions | Market intel, competitor mentions, buying triggers | Yes |

### Voice Observations (Partner/Mixed only)

- **Quotable Moments**: Exact quotes that capture voice, with context prompt
- **Speech Patterns**: Recurring phrases, sentence structures, vocabulary preferences
- **Language Corrections**: "Instead of X, they prefer Y" -- captures how partners self-correct or redirect language

### Customer Language (Client/Mixed only)

- **Problem Descriptions**: How prospects describe their pain in their own words
- **Service Vocabulary**: What they call the service (vs. what we call it)
- **Objections**: Hesitations, pushback, concerns raised

### Content Themes (All call types)

Extract themes that could become content:
- Partner calls: Topics discussed with passion, misconceptions corrected, stories told
- Client calls: Questions asked (blog/FAQ candidates), education gaps identified
- Tag each with potential content pillar and format (Social/Blog/Email)

### Action Items (All call types)

Extract every actionable item with:
- Owner (who is responsible)
- Action (what needs to happen)
- Deadline (if mentioned, otherwise "TBD")
- Urgency (High/Medium/Low based on context)

### Key Insights (All call types)

- Partner calls: Business intelligence, strategic decisions, market observations
- Client calls: Market intel, competitor mentions, buying triggers, deal status

---

## Phase 3: Route & Write-back

Write outputs to their designated targets in the context system.

### Write-back Routing

| What | Where | When |
|------|-------|------|
| Full extraction log | `content/transcripts/[DATE]-[slug].md` | Always |
| Content themes | Append to `content/social/content-bank.md` | If themes extracted |
| Voice observations | Append to `content/transcripts/voice-notes.md` | Partner/mixed calls |
| Competitive intel | Append to `docs/intelligence/internal/competitive-intelligence-tracking.md` | If competitor mentions found |
| Market/performance intel | Append to `docs/intelligence/internal/performance-analysis-history.md` | Client calls with market intel |
| Seasonal insights | Append to `docs/intelligence/internal/seasonal-patterns.md` | If timing/seasonal patterns found |
| Action items | **Displayed to user** (not filed) | Always |

### Extraction Log Format

Each run creates `content/transcripts/[YYYY-MM-DD]-[slug].md`:

```markdown
# Transcript Extraction: [Title]

**Date:** [YYYY-MM-DD]
**Call Type:** [Partner | Client | Mixed]
**Participants:** [List]
**Source:** [file path or "inline paste"]
**Context:** [Brief description]

---

## Voice Observations _(partner/mixed only)_
### Quotable Moments
### Speech Patterns
### Language Corrections

## Customer Language _(client/mixed only)_
### Problem Descriptions
### Service Vocabulary
### Objections

## Content Themes Extracted

| ID | Theme | Angle | Pillar | Format | Status |
|----|-------|-------|--------|--------|--------|
| TR-[DATE]-1 | [Topic] | [Angle] | [Pillar] | Social/Blog/Email | AVAILABLE |

## Key Insights
## Action Items

| # | Owner | Action | Deadline | Urgency |
|---|-------|--------|----------|---------|
| 1 | [Name] | [Task] | [Date] | High/Med/Low |

## Follow-Up Needed

---
_Extracted by /transcript on [timestamp]_
```

### Content Bank Theme Append Format

When appending themes to `content/social/content-bank.md`:

```markdown
### TR-[DATE]-N: [Theme Title]
- **Status:** AVAILABLE
- **Source:** content/transcripts/[DATE]-[slug].md
- **Angle:** [specific angle from transcript]
- **Pillar:** [content pillar]
- **Format:** [Social/Blog/Email]
```

### Intelligence File Append Format

When appending to intelligence files (same format as `/cmo` and `/analyst`):

```markdown
### [YYYY-MM-DD] - Transcript: [Slug]
- **Summary:** [2-3 sentences]
- **Key Findings:** [bullet list]
- **Source:** content/transcripts/[DATE]-[slug].md
---
```

### Voice Notes Append Format

When appending to `content/transcripts/voice-notes.md`:

```markdown
### [YYYY-MM-DD] - [Speaker Name] - [Call Context]
- **Quotable Moments:**
  1. "[Exact quote]" -- Context: [prompt] | Confidence: High
- **Speech Patterns:** [observations]
- **Language Corrections:** Instead of "[X]" -> prefer "[Y]"
- **Source:** content/transcripts/[DATE]-[slug].md
---
```

---

## Phase 4: Summary

Present to the user after extraction completes:

1. **Extraction Summary** -- Counts by category (e.g., "3 voice observations, 5 content themes, 2 key insights")
2. **Files Written** -- List each file path written to
3. **ACTION ITEMS** -- Prominent block, formatted as table:

| # | Owner | Action | Deadline | Urgency |
|---|-------|--------|----------|---------|
| 1 | [Name] | [Task] | [Date] | High/Med/Low |

4. **Next Steps** -- Offer logical follow-ups:
   - "Ready to develop themes into content? -> `/cmo`"
   - "Analyze client intelligence further? -> `/analyst`"

---

## Constraints

- **Extract only** -- no content drafting in this skill. Theme development is `/cmo`'s job.
- **Confidence tagging required** on all extracted items (High/Medium/Low).
- **Voice observations are staged** in `content/transcripts/voice-notes.md`. Never write directly to curated voice profiles in `client-context/brand/voice-and-tone-guide.md`.
- **Action items always displayed** to the user prominently. Never silently filed away.
- **Respect existing formats** -- append to content-bank.md and intelligence files using their established entry formats.

---

## Keywords

transcript, call transcript, meeting notes, extract, voice capture, content themes, action items, call processing, intake, call notes, meeting extraction, voice observations, customer language, pain points
