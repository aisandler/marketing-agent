# Installation Guide

Get your AI Marketing Organization running in under 10 minutes.

---

## Prerequisites

### Required

**Claude Code CLI** — This system runs entirely inside Claude Code.

- Install: https://docs.anthropic.com/en/docs/claude-code
- Requires a Claude Pro, Max, or Team subscription (or Anthropic API key)
- Verify it's working: run `claude` in your terminal

### Optional

- **Node.js 18+** — needed for image generation, social intelligence, and Airtable sync
- **Airtable account** — for content calendar management
- **OpenRouter API key** — for AI image generation (~$0.14/image)

---

## Step 1: Unzip and Open

```bash
unzip marketing-agent.zip -d marketing-agent
cd marketing-agent
```

---

## Step 2: Gather Your Brand Materials

Before running onboarding, collect whatever you have and drop it into the intake folder:

```bash
cp ~/path-to-your-materials/* onboarding/intake/
```

**What to include** (use whatever you have — more is better):

| Material | Examples |
|----------|----------|
| **Brand basics** | Logo usage guide, brand colors, tagline, mission statement |
| **Website content** | Homepage copy, About page, service descriptions |
| **Audience info** | Customer personas, demographics, ideal client profile |
| **Competitor info** | Competitor URLs, positioning notes, differentiators |
| **Existing content** | Past newsletters, social posts, blog articles |
| **Voice samples** | Writing samples that capture how you want to sound |
| **Business details** | Service areas, pricing tiers, seasonal patterns |

Don't have all of this? That's fine. The onboarding process will ask clarifying questions for anything it needs. Even a website URL and a few sentences about your business is enough to get started.

---

## Step 3: Run Onboarding

Open Claude Code in the project folder and run the onboarding command:

```bash
claude
```

Then inside Claude Code:

```
/onboard
```

The onboarding specialist will walk you through a guided conversation to build your brand architecture. This generates:

- **Brand voice and tone guide** — how your brand sounds
- **Competitive positioning** — how you stand apart
- **Content pillars** — what you talk about and why
- **Customer profiles** — who you're talking to
- **SEO keyword foundation** — what your audience searches for
- **Paid media readiness profile** — your advertising baseline

All outputs land in `client-context/` and `config/`. Every agent in the system reads from these files, so all content stays on-brand from day one.

---

## Step 4: Start Using It

You have two primary commands:

### `/cmo` — Your Marketing Co-Pilot

Strategic planning, campaign creation, and content generation. Use it for:

- Monthly content calendars
- Seasonal campaigns
- Product or service launches
- Email marketing sequences
- Paid media strategy
- Competitive response plans
- Brand awareness campaigns

```
/cmo
```

The CMO presents a menu of strategic pathways. Pick one and have a conversation — it coordinates the right specialist agents behind the scenes.

### `/analyst` — Marketing Intelligence

Performance analysis, optimization, and market research. Use it for:

- Weekly performance reviews
- Competitive deep dives
- SEO audits
- Paid media performance checks
- Content effectiveness analysis
- Market research

```
/analyst
```

### Other Commands

| Command | What It Does |
|---------|-------------|
| `/discover` | Explore the full system and all 15 agents |
| `/images` | Generate AI images for social posts |
| `/intel` | Collect competitive intelligence from social media |
| `/transcript` | Extract marketing insights from call recordings |
| `/report` | Website performance reports (requires GA/GSC setup) |

---

## Step 5: Optional Integrations

These are not required to use the system. Set them up when you're ready.

### Airtable Content Calendar

Sync your content plan to an Airtable base for team visibility and publishing workflows.

```bash
# 1. Copy the env template
cp .env.example .env

# 2. Add your Airtable credentials to .env
#    Get a token at: https://airtable.com/create/tokens
#    Required scopes: data.records:read, data.records:write, schema.bases:read, schema.bases:write

# 3. Auto-configure your Airtable base schema
npx tsx automation/airtable-setup/setup-base.ts --token YOUR_TOKEN --open
```

### AI Image Generation

Generate brand-aligned images for social media posts using Gemini via OpenRouter.

```bash
# 1. Get an API key at https://openrouter.ai/keys
# 2. Add OPENROUTER_API_KEY to your .env file
# 3. Check status and generate
/images status
/images generate
```

Cost: approximately $0.14 per image.

### Social Intelligence

Collect competitor and industry insights from LinkedIn and Twitter/X.

```bash
/intel status    # Check freshness
/intel collect   # Run collection
```

---

## Recommended Weekly Workflow

Once you're set up, here's a practical weekly cadence:

| Day | What to Do |
|-----|-----------|
| **Monday** | `/intel` to collect fresh competitive data, `/cmo` to plan the week |
| **Tuesday** | `/images` to generate visuals for scheduled posts |
| **Wednesday** | `/cmo` for content creation, `/analyst` for mid-week performance check |
| **Thursday** | `/transcript` to process any call notes, review scheduled content |
| **Friday** | `/analyst` for weekly review, `/cmo` to plan next week |

---

## Troubleshooting

**"Command not found" when running /cmo or /onboard**
Make sure you opened Claude Code from inside the `marketing-agent` directory. The commands are project-scoped.

**Onboarding asks questions I don't know the answer to**
Skip what you don't know. You can always re-run `/onboard` later to fill in gaps. The system works with partial information.

**Want to redo onboarding from scratch?**
Delete the `client-context/brand/` folder and run `/onboard` again.

**Need help inside a session?**
Type `/discover` to see everything the system can do, or just describe what you need in plain language — the CMO will route it to the right agent.

---

## System Reference

- **User Guide**: Open `docs/marketing-agent-guide.html` in a browser for an interactive guide to the full system
- **Architecture**: See `CLAUDE.md` for the complete technical reference
- **15 Agents**: Content strategist, SEO specialist, email marketing, paid media, brand strategy, creative director, market research, analytics, social media, crisis response, conversion optimization, and more — all coordinated automatically
