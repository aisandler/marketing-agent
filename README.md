# Marketing Agent

**Your AI-Powered Marketing Organization**

A complete AI marketing organization template powered by Claude Code. Get professional marketing strategy and execution through intelligent agent coordination.

## Quick Start

```bash
# 1. Clone this repository
git clone <repo-url> marketing-agent
cd marketing-agent

# 2. Place your brand materials in the intake folder
# Add: website content, brand guidelines, competitor info, etc.
cp your-materials/* onboarding/intake/

# 3. Configure your marketing organization
/onboard

# 4. Start strategic planning
/cmo
```

## What This System Does

You have a complete **AI Marketing Organization** with 15 specialized agents that handle:

- **Content Creation**: Blog posts, social media, email campaigns
- **Strategic Planning**: Monthly calendars, seasonal campaigns, product launches
- **Market Intelligence**: Competitor analysis, performance optimization, market research
- **SEO & Analytics**: Keyword research, content optimization, ROI measurement
- **Email Marketing**: Newsletter campaigns, promotional emails, automation sequences
- **Paid Media**: Campaign strategy, budget allocation, audience targeting, platform optimization

## Commands

| Command | Purpose |
|---------|---------|
| `/onboard` | Configure your brand architecture |
| `/cmo` | Strategic marketing planning |
| `/analyst` | Marketing intelligence & optimization |
| `/images` | AI image generation toolkit |
| `/intel` | Social media intelligence collection |
| `/discover` | Explore system capabilities |

## How It Works

1. **Configure Your Brand**: Run `/onboard` to process your brand materials
2. **Strategic Planning**: Use `/cmo` to plan campaigns and content
3. **Content Generation**: Agents create brand-aligned content
4. **Review & Publish**: Approve content via dashboard, sync to Airtable

## Repository Structure

```
marketing-agent/
├── .claude/
│   ├── agents/          # Specialized marketing agents
│   ├── commands/        # Slash command definitions
│   └── skills/          # Workflow skills and templates
│       ├── images/      # /images - AI image generation toolkit
│       └── social-intel/# /intel - Social media intelligence
├── automation/          # Integration scripts
│   ├── image-generation/# AI image generation (~$0.14/image)
│   ├── intel/           # Social intelligence collectors & analysis
│   └── airtable-setup/  # Airtable auto-configuration
├── client-context/      # Brand-specific content (generated)
├── content/             # Generated marketing content
├── docs/                # Reference documentation
│   └── intelligence/    # Social media intelligence data
├── expansions/          # Template examples
│   └── partner-voice-template/  # Voice profile template
├── portal/              # Partner content review portal
└── onboarding/
    └── intake/          # Place brand materials here
```

## Configuration

### New Brand Setup

1. **Add Materials**: Place brand documents in `onboarding/intake/`
   - Website content
   - Brand guidelines
   - Competitor information
   - Target audience profiles

2. **Run Onboarding**: Execute `/onboard` to generate:
   - Brand architecture (`client-context/brand/`)
   - Voice guides
   - Competitive positioning
   - Content pillars

3. **Configure Airtable** (optional):
   - Set up content calendar table
   - Configure table IDs in system

### Partner Voice Profiles

For team members with distinct voices:

1. Copy `expansions/partner-voice-template/` to `.claude/skills/<name>/`
2. Customize all `{{PLACEHOLDER}}` values
3. Reference in social content workflow

## Agents

| Agent | Specialty |
|-------|-----------|
| **CMO** | Strategic orchestration |
| **Content Strategist** | Content planning |
| **Social Media Strategist** | Platform strategy |
| **SEO Specialist** | Search optimization |
| **Email Marketing** | Email campaigns |
| **Market Research** | Consumer insights |
| **Brand Strategy** | Brand positioning |
| **Creative Director** | Visual identity |
| **Analytics Specialist** | Performance measurement |
| **Crisis Response** | Reputation management |

## Documentation

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | System configuration |
| `docs/reference/CONTEXT-ARCHITECTURE.md` | Context system overview |
| `docs/reference/social-content-rules.md` | Content guidelines |
| `.claude/skills/social-content-workflow.md` | Workflow reference |

## Requirements

- Claude Code CLI
- Node.js (for dashboard)
- Airtable account (optional, for content management)

## License

MIT
