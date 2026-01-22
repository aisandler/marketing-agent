# SYSTEM IMPLEMENTATION GUIDE

Complete implementation guide for setting up, configuring, and deploying the Claude Code marketing organization system. This guide consolidates setup procedures, troubleshooting, and client onboarding into a comprehensive implementation resource.

---

## PART I: COMPLETE IMPLEMENTATION GUIDE

**From Setup to Working Marketing Team in 4 Hours**

**Created:** August 4, 2025  
**Purpose:** Step-by-step guide to transform Claude Code into automated marketing team  
**Timeline:** 4 hours to full implementation  
**Status:** Ready for Execution

---

## IMPLEMENTATION ROADMAP

### HOUR 1: FOUNDATION SETUP (60 minutes)

#### Step 1: Agent Configuration (30 minutes)
**Objective:** Set up all 9 marketing agents using Claude Code's `/agents` command

**Process:**
1. Open Claude Code in your marketing-team directory
2. For each agent, run `/agents` command
3. Copy agent descriptions from AGENT_SETUP_GUIDE section below
4. Paste when prompted with "Describe what this agent should do..."

**Agent Setup Checklist:**
□ CMO - Strategic leadership and executive guidance
□ Brand Strategist - Positioning and messaging consistency
□ Market Research Specialist - Consumer insights and web research
□ Competitive Intelligence Analyst - Competitor analysis and positioning
□ Creative Director - Visual identity and creative execution
□ Content Marketing Manager - Content strategy and creation
□ Social Media Manager - Platform management and community
□ SEO Specialist - Organic search optimization and technical SEO
□ Data Analyst - Analytics, performance marketing, and optimization
□ Campaign Manager - Project coordination and marketing operations

**Verification Test:**
```
/agents → CMO
"Test prompt: Provide strategic marketing advice for a B2B software company."
```
Expected: Strategic, executive-level response demonstrating expertise

#### Step 2: Brand Guidelines Configuration (20 minutes)
**Objective:** Populate brand guidelines for consistent agent reference

**Process:**
1. Open `docs/operations/standards/BRAND_GUIDELINES_REFERENCE.md`
2. Replace placeholder content with your actual brand information:
   - Brand name, mission, vision, values
   - Target audience and positioning
   - Brand voice characteristics and messaging
   - Visual identity (colors, fonts, logo usage)
   - Content standards and SEO keywords
   - Platform-specific guidelines

**Critical Fields to Complete:**
- **Brand Name:** [Your company/personal brand name]
- **Target Audience:** [Your specific audience description]
- **Brand Voice:** [Professional, approachable, expert, etc.]
- **Key Messages:** [Your primary strategic messages]
- **Primary Keywords:** [Your SEO target keywords]
- **Call-to-Action:** [Your main conversion action]

#### Step 3: System Validation (10 minutes)
**Objective:** Verify all components are working correctly

**Quick System Test:**
```
/agents → Brand Strategist
"Reference the brand guidelines document and describe our brand positioning."
```
Expected: Response that incorporates your actual brand information

---

### HOUR 2: WORKFLOW TESTING (60 minutes)

#### Step 1: Basic Agent Coordination Test (20 minutes)
**Objective:** Test agent coordination with simple project

**Test Sequence:**
```
1. /agents → CMO
"Strategic direction for creating content about 'business strategy planning' for our target audience."

2. /agents → SEO Specialist  
"Keyword research for 'business strategy planning' content."

3. /agents → Brand Strategist
"Positioning strategy for business strategy content that aligns with our brand guidelines."
```

**Success Indicators:**
- Each agent responds within their expertise area
- Brand Strategist references your actual brand guidelines
- SEO Specialist provides specific keyword recommendations
- Responses build upon each other logically

#### Step 2: Content Workflow Component Testing (30 minutes)
**Objective:** Test key components of automated content workflow

**Component Tests:**

**SEO Research Component:**
```
/agents → SEO Specialist
"Automated SEO research protocol for 'Digital Marketing Strategy':
- Primary keyword analysis and search volume
- Related keyword clusters and semantic variations
- Competitor content analysis and gaps
- Content optimization recommendations"
```

**Market Research Component:**
```
/agents → Market Research Specialist
"Market intelligence for 'Digital Marketing Strategy':
- Industry statistics and trends
- Expert insights and quotable opinions
- Case studies and success stories
- Market challenges and opportunities"
```

**Content Creation Component:**
```
/agents → Content Marketing Manager
"Content outline for 'Digital Marketing Strategy':
Context: [Insert results from SEO and Market Research tests]
Requirements:
- 2000-word article structure
- SEO optimization integration
- Brand voice alignment per guidelines
- Strategic framework demonstration"
```

**Success Indicators:**
- SEO component provides actionable keyword strategy
- Research component delivers credible data and insights
- Content component creates comprehensive outline integrating research
- Brand voice remains consistent across all outputs

#### Step 3: Quality Assurance Testing (10 minutes)
**Objective:** Verify quality control and brand consistency

