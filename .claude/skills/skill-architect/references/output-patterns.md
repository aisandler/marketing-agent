# Output Patterns

Patterns for producing consistent, high-quality output within skills.

## Template Pattern

Provide templates for output format. Match strictness to requirements.

### Strict Templates (API responses, data formats)

```markdown
## Report structure

ALWAYS use this exact template:

# [Analysis Title]

## Executive summary
[One-paragraph overview of key findings]

## Key findings
- Finding 1 with supporting data
- Finding 2 with supporting data
- Finding 3 with supporting data

## Recommendations
1. Specific actionable recommendation
2. Specific actionable recommendation
```

### Flexible Templates (adaptable formats)

```markdown
## Report structure

Sensible default format (adapt as needed):

# [Analysis Title]

## Executive summary
[Overview]

## Key findings
[Adapt sections based on discoveries]

## Recommendations
[Tailor to specific context]

Adjust sections as needed for the specific analysis.
```

## Examples Pattern

For output quality that depends on seeing examples, provide input/output pairs:

```markdown
## Commit message format

Generate commit messages following these examples:

**Example 1:**
Input: Added user authentication with JWT tokens
Output:
```
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
```

**Example 2:**
Input: Fixed bug where dates displayed incorrectly
Output:
```
fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently across report generation
```

Follow this style: type(scope): brief description, then detailed explanation.
```

Examples help Claude understand desired style more clearly than descriptions alone.

## Schema Pattern

For structured data output, provide explicit schemas:

```markdown
## Output Schema

```json
{
  "title": "string (required)",
  "summary": "string (required, max 200 chars)",
  "findings": [
    {
      "category": "string",
      "detail": "string",
      "severity": "low | medium | high"
    }
  ],
  "metadata": {
    "generated_at": "ISO 8601 timestamp",
    "version": "string"
  }
}
```
```

## Before/After Pattern

For transformation tasks, show the change clearly:

```markdown
## Code Style

**Before:**
```python
def getData(x):
    return x*2
```

**After:**
```python
def get_data(value: int) -> int:
    """Double the input value."""
    return value * 2
```

Note the changes:
- snake_case function name
- Descriptive parameter name
- Type hints
- Docstring
```

## Quality Checklist Pattern

For ensuring output meets standards:

```markdown
## Output Checklist

Before finalizing, verify:
- [ ] All required sections present
- [ ] No placeholder text remaining
- [ ] Code examples tested
- [ ] Links are valid
- [ ] Formatting is consistent
```
