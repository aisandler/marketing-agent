# Router Archetype

Minimal SKILL.md that routes to specific reference files based on use case.

## When to Use

- Multiple distinct use cases with different guidance
- Skill supports various formats or types
- Each use case has substantial documentation
- Want to minimize context usage by loading only relevant content

**Examples:** internal-comms, theme-factory

## Directory Structure

```
skill-name/
├── SKILL.md           # Minimal - just routing logic
├── examples/          # OR references/
│   ├── type-a.md
│   ├── type-b.md
│   └── type-c.md
└── assets/            # Optional shared assets
```

Router skills have a **very small SKILL.md** (often under 50 lines) with detailed content in reference files.

## SKILL.md Structure

```markdown
---
name: my-router-skill
description: A set of resources to help with [domain]. Use when asked to
[specific triggers like type1, type2, type3, etc.].
---

## When to use this skill

To [domain task], use this skill for:
- [Use case 1]
- [Use case 2]
- [Use case 3]

## How to use this skill

1. **Identify the type** from the request
2. **Load the appropriate file** from `examples/`:
   - `examples/type-a.md` - For [description]
   - `examples/type-b.md` - For [description]
   - `examples/type-c.md` - For [description]
3. **Follow the instructions** in that file

If the request doesn't match any existing type, ask for clarification.

## Keywords

[comma-separated keywords for discoverability]
```

## Key Patterns

### Minimal SKILL.md

Keep SKILL.md extremely concise - just routing:

```markdown
## How to use this skill

1. **Identify the communication type** from the request
2. **Load the appropriate guideline file** from `examples/`:
   - `examples/3p-updates.md` - For Progress/Plans/Problems updates
   - `examples/company-newsletter.md` - For company-wide newsletters
   - `examples/faq-answers.md` - For answering frequently asked questions
3. **Follow the specific instructions** in that file
```

### Clear Routing Table

Make it obvious which file to load:

```markdown
| Request Type | Load This File |
|--------------|----------------|
| Status report | `examples/status-report.md` |
| Newsletter | `examples/newsletter.md` |
| FAQ response | `examples/faq.md` |
```

### Self-Contained Reference Files

Each reference file should be complete and standalone:

```markdown
# 3P Updates

## Format

Progress/Plans/Problems updates follow this structure:

### Progress
[What was accomplished]

### Plans
[What's coming next]

### Problems
[Blockers or concerns]

## Tone

- Concise and scannable
- Focus on outcomes, not activities
- Be specific about blockers

## Example

[Complete example of a good 3P update]
```

### Keywords Section

Add keywords for better trigger matching:

```markdown
## Keywords

3P updates, company newsletter, weekly update, FAQs, internal comms
```

### Fallback Guidance

Handle cases that don't match:

```markdown
If the communication type doesn't match any existing guideline,
ask for clarification or more context about the desired format.
```

## Description Pattern

```
A set of resources to help with [domain]. Use when asked to
[list of specific triggers matching the reference files].
```

**Example:**
```yaml
description: A set of resources to help write internal communications,
using company formats. Use when asked to write status reports,
leadership updates, 3P updates, company newsletters, FAQs,
incident reports, or project updates.
```

## Consistency Checklist

- [ ] SKILL.md is minimal (under 50 lines ideal)
- [ ] Clear routing table or list
- [ ] Each reference file is self-contained
- [ ] Fallback for unmatched cases
- [ ] Keywords section for discoverability
- [ ] Description lists all supported types
- [ ] Reference files follow consistent format
