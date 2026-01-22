# {{COMPANY_NAME}} Agent System Inventory Matrix
**Audit Date**: 2025-09-16
**Status**: Active Audit Document

## Executive Summary

This matrix consolidates all documented agent references across the {{COMPANY_NAME}} system to identify discrepancies, overlaps, and gaps in the agent infrastructure.

---

## Agent Inventory Comparison

### Source Document Analysis

| Agent Name | CLAUDE.md (12 agents) | ORCHESTRATED_AGENT_SYSTEM.md (9 agents) | AGENT_COORDINATION_PLAYBOOK.md (9 agents) | Status |
|------------|----------------------|------------------------------------------|-------------------------------------------|---------|
| **Content Marketing Strategist** | ✅ Listed | ❌ Not Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Market Research Specialist** | ✅ Listed | ❌ Not Listed | ✅ Listed | 🔍 Needs Testing |
| **Competitive Intelligence Analyst** | ✅ Listed | ❌ Not Listed | ✅ Listed | 🔍 Needs Testing |
| **Brand Strategy Consultant** | ✅ Listed | ❌ Not Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Blog Content Writer** | ✅ Listed | ❌ Not Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Social Media Strategist** | ✅ Listed | ❌ Not Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Lead Writer** | ✅ Listed | ✅ Listed (Lead Writer – Drafting) | ❌ Not Listed | 🔍 Needs Testing |
| **Creative Director** | ✅ Listed | ❌ Not Listed | ✅ Listed | 🔍 Needs Testing |
| **SEO Optimization Specialist** | ✅ Listed | ❌ Not Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Marketing Analytics Specialist** | ✅ Listed | ❌ Not Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Blog Outline Strategist** | ✅ Listed | ❌ Not Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Monthly Content Planner** | ✅ Listed | ❌ Not Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Orchestrator – Campaign Manager** | ❌ Not Listed | ✅ Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Strategist – Content Strategy** | ❌ Not Listed | ✅ Listed | ❌ Not Listed | 🔍 Needs Testing |
| **SEO Specialist – Local SEO** | ❌ Not Listed | ✅ Listed | ✅ Listed (as SEO Specialist) | 🔍 Needs Testing |
| **Brand Guardian – Voice & Compliance** | ❌ Not Listed | ✅ Listed | ❌ Not Listed | 🔍 Needs Testing |
| **QA Editor – Gatekeeper** | ❌ Not Listed | ✅ Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Localizer – Location Variants** | ❌ Not Listed | ✅ Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Distribution – Atomization** | ❌ Not Listed | ✅ Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Analyst – Performance** | ❌ Not Listed | ✅ Listed | ❌ Not Listed | 🔍 Needs Testing |
| **Chief Marketing Officer (CMO)** | ❌ Not Listed | ❌ Not Listed | ✅ Listed | 🔍 Needs Testing |
| **Campaign Manager & Marketing Operations** | ❌ Not Listed | ❌ Not Listed | ✅ Listed | 🔍 Needs Testing |
| **Brand Strategist** | ❌ Not Listed | ❌ Not Listed | ✅ Listed | 🔍 Needs Testing |
| **Content Marketing Manager** | ❌ Not Listed | ❌ Not Listed | ✅ Listed | 🔍 Needs Testing |
| **Social Media Manager** | ❌ Not Listed | ❌ Not Listed | ✅ Listed | 🔍 Needs Testing |
| **Data Analyst & Performance Marketing** | ❌ Not Listed | ❌ Not Listed | ✅ Listed | 🔍 Needs Testing |

---

## Consolidated Agent Categories

### Strategic Planning Agents
1. Chief Marketing Officer (CMO) - *Only in AGENT_COORDINATION_PLAYBOOK*
2. Content Marketing Strategist - *Primary in CLAUDE.md*
3. Brand Strategy Consultant / Brand Strategist - *Multiple variations*
4. Market Research Specialist - *In CLAUDE.md and AGENT_COORDINATION_PLAYBOOK*

### Content Creation Agents
1. Blog Content Writer - *Only in CLAUDE.md*
2. Lead Writer / Lead Writer – Drafting - *Multiple variations*
3. Blog Outline Strategist - *Only in CLAUDE.md*
4. Creative Director - *In CLAUDE.md and AGENT_COORDINATION_PLAYBOOK*

