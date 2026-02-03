---
name: {skill_name}
description: Knowledge and utilities for [domain]. Provides [key features]. Use when users request [specific triggers].
---

# {Skill Title}

A toolkit providing utilities and knowledge for [domain].

## Requirements

**Parameters:**
- [TODO: Key constraint or parameter]
- [TODO: Another constraint]

**Limits:**
- [TODO: Size, performance, or other limits]

## Core Workflow

```python
from core.main_utility import MainClass

# 1. Initialize
tool = MainClass(param1=value, param2=value)

# 2. Process
for item in items:
    result = tool.process(item)

# 3. Output
tool.save('output.ext', optimize=True)
```

## Available Utilities

### MainUtility (`core/main_utility.py`)

[TODO: Brief description of what this utility does]

```python
from core.main_utility import MainClass

tool = MainClass(width=128, height=128)
tool.add_item(item)
tool.save('output.ext')
```

### Validators (`core/validators.py`)

[TODO: Validation utilities]

```python
from core.validators import validate, is_ready

passes, info = validate('file.ext', verbose=True)
if is_ready('file.ext'):
    print("Ready!")
```

### Helpers (`core/helpers.py`)

[TODO: Helper functions]

```python
from core.helpers import helper_function

result = helper_function(input_data)
```

## Concepts

### [Domain Concept 1]

[TODO: Explain key domain concept with code example]

### [Domain Concept 2]

[TODO: Explain another concept]

## Optimization

When asked to optimize, use these strategies:

1. [TODO: Optimization strategy 1]
2. [TODO: Optimization strategy 2]
3. [TODO: Optimization strategy 3]

## Dependencies

```bash
pip install [TODO: required packages]
```