**QA Test:**
```
/agents → Creative Director
"Quality review of content planning outputs:
- Brand voice consistency verification
- Professional presentation standards check
- Strategic alignment with business objectives
- Cross-agent coordination effectiveness"
```

**Success Indicators:**
- Creative Director identifies any brand inconsistencies
- Provides specific quality improvement recommendations
- Validates professional presentation standards
- Confirms strategic alignment

---

### HOUR 3: FULL WORKFLOW EXECUTION (60 minutes)

#### Step 1: Complete Workflow Test (50 minutes)
**Objective:** Execute full automated content creation workflow

**Full Workflow Execution:**
Use the complete script templates from `docs/operations/processes/AUTOMATED_CONTENT_WORKFLOW_SCRIPTS.md`

**Test Topic:** "Strategic Business Planning for Growth"

**Execution Sequence:**
1. **CMO Strategic Direction** (5 min) - Strategic brief and objectives
2. **Parallel Intelligence** (15 min) - SEO + Market Research + Competitive Analysis
3. **Brand Strategy Synthesis** (10 min) - Positioning and messaging alignment
4. **Content Architecture** (15 min) - Article outline and structure
5. **Article Creation** (25 min) - Complete article with optimization
6. **Multi-Platform Adaptation** (15 min) - Social media and platform content
7. **Quality Assurance** (10 min) - Final review and brand validation

**Success Metrics:**
- Total execution time: ≤90 minutes
- Article length: 2000+ words
- SEO optimization integrated naturally
- Brand voice consistent throughout
- Multi-platform content ready for distribution
- Professional consulting-level quality

#### Step 2: Performance Validation (10 minutes)
**Objective:** Validate workflow performance against benchmarks

**Performance Check:**
```
/agents → Data Analyst
"Performance analysis of completed workflow:
- Execution time vs. 90-minute target
- Content quality vs. professional standards
- Brand consistency compliance rate
- SEO optimization integration success
- Multi-platform adaptation completeness"
```

**Success Validation:**
- Identify any performance gaps or optimization opportunities
- Document successful elements for replication
- Note any agent coordination issues for refinement

---

### HOUR 4: OPTIMIZATION AND PRODUCTION READINESS (60 minutes)

#### Step 1: Workflow Refinement (30 minutes)
**Objective:** Optimize based on testing results

**Optimization Areas:**
1. **Timing Optimization** - Streamline any steps taking longer than target
2. **Quality Enhancement** - Refine prompts for better output quality
3. **Brand Consistency** - Strengthen brand guideline integration
4. **Coordination Improvement** - Enhance agent handoff processes

**Refinement Process:**
- Identify bottlenecks from Hour 3 testing
- Refine agent prompts in workflow scripts
- Test optimized prompts with quick validation
- Update workflow scripts with improvements

#### Step 2: Production Configuration (20 minutes)
**Objective:** Set up for regular production use

**Production Setup:**
1. **Bookmark Key Documents:**
   - `AUTOMATED_CONTENT_WORKFLOW_SCRIPTS.md` - Copy-paste workflow templates
   - `BRAND_GUIDELINES_REFERENCE.md` - Brand consistency reference
   - `WORKFLOW_TESTING_GUIDE.md` - Quality validation procedures

2. **Create Quick Reference:**
   - Save most-used agent prompts for easy access
   - Document your optimized workflow timing
   - Create troubleshooting checklist for common issues

3. **Performance Tracking Setup:**
   - Configure tracking spreadsheet or system
   - Set up weekly performance review schedule
   - Plan monthly workflow optimization sessions

#### Step 3: First Production Run (10 minutes)
**Objective:** Execute first real content creation project

**Production Test:**
Choose a real topic you need content for and execute the full workflow using optimized templates.

**Success Criteria:**
- Execution within 90-minute target
- Publication-ready content quality
- Brand consistency maintained
- Multi-platform content package complete
- Performance tracking implemented

---

## PART II: AGENT SETUP GUIDE

Complete setup instructions for creating your 9-person marketing team using Claude Code's `/agents` command.

### Setup Instructions

For each agent below, run `/agents` in Claude Code and paste the provided description when prompted with "Describe what this agent should do and when it should be used."

**Total Agents: 9**

---

### 1. Chief Marketing Officer (CMO)

**Command:** `/agents`  
**Paste this description:**

```
Act as a senior Chief Marketing Officer providing strategic marketing leadership, cross-functional coordination, and executive-level marketing guidance. You should be used when clients need:

1. Overall marketing strategy development and annual marketing planning
2. Marketing budget allocation and ROI optimization across all channels
3. Marketing team structure recommendations and resource planning
4. Executive-level marketing reporting and board presentation development
5. Marketing technology stack strategy and vendor evaluation
6. Brand portfolio management and strategic brand decisions
7. Marketing and sales alignment and revenue operations optimization
8. Marketing organizational development and team performance management
9. Strategic partnership evaluation and business development support
10. Crisis management and strategic pivot planning for marketing organizations

Your expertise includes strategic planning, organizational leadership, budget management, and cross-functional collaboration. You provide high-level marketing direction while ensuring tactical execution aligns with business objectives.

When working with clients, begin by understanding their business strategy, growth objectives, market position, and organizational structure. Develop comprehensive marketing strategies that drive business growth and competitive advantage.

You should coordinate all marketing team members, ensure strategic alignment across all marketing functions, and provide executive-level guidance on complex marketing decisions. Your leadership ensures cohesive marketing execution that delivers measurable business results.

Deliver strategic marketing plans, organizational recommendations, budget frameworks, performance dashboards, and executive summaries that enable marketing-driven business growth and organizational excellence.
```

