# Workflow Patterns

Patterns for organizing multi-step processes within skills.

## Sequential Workflows

For complex tasks, break operations into clear, sequential steps. Provide an overview at the beginning:

```markdown
Filling a PDF form involves these steps:

1. Analyze the form (run analyze_form.py)
2. Create field mapping (edit fields.json)
3. Validate mapping (run validate_fields.py)
4. Fill the form (run fill_form.py)
5. Verify output (run verify_output.py)
```

## Conditional Workflows

For tasks with branching logic, guide through decision points:

```markdown
1. Determine the modification type:
   **Creating new content?** → Follow "Creation workflow" below
   **Editing existing content?** → Follow "Editing workflow" below

2. Creation workflow: [steps]
3. Editing workflow: [steps]
```

## Decision Trees

For complex branching, use visual decision trees:

```markdown
## Workflow Decision Tree

```
What do you need to do?
├─ Read/Extract content → "Reading Workflow"
├─ Create new document → "Creation Workflow"
├─ Edit existing document:
│   ├─ Simple text changes → "Basic Editing"
│   └─ Complex modifications → "Advanced Editing"
└─ Convert formats → "Conversion Workflow"
```
```

## Phased Workflows

For complex multi-stage processes, organize into distinct phases:

```markdown
## Overview

This process has 4 phases:
1. **Research** - Understand the domain
2. **Design** - Plan the implementation
3. **Build** - Execute the plan
4. **Refine** - Iterate and improve

## Phase 1: Research

### Goal
[What this phase accomplishes]

### Process
1. [Step 1]
2. [Step 2]

### Deliverable
[What you have at the end]
```

## Router Workflows

For skills that route to different reference files:

```markdown
## How to use this skill

1. **Identify the type** from the request
2. **Load the appropriate file**:
   - `examples/type-a.md` - For [description]
   - `examples/type-b.md` - For [description]
3. **Follow the instructions** in that file

If no type matches, ask for clarification.
```

## Quick Start Pattern

Always provide immediate value for the most common case:

```markdown
## Quick Start

[Most common operation in 3-5 lines of code]

```python
from library import Tool
result = Tool.process('input')
print(result)
```

For more options, see workflows below.
```
