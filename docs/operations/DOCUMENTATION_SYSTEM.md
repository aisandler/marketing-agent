# Documentation System

**Version**: 2.0 (Consolidated)
**Last Updated**: 2025-10-20
**Purpose**: Complete reference for documentation organization, tracking, and maintenance

---

## Quick Reference

### Essential Documentation Principles
1. **Use descriptive names** that clearly indicate content
2. **Follow category structure** for consistent organization
3. **Maintain documentation** with regular reviews
4. **Preserve history** through git and archival practices

### Common Tasks
- **Creating documents**: Use templates, follow naming conventions, place in correct category
- **Finding documents**: Check category structure in this guide or use grep/find commands
- **Updating documents**: Modify content, update timestamps, commit changes
- **Archiving documents**: Move to docs/archive/ with clear subdirectory organization

---

## Documentation Categories

### Primary Structure

```
docs/
├── SYSTEM_GUIDE.md              # Primary system reference
├── IMPLEMENTATION_GUIDE.md      # Setup and configuration
├── strategic-pathways.md        # CMO strategic reference
│
├── agents/                      # Agent capabilities
├── operations/                  # Operational documentation
├── reference/                   # User and technical guides
│   ├── user-guides/
│   └── technical/
├── strategy/                    # Strategic planning docs
├── templates/                   # Active templates
└── archive/                     # Historical documentation
    ├── reorganizations/
    ├── transitions/
    ├── workflows-sept-2025/
    └── implementation-history/
```

### Brand-Specific Directories (Gitignored on Main)

```
client-brand/                    # User-accessible brand files
├── current/                     # Living brand guidelines
├── exports/                     # Portable brand documents
└── history/                     # Brand evolution

client-context/                  # Internal brand architecture
├── business/                    # Company profiles
├── brand/                       # Messaging framework
├── keywords/                    # SEO strategy
└── competitors/                 # Competitive intelligence

content/                         # Generated content
strategic-output/                # Strategic planning output
analytics/                       # Performance data
```

---

## Category Definitions

### agents/
**Purpose**: Agent capability documentation and coordination patterns

**Contains**:
- Agent registry and inventory
- Coordination playbooks
- Agent implementation guides

**Examples**:
- `AGENT_REGISTRY.md`
- `AGENT_INVENTORY_MATRIX.md`
- `coordination-patterns.md`

---

### operations/
**Purpose**: Internal processes, standards, and operational documentation

**Contains**:
- Process workflows
- Documentation standards
- Quality assurance procedures
- Testing protocols

**Examples**:
- `WORKFLOW_REFERENCE.md`
- `DOCUMENTATION_SYSTEM.md` (this file)
- `standards/DOCUMENTATION_STANDARDS.md`
- `testing/WORKFLOW_TESTING_GUIDE.md`

---

### reference/
**Purpose**: User guides and technical reference documentation

**Subdirectories**:

