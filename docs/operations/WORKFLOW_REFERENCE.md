# Workflow Reference

**Version**: 2.0 (Consolidated)
**Last Updated**: 2025-10-20
**Purpose**: Essential workflows and agent coordination patterns

---

## Quick Reference

### Primary Workflows
1. **Content Planning** → Use `/cmo` with strategic pathway selection
2. **Content Generation** → LOCAL (immediate) or SYSTEMATIC (workflow)
3. **Performance Analysis** → Use `/analyst` for intelligence and optimization
4. **Brand Setup** → Use `/onboard` for business configuration

### Key Automation Scripts
```bash
# Server Management
./automation/server_manager.sh [start|stop|status]

# Content Operations
./automation/claude_direct_airtable_fixed.sh --description "..." --type "..."
./automation/email-campaign-generator.sh [newsletter|promotional|drip-sequence]
./automation/content-validation-hook.sh [file] [type] [title]

# Brand Export
./automation/brand-synthesis.sh [summary|detailed|guide]
```

---

## Agent Coordination Patterns

### Executive Command Agents

**Ophelia (Onboarding Specialist)** - `/onboard`
- **Purpose**: Business setup and brand intelligence
- **Coordinates**: website-analysis-specialist, competitive-intelligence-analyst, brand-strategy-consultant
- **Output**: Complete brand architecture in client-context/ and client-brand/

**Cleon (Chief Marketing Officer)** - `/cmo`
- **Purpose**: Strategic marketing orchestration
- **Coordinates**: All specialist agents based on pathway selection
- **Output**: Strategic plans, content calendars, campaign records

**Marcus (Marketing Intelligence)** - `/analyst`
- **Purpose**: Performance optimization and intelligence
- **Coordinates**: marketing-analytics-specialist, competitive-intelligence-analyst
- **Output**: Performance insights, optimization recommendations

### Specialist Agent Coordination

**Content Development Pattern**:
```
content-marketing-strategist (PRIMARY)
    ↓
monthly-content-planner (calendar structure)
    ↓
market-research-specialist (trending topics)
    ↓
seo-optimization-specialist (keyword research)
    ↓
lead-writer (content creation for LOCAL generation)
```

**Campaign Development Pattern**:
```
content-marketing-strategist (PRIMARY)
    ↓
market-research-specialist (audience insights)
    ↓
creative-director (campaign creative)
    ↓
social-media-strategist (platform optimization)
    ↓
Records created for SYSTEMATIC workflow processing
```

**Competitive Analysis Pattern**:
```
competitive-intelligence-analyst (PRIMARY)
    ↓
market-research-specialist (market context)
    ↓
brand-strategy-consultant (positioning refinement)
    ↓
Strategic recommendations for brand differentiation
```

---

## Content Generation Workflows

### LOCAL Generation (Immediate Creation)

**When to Use**:
- Blog posts and guides (text-heavy content)
- AEO-enhanced articles with FAQ sections
- Location pages with local optimization
- Urgent content needs requiring immediate deployment

**Process**:
1. Agent generates complete content
2. Content saved to content/ directory
3. Content record created with full markdown in Text field
4. Ready for dashboard review and publishing

**Agents Involved**:
- lead-writer (primary content creation)
- content-marketing-strategist (strategy and structure)
- seo-optimization-specialist (keyword optimization)

### SYSTEMATIC Generation (Workflow Processing)

**When to Use**:
- Social media posts (platform-specific formatting)
- Visual content requirements (images, graphics)
- Campaign content requiring coordination
- Multi-stakeholder review processes

**Process**:
1. Agent creates content strategy and descriptions
2. Content records generated with detailed specifications
3. Records submitted to Airtable via dashboard
4. Business workflow handles formatting, citations, publishing

**Agents Involved**:
- social-media-strategist (platform optimization)
- creative-director (visual specifications)
- email-marketing-specialist (campaign sequences)

---

## Strategic Pathway Workflows

