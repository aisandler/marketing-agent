# Documentation Standards

**Version:** 1.0  
**Last Updated:** July 28, 2025  
**Owner:** Operations Team

## Overview

This document establishes comprehensive standards for all documentation within the {{COMPANY_NAME}} marketing organization. These standards ensure consistency, maintainability, and discoverability across all documentation types.

## Documentation Structure

### Folder Organization

```
docs/
├── system/                     # Core system setup and workflows
├── strategic-planning/         # Strategic planning and execution documents
├── client-work/               # Client engagement materials
│   ├── examples/              # Sample deliverables and quality standards
│   ├── templates/             # Standardized format templates
│   └── deliverables/          # Active client work products
└── operations/                # Operational standards and processes
    ├── standards/             # Quality standards and guidelines
    ├── processes/             # Step-by-step workflows
    └── resources/             # Tools, templates, and references
```

### Navigation Requirements
- Each major folder must contain a README.md index file
- Index files must include folder purpose, contents overview, and usage guidelines
- Cross-references to related documentation must be maintained
- Navigation paths must use relative linking for portability

## File Naming Conventions

### Standard Formats

#### System Documentation
- `AGENT_SETUP_GUIDE.md` - Agent configuration instructions
- `CLIENT_ONBOARDING_GUIDE.md` - Workflow and process guides
- `[PROCESS_NAME]_WORKFLOW.md` - Specific workflow documentation

#### Strategic Planning
- `[brand]_[timeframe]_strategic_[type].md`
  - Example: `client_90_day_strategic_agenda.md`
- `[brand]_annual_strategic_plan_[year].md`
- `[brand]_quarterly_execution_plan_q[#]_[year].md`

#### Client Work
- `[client]_[deliverable_type]_[year].md`
  - Example: `hydr8_annual_calendar_2024.md`
- `[client]_strategic_marketing_plan_[year].md`
- `[client]_campaign_strategy_[campaign_name].md`

#### Operations
- `[STANDARD_NAME]_STANDARDS.md` - All caps for operational standards
- `[process_name]_process.md` - Process documentation
- `[tool_name]_guide.md` - Tool usage guides

### File Naming Rules
- Use lowercase with underscores for word separation
- Include dates for time-sensitive documents
- Use descriptive names that indicate content purpose
- Avoid spaces, special characters, or version numbers in filenames
- Keep names under 50 characters when possible

## Document Structure Standards

### Required Header Information
All documents must include:

```markdown
# Document Title

**Version:** [Version Number]  
**Last Updated:** [Date]  
**Owner:** [Responsible Team/Person]  
**Status:** [Draft/Review/Final/Archived]
```

### Content Organization

#### Executive Summary (Required for strategic documents)
- 2-3 paragraph overview of document purpose and key points
- Target audience identification
- Success criteria or objectives

#### Table of Contents (Required for documents >1000 words)
- Hierarchical structure with markdown links
- Updated automatically or maintained manually
- Maximum 3 levels of nesting

#### Main Content Sections
- Logical flow from overview to detail
- Clear section headers with consistent formatting
- Actionable content with specific guidance
- Examples and use cases where applicable

#### Related Documentation (Required)
- Links to relevant supporting documents
- Cross-references to dependent materials
- Navigation back to parent directories

#### Footer Information (Required)
```markdown
---
*Last Updated: [Date]*  
*Owner: [Team/Person]*  
*Next Review: [Date]*
```

## Content Quality Standards

### Writing Guidelines

#### Voice and Tone
- **Professional but accessible** - Avoid jargon while maintaining expertise
- **Action-oriented** - Focus on what readers should do with the information
- **Concise and specific** - Eliminate unnecessary words and vague statements
- **Consistent terminology** - Use established terms throughout the organization

#### Clarity Requirements
- One main idea per paragraph
- Active voice preferred over passive voice
- Specific examples and use cases included
- Technical terms defined on first use
- Step-by-step instructions for processes

#### Formatting Standards
- **Headers:** Use hierarchical markdown headers (H1-H4 maximum)
- **Lists:** Use bullet points for items, numbered lists for sequences
- **Emphasis:** Bold for key terms, italics for emphasis, code blocks for technical content
- **Links:** Descriptive link text, relative paths for internal links
- **Code:** Properly formatted code blocks with language specification

### Information Architecture