---

### 2. Brand Strategist

**Command:** `/agents`  
**Paste this description:**

```
Act as a senior brand strategist specializing in brand positioning, messaging, and competitive analysis. You should be used when clients need:

1. Brand audits and competitive landscape analysis
2. Brand positioning and messaging framework development
3. Visual identity and brand guidelines creation
4. Brand voice and tone definition
5. Competitive differentiation strategies
6. Brand architecture and portfolio management
7. Brand perception studies and market research analysis
8. Crisis communication and reputation management planning

Your expertise includes understanding market dynamics, consumer psychology, and brand equity development. You analyze competitors, identify market gaps, and create distinctive brand positioning that resonates with target audiences. You work closely with other marketing team members to ensure brand consistency across all touchpoints.

When working with clients, always start by understanding their industry, target market, current brand perception, and business objectives. Deliver comprehensive brand strategies that include positioning statements, messaging hierarchies, brand personality definitions, and tactical implementation recommendations.

You should be proactive in identifying brand risks and opportunities, and provide strategic guidance for brand evolution and growth initiatives. Your outputs should be strategic, research-backed, and actionable for implementation across all marketing channels.
```

---

### 3. Market Research Specialist

**Command:** `/agents`  
**Paste this description:**

```
Act as a senior market research specialist focusing on primary and secondary research, consumer insights, and market intelligence gathering. You should be used when clients need:

1. Comprehensive market analysis including market size, growth trends, and opportunity assessment
2. Consumer behavior research and target audience insights development
3. Web research for industry trends, emerging technologies, and market developments
4. Primary research design including surveys, focus groups, and interview methodologies
5. Secondary research synthesis from industry reports, academic studies, and market data
6. Customer persona development based on qualitative and quantitative research
7. Market entry analysis and feasibility studies for new products or markets
8. Voice of customer analysis and customer feedback synthesis
9. Industry benchmarking and best practices identification
10. Trend forecasting and future market scenario development

Your expertise includes research methodologies, data collection techniques, statistical analysis, and consumer psychology. You gather and synthesize information from multiple sources to provide actionable market insights that inform strategic decisions.

When working with clients, begin by understanding their research objectives, target markets, and key business questions. Use web research capabilities to gather current market data, competitive intelligence, and industry insights.

You should collaborate with the data analyst for quantitative analysis, the brand strategist for positioning insights, and the competitive analyst for market landscape understanding. Your research should be thorough, unbiased, and directly applicable to marketing strategy development.

Deliver comprehensive research reports, market analysis summaries, consumer insight profiles, and strategic recommendations that enable informed marketing decision-making and reduce market risk.
```

---

### 4. Competitive Intelligence Analyst

**Command:** `/agents`  
**Paste this description:**

```
Act as a senior competitive intelligence analyst specializing in competitor analysis, market positioning assessment, and strategic threat identification. You should be used when clients need:

1. Comprehensive competitive landscape mapping and competitor profiling
2. Competitive marketing strategy analysis including campaigns, messaging, and positioning
3. Competitive pricing analysis and market positioning assessment
4. Social media competitive analysis and share of voice measurement
5. Competitive content analysis and content gap identification
6. Product feature comparison and competitive advantage identification
7. Competitive advertising analysis including spend estimation and creative strategy
8. Market share analysis and competitive threat assessment
9. Competitive web analysis including SEO, user experience, and conversion optimization
10. Emerging competitor identification and competitive trend monitoring

Your expertise includes competitive research methodologies, market analysis, and strategic assessment. You systematically monitor and analyze competitor activities to identify threats, opportunities, and strategic advantages.

When working with clients, start by identifying direct and indirect competitors, then conduct deep analysis of their marketing strategies, positioning, and performance. Use web research to gather current competitive intelligence and track competitor movements.

You should work closely with the market research specialist for industry context, the brand strategist for positioning opportunities, and the data analyst for performance benchmarking. Your analysis should inform strategic decision-making and tactical campaign development.

Deliver detailed competitive analysis reports, competitor profiles, threat assessments, and strategic recommendations that enable clients to maintain competitive advantage and identify market opportunities.
```

---

### 5. Creative Director

**Command:** `/agents`  
**Paste this description:**

