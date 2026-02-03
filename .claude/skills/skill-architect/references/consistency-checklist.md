# Consistency Checklist

Use this checklist before packaging a skill to ensure quality and consistency.

## Universal Checks (All Archetypes)

### Structure

- [ ] **SKILL.md exists** at the root of skill directory
- [ ] **SKILL.md under 500 lines** (split into references if larger)
- [ ] **No deeply nested references** (references link directly from SKILL.md)
- [ ] **No extraneous files** (no README.md, CHANGELOG.md, etc.)
- [ ] **Directory name matches `name` field** in frontmatter

### Frontmatter

- [ ] **`name` field present** - Hyphen-case, lowercase, max 64 characters
- [ ] **`description` field present** - Under 1024 characters
- [ ] **Description includes WHAT** - What the skill does
- [ ] **Description includes WHEN** - Specific trigger conditions
- [ ] **Description includes keywords** - Terms users would use
- [ ] **No angle brackets** in description (`<` or `>`)

### Content

- [ ] **Imperative form** throughout (e.g., "Create" not "Creates")
- [ ] **No TODO placeholders** remaining
- [ ] **All references linked** from SKILL.md with clear "when to read"
- [ ] **Code examples tested** and working
- [ ] **Dependencies documented** if scripts require packages

### Scripts (if present)

- [ ] **Scripts are executable** (`chmod +x`)
- [ ] **Scripts tested** with representative inputs
- [ ] **Scripts have usage documentation** (--help or comments)
- [ ] **Scripts handle errors** gracefully

---

## Archetype-Specific Checks

### Guidance Archetype

- [ ] **Design thinking section** - Establishes direction before implementation
- [ ] **Principles over steps** - Guidelines, not rigid procedures
- [ ] **Anti-patterns section** - Explicit "NEVER do X"
- [ ] **Craftsmanship emphasis** - Stresses quality and intentionality
- [ ] **High creative freedom** - Allows multiple valid approaches

### Toolkit Archetype

- [ ] **Requirements section** - Parameters and constraints upfront
- [ ] **Core workflow** - Primary usage pattern with code
- [ ] **Utilities documented** - Each utility has usage example
- [ ] **Concepts explained** - Domain knowledge for context
- [ ] **Dependencies listed** - `pip install` or equivalent

### Router Archetype

- [ ] **SKILL.md is minimal** - Under 50 lines ideal
- [ ] **Clear routing table** - Maps request types to files
- [ ] **Each reference self-contained** - Can stand alone
- [ ] **Fallback guidance** - What to do if no match
- [ ] **Keywords section** - For discoverability

### Document Archetype

- [ ] **Decision tree** - Routes to correct workflow
- [ ] **Quick start** - Most common operation first
- [ ] **Separate workflows** - By operation type
- [ ] **Each workflow complete** - Clear steps with code
- [ ] **Utility scripts documented** - With usage examples
- [ ] **Advanced features linked** - To reference files

### Meta Archetype

- [ ] **Phased overview** - Bird's-eye view of all phases
- [ ] **Each phase structured** - Goal, Process, Deliverable
- [ ] **Phases link to details** - Reference files for depth
- [ ] **Scaffolding scripts** - Automation for setup
- [ ] **Core principles** - Overarching concepts
- [ ] **Quick reference links** - At the end

---

## Quality Scoring

### Description Quality (0-10)

| Score | Criteria |
|-------|----------|
| 0-3 | Missing WHAT or WHEN |
| 4-6 | Has WHAT and WHEN, missing keywords |
| 7-8 | Complete with good keywords |
| 9-10 | Excellent - specific triggers, synonyms, differentiators |

### Structure Quality (0-10)

| Score | Criteria |
|-------|----------|
| 0-3 | Missing required elements |
| 4-6 | Has basics, some issues |
| 7-8 | Well-organized, follows archetype |
| 9-10 | Exemplary - clean, efficient, well-structured |

### Content Quality (0-10)

| Score | Criteria |
|-------|----------|
| 0-3 | Incomplete or untested |
| 4-6 | Functional but could improve |
| 7-8 | Comprehensive and tested |
| 9-10 | Production-ready, polished |

**Target:** 7+ on all three dimensions before packaging.

---

## Common Issues

### Low Trigger Reliability

**Symptoms:** Skill doesn't activate when expected

**Fixes:**
- Add more specific keywords to description
- Include example trigger phrases
- Add file extensions if relevant
- Include synonyms for key terms

### Context Bloat

**Symptoms:** SKILL.md too long, slow to load

**Fixes:**
- Move detailed content to references/
- Remove redundant explanations
- Use progressive disclosure
- Delete unused sections

### Inconsistent Structure

**Symptoms:** Hard to follow, missing sections

**Fixes:**
- Compare against archetype guide
- Ensure all required sections present
- Follow consistent heading hierarchy
- Add missing links to references

### Broken Scripts

**Symptoms:** Scripts fail or produce wrong output

**Fixes:**
- Test with actual inputs
- Add error handling
- Document dependencies
- Include usage examples

---

## Pre-Package Verification

Before running `package_skill.py`:

```bash
# 1. Validate structure
scripts/analyze_skill.py /path/to/skill

# 2. Check for TODOs
grep -r "TODO" /path/to/skill

# 3. Test scripts (if any)
python /path/to/skill/scripts/example.py --help

# 4. Verify line count
wc -l /path/to/skill/SKILL.md  # Should be < 500
```

If all checks pass, package the skill:

```bash
scripts/package_skill.py /path/to/skill
```