#### Logical Organization
- Information flows from general to specific
- Prerequisites clearly identified and linked
- Dependencies mapped and documented
- Assumptions explicitly stated

#### Discoverability
- Keywords included in headers and content
- Cross-links to related materials maintained
- Index entries for key concepts
- Search-friendly terminology used

#### Actionability
- Clear next steps provided
- Required resources identified
- Success criteria defined
- Performance metrics included where applicable

## Version Control and Maintenance

### Change Management

#### Version Tracking
- Major changes increment version number (1.0 → 2.0)
- Minor updates increment decimal (1.0 → 1.1)
- Editorial changes update date only
- All changes documented in change log

#### Review Cycles
- **System Documentation:** Quarterly review
- **Strategic Planning:** Monthly review during active periods
- **Client Work:** After each client engagement
- **Operations:** Bi-annual comprehensive review

### Archive Management

#### When to Archive
- Documents superseded by newer versions
- Processes no longer in use
- Client work after project completion
- Outdated strategic plans

#### Archive Process
1. Create `docs/archived/[YYYY-MM]/` folder structure
2. Move obsolete documents with original folder structure
3. Update all cross-references and links
4. Create archive log entry with reason and date
5. Maintain archive index for discoverability

#### Archive Log Format
```markdown
## Archive Log

### [Date] - [Document Name]
- **Reason:** [Why archived]
- **Replaced by:** [New document if applicable]
- **Location:** [Archive path]
```

## Template Standards

### Template Requirements
- All templates stored in appropriate `/templates/` folders
- Placeholder text clearly marked with [BRACKETS]
- Instructions included within template structure
- Version control applied to template updates
- Usage examples provided for complex templates

### Template Categories

#### Client Deliverable Templates
- Strategic plan template with all required sections
- Campaign strategy template with timeline frameworks
- Performance report template with standard metrics
- Presentation template with brand consistency

#### Process Documentation Templates
- Workflow documentation template
- Standard operating procedure template
- Training material template
- Meeting notes template

#### Administrative Templates
- Project brief template
- Status report template
- Change request template
- Review checklist template

## Quality Assurance

### Review Process

#### Pre-Publication Checklist
- [ ] Document follows naming conventions
- [ ] Required header information complete
- [ ] Content organization meets standards
- [ ] Links functional and properly formatted
- [ ] Grammar and spelling checked
- [ ] Cross-references updated
- [ ] Template compliance verified

#### Peer Review Requirements
- **Strategic documents:** CMO approval required
- **System documentation:** Technical review by agent specialists
- **Client deliverables:** Quality review by senior team member
- **Process documentation:** Stakeholder review by process users

### Continuous Improvement

#### Feedback Collection
- Regular user feedback on documentation usability
- Analytics on document access and engagement
- Team retrospectives on documentation effectiveness
- Client feedback on deliverable quality

#### Optimization Process
- Monthly review of most/least accessed documents
- Quarterly assessment of documentation gaps
- Annual comprehensive standards review
- Continuous iteration based on user needs

## Tools and Technology

### Approved Tools
- **Primary:** Markdown for all documentation
- **Secondary:** Google Docs for collaborative drafting
- **Prohibited:** Proprietary formats that limit accessibility

### Technical Requirements
- All documents must render properly in markdown viewers
- Images optimized for web viewing
- File sizes kept under 10MB for performance
- External links validated monthly

## Compliance and Governance

### Responsibility Matrix
- **Document Owners:** Content accuracy and maintenance
- **Operations Team:** Standards compliance and training
- **Team Leads:** Quality review and approval
- **All Team Members:** Following established standards

### Non-Compliance Process
1. Identification of non-compliant documents
2. Notification to document owner
3. 72-hour correction window
4. Escalation to team lead if unresolved
5. Direct correction with notification if critical

## Training and Support

### Onboarding Requirements
- All new team members complete documentation standards training
- Hands-on practice with template usage
- Review of organization-specific conventions
- Assessment of standards comprehension

### Ongoing Support
- Regular training updates when standards change
- Help desk support for documentation questions
- Best practice sharing in team meetings
- Recognition for exceptional documentation quality

---

These standards ensure the {{COMPANY_NAME}} marketing organization maintains professional, consistent, and usable documentation that supports operational excellence and client success.

*Last Updated: July 28, 2025*  
*Owner: Operations Team*  
*Next Review: October 28, 2025*