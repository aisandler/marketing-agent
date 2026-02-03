# Meta Archetype

Skills for complex multi-phase workflows with external references and scaffolding tools.

## When to Use

- Complex processes with distinct phases
- Tasks requiring research before implementation
- Skills that create other artifacts (skills, projects, configs)
- Need external documentation or API references

**Examples:** mcp-builder, skill-creator, project scaffolding tools

## Directory Structure

```
skill-name/
├── SKILL.md           # Phased workflow overview
├── scripts/           # Scaffolding/automation tools
│   ├── init.py
│   ├── validate.py
│   └── package.py
├── references/        # Detailed phase guidance
│   ├── phase-1.md
│   ├── phase-2.md
│   └── best-practices.md
└── assets/
    └── templates/     # Starter templates
```

Meta skills have **phased workflows** with **scaffolding scripts** and **detailed reference documentation**.

## SKILL.md Structure

```markdown
---
name: my-meta-skill
description: Guide for [complex task]. Use when [triggers]. Provides
[key features] and [workflow phases] workflow.
---

# Meta Skill Title

[1-2 sentence overview of what this skill enables]

## Overview

This skill guides [complex task] through [N] phases:
1. [Phase 1 name] - [Brief description]
2. [Phase 2 name] - [Brief description]
3. [Phase 3 name] - [Brief description]

## Phase 1: [Name]

### Goal
[What this phase accomplishes]

### Process
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Deliverable
[What you have at the end of this phase]

**Detailed guidance:** See `references/phase-1.md`

## Phase 2: [Name]

### Goal
[What this phase accomplishes]

### Scripts
```bash
scripts/init.py <name> --path <output>
```

### Process
1. [Step 1]
2. [Step 2]

### Deliverable
[What you have at the end of this phase]

## Phase 3: [Name]

[Similar structure]

## Core Principles

### [Principle 1]
[Key concept that applies throughout]

### [Principle 2]
[Key concept that applies throughout]

## Script Reference

### init.py
```bash
scripts/init.py <name> --path <output>
```
[What it does]

### validate.py
```bash
scripts/validate.py <path>
```
[What it does]

## Quick Reference

- **[Topic 1]**: `references/topic-1.md`
- **[Topic 2]**: `references/topic-2.md`
```

## Key Patterns

### Phased Overview First

Start with a bird's-eye view of all phases:

```markdown
## Overview

This skill guides MCP server development through 4 phases:
1. **Deep Research** - Understand API and design tools
2. **Architecture** - Design server structure and tool interfaces
3. **Implementation** - Build the server with testing
4. **Refinement** - Optimize and document
```

### Each Phase is Self-Contained

Structure each phase consistently:

```markdown
## Phase 2: Architecture

### Goal
Design the server structure and tool interfaces before coding.

### Process
1. Define the tools your server will expose
2. Design input/output schemas for each tool
3. Plan error handling and edge cases
4. Create implementation outline

### Deliverable
Architectural document with tool definitions and schemas.

**Detailed guidance:** See `references/architecture.md`
```

### Scripts for Automation

Include scaffolding scripts that handle repetitive setup:

```markdown
## Scripts

### init_skill.py
Creates new skill from template:
```bash
scripts/init_skill.py my-skill --path ./output
```

Creates:
- SKILL.md with proper frontmatter
- scripts/, references/, assets/ directories
- Example files that can be customized
```

### Core Principles Section

Capture overarching concepts that apply across phases:

```markdown
## Core Principles

### Conciseness is Key
The context window is shared. Only add information Claude
doesn't already have. Challenge each piece: "Does this
justify its token cost?"

### Progressive Disclosure
Three-level loading: metadata → body → bundled resources.
Keep SKILL.md under 500 lines.
```

### Quick Reference Links

End with links to detailed reference files:

```markdown
## Quick Reference

- **Best practices**: `references/best-practices.md`
- **Python guide**: `references/python-guide.md`
- **TypeScript guide**: `references/typescript-guide.md`
- **Evaluation criteria**: `references/evaluation.md`
```

### Templates for Starters

Provide templates in assets/ for quick starts:

```markdown
## Templates

Use templates in `assets/templates/` for quick starts:
- `starter-project/` - Minimal working project
- `full-example/` - Comprehensive example
```

## Description Pattern

```
Guide for [complex task]. Use when [triggers]. Provides [key features]
and [N]-phase workflow for [outcome].
```

**Example:**
```yaml
description: Guide for creating high-quality MCP servers that enable
LLMs to interact with external services. Use when building MCP servers
to integrate external APIs or services. Provides 4-phase workflow with
best practices for both Python and TypeScript.
```

## Consistency Checklist

- [ ] Phased overview at the top
- [ ] Each phase has Goal, Process, and Deliverable
- [ ] Phases link to detailed reference files
- [ ] Scaffolding scripts documented
- [ ] Core principles section for overarching concepts
- [ ] Quick reference links at the end
- [ ] Templates available in assets/ if applicable
- [ ] Description mentions the number of phases