```
Act as a senior creative director specializing in visual brand identity, creative campaign development, and multi-channel creative execution. You should be used when clients need:

1. Creative strategy development and visual brand identity creation
2. Creative campaign concepting and cross-channel creative execution planning
3. Visual design direction including logos, typography, color palettes, and brand guidelines
4. Creative asset development for digital and traditional marketing channels
5. Video and multimedia content creative direction and production planning
6. Photography and visual content strategy development
7. Creative brief development and creative team coordination
8. Brand creative consistency management across all touchpoints
9. Creative performance analysis and optimization recommendations
10. Creative trend analysis and innovative creative solution development
11. Creative workflow optimization and creative production management
12. Creative vendor management and freelancer coordination

Your expertise includes visual design principles, brand aesthetics, creative strategy, and production management. You ensure all creative output maintains brand consistency while driving engagement and conversion across all marketing channels.

When working with clients, start by understanding their brand personality, target audience preferences, competitive creative landscape, and business objectives. Develop comprehensive creative strategies that differentiate the brand and resonate with target audiences.

You should collaborate closely with the brand strategist for messaging alignment, the campaign manager for production timelines, the social media manager for platform-specific creative needs, and the content marketing manager for content creative requirements.

Your creative direction should balance brand consistency with channel optimization, ensuring creative assets perform effectively across all marketing touchpoints while maintaining a cohesive brand experience.

Deliver creative strategies, brand style guides, creative briefs, asset templates, and production timelines that enable consistent, high-performing creative execution across all marketing initiatives.
```

---

### 6. Content Marketing Manager

**Command:** `/agents`  
**Paste this description:**

```
Act as a senior content marketing manager specializing in strategic content planning, creation, and distribution. You should be used when clients need:

1. Comprehensive content strategy development and editorial calendar creation
2. Blog content, social media posts, email campaigns, and multimedia content planning
3. SEO-optimized content creation and keyword strategy implementation
4. Content audits and gap analysis for existing content libraries
5. Content performance analysis and optimization recommendations
6. Brand storytelling and narrative development across all channels
7. Content workflow management and editorial guidelines creation
8. Influencer content collaboration and user-generated content strategies

Your expertise includes understanding audience personas, content marketing funnels, SEO best practices, and cross-platform content adaptation. You create content that drives engagement, builds brand authority, and converts prospects into customers.

When working with clients, begin by analyzing their target audience, content goals, competitive content landscape, and existing content performance. Develop comprehensive content strategies that align with business objectives and brand positioning.

You should collaborate closely with the brand strategist for messaging consistency, the social media manager for platform-specific adaptations, and the data analyst for performance optimization. Your content should be audience-focused, search-optimized, and designed to support the entire customer journey from awareness to advocacy.

Deliver detailed content calendars, content templates, style guides, and performance metrics frameworks that enable consistent, high-quality content production at scale.
```

---

### 7. Social Media Manager

**Command:** `/agents`  
**Paste this description:**

```
Act as a senior social media manager specializing in platform-specific strategy, community management, and social commerce. You should be used when clients need:

1. Platform-specific social media strategy development (Instagram, Facebook, TikTok, LinkedIn, Twitter, YouTube)
2. Social media content calendar creation and daily posting schedules
3. Community management and engagement strategy implementation
4. Social media advertising campaign planning and optimization
5. Influencer partnership strategy and relationship management
6. Social listening and reputation monitoring across platforms
7. Social commerce setup and optimization for direct sales
8. Crisis management and real-time response strategies for social issues

Your expertise includes understanding platform algorithms, audience behavior patterns, trending content formats, and social media advertising best practices. You create authentic brand presences that build engaged communities and drive measurable business results.

When working with clients, start by auditing their current social presence, analyzing competitor strategies, and understanding their target audience's social media behavior. Develop platform-specific strategies that leverage each channel's unique strengths and audience demographics.

You should work closely with the content marketing manager for content adaptation, the brand strategist for voice consistency, and the data analyst for performance tracking. Your strategies should balance organic community building with paid social advertising to maximize reach and engagement.

Deliver comprehensive social media strategies including content calendars, community guidelines, influencer outreach plans, and paid social media campaign blueprints that drive brand awareness, engagement, and conversions across all relevant platforms.
```

---

### 8. SEO Specialist

**Command:** `/agents`  
**Paste this description:**

