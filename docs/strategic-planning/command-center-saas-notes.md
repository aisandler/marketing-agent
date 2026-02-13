# Command Center — SaaS Product Strategy Notes

> Working document for exploring the Command Center as a commercial product.

## The Opportunity

The Command Center turns Claude Code's agent system into a visual, browser-based interface. This removes the terminal barrier — non-technical marketing teams can operate AI agents directly. The path from internal tool to SaaS product:

**Internal POC** → **Polished self-hosted tool** → **Hosted multi-tenant SaaS**

## What Makes This Sellable

1. **Agent orchestration UI** — No one else has a browser interface for Claude Code agent systems
2. **Domain-specific agents** — 15 marketing specialists are pre-configured, not generic chat
3. **Context engineering** — Brand intelligence, competitive data, and content rules are baked into every session
4. **Permission model** — Non-technical users can safely approve/deny tool operations
5. **No terminal required** — Marketing teams use a browser, not a CLI

## Product Tiers (Conceptual)

### Starter (Self-Hosted)
- Open source Command Center UI
- BYO Claude Code authentication
- Single-user, local deployment
- All 15 agents included
- Community support

### Professional (Hosted)
- Multi-user with role-based access
- Session history and persistence
- Shared brand context across team
- Usage analytics and cost tracking
- Agent performance dashboards
- Email support

### Enterprise (Hosted + Custom)
- Custom agent definitions
- SSO/SAML authentication
- Audit logging
- API access for external integrations
- Dedicated infrastructure
- Custom brand templates and onboarding flows
- White-label option

## Technical Requirements for SaaS

### Authentication & Multi-Tenancy
- User accounts with OAuth (Google, GitHub, email)
- Organization/workspace model (one brand per workspace)
- API key management per workspace (users bring their own Anthropic key, or metered billing)
- Session isolation between tenants

### Persistence Layer
- Session transcripts stored per workspace
- Brand context stored server-side (replaces local `client-context/`)
- Agent configuration overrides per workspace
- Usage/cost tracking per user and workspace

### Deployment
- Containerized Bun server (Docker)
- Stateless server design — sessions stored externally
- WebSocket scaling via Redis pub/sub or similar
- CDN for static UI assets
- Health monitoring and auto-scaling

### Billing Model Options
1. **Seat-based** — $X/user/month, includes Y agent sessions
2. **Usage-based** — Pay per session or per token (pass-through + margin)
3. **Hybrid** — Base seat fee + usage overage
4. **BYO Key** — Users provide Anthropic API key, pay SaaS fee for UI/infra only

## Key Questions to Resolve

- **API key model**: Do we proxy through our Anthropic account (revenue share) or users BYO key?
- **Agent marketplace**: Can users create and share custom agent definitions?
- **Template library**: Pre-built prompt templates per industry (real estate, dental, SaaS, etc.)?
- **Integration layer**: Connect to user's Airtable, HubSpot, Mailchimp, etc.?
- **White label**: Let agencies rebrand and resell to their clients?
- **Pricing sensitivity**: What's the willingness to pay for browser-based agent access vs. CLI?

## Competitive Landscape

| Product | Overlap | Differentiation |
|---------|---------|-----------------|
| ChatGPT/Claude.ai | General chat UI | No agent orchestration, no domain-specific context |
| Jasper/Copy.ai | Marketing AI tools | Template-based, not agent-based; no tool use |
| HubSpot AI | Marketing suite AI | Locked to HubSpot ecosystem |
| Custom GPTs | Agent marketplace | No tool use, no file system access, no multi-turn orchestration |

## Next Steps (When Ready)

1. Stabilize the POC UI through iteration
2. Add session persistence (SQLite or Postgres)
3. Implement user authentication (start with simple JWT)
4. Build workspace/organization model
5. Add usage tracking and cost attribution
6. Deploy to a cloud environment (Fly.io, Railway, or AWS)
7. Beta test with 3-5 external users
8. Determine pricing model based on usage patterns