### Monthly Content Calendar Pathway

**Trigger**: `/cmo *monthly` or "plan monthly content"

**Coordination Flow**:
1. content-marketing-strategist → Seasonal opportunity analysis
2. monthly-content-planner → Calendar structure and timing
3. market-research-specialist → Trending topics and audience needs
4. seo-optimization-specialist → Keyword research and volume estimates
5. Strategic consultation with user for final direction
6. Generate 15-20 content records with optimal distribution

**Deliverable**: Complete monthly calendar with blog, social, and location content

### Seasonal Campaign Pathway

**Trigger**: `/cmo *seasonal` or "create seasonal campaign"

**Coordination Flow**:
1. content-marketing-strategist → Campaign theme development
2. market-research-specialist → Seasonal trends and consumer behavior
3. creative-director → Campaign creative direction
4. lead-writer → LOCAL content generation for key pieces
5. social-media-strategist → Platform-specific campaign content
6. Generate 8-12 cohesive campaign records

**Deliverable**: Integrated seasonal campaign with multi-channel content

### Competitive Response Pathway

**Trigger**: `/cmo *competitive` or "respond to competitor"

**Coordination Flow**:
1. competitive-intelligence-analyst → Competitive threat/opportunity analysis
2. brand-strategy-consultant → Positioning and differentiation strategy
3. content-marketing-strategist → Response content strategy
4. Strategic recommendations for brand positioning
5. Content records for tactical response

**Deliverable**: Competitive response strategy with implementation plan

### Performance Optimization Pathway

**Trigger**: `/analyst` or `/cmo *optimize`

**Coordination Flow**:
1. marketing-analytics-specialist → Performance data analysis
2. seo-optimization-specialist → Search performance and ranking analysis
3. competitive-intelligence-analyst → Competitive benchmark comparison
4. content-marketing-strategist → Optimization recommendations
5. Actionable improvement plan with prioritized initiatives

**Deliverable**: Performance audit with optimization roadmap

---

## Dashboard & Automation Workflows

### Dashboard Review Workflow

**Process**:
1. Content generated via `/cmo` strategic pathways
2. Access dashboard: `http://localhost:3000/dashboard/client-interactive-dashboard.html`
3. Review content records and LOCAL generated content
4. Select records for Airtable submission
5. Submit batch to Airtable for workflow processing

**Dashboard Functions**:
- Content preview (LOCAL generated content)
- Record editing and refinement
- Batch selection and submission
- Airtable sync status tracking

### Content Validation Workflow

**Automated Validation**:
```bash
./automation/content-validation-hook.sh [file.html] [content-type] "Title"
```

**Validation Checks**:
- Brand compliance (messaging, voice, positioning)
- Regulatory review (if applicable)
- Quality standards (formatting, structure, completeness)
- SEO optimization (keywords, meta, structure)

**Output**: Pass/fail with specific recommendations for improvements

### Email Campaign Workflow

**Newsletter Generation**:
```bash
./automation/email-campaign-generator.sh newsletter --season [spring|summer|fall|winter]
```

**Promotional Campaign**:
```bash
./automation/email-campaign-generator.sh promotional --offer "20% off summer services"
```

**Drip Sequence**:
```bash
./automation/email-campaign-generator.sh drip-sequence --service "commercial leasing"
```

**Process**:
1. email-marketing-specialist generates campaign strategy
2. Script creates email content and sequence
3. Campaign records created for email platform
4. Review and scheduling in email system

---

## Quality Assurance Workflows

### Content Quality Gates

**Before Submission**:
- [ ] Brand voice and messaging alignment verified
- [ ] Keyword optimization completed (for blog/location content)
- [ ] Content structure follows best practices
- [ ] Links and references validated
- [ ] Formatting consistency confirmed

**During Review**:
- [ ] Dashboard preview checked
- [ ] Record details accurate (type, priority, location)
- [ ] Content classification appropriate (LOCAL vs SYSTEMATIC)
- [ ] Target audience alignment confirmed

