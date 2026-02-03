---
name: skill-architect
description: Advanced guide for creating consistent, high-quality skills across all skill types. Use when creating new skills or improving existing ones. Provides 5 skill archetypes with templates, description engineering patterns, consistency validation, and a 7-step creation workflow. Recommended for any skill creation or improvement task.
license: Complete terms in LICENSE.txt
---

# Skill Architect

Create effective, consistent skills using archetypes, templates, and proven patterns.

## Skill Archetypes

Choose the archetype that matches your skill's purpose:

| Archetype | Use When | Examples | Key Pattern |
|-----------|----------|----------|-------------|
| **Guidance** | Creative/philosophical tasks with high freedom | frontend-design, algorithmic-art | Philosophy + Guidelines + Anti-patterns |
| **Toolkit** | Technical tools with executable utilities | slack-gif-creator, webapp-testing | Requirements + Workflow + Utilities + Concepts |
| **Router** | Multiple reference files by use case | internal-comms, theme-factory | Minimal SKILL.md + examples/ routing |
| **Document** | File format processing | docx, pdf, pptx, xlsx | Decision tree + Multiple workflows + Scripts |
| **Meta** | Complex multi-phase workflows | mcp-builder, skill-creator | Phased workflow + External references |

**Detailed guides:** See `references/archetypes/<archetype>-archetype.md` for comprehensive patterns.

## 7-Step Creation Process

### Step 1: Understand with Concrete Examples

Gather concrete examples of how the skill will be used:
- "What should this skill support?"
- "Can you give examples of how it would be used?"
- "What would a user say that should trigger this skill?"

### Step 2: Identify the Archetype

Match your skill to an archetype using this decision tree:

```
Is this primarily creative/philosophical work?
├─ Yes → GUIDANCE archetype
└─ No → Does it provide executable utilities?
         ├─ Yes → TOOLKIT archetype
         └─ No → Does it route to different reference files?
                  ├─ Yes → ROUTER archetype
                  └─ No → Does it process document formats?
                           ├─ Yes → DOCUMENT archetype
                           └─ No → META archetype
```

### Step 3: Plan Reusable Contents

For each concrete example, identify what would be helpful:
- **Scripts**: Code that's rewritten repeatedly or needs deterministic reliability
- **References**: Documentation Claude should load while working
- **Assets**: Templates, images, fonts used in output (not loaded into context)

### Step 4: Initialize the Skill

```bash
scripts/init_skill.py <skill-name> --path <output-directory> --archetype <archetype>
```

Archetypes: `guidance`, `toolkit`, `router`, `document`, `meta`

The script creates archetype-specific structure with appropriate templates.

### Step 5: Edit the Skill

**Start with bundled resources** (scripts, references, assets) before writing SKILL.md.

**Consult archetype guides** in `references/archetypes/` for proven patterns.

**Write effective descriptions** - See `references/description-engineering.md`:
- Include WHAT the skill does
- Include WHEN to use it (specific triggers)
- Include keywords for discoverability

**Use imperative form** throughout (e.g., "Create document" not "Creates document").

### Step 6: Validate Consistency

Run the consistency checklist before packaging:

```bash
scripts/analyze_skill.py <path/to/skill>
```

Quick self-check:
- [ ] Description includes what + when + triggers
- [ ] SKILL.md under 500 lines
- [ ] No TODO placeholders remaining
- [ ] Scripts tested and working
- [ ] References properly linked from SKILL.md

See `references/consistency-checklist.md` for complete checklist.

### Step 7: Package and Iterate

```bash
scripts/package_skill.py <path/to/skill-folder>
```

After packaging, use the skill on real tasks and iterate based on performance.

---

## Core Principles

### Conciseness is Key

The context window is shared across system prompt, conversation, other skills, and user requests. Only add information Claude doesn't already have. Challenge each piece: "Does this justify its token cost?"

### Set Appropriate Freedom

- **High freedom** (text instructions): Multiple valid approaches, context-dependent decisions
- **Medium freedom** (pseudocode/parameterized): Preferred pattern exists, some variation acceptable
- **Low freedom** (specific scripts): Fragile operations, consistency critical

### Progressive Disclosure

Three-level loading system:
1. **Metadata** (name + description) - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed (unlimited, scripts can execute without loading)

Keep SKILL.md under 500 lines. Split into reference files when approaching this limit.

---

## Skill Anatomy

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/      - Executable code (Python/Bash)
    ├── references/   - Documentation loaded as needed
    └── assets/       - Files for output (templates, images, fonts)
```

### SKILL.md Requirements

**Frontmatter** (YAML):
- `name`: Hyphen-case identifier (e.g., `my-skill`)
- `description`: Primary trigger mechanism - include what + when + specific triggers

**Body** (Markdown):
- Instructions for using the skill
- References to bundled resources
- Keep under 500 lines

### What NOT to Include

Do NOT create extraneous files:
- README.md, INSTALLATION_GUIDE.md, QUICK_REFERENCE.md, CHANGELOG.md

Skills contain only what Claude needs to do the job.

---

## Script Reference

### init_skill.py
```bash
scripts/init_skill.py <skill-name> --path <output-dir> [--archetype <type>]
```
Creates new skill with archetype-specific template.

### package_skill.py
```bash
scripts/package_skill.py <path/to/skill-folder> [output-directory]
```
Validates and packages skill into distributable .skill file.

### analyze_skill.py
```bash
scripts/analyze_skill.py <path/to/skill>
```
Analyzes skill against archetype patterns, suggests improvements.

---

## Quick Reference

**Archetype guides:** `references/archetypes/`
**Description patterns:** `references/description-engineering.md`
**Quality checklist:** `references/consistency-checklist.md`
**Workflow patterns:** `references/workflows.md`
**Output patterns:** `references/output-patterns.md`
