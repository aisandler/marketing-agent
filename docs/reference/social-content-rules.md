# Social Content Rules

**Canonical reference for social content creation standards.**

---

## The Golden Rules

### 1. One Record = One Post
Each Airtable record represents a single post from a single account. No multi-poster records.

### 2. Voice Must Match Account
Every post must reflect the voice profile of its Posting Account. Configure voice profiles during `/onboard`.

### 3. Quality Filter
Content must pass the audience sophistication test:
> "Would your target audience find this valuable?"

### 4. Posting Schedule
Posts are scheduled according to your configured schedule (typically weekdays).

### 5. Content Bank First
Check `content/social/content-bank.md` before creating new topics. Update it when themes are used.

### 6. Tie to Competitive Win Themes
Every post should highlight a competitive advantage. Add to Competitive Insight field.

---

## Competitive Win Themes

Configure your win themes during `/onboard`. Example structure:

| Theme | Against | Use When |
|-------|---------|----------|
| **WIN THEME 1** | Large competitors | Service + sophistication combined |
| **WIN THEME 2** | ALL competitors | Unique offering (UNIQUE) |
| **WIN THEME 3** | Volume operations | Relationship focus |
| **WIN THEME 4** | Single-service competitors | Integrated expertise (UNIQUE) |
| **WIN THEME 5** | Traditional competitors | Modern capabilities |

**Full reference:** `docs/reference/competitive-win-themes.md`

---

## Posting Cadence

Configure during `/onboard`. Example:

| Account | Frequency | Platforms |
|---------|-----------|-----------|
| Company | Daily | LinkedIn |
| Partner 1 | Daily | LinkedIn + Instagram |
| Partner 2 | 2-3x/week | LinkedIn |
| Partner 3 | 3x/week | LinkedIn |

### Repost Pattern
Partner posts original → Company reposts 24-48 hours later using platform native repost feature.

---

## Handling Reposts

Reposts are company amplifications of partner content. They use the platform's native repost feature (not duplicate copy).

### Repost Record Setup
| Field | Value |
|-------|-------|
| Post Type | "Repost" |
| Copy Status | "Repost" |
| Copy | (empty) |
| Source Post | Link to original record |

### What Makes a Repost Clear
1. **Post Type = "Repost"** - Identifies it as amplification
2. **Copy Status = "Repost"** - Distinguishes from Draft/Approved workflow
3. **Copy field empty** - No duplicate content needed
4. **Source Post linked** - Shows which original it amplifies

### Repost Timing
- Company reposts partner content 24-48 hours after original
- Same topic name as original (for easy identification)

---

## Required Fields (Airtable)

### For Original Posts
- Date
- Post Topic
- Posting Account
- Platform
- Copy (full post text)
- Copy Status (Draft → Approved)
- Post Status
- Post Type = "Original"
- Content Pillar
- Focus
- **Competitive Insight** (win theme + strategic context)

### For Reposts
- Date (24-48 hours after original)
- Post Topic (same as original)
- Posting Account = Company account
- Platform
- Copy = (empty)
- Copy Status = "Repost"
- Post Type = "Repost"
- Source Post = link to original record

### Visual Content Posts Also Need
- Needs Asset = true

---

## Copy Standards

### LinkedIn Posts
- **Length:** 150-300 words
- **Structure:** Hook → Insight → Close
- **First 2 lines:** Must stop the scroll (shows in preview)
- **Paragraphs:** 1-2 sentences each
- **Required:** Any disclaimers your industry requires

### Instagram Posts
- **Length:** Shorter than LinkedIn
- **Style:** Visual-first, punchier
- **Required:** Flag for asset creation

---

## Content Pillars

Configure during `/onboard`. Example:

| Pillar | Definition |
|--------|------------|
| **Customer Empowerment** | Partnership, support, recognition |
| **Industry Expertise** | Insights, market knowledge |
| **Responsive Service** | Direct access, hands-on |
| **Success Stories** | Celebrating achievements |

---

## Quality Filter

### Test
Before posting, ask:
> "Would the target audience find this valuable, or would they think 'who doesn't know this?'"

### Fails (Don't Post)
- Basic terminology
- Generic advice
- Obvious checklists
- Information everyone knows

### Passes (Post It)
- Specific insights from experience
- Edge cases and complications
- Details the audience can use
- Unique perspectives

---

## Forbidden

- Posts outside configured schedule
- Emojis (unless part of brand voice)
- Made-up testimonials
- Mixed messaging across focus areas
- Basic advice that fails quality filter
- Jargon without translation

---

## Workflow

```
1. Content Bank → Check for AVAILABLE themes
2. Voice Profile → Match to Posting Account
3. Quality Filter → Apply for content
4. Generate Copy → Follow platform structure
5. Airtable → Create record with all required fields
6. Content Bank → Update theme status and record ID
```

---

## File Locations

| Purpose | File |
|---------|------|
| Content themes | `content/social/content-bank.md` |
| Full workflow skill | `.claude/skills/social-content-workflow.md` |
| Partner voice template | `expansions/partner-voice-template/` |
| Brand architecture | `client-context/brand/brand-architecture-framework.md` |
| Voice guide | `client-context/brand/voice-and-tone-guide.md` |
| Airtable schema | `docs/reference/technical/airtable-schema-template.md` |

---

*Configure these rules for your specific brand during `/onboard`.*
