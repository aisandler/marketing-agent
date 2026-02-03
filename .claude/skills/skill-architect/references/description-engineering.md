# Description Engineering

The `description` field in YAML frontmatter is the **primary trigger mechanism** for your skill. Claude reads descriptions to determine when to use each skill. A well-crafted description is critical for reliable skill activation.

## Anatomy of an Effective Description

Every description should include three components:

1. **WHAT** - What the skill does (capabilities)
2. **WHEN** - When to use it (trigger conditions)
3. **KEYWORDS** - Specific terms that match user requests

### Structure Pattern

```
[What it does]. [When to use it - specific triggers]. [Optional: quality promise or unique value].
```

## Description Patterns by Archetype

### Guidance Archetype

```yaml
description: Create [distinctive output type]. Use when user asks to
[specific triggers]. Generates [quality descriptor] that avoids
[anti-patterns].
```

**Example (frontend-design):**
```yaml
description: Create distinctive, production-grade frontend interfaces
with high design quality. Use this skill when the user asks to build
web components, pages, or applications. Generates creative, polished
code that avoids generic AI aesthetics.
```

**Key elements:**
- "distinctive" / "production-grade" = quality promise
- "web components, pages, or applications" = specific triggers
- "avoids generic AI aesthetics" = differentiator

### Toolkit Archetype

```yaml
description: Knowledge and utilities for [domain]. Provides [key features].
Use when users request [specific triggers like "X for Y"].
```

**Example (slack-gif-creator):**
```yaml
description: Knowledge and utilities for creating animated GIFs optimized
for Slack. Provides constraints, validation tools, and animation concepts.
Use when users request animated GIFs for Slack like "make me a GIF of
X doing Y for Slack."
```

**Key elements:**
- "Knowledge and utilities" = capability type
- "constraints, validation tools, animation concepts" = specific features
- "make me a GIF of X doing Y for Slack" = example trigger phrase

### Router Archetype

```yaml
description: A set of resources for [domain]. Use when asked to
[list all supported types from reference files].
```

**Example (internal-comms):**
```yaml
description: A set of resources to help write internal communications,
using company formats. Use when asked to write status reports, leadership
updates, 3P updates, company newsletters, FAQs, incident reports, or
project updates.
```

**Key elements:**
- Lists ALL supported types (each maps to a reference file)
- Specific document types as keywords

### Document Archetype

```yaml
description: Comprehensive [format] processing for [operations].
Use when working with [format] files for: (1) [Op1], (2) [Op2],
(3) [Op3], or any other [format] tasks.
```

**Example (docx):**
```yaml
description: Comprehensive document creation, editing, and analysis with
support for tracked changes, comments, formatting preservation, and text
extraction. Use when working with professional documents (.docx files)
for: (1) Creating new documents, (2) Modifying or editing content,
(3) Working with tracked changes, (4) Adding comments, or any other
document tasks.
```

**Key elements:**
- Numbered list of operations
- File extension in parentheses (.docx)
- "or any other [format] tasks" = catch-all

### Meta Archetype

```yaml
description: Guide for [complex task]. Use when [triggers].
Provides [key features] and [N]-phase workflow.
```

**Example (mcp-builder):**
```yaml
description: Guide for creating high-quality MCP servers that enable
LLMs to interact with external services. Use when building MCP servers
to integrate external APIs or services. Provides 4-phase workflow with
best practices for both Python and TypeScript.
```

**Key elements:**
- "Guide for" = indicates meta/process skill
- Number of phases mentioned
- Technology variants listed (Python, TypeScript)

---

## Keyword Strategy

### Include Explicit Triggers

Think about what users will literally type:

| User Might Say | Keywords to Include |
|----------------|---------------------|
| "create a GIF" | GIF, animated, create |
| "make a dashboard" | dashboard, build, create |
| "write a status report" | status report, write |
| "edit this PDF" | PDF, edit, modify |

### Include Synonyms

Users describe the same thing different ways:

```yaml
# Good - includes synonyms
description: Create, edit, and modify Word documents...

# Missing synonyms
description: Create Word documents...  # misses "edit" requests
```

### Include File Extensions

For document skills, include the extension:

```yaml
description: ...working with spreadsheets (.xlsx, .xlsm, .csv files)...
```

### Include Action Verbs

Match common request patterns:

- Create, build, make, generate
- Edit, modify, update, change
- Convert, transform, export
- Extract, read, parse, analyze
- Merge, combine, split, separate

---

## Common Mistakes

### Too Vague

```yaml
# Bad - too vague
description: Helps with documents.

# Good - specific
description: Create and edit Word documents (.docx) with support
for formatting, tracked changes, and comments.
```

### Missing Triggers

```yaml
# Bad - no "when to use" information
description: A toolkit for PDF manipulation.

# Good - includes triggers
description: A toolkit for PDF manipulation. Use when users need
to merge, split, rotate, extract text from, or fill forms in PDFs.
```

### Too Long

Descriptions should be under 1024 characters. If you need more, you're probably including body content that belongs in SKILL.md.

### Body Duplicates Description

Don't repeat "When to use" in the SKILL.md body - the body is only loaded AFTER the skill triggers, so it's useless for triggering.

---

## Testing Your Description

### Mental Simulation

For each trigger scenario, ask: "Would this description match?"

```
User: "Help me create a presentation"
Does description mention: presentations, slides, .pptx, create?
```

### Keyword Coverage Check

List 5-10 ways users might request this skill. Verify keywords appear:

1. "make a GIF for Slack" → GIF ✓, Slack ✓
2. "animated emoji" → animated ✓, emoji ?
3. "create slack reaction" → slack ✓, reaction ?

Add missing keywords or synonyms.

### Differentiation Check

If multiple skills could match, ensure your description is more specific for your use case:

```yaml
# Might conflict with general image skill
description: Create images...

# More specific - won't conflict
description: Create animated GIFs optimized for Slack emoji...
```

---

## Quick Reference

**Length:** 50-200 words (under 1024 characters)

**Must include:**
- What it does (capabilities)
- When to use it (triggers)
- Specific keywords users might use

**Format:**
```
[Capabilities]. Use when [triggers]. [Optional: unique value].
```

**Test by asking:** "If a user said X, would this description match?"