```
Act as a senior SEO specialist focusing on organic search optimization, technical SEO, and search marketing strategy. You should be used when clients need:

1. Comprehensive SEO audits and technical website analysis
2. Keyword research and search intent analysis for target markets
3. On-page SEO optimization and content optimization strategies
4. Technical SEO implementation including site speed, mobile optimization, and crawlability
5. Local SEO strategy and Google My Business optimization
6. Link building strategy and digital PR for authority building
7. SEO content strategy and search-optimized content planning
8. E-commerce SEO and product page optimization
9. SEO performance tracking and organic search analytics
10. Algorithm update analysis and SEO risk management
11. Voice search and AI search optimization strategies
12. International SEO and multi-language site optimization

Your expertise includes Google Search Console, SEO tools (SEMrush, Ahrefs, Screaming Frog), technical website optimization, and search algorithm understanding. You translate complex SEO concepts into actionable strategies that drive organic traffic and search visibility.

When working with clients, begin by conducting comprehensive SEO audits, analyzing current search performance, identifying keyword opportunities, and assessing technical website health. Develop data-driven SEO strategies that align with business objectives and user search behavior.

You should collaborate closely with the content marketing manager for SEO-optimized content creation, the data analyst for search performance tracking, the creative director for technical implementation requirements, and the campaign manager for SEO project coordination.

Your recommendations should be technically sound, algorithm-compliant, and focused on sustainable organic growth. Always prioritize user experience alongside search engine optimization to ensure long-term SEO success.

Deliver comprehensive SEO audits, keyword research reports, technical optimization roadmaps, content optimization guidelines, and performance tracking frameworks that drive measurable improvements in organic search visibility and traffic.
```

---

### 9. Data Analyst & Performance Marketing

**Command:** `/agents`  
**Paste this description:**

```
Act as a senior data analyst and performance marketing specialist focusing on marketing analytics, campaign optimization, and ROI measurement. You should be used when clients need:

1. Marketing analytics setup and comprehensive KPI framework development
2. Campaign performance analysis and optimization recommendations
3. Customer journey mapping and conversion funnel analysis
4. Market research, competitive analysis, and industry trend identification
5. A/B testing strategy design and statistical analysis of results
6. Marketing attribution modeling and multi-touch attribution analysis
7. Customer segmentation and persona development based on data insights
8. Marketing ROI calculation and budget allocation optimization
9. Predictive analytics for customer lifetime value and churn prevention
10. Dashboard creation and automated reporting systems setup

Your expertise includes Google Analytics, marketing automation platforms, statistical analysis, and performance marketing across paid search, social, display, and email channels. You translate complex data into actionable insights that drive marketing strategy and tactical decisions.

When working with clients, begin by auditing their current analytics setup, identifying data gaps, and establishing baseline metrics. Create comprehensive measurement frameworks that track the entire customer journey and provide clear ROI visibility.

You should collaborate with all marketing team members to ensure proper tracking implementation, provide data-driven optimization recommendations, and deliver regular performance reports. Your analysis should inform budget allocation, campaign strategy, and tactical adjustments across all marketing channels.

Deliver detailed analytics audits, KPI frameworks, performance dashboards, testing roadmaps, and optimization recommendations that enable data-driven marketing decisions and continuous performance improvement.
```

---

### 10. Campaign Manager & Marketing Operations

**Command:** `/agents`  
**Paste this description:**

```
Act as a senior campaign manager and marketing operations specialist focusing on cross-channel campaign coordination, project management, and marketing technology optimization. You should be used when clients need:

1. Integrated marketing campaign planning and multi-channel coordination
2. Marketing project management and timeline development for complex initiatives
3. Marketing technology stack evaluation, implementation, and optimization
4. Budget planning, allocation, and spend tracking across all marketing channels
5. Marketing automation workflows and lead nurturing sequence development
6. Campaign launch coordination and stakeholder communication management
7. Vendor management and partnership coordination for marketing initiatives
8. Marketing process optimization and workflow standardization
9. Resource planning and team capacity management for marketing projects
10. Marketing compliance and quality assurance across all campaigns and channels

Your expertise includes project management methodologies, marketing automation platforms, CRM systems, and cross-functional team coordination. You ensure marketing campaigns are executed flawlessly, on time, and within budget while maintaining quality and brand consistency.

When working with clients, start by understanding their marketing objectives, available resources, technology stack, and organizational structure. Develop comprehensive campaign plans that coordinate all marketing functions and maximize efficiency.

You should work closely with all marketing team members to ensure seamless campaign execution, proper resource allocation, and timeline adherence. Your role includes troubleshooting issues, managing stakeholder expectations, and optimizing processes for scalability.

Deliver detailed project plans, campaign timelines, budget tracking systems, process documentation, and performance reports that ensure successful marketing campaign execution and continuous operational improvement across all marketing initiatives.
```

---

## PART III: MCP TROUBLESHOOTING GUIDE

### Current Issue
MCP servers are failing to connect despite being properly installed and configured.

### Status Check
✅ **StrategicBridge**: Connected successfully  
❌ **Context7**: Failed to connect  
❌ **Notion**: Failed to connect  
❌ **Scrapeless**: Failed to connect  

### Troubleshooting Steps

#### Step 1: Restart Claude Code
```bash
# Exit Claude Code completely and restart
# This often resolves connection issues
```

#### Step 2: Check Node.js Environment
```bash
# Verify Node.js and npm versions
node --version  # Should be v23.7.0 (current)
npm --version   # Should be 10.9.2 (current)

# Check if packages can be installed
npx -y @upstash/context7-mcp --help
```

#### Step 3: Manual MCP Server Testing
```bash
# Test each server individually
npx -y @upstash/context7-mcp &
npx -y @notionhq/notion-mcp-server &
npx -y scrapeless-mcp-server &

# Check if they start without errors
```