**After Submission**:
- [ ] Airtable record created successfully
- [ ] Content ID tracking active
- [ ] Workflow triggers functioning
- [ ] Publication schedule confirmed

### Agent Coordination Quality Checks

**Strategic Alignment**:
- All specialist agents reference current brand positioning
- Content recommendations align with business objectives
- Competitive positioning integrated into strategy
- Performance insights incorporated into planning

**Information Consistency**:
- Brand voice consistent across all agent outputs
- Keyword strategy aligned across content types
- Visual identity referenced in creative recommendations
- Target audience definition shared across specialists

---

## Troubleshooting Common Workflows

### Issue: Strategic Pathway Not Clear

**Solution**:
1. Use `/cmo` to access pathway selection
2. Review strategic pathway descriptions
3. Ask for clarification with specific business goal
4. CMO will present numbered options for clear selection

### Issue: Content Classification Unclear

**Decision Matrix**:
- Text-heavy, time-sensitive → LOCAL
- Platform-specific formatting needed → SYSTEMATIC
- Visual requirements → SYSTEMATIC
- Immediate blog/guide need → LOCAL
- Social media posts → SYSTEMATIC
- Campaign coordination needed → SYSTEMATIC

### Issue: Agent Coordination Confusion

**Resolution Steps**:
1. Check strategic pathway in `/cmo` help
2. Review agent coordination pattern for selected pathway
3. Trust PRIMARY agent to coordinate specialists
4. Provide strategic input when consulted
5. Approve final recommendations before content generation

### Issue: Dashboard Not Loading

**Fix**:
```bash
# Check server status
./automation/server_manager.sh status

# Restart servers if needed
./automation/server_manager.sh stop
./automation/server_manager.sh start

# Verify servers running
# Dashboard: http://localhost:3000
# API: http://localhost:3002
```

---

## Best Practices

### Strategic Planning
✅ Always start with `/onboard` for new brand configurations
✅ Use `/cmo` for strategic pathways and content planning
✅ Provide clear business objectives for better agent coordination
✅ Review and approve strategic recommendations before content generation
✅ Use numbered pathway options for clear direction

### Content Generation
✅ Leverage LOCAL generation for immediate text content needs
✅ Use SYSTEMATIC for platform-formatted and visual content
✅ Validate content before dashboard submission
✅ Maintain brand consistency across all content types
✅ Track content IDs for unified performance measurement

### Agent Coordination
✅ Trust specialist agents to coordinate sub-agents appropriately
✅ Provide strategic input when agents present consultation questions
✅ Review agent recommendations before final approval
✅ Allow PRIMARY agent to lead coordination for each pathway
✅ Reference brand architecture in client-context/ for consistency

### System Maintenance
✅ Monitor server health with server_manager.sh status
✅ Update brand configuration as business evolves
✅ Test workflows periodically to ensure functionality
✅ Review automation scripts for optimization opportunities
✅ Keep dashboard and API servers running during active sessions

---

## Workflow Evolution

### Recent Changes (2025-10-20)
- Consolidated workflow documentation from 8+ detailed process files
- Streamlined to essential coordination patterns and workflows
- Optimized for Claude Skills integration
- Preserved detailed workflow history in docs/archive/workflows-sept-2025/

### Historical Workflow Documentation
Detailed process documentation archived in:
- `docs/archive/workflows-sept-2025/AGENT_COORDINATION_PLAYBOOK.md`
- `docs/archive/workflows-sept-2025/CONTENT_PRODUCTION_PIPELINE.md`
- `docs/archive/workflows-sept-2025/CLAUDE_CODE_MARKETING_WORKFLOW.md`
- Additional workflow details in archive directory

---

**Workflow Owner**: Marketing Operations
**Maintained By**: System Team
**Review Schedule**: Monthly workflow optimization review
**Last Major Update**: 2025-10-20 (Consolidation and Claude Skills optimization)