**reference/user-guides/**
- Dashboard usage
- Content generation workflows
- Startup procedures
- User-facing functionality

**reference/technical/**
- Planning systems
- Analytics and tracking
- Integration guides
- Debugging and troubleshooting

---

### strategy/
**Purpose**: Strategic planning and improvement documentation

**Contains**:
- Content strategy
- Scaling guides
- Improvement plans
- Context optimization

---

### templates/
**Purpose**: Active templates for campaigns, strategies, and content

**Contains**:
- Campaign strategy templates
- Strategic plan templates
- Content templates
- Brand guideline templates

---

### archive/
**Purpose**: Historical documentation, completed projects, past reorganizations

**Subdirectories**:
- `reorganizations/` - Documentation organization history
- `transitions/` - System transition guides
- `workflows-sept-2025/` - Detailed workflow documentation from Sept 2025
- `implementation-history/` - System implementation milestones

---

## File Naming Conventions

### General Rules
1. Use underscores `_` instead of spaces
2. Include dates for time-sensitive documents: `YYYY-MM-DD` or `YYYY`
3. Use UPPER_CASE for major reference documents
4. Use lower_case for supporting files and templates
5. Be descriptive and specific

### Naming Patterns by Category

**System Guides**: `SYSTEM_GUIDE.md`, `IMPLEMENTATION_GUIDE.md`
**Operations**: `[PROCESS_NAME]_REFERENCE.md`, `[SYSTEM]_STANDARDS.md`
**User Guides**: `[feature].md`, `[workflow].md`
**Technical**: `[system]-[function].md`
**Strategy**: `[topic]-strategy.md`, `[topic]-guide.md`
**Templates**: `[type]_template.md`
**Archive**: `[original-name].md` or `[topic]-[date].md`

### Examples
- `DOCUMENTATION_SYSTEM.md` (operational reference)
- `dashboard.md` (user guide)
- `airtable-integration.md` (technical reference)
- `content-generation-strategy.md` (strategic planning)
- `campaign_strategy_template.md` (template)
- `documentation-org-july-2025.md` (archive)

---

## Documentation Workflow

### Creating New Documentation

1. **Choose appropriate category** based on purpose and audience
2. **Use template if available** from templates/ directory
3. **Follow naming conventions** for consistency
4. **Include header metadata**: Title, date, version, purpose
5. **Commit with clear message** explaining document purpose

### Updating Documentation

1. **Make content changes** as needed
2. **Update metadata** (Last Updated date, version if significant changes)
3. **Maintain formatting** consistency with other docs
4. **Commit changes** with descriptive message

### Archiving Documentation

1. **Determine archive category** (reorganizations, transitions, workflows, implementation-history)
2. **Move to appropriate archive subdirectory** with descriptive name
3. **Update any references** in active documentation
4. **Commit archive** with explanation of why archived

### Finding Documentation

**By Category**:
- Check category structure in this guide
- Browse relevant directory: `ls docs/[category]/`

**By Content**:
```bash
# Search all markdown files
grep -r "search term" docs/*.md

# Find files modified recently
find docs -name "*.md" -mtime -7

# List all markdown files
find docs -name "*.md" -type f
```

**By Purpose**:
- System setup → `SYSTEM_GUIDE.md`, `IMPLEMENTATION_GUIDE.md`
- Agent capabilities → `docs/agents/`
- User guides → `docs/reference/user-guides/`
- Technical reference → `docs/reference/technical/`
- Operational processes → `docs/operations/`

---

## Maintenance Schedule

### Weekly (15 minutes)
- Review new documentation added
- Check for broken links or references
- Verify categorization accuracy

### Monthly (1 hour)
- Comprehensive documentation audit
- Archive completed or obsolete docs
- Update this system guide if structure changes
- Review templates for relevance

### Quarterly (2 hours)
- Full category optimization review
- Team feedback on documentation usability
- Update standards and conventions
- Plan improvements and consolidations

---

## Quality Standards

### All Documentation Should Include

**Required Elements**:
- Clear title describing purpose
- Brief overview or introduction
- Organized sections with headers
- Examples where appropriate
- Contact or owner information (if applicable)

**Optional But Recommended**:
- Table of contents for long documents (100+ lines)
- Version number for documents that evolve
- Related documentation links
- Last updated date
- Quick reference section

### Formatting Standards

- Use markdown headers: `#`, `##`, `###`
- Code blocks for commands: ` ```bash ` or ` ```markdown `
- Lists for sequential steps or options
- Tables for comparison or reference data
- Links for cross-references: `[text](path/to/file.md)`

---

## Troubleshooting

### Can't Find a Document
1. Check category structure in this guide
2. Search by content: `grep -r "keyword" docs/`
3. Check git history: `git log --all --full-history -- "**/filename.md"`
4. Check archive directories

### Documentation Structure Changed
1. Review `docs/archive/reorganizations/` for history
2. Check git log for recent moves: `git log --follow -- docs/`
3. Update any broken references
4. Notify team of structural changes

### Need to Create New Category
1. Evaluate if existing categories can accommodate
2. Document rationale for new category
3. Update this guide with new category definition
4. Notify team of new organizational option

---

## Archive Reference

### Historical Documentation Locations

**Reorganization History**: `docs/archive/reorganizations/`
- Past documentation organization efforts
- File move summaries
- Structural changes

**Implementation Milestones**: `docs/archive/implementation-history/`
- System transformation summaries
- Feature implementation guides
- Enhancement plans

**Transition Guides**: `docs/archive/transitions/`
- Agent transition documentation
- System migration guides

**Workflow Details**: `docs/archive/workflows-sept-2025/`
- Detailed process documentation
- Historical workflow references

---

## Best Practices

### Documentation Creation
✅ Start with template when available
✅ Use clear, descriptive titles
✅ Include practical examples
✅ Link to related documentation
✅ Keep focused on single topic

### Documentation Maintenance
✅ Review regularly for accuracy
✅ Update timestamps when modified
✅ Archive obsolete content promptly
✅ Maintain consistent formatting
✅ Test links and references

### Documentation Organization
✅ Follow category guidelines strictly
✅ Use consistent naming conventions
✅ Preserve git history when moving files
✅ Document structural changes
✅ Communicate changes to team

---

**System Owner**: Technical Document Manager
**Maintained By**: Marketing Organization Team
**Review Schedule**: Monthly structure review, quarterly comprehensive assessment
**Last Major Update**: 2025-10-20 (Consolidation for Claude Skills optimization)
**Previous Versions**: Archived in `docs/archive/reorganizations/`