#### Step 4: Environment Variables
Some MCP servers require API keys:

**Context7 (Upstash)**
```bash
# May need Upstash credentials
export UPSTASH_REDIS_REST_URL="your-url"
export UPSTASH_REDIS_REST_TOKEN="your-token"
```

**Scrapeless**
```bash
# May need API key
export SCRAPELESS_API_KEY="your-key"
```

**Notion**
```bash
# Requires Notion API token
export NOTION_API_TOKEN="your-notion-token"
```

#### Step 5: Alternative Working Setup

If the above servers continue to fail, here are proven working MCP servers:

```bash
# Remove problematic servers
claude mcp remove context7
claude mcp remove notion  
claude mcp remove scrapeless

# Add filesystem server (always works)
claude mcp add filesystem "npx -y @modelcontextprotocol/server-filesystem"

# Add HubSpot for marketing (if you have HubSpot)
claude mcp add hubspot "npx -y @hubspot/mcp-server"

# Add YouTube for content research
claude mcp add youtube "npx -y youtube-data-mcp-server"
```

### Recommended Marketing MCP Setup

For your {{COMPANY_NAME}} marketing needs, I recommend these MCP servers:

#### 1. StrategicBridge (Already Working)
- **Purpose**: Document management and workflows
- **Status**: ✅ Connected

#### 2. YouTube Data Server
```bash
claude mcp add youtube "npx -y youtube-data-mcp-server"
```
- **Purpose**: YouTube research for content strategy
- **API Key**: Requires YouTube Data API key

#### 3. Notion Server (if you use Notion)
```bash
claude mcp add notion "npx -y @notionhq/notion-mcp-server"
```
- **Purpose**: Documentation and content management
- **API Key**: Requires Notion integration token

#### 4. Filesystem Server (Always Works)
```bash
claude mcp add filesystem "npx -y @modelcontextprotocol/server-filesystem"
```
- **Purpose**: Local file operations
- **No API Key**: Required, always works

### API Key Setup Instructions

**For YouTube MCP Server:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable YouTube Data API v3
4. Create credentials (API key)
5. Set environment variable:
```bash
export YOUTUBE_API_KEY="your-key-here"
```

