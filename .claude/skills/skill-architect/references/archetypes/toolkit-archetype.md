# Toolkit Archetype

Technical skills providing executable utilities, code examples, and domain knowledge.

## When to Use

- Technical tools with reusable code
- Skills that wrap libraries or APIs
- Tasks requiring specific parameters and constraints
- Outputs that need validation or optimization

**Examples:** slack-gif-creator, webapp-testing, mcp-builder

## Directory Structure

```
skill-name/
├── SKILL.md           # Requirements + Workflow + Utilities reference
├── core/              # OR scripts/ - Executable utilities
│   ├── main_utility.py
│   ├── helpers.py
│   └── validators.py
├── references/        # Optional detailed documentation
└── templates/         # Optional code templates
```

Toolkit skills have **substantial executable code** alongside documentation.

## SKILL.md Structure

```markdown
---
name: my-toolkit-skill
description: Knowledge and utilities for [domain]. Provides [key features].
Use when users request [specific triggers].
---

# Skill Title

A toolkit providing utilities and knowledge for [domain].

## Requirements

**Parameters:**
- [Key constraint 1]
- [Key constraint 2]

## Core Workflow

```python
from core.main_utility import MainClass

# 1. Initialize
tool = MainClass(param1=value, param2=value)

# 2. Process
for item in items:
    tool.process(item)

# 3. Output
tool.save('output.ext', optimize=True)
```

## Available Utilities

### MainUtility (`core/main_utility.py`)
[Brief description]
```python
from core.main_utility import MainClass
tool = MainClass(width=128, height=128)
tool.add_item(item)
tool.save('output.ext')
```

### Validators (`core/validators.py`)
[Brief description]
```python
from core.validators import validate, is_ready
passes, info = validate('file.ext', verbose=True)
```

### Helpers (`core/helpers.py`)
[Brief description with usage examples]

## Concepts

### [Domain Concept 1]
[Explanation with code examples]

### [Domain Concept 2]
[Explanation with code examples]

## Optimization

[When asked to optimize, use these strategies:]
1. [Strategy 1]
2. [Strategy 2]

## Dependencies

```bash
pip install package1 package2
```
```

## Key Patterns

### Requirements Section First

Start with constraints and parameters:

```markdown
## Slack Requirements

**Dimensions:**
- Emoji GIFs: 128x128 (recommended)
- Message GIFs: 480x480

**Parameters:**
- FPS: 10-30 (lower is smaller file size)
- Colors: 48-128 (fewer = smaller file size)
```

### Core Workflow with Code

Show the primary usage pattern immediately:

```markdown
## Core Workflow

```python
from core.gif_builder import GIFBuilder

# 1. Create builder
builder = GIFBuilder(width=128, height=128, fps=10)

# 2. Generate frames
for i in range(12):
    frame = create_frame(i)
    builder.add_frame(frame)

# 3. Save with optimization
builder.save('output.gif', num_colors=48)
```
```

### Utility Reference with Examples

Document each utility with usage examples:

```markdown
### GIFBuilder (`core/gif_builder.py`)
Assembles frames and optimizes for Slack:
```python
builder = GIFBuilder(width=128, height=128, fps=10)
builder.add_frame(frame)
builder.save('out.gif', num_colors=48)
```
```

### Concepts Section

Explain domain knowledge needed to use the toolkit:

```markdown
## Animation Concepts

### Bounce
Object falls and bounces:
- Use `interpolate()` with `easing='bounce_out'` for landing
- Apply gravity by increasing y velocity each frame
```

### Dependencies Section

Always include required packages:

```markdown
## Dependencies

```bash
pip install pillow imageio numpy
```
```

## Description Pattern

```
Knowledge and utilities for [domain]. Provides [key features].
Use when users request [specific triggers].
```

**Example:**
```yaml
description: Knowledge and utilities for creating animated GIFs optimized
for Slack. Provides constraints, validation tools, and animation concepts.
Use when users request animated GIFs for Slack like "make me a GIF of
X doing Y for Slack."
```

## Consistency Checklist

- [ ] Requirements/constraints section at the top
- [ ] Core workflow with code example
- [ ] All utilities documented with usage examples
- [ ] Concepts section for domain knowledge
- [ ] Dependencies listed with install command
- [ ] Scripts in core/ or scripts/ are tested and working
- [ ] Description mentions utilities and specific triggers
