---
name: images
description: Image generation toolkit for social media posts. Provides commands for generating AI images, managing the generation queue, tracking costs, and applying partner feedback. Use when users say "generate images", "check image status", "image costs", or reference the /images command.
---

# Image Generation Toolkit

AI image generation for social media content with cost tracking and partner feedback integration.

## Overview

This skill wraps the image generation utilities in `automation/image-generation/` and provides a command interface for managing the image workflow. Images are generated via OpenRouter/Gemini at ~$0.14 per image.

**Key Features:**
- Queue management from Airtable (records with Image Brief but no Image)
- Cost tracking and monthly budget monitoring
- Partner feedback loop (rejection themes become negative prompts)
- Preview mode for local review before uploading
- Batch processing with rate limiting

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `/images status` | Show queue status and current month costs |
| `/images status --by-account` | Status breakdown by posting account |
| `/images generate` | Generate images for pending records |
| `/images generate --dry-run` | Preview what would be generated with cost estimate |
| `/images generate --limit N` | Generate up to N images |
| `/images generate --preview` | Generate locally first (no upload) |
| `/images briefs` | Validate image brief quality |
| `/images retry` | Retry previously failed generations |
| `/images costs` | Detailed cost report |
| `/images approve <record>` | Upload a preview image to Airtable |
| `/images reposts` | Process reposts - mark as "No Image Needed" |
| `/images reposts --dry-run` | Preview which reposts would be processed |

---

## Quick Start

### Check what needs images
```bash
npx tsx automation/image-generation/generate-images.ts --status
```

### Preview before generating
```bash
npx tsx automation/image-generation/generate-images.ts --dry-run
```

### Generate a small batch
```bash
npx tsx automation/image-generation/generate-images.ts --limit 3
```

---

## Core Workflow

### 1. Queue Check
Records need images when:
- Has `Image Brief` field populated
- Does NOT have `Image` attachment
- Not marked for "Real Photo" in Image Source
- Post Type is NOT "Repost" or "Link Share"

**Reposts are automatically excluded** - they use the original post's image and don't need generation.

### 2. Brief Sanitization
Before generation, briefs are automatically sanitized:
- People/face references removed (AI generates abstract alternatives)
- "Photo of" triggers skip (needs real photo)
- Brand styling applied (from config/brand.json)

### 3. Feedback Loop Integration
Partner feedback from the portal dynamically adjusts prompts:
- Rejection themes extracted and converted to negative prompts
- Applied automatically to all generations in a batch
- See `references/feedback-loop.md` for details

### 4. Generation
- Via OpenRouter API using Gemini image model
- Rate limited (2s between requests)
- Max batch size: 20 images (configurable)

### 5. Upload
- Direct upload to Airtable Image field
- Metadata fields updated (Image Source = "AI Generated")

### 6. Repost Handling
Reposts are automatically detected and marked as not needing images:
- **Asset Status** → "No Image Needed"
- **Image Source** → "N/A - Repost"
- **Notes** → References the source post ID

When processing reposts, the system also checks the source post's status:
- If the original post's Copy Status is "Approved", the repost copy is considered pre-approved
- The Source Post link is preserved for reference

Run `--process-reposts` to mark all unprocessed reposts in Airtable.

> **Note:** The "No Image Needed" and "N/A - Repost" values must exist as options in Airtable's Asset Status and Image Source single-select fields respectively. Add them in Airtable if they don't exist.

---

## Constraints

| Constraint | Value |
|------------|-------|
| **Cost per image** | ~$0.14 |
| **Max batch size** | 20 images |
| **Rate limit** | 2 seconds between API calls |
| **Never auto-generate** | Always requires explicit CLI command |
| **Supported formats** | PNG (default), JPG |

---

## Command Details

### Status Check
```bash
npx tsx automation/image-generation/generate-images.ts --status
```
Shows:
- Records needing images (with Image Brief, no Image)
- Records with images
- Records missing briefs
- Current month spend

Add `--by-account` for breakdown by posting account.

### Dry Run
```bash
npx tsx automation/image-generation/generate-images.ts --dry-run
```
Shows exactly what would be generated:
- Record IDs and topics
- Brief preview (truncated)
- Sanitization warnings
- Total estimated cost

### Generate with Limit
```bash
npx tsx automation/image-generation/generate-images.ts --limit 5
```
Generates up to 5 images. Recommended for testing or controlled batches.

### Preview Mode
```bash
npx tsx automation/image-generation/generate-images.ts --preview --limit 3
```
Generates images locally to `automation/image-generation/preview/` without uploading to Airtable. Review images then approve:
```bash
npx tsx automation/image-generation/generate-images.ts --approve recXXXXXX
```

### Single Record
```bash
npx tsx automation/image-generation/generate-images.ts --record recXXXXXX
```
Generate for a specific Airtable record.

### Retry Failed
```bash
npx tsx automation/image-generation/generate-images.ts --retry-failed
```
Retries records that failed in previous runs (logged in generation-log.csv).

### Validate Briefs
```bash
npx tsx automation/image-generation/generate-images.ts --validate-briefs
```
Check brief quality before generating:
- Too short/long
- Missing style directive
- Contains "photo" (needs real image)
- Contains people references (will be sanitized)

### Cost Report
```bash
npx tsx automation/image-generation/generate-images.ts --costs
```
Shows:
- Total spend (all time)
- Breakdown by posting account
- Breakdown by platform
- Current month spend

### Budget Warning
```bash
npx tsx automation/image-generation/generate-images.ts --budget 50
```
Warn if monthly spend would exceed $50. Use with generation commands.

### Process Reposts
```bash
npx tsx automation/image-generation/generate-images.ts --process-reposts
```
Finds all records where Post Type = "Repost" and marks them:
- Asset Status → "No Image Needed"
- Image Source → "N/A - Repost"
- Notes → References the source post

Also checks the source post (via `Source Post` link) and reports:
- Original post's Copy Status (if Approved, repost copy is pre-approved)
- Original post's Asset Status

Use with `--dry-run` to preview without making changes:
```bash
npx tsx automation/image-generation/generate-images.ts --process-reposts --dry-run
```

### Clear Image for Regeneration
```bash
npx tsx automation/image-generation/generate-images.ts --clear-image recXXXXXX
```
Removes image from a record so it can be regenerated.

---

## Reference Files

- `references/cost-tracking.md` - Budget monitoring and cost calculation
- `references/feedback-loop.md` - Partner feedback integration

## Implementation Files

| File | Purpose |
|------|---------|
| `automation/image-generation/generate-images.ts` | Main CLI entry point |
| `automation/image-generation/airtable-client.ts` | Airtable API integration |
| `automation/image-generation/openrouter-client.ts` | Image generation API |
| `automation/image-generation/cost-tracker.ts` | Cost logging and reporting |
| `automation/image-generation/feedback-client.ts` | Partner feedback integration |
| `automation/image-generation/rules.ts` | Generation rules and prompt sanitization |
| `automation/image-generation/generation-log.csv` | Generation history |

---

## Keywords

image generation, images, generate images, image status, image costs, AI images, social media images, image brief, image queue, Airtable images
