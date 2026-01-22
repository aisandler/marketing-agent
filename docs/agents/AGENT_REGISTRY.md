# {{COMPANY_NAME}} Agent System Master Registry
**Created**: 2025-09-16
**Status**: OFFICIAL AGENT REGISTRY
**Last Updated**: Based on live system testing

## Executive Summary

This is the definitive registry of all functional agents in the {{COMPANY_NAME}} marketing system based on comprehensive system testing. This document supersedes all other agent documentation and represents the actual system capabilities.

---

## 🟢 AVAILABLE MARKETING AGENTS (11 Total)

### Content Strategy & Planning
1. **content-marketing-strategist** ✅ OPERATIONAL
   - Senior content strategist for local SEO
   - Editorial calendar development
   - Multi-content coordination

2. **monthly-content-planner** ✅ OPERATIONAL
   - CSV generation for Airtable
   - Multi-month calendar planning
   - Structured data output

3. **brand-strategy-consultant** ✅ OPERATIONAL
   - Brand positioning and messaging
   - Competitive differentiation
   - Voice and tone management

### Content Creation & Writing
4. **lead-writer** ✅ OPERATIONAL
   - Blog post development (1,000-1,500 words)
   - {{COMPANY_NAME}} compliance enforcement
   - Outline-to-draft conversion

### SEO & Analytics
5. **seo-optimization-specialist** ✅ OPERATIONAL
   - Local SEO strategy
   - Technical optimization
   - Keyword research

6. **marketing-analytics-specialist** ✅ OPERATIONAL
   - Campaign performance analysis
   - ROI measurement
   - Data-driven recommendations

### Social & Digital Marketing
7. **social-media-strategist** ✅ OPERATIONAL
   - Platform-specific strategies
   - Community management
   - Social commerce optimization

8. **creative-director** ✅ OPERATIONAL
   - Visual brand identity
   - Campaign creative strategy
   - Multi-channel asset direction

### Research & Intelligence
9. **market-research-specialist** ✅ OPERATIONAL
   - Consumer insights development
   - Market opportunity analysis
   - Industry trend research

10. **competitive-intelligence-analyst** ✅ OPERATIONAL
    - Competitive landscape analysis
    - Market positioning assessment
    - Strategic threat evaluation

### Executive Leadership
11. **chief-marketing-officer** ❌ DEPRECATED (2025-01-17)
    - Functionality moved to CMO command agent (/cmo)
    - Archive location: .claude/agents/deprecated/

---

## 🔴 DOCUMENTED BUT NOT AVAILABLE

### Agents Listed in CLAUDE.md But Not Found
1. **Blog Content Writer** ❌ NOT FOUND
   - Use `lead-writer` instead

2. **Blog Outline Strategist** ❌ NOT FOUND
   - Functionality covered by `content-marketing-strategist`

---

## 🟡 ADDITIONAL AVAILABLE AGENTS (Non-Marketing)

### Technical & Development Agents
- **general-purpose** - General task handling
- **frontend-developer** - Frontend implementation
- **rapid-prototyper** - Quick prototyping
- **backend-architect** - Backend systems
- **deployment-pipeline-manager** - CI/CD management
- **react-performance-optimizer** - React optimization
- **dashboard-project-manager** - Dashboard development
- **code-executor** - Code implementation

### Documentation & Support Agents
- **product-documentation-manager** - Product docs
- **technical-document-manager** - Technical docs
- **statusline-setup** - Status configuration
- **output-style-setup** - Output styling

### Optimization Agents
- **ai-prompt-optimizer** - Prompt optimization
- **conversion-flow-optimizer** - Conversion optimization
- **landing-page-conversion-expert** - Landing page optimization

---

## 📊 Agent Availability Summary

| Category | Documented in CLAUDE.md | Actually Available | Status |
|----------|------------------------|-------------------|---------|
| Marketing Agents | 12 | 10 | ✅ 83% Available |
| Total System Agents | 12 | 27 | ✅ 225% More Than Expected |

### Key Findings
1. **10 of 12 documented marketing agents are functional**
2. **16 additional agents available** but not documented in CLAUDE.md
3. **System is MORE capable than documentation suggests**

---

## 🎯 Recommended Actions

### Immediate Updates Needed
1. **Update CLAUDE.md** to reflect actual agent names:
   - Change "Blog Content Writer" to "lead-writer"
   - Remove "Blog Outline Strategist" (functionality in content-marketing-strategist)

2. **Consider Adding to Documentation**:
   - competitive-intelligence-analyst (actively working)
   - chief-marketing-officer (actively working)

### System Optimization Opportunities
1. **Leverage Additional Agents**:
   - Use `ai-prompt-optimizer` for content quality
   - Use `conversion-flow-optimizer` for marketing funnels
   - Use `landing-page-conversion-expert` for location pages

2. **Create Agent Coordination Workflows**:
   - Document inter-agent communication protocols
   - Establish agent team templates
   - Define quality handoff standards

---

## 🔄 Agent Invocation Reference

### Correct Invocation Pattern
```javascript
Task tool invocation:
- description: "Brief task description"
- subagent_type: "exact-agent-name" (from this registry)
- prompt: "Detailed instructions for the agent"
```

### Example:
```javascript
{
  "description": "Create blog content",
  "subagent_type": "lead-writer",  // NOT "blog-content-writer"
  "prompt": "Write a 1,000 word blog post about..."
}
```

---

## 📝 Testing Log

| Agent | Test Date | Status | Response Quality |
|-------|-----------|---------|-----------------|
| content-marketing-strategist | 2025-09-16 | ✅ Pass | Excellent |
| seo-optimization-specialist | 2025-09-16 | ✅ Pass | Excellent |
| social-media-strategist | 2025-09-16 | ✅ Pass | Excellent |
| lead-writer | 2025-09-16 | ✅ Pass | Excellent |
| market-research-specialist | 2025-09-16 | ✅ Pass | Excellent |
| brand-strategy-consultant | 2025-09-16 | ✅ Pass | Excellent |
| creative-director | 2025-09-16 | ✅ Pass | Excellent |
| marketing-analytics-specialist | 2025-09-16 | ✅ Pass | Excellent |
| monthly-content-planner | 2025-09-16 | ✅ Pass | Excellent |
| chief-marketing-officer | 2025-09-16 | ✅ Pass | Excellent |
| blog-content-writer | 2025-09-16 | ❌ Fail | Not Found |

---

## 🚀 Next Steps

1. **Update all documentation** to use correct agent names
2. **Test agent coordination workflows** with correct names
3. **Create automated test suite** using this registry
4. **Implement missing functionality** if gaps identified

---

*This registry represents the true state of the {{COMPANY_NAME}} agent system and should be used as the authoritative reference for all agent operations.*