# Guidance Archetype

Philosophy-first skills for creative and philosophical tasks with high freedom.

## When to Use

- Creative work requiring aesthetic judgment
- Design tasks with multiple valid approaches
- Tasks where quality comes from understanding principles, not following steps
- Outputs that should be distinctive and avoid generic patterns

**Examples:** frontend-design, algorithmic-art, canvas-design

## Directory Structure

```
skill-name/
├── SKILL.md           # Philosophy + Guidelines + Anti-patterns
├── references/        # Optional detailed guides
└── assets/            # Optional templates or resources
```

Guidance skills are typically **SKILL.md-heavy** with minimal scripts. The skill provides thinking frameworks, not automation.

## SKILL.md Structure

```markdown
---
name: my-guidance-skill
description: Create [distinctive output]. Use when user asks to [triggers].
Generates [output type] that avoids [anti-patterns].
---

# Skill Title

[1-2 sentence overview of what this skill enables]

## Design Thinking

Before implementation, understand the context:
- **Purpose**: What problem does this solve? Who uses it?
- **Tone/Direction**: What aesthetic or philosophical direction to take?
- **Constraints**: Technical or contextual requirements?
- **Differentiation**: What makes this memorable/distinctive?

## Guidelines

[Core principles for high-quality output]

### [Aspect 1: e.g., Typography]
[Specific guidance with examples]

### [Aspect 2: e.g., Color & Theme]
[Specific guidance with examples]

## Anti-Patterns

NEVER:
- [Specific thing to avoid]
- [Another thing to avoid]

## Examples

[Optional: Show good vs. bad examples]
```

## Key Patterns

### Philosophy Before Implementation

Always establish conceptual direction before execution:

```markdown
## Design Thinking

Before coding, commit to a BOLD aesthetic direction:
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos,
  retro-futuristic, organic/natural, luxury/refined...
- **Differentiation**: What's the one thing someone will remember?
```

### Strong Anti-Patterns Section

Be explicit about what to avoid:

```markdown
## Anti-Patterns

NEVER use generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial)
- Cliched color schemes (purple gradients on white)
- Predictable layouts and component patterns
```

### Guidelines Over Steps

Provide principles, not procedures:

```markdown
## Typography Guidelines

- Choose fonts that are beautiful, unique, and interesting
- Avoid generic fonts; opt for distinctive choices
- Pair a distinctive display font with a refined body font
```

### Emphasis on Craftsmanship

Repeatedly stress quality and intentionality:

```markdown
Remember: Claude is capable of extraordinary creative work.
Don't hold back. Commit fully to a distinctive vision.
```

## Description Pattern

```
Create [distinctive output type]. Use when user asks to [specific triggers].
Generates [output quality] that avoids [anti-patterns].
```

**Example:**
```yaml
description: Create distinctive, production-grade frontend interfaces with
high design quality. Use this skill when the user asks to build web
components, pages, or applications. Generates creative, polished code
that avoids generic AI aesthetics.
```

## Consistency Checklist

- [ ] Establishes philosophical/aesthetic direction before implementation
- [ ] Provides principles, not just steps
- [ ] Includes explicit anti-patterns section
- [ ] Emphasizes craftsmanship and quality
- [ ] Allows high creative freedom
- [ ] Description mentions distinctive output and avoidance of generic patterns