**For Notion MCP Server:**
1. Go to [Notion Developers](https://developers.notion.com/)
2. Create new integration
3. Copy the Internal Integration Token
4. Set environment variable:
```bash
export NOTION_API_TOKEN="your-token-here"
```

**For Scrapeless (Web Search):**
1. Sign up at [Scrapeless](https://scrapeless.com/)
2. Get your API key
3. Set environment variable:
```bash
export SCRAPELESS_API_KEY="your-key-here"
```

### Testing Your Setup

After configuration, test with:
```bash
claude mcp list
```

You should see all servers as "Connected" ✅

---

## PART IV: CLIENT ONBOARDING & USAGE GUIDE

Step-by-step guide for using the Claude Co. Marketing Organization with any client.

### Pre-Client Meeting Preparation

#### 1. Agent System Check
- Verify all 8 agents are set up and functioning
- Test CMO agent with a simple brief
- Ensure access to Claude Code `/agents` command

#### 2. Client Discovery Questions
Prepare these questions for your client intake:

**Business Context:**
- What industry are you in?
- What is your current market position?
- Who are your main competitors?
- What are your primary business objectives for the next 12 months?

**Marketing Context:**
- What is your annual marketing budget?
- What marketing channels are you currently using?
- What has worked well? What hasn't?
- Who is your target audience?

**Project Scope:**
- What specific marketing challenges are you facing?
- What does success look like for this engagement?
- What is your timeline for seeing results?
- Are there any constraints or limitations we should know about?

---

### Client Onboarding Workflow

#### Phase 1: Strategic Foundation (Week 1-2)

**Step 1: CMO Strategy Session**
**Agent:** Chief Marketing Officer  
**Prompt Template:**
```
New client engagement: [Company Name] in [Industry].

Client Details:
- Industry: [Industry]
- Company size: [Size/Revenue]
- Current market position: [Position]
- Main competitors: [List]

Business Objectives:
- [Objective 1]
- [Objective 2] 
- [Objective 3]

Marketing Context:
- Annual budget: $[Amount]
- Current channels: [List]
- Target audience: [Description]
- Timeline: [Duration]

Please provide:
1. Initial strategic assessment
2. Recommended marketing organization structure for this client
3. Suggested phased approach for engagement
4. Key success metrics to track
5. Next steps for our marketing team
```

**Step 2: Market Intelligence Gathering**
**Agent:** Market Research Specialist  
**Prompt Template:**
```
Conduct comprehensive market research for [Company Name] in [Industry].

Research Objectives:
- Market size and growth trends
- Consumer behavior patterns
- Industry benchmarks and best practices
- Emerging trends and opportunities

Target Markets: [List target segments]

Please provide:
1. Market landscape analysis
2. Consumer insights and personas
3. Market opportunity assessment
4. Industry trend implications
5. Strategic recommendations based on findings
```

**Agent:** Competitive Intelligence Analyst  
**Prompt Template:**
```
Analyze competitive landscape for [Company Name] in [Industry].

Known Competitors: [List provided by client]

Please provide:
1. Comprehensive competitor mapping
2. Competitive positioning analysis
3. Competitor marketing strategy assessment
4. Competitive advantages and vulnerabilities
5. Competitive threats and opportunities
6. Strategic recommendations for differentiation
```

**Step 3: Brand Strategy Development**
**Agent:** Brand Strategist  
**Prompt Template:**
```
Develop brand strategy for [Company Name] based on:

Market Research Insights: [Summary from market research]
Competitive Analysis: [Summary from competitive analysis]
Business Objectives: [Client objectives]

Current Brand Position: [If established]
Target Audience: [Detailed description]

Please provide:
1. Brand positioning statement
2. Messaging framework
3. Brand personality and voice guidelines
4. Competitive differentiation strategy
5. Brand implementation roadmap
```

#### Phase 2: Tactical Planning (Week 3-4)

**Step 4: Campaign Strategy & Planning**
**Agent:** Campaign Manager & Marketing Operations  
**Prompt Template:**
```
Based on our strategic foundation, develop comprehensive campaign plan for [Company Name].

Strategic Context:
- Brand positioning: [Summary]
- Target audience: [Description]
- Budget: $[Amount]
- Timeline: [Duration]
- Success metrics: [KPIs]

Please provide:
1. Integrated campaign strategy
2. Channel mix recommendations
3. Budget allocation across channels
4. Implementation timeline
5. Resource requirements
6. Project management framework
```

**Step 5: Creative Strategy**
**Agent:** Creative Director  
**Prompt Template:**
```
Develop creative strategy for [Company Name] campaign.

Brand Guidelines:
- Positioning: [Brand positioning]
- Personality: [Brand personality]
- Voice: [Brand voice]
- Visual identity: [If established]

Campaign Objectives: [Objectives]
Target Audience: [Description]
Key Messages: [Core messages]

Please provide:
1. Creative strategy and concept
2. Visual identity recommendations
3. Creative asset requirements
4. Production timeline and budget
5. Brand consistency guidelines
```

#### Phase 3: Channel-Specific Planning (Week 3-4)

**Step 6: Content Strategy**
**Agent:** Content Marketing Manager  
**Prompt Template:**
```
Create comprehensive content strategy for [Company Name].

Strategic Context:
- Brand messaging: [Key messages]
- Target audience: [Personas]
- Campaign timeline: [Duration]
- Content budget: $[Amount]

Please provide:
1. Content strategy framework
2. Editorial calendar (12 months)
3. Content pillar topics
4. SEO keyword strategy
5. Content production workflow
6. Performance measurement plan
```

**Step 7: Social Media Strategy**
**Agent:** Social Media Manager  
**Prompt Template:**
```
Develop social media strategy for [Company Name].

Brand Context:
- Voice and tone: [Guidelines]
- Target audience: [Demographics and behaviors]
- Campaign objectives: [Goals]
- Social media budget: $[Amount]

Current Social Presence: [Audit results if available]

Please provide:
1. Platform strategy for each channel
2. Content calendar and posting schedule
3. Community management guidelines
4. Social advertising strategy
5. Influencer partnership recommendations
6. Social media KPIs and reporting framework
```

**Step 8: Analytics & Measurement**
**Agent:** Data Analyst & Performance Marketing  
**Prompt Template:**
```
Set up comprehensive analytics and measurement framework for [Company Name].

Campaign Details:
- Marketing channels: [List]
- Budget allocation: [Breakdown]
- Success metrics: [KPIs from CMO]
- Reporting requirements: [Frequency and format]

Current Analytics Setup: [Description if available]

Please provide:
1. Analytics audit and recommendations
2. KPI framework and measurement plan
3. Attribution modeling strategy
4. Dashboard and reporting structure
5. Testing and optimization roadmap
6. ROI tracking methodology
```

---

### Phase 4: Presentation & Implementation (Week 5)

#### Client Presentation Structure

1. **Executive Summary (CMO)**
   - Strategic overview
   - Key recommendations
   - Investment required
   - Expected outcomes

2. **Market Intelligence (Research + Competitive)**
   - Market opportunity
   - Competitive landscape
   - Strategic positioning

3. **Brand Strategy (Brand Strategist)**
   - Brand positioning
   - Messaging framework
   - Differentiation strategy

4. **Campaign Strategy (Campaign Manager)**
   - Integrated approach
   - Channel mix
   - Timeline and budget

5. **Creative Strategy (Creative Director)**
   - Creative concept
   - Visual identity
   - Asset requirements

6. **Channel Strategies (Content + Social)**
   - Content approach
   - Social media strategy
   - Distribution plan

7. **Measurement Plan (Data Analyst)**
   - Success metrics
   - Tracking methodology
   - Reporting framework

---

### Ongoing Client Management

#### Monthly Check-ins
**Agent:** Campaign Manager  
**Prompt:**
```
Provide monthly performance review for [Company Name] including:
1. Campaign performance against KPIs
2. Budget utilization
3. Key accomplishments
4. Challenges and solutions
5. Recommendations for next month
```

#### Quarterly Strategic Reviews
**Agent:** CMO  
**Prompt:**
```
Conduct quarterly strategic review for [Company Name]:
1. Performance against business objectives
2. Market changes and implications
3. Competitive landscape updates
4. Strategic adjustments needed
5. Next quarter priorities
```

#### Performance Optimization
**Agent:** Data Analyst  
**Prompt:**
```
Analyze performance data for [Company Name] and provide:
1. Channel performance analysis
2. Optimization opportunities
3. Budget reallocation recommendations
4. A/B testing results and next tests
5. ROI improvement strategies
```

---

### Quality Assurance Checklist

Before delivering to client, ensure:

- [ ] All agent outputs are aligned with brand strategy
- [ ] Budget allocations add up correctly
- [ ] Timelines are realistic and coordinated
- [ ] Success metrics are clearly defined and measurable
- [ ] Recommendations are actionable and specific
- [ ] Client-specific context is reflected throughout
- [ ] All deliverables are professional and presentation-ready

---

## ONGOING OPERATIONS

### DAILY WORKFLOW EXECUTION

#### Standard Operating Procedure
**When you need to create content:**

1. **Choose Topic** - Identify content need based on strategy
2. **Execute Workflow** - Use templates from `AUTOMATED_CONTENT_WORKFLOW_SCRIPTS.md`
3. **Monitor Performance** - Track timing and quality metrics
4. **Publish and Distribute** - Deploy across all planned channels
5. **Track Results** - Monitor performance and engagement

#### Quality Maintenance
- **Weekly Review** - Assess workflow performance and content quality
- **Monthly Optimization** - Refine prompts and processes based on results
- **Quarterly Enhancement** - Upgrade agent configurations and capabilities

### TROUBLESHOOTING GUIDE

#### Common Issues and Solutions

**Issue: Agent not responding or giving poor output**
- Solution: Check agent configuration, refresh with `/agents` command
- Verify: Prompt clarity and context provided
- Alternative: Use different agent or rephrase prompt

**Issue: Brand inconsistency across outputs**
- Solution: Update brand guidelines document with more specific direction
- Verify: All agents referencing brand guidelines correctly
- Alternative: Add brand validation checkpoint in workflow

**Issue: Workflow taking longer than 90 minutes**
- Solution: Streamline prompts, remove unnecessary detail requests
- Verify: Agents working in parallel where possible
- Alternative: Split complex topics into multiple workflow runs

**Issue: Content quality below professional standards**
- Solution: Enhance agent prompts with more specific quality requirements
- Verify: Research integration and expertise demonstration
- Alternative: Add additional quality review steps

#### Performance Optimization

**Efficiency Improvements:**
- Batch similar content topics for streamlined execution
- Create template libraries for common content types
- Develop agent prompt variations for different industries
- Build content topic calendars for systematic production

**Quality Enhancements:**
- Regular brand guideline updates and refinements  
- Agent prompt optimization based on output quality
- Cross-platform content adaptation improvements
- Performance tracking and optimization integration

---

## SUCCESS VALIDATION

### Implementation Success Checklist

**Foundation Complete:**
□ All 9 agents configured and responding correctly
□ Brand guidelines populated and accessible to agents
□ System validation tests passed successfully
□ Basic agent coordination working effectively

**Workflow Operational:**
□ Full workflow executed within 90-minute target
□ Content quality meets professional consulting standards
□ Brand consistency maintained across all outputs
□ Multi-platform content adaptations completed successfully
□ Performance tracking system operational

**Production Ready:**
□ Optimized workflow templates created and accessible
□ Troubleshooting procedures documented and tested
□ Performance monitoring and optimization system active
□ First production content successfully created and deployed

### Business Impact Expectations

**Immediate Benefits (Week 1):**
- Professional-quality content creation in 90 minutes
- Consistent brand voice across all marketing materials
- Multi-platform content distribution readiness
- Strategic expertise demonstration in all content

**30-Day Impact:**
- 10+ high-quality articles created and published
- Established thought leadership content library
- Optimized content creation process and timing
- Measurable improvement in content engagement

**90-Day Transformation:**
- Full marketing team capabilities operational through Claude Code
- Strategic content marketing driving qualified lead generation
- Industry authority and thought leadership positioning established
- Scalable content production system supporting business growth

**Annual Vision:**
- Enterprise-level marketing organization entirely through Claude Code
- Systematic content marketing driving significant business growth
- Competitive advantage through unique AI-powered marketing capabilities
- Thought leadership position in strategic marketing and business frameworks

This comprehensive implementation guide transforms your Claude Code environment into a professional marketing organization capable of delivering enterprise-level results through systematic, automated workflows.