### Research & Optimization Agents
1. SEO Optimization Specialist / SEO Specialist – Local SEO - *Multiple variations*
2. Marketing Analytics Specialist / Data Analyst & Performance Marketing - *Multiple variations*
3. Competitive Intelligence Analyst - *In CLAUDE.md and AGENT_COORDINATION_PLAYBOOK*

### Execution & Distribution Agents
1. Social Media Strategist / Social Media Manager - *Multiple variations*
2. Monthly Content Planner - *Only in CLAUDE.md*
3. Distribution – Atomization - *Only in ORCHESTRATED_AGENT_SYSTEM*
4. Campaign Manager & Marketing Operations - *Only in AGENT_COORDINATION_PLAYBOOK*

### Quality & Compliance Agents
1. Brand Guardian – Voice & Compliance - *Only in ORCHESTRATED_AGENT_SYSTEM*
2. QA Editor – Gatekeeper - *Only in ORCHESTRATED_AGENT_SYSTEM*
3. Localizer – Location Variants - *Only in ORCHESTRATED_AGENT_SYSTEM*

---

## Key Discrepancies Identified

### 1. Agent Count Mismatch
- **CLAUDE.md**: Claims 12 agents
- **ORCHESTRATED_AGENT_SYSTEM.md**: Defines 9 agents
- **AGENT_COORDINATION_PLAYBOOK.md**: References 9 agents
- **Total Unique Agents Found**: 26 different agent names/roles

### 2. Naming Inconsistencies
- Same role, different names (e.g., "SEO Optimization Specialist" vs "SEO Specialist – Local SEO")
- Role overlap (e.g., "Marketing Analytics Specialist" vs "Data Analyst & Performance Marketing")
- Undefined hierarchy (multiple "manager" and "strategist" roles)

### 3. Missing Core Functions
- No unified orchestrator in CLAUDE.md system
- Quality assurance agents only in ORCHESTRATED_AGENT_SYSTEM
- CMO role only in AGENT_COORDINATION_PLAYBOOK

### 4. Documentation Conflicts
- CLAUDE.md is the "official" list per project instructions
- ORCHESTRATED_AGENT_SYSTEM provides most detailed implementation guidance
- AGENT_COORDINATION_PLAYBOOK has most comprehensive workflow integration

---

## Recommended Agent Consolidation

### Priority 1: Core Marketing Agents (5 agents)
1. **Marketing Strategist** (Combines CMO, Content Marketing Strategist, Brand Strategist)
2. **Content Creator** (Combines Blog Content Writer, Lead Writer, Blog Outline Strategist)
3. **SEO Specialist** (Consolidates all SEO variations)
4. **Social Media Manager** (Consolidates social media roles)
5. **Analytics Specialist** (Combines all analytics/performance roles)

### Priority 2: Supporting Agents (4 agents)
6. **Market Research Analyst** (Market Research + Competitive Intelligence)
7. **Creative Director** (Visual and brand consistency)
8. **Quality Assurance Editor** (Brand Guardian + QA Editor)
9. **Campaign Coordinator** (Campaign Manager + Monthly Content Planner)

### Priority 3: Specialized Agents (3 agents)
10. **Localizer** (Location-specific content adaptation)
11. **Distribution Manager** (Content atomization and multi-channel)
12. **Orchestrator** (Workflow coordination and agent management)

---

## Testing Protocol

### Phase 1: Existence Validation
- [ ] Test each agent name with Task tool invocation
- [ ] Document actual response vs expected behavior
- [ ] Record error messages for non-existent agents

### Phase 2: Functionality Testing
- [ ] Test agent-specific prompts from documentation
- [ ] Validate output quality and relevance
- [ ] Check cross-agent coordination capabilities

### Phase 3: Workflow Integration
- [ ] Test "let's plan" pathway with documented agents
- [ ] Validate agent team assembly
- [ ] Test LOCAL vs SYSTEMATIC classification

---

## Next Steps

1. **Immediate**: Begin systematic agent invocation testing
2. **Short-term**: Create definitive agent list based on testing results
3. **Medium-term**: Implement missing critical agents
4. **Long-term**: Consolidate to optimized 12-agent system

---

## Audit Log

| Date | Action | Result | Notes |
|------|--------|--------|-------|
| 2025-09-16 | Initial inventory created | 26 unique agent references found | Major discrepancies between documents |
| *Pending* | Agent invocation testing | *To be completed* | Will test each documented agent |
| *Pending* | Consolidation recommendation | *To be completed* | Based on testing results |

---

*This document will be updated throughout the audit process with testing results and recommendations.*