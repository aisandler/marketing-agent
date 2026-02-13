# Marketing Agent Plugin — Portable Mini Version

## Context

The full marketing-agent system is a 15-agent marketing organization with infrastructure (Airtable, image gen, intel collection, portal). But the "brain" — agents, commands, context architecture — is pure markdown/JSON with zero external dependencies. This plan builds a portable plugin version that can be dropped into any Claude Code project to add marketing capabilities without requiring any infrastructure.

**Why:** Developers and small businesses using Claude Code on their projects could bolt on marketing strategy + content planning without needing to adopt the full system. Lower barrier, wider reach.

**What's different from the full system:**
- No infrastructure dependencies (no Airtable, no image gen, no servers)
- Coexists with existing project CLAUDE.md (appendable, not replaceable)
- Tiered agent roster (start with 5, expand to 15)
- 5-minute onboarding (vs 10-30 min full version)
- Namespaced under `marketing/` directory (no collisions)
- Single orchestrator command `/marketing` (vs `/cmo` + `/analyst`)

---

## Plugin Package Structure

```
marketing-agent-plugin/
├── README.md                              # Installation + usage guide
├── setup.sh                               # Interactive installer
├── uninstall.sh                           # Clean removal
├── manifest.json                          # Plugin metadata + tier definitions
├── claude-md-section.md                   # CLAUDE.md append block (with HTML markers)
├── hooks/
│   └── check-marketing-setup.sh           # Lite SessionStart hook
├── tiers/
│   ├── core/                              # Always installed (5 agents)
│   │   ├── agents/
│   │   │   ├── brand-strategy-consultant.md
│   │   │   ├── content-marketing-strategist.md
│   │   │   ├── marketing-analytics-specialist.md
│   │   │   ├── seo-optimization-specialist.md
│   │   │   └── social-media-strategist.md
│   │   └── commands/
│   │       ├── marketing.md               # Lite orchestrator (7 pathways)
│   │       └── brand-setup.md             # 5-min onboarding
│   ├── growth/                            # +4 agents
│   │   ├── agents/
│   │   │   ├── creative-director.md
│   │   │   ├── email-marketing-specialist.md
│   │   │   ├── lead-writer.md
│   │   │   └── paid-media-specialist.md
│   │   └── commands/
│   │       └── marketing.md               # Extended orchestrator (11 pathways)
│   └── enterprise/                        # +6 agents (full 15)
│       ├── agents/
│       │   ├── competitive-intelligence-analyst.md
│       │   ├── conversion-flow-optimizer.md
│       │   ├── crisis-response-specialist.md
│       │   ├── market-research-specialist.md
│       │   ├── monthly-content-planner.md
│       │   └── website-analysis-specialist.md
│       └── commands/
│           └── marketing.md               # Full orchestrator (17 pathways)
└── context/
    └── marketing/
        ├── brand/  (.gitkeep)
        ├── business/  (.gitkeep)
        └── templates/
            ├── brand-voice-template.md
            └── content-standards-template.md
```

---

## What Gets Installed in the Host Project

```
host-project/
├── .claude/
│   ├── agents/
│   │   ├── (existing agents untouched)
│   │   └── 5-15 marketing agents (per tier)
│   ├── commands/
│   │   ├── (existing commands untouched)
│   │   ├── marketing.md
│   │   └── brand-setup.md
│   ├── hooks/
│   │   └── check-marketing-setup.sh
│   └── settings.json                 # MERGED (hook added to existing)
├── marketing/                        # Namespaced context directory
│   ├── brand/
│   ├── business/
│   └── templates/
├── CLAUDE.md                         # APPENDED between HTML markers
└── .marketing-plugin.json            # Install state (tier, files, hashes)
```

---

## Files to Create (New)

### 1. `setup.sh` — Interactive Installer

Handles: tier selection, collision detection, settings.json merge, CLAUDE.md append, state tracking.

Key logic:
- Check for existing `.claude/agents/` files with same names — warn + offer overwrite/skip/diff
- Merge into `settings.json` using jq (add SessionStart hook without clobbering existing hooks)
- Append to CLAUDE.md between `<!-- MARKETING-AGENT-PLUGIN-START -->` / `<!-- MARKETING-AGENT-PLUGIN-END -->` markers (idempotent — replace on re-run)
- Write `.marketing-plugin.json` with installed file list + hashes for upgrade detection
- Support `--tier core|growth|enterprise` flag (default: core)

### 2. `uninstall.sh` — Clean Removal

Reads `.marketing-plugin.json`, removes only files the plugin installed, strips CLAUDE.md section between markers, removes hook from settings.json, optionally preserves `marketing/` brand context.

### 3. `manifest.json` — Plugin Metadata

```json
{
  "name": "marketing-agent-plugin",
  "version": "1.0.0",
  "tiers": {
    "core":       { "agents": 5,  "pathways": 7  },
    "growth":     { "agents": 9,  "pathways": 11 },
    "enterprise": { "agents": 15, "pathways": 17 }
  }
}
```

### 4. `claude-md-section.md` — Appendable CLAUDE.md Block (~40 lines)

Wrapped in HTML comment markers. Contains: quick-start commands, agent table, context directory reference. Dynamically reflects installed tier.

### 5. `check-marketing-setup.sh` — Lite SessionStart Hook

Simplified from the full `check-onboarding.sh` (107 lines → ~15 lines). Checks if `marketing/brand/` exists, outputs JSON hint suggesting `/brand-setup` if missing. No intelligence freshness checks.

### 6. `marketing.md` — Lite Orchestrator Command (~200 lines per tier variant)

Modeled after `cmo.md` (647 lines) but lighter:
- Persona: **Maven** (Marketing Strategist) — distinct from Cleon (full CMO)
- No Agent Teams (no Teammate/SendMessage in allowed-tools)
- No intelligence write-back, no microbrief system, no quality validation hooks
- Reads from `marketing/brand/` instead of `client-context/brand/`
- 3 pre-built variants (core/growth/enterprise) rather than runtime patching

**Core tier pathways (7):**

| # | Pathway | Primary Agent | Supporting |
|---|---------|--------------|------------|
| 1 | Content Plan | content-marketing-strategist | seo-optimization-specialist |
| 2 | Brand Messaging | brand-strategy-consultant | content-marketing-strategist |
| 3 | SEO Strategy | seo-optimization-specialist | content-marketing-strategist |
| 4 | Social Strategy | social-media-strategist | content-marketing-strategist |
| 5 | Performance Review | marketing-analytics-specialist | seo-optimization-specialist |
| 6 | Competitive Analysis | brand-strategy-consultant | marketing-analytics-specialist |
| 7 | Campaign Development | content-marketing-strategist | social-media-strategist, brand-strategy-consultant |

**Growth adds:** Email Campaign, Paid Media Launch, Long-form Content, Creative Campaign
**Enterprise adds:** Lead Gen, Crisis Mgmt, Annual Strategy, Deep Competitive, Market Research, Website Audit

### 7. `brand-setup.md` — 5-Minute Onboarding (~120 lines)

Simplified from `onboard.md` (382 lines):
- 5 questions: company+industry, products/services, ideal customer, differentiators, brand personality
- Generates 2 files: `marketing/brand/messaging-framework.md`, `marketing/business/company-profile.md`
- No framework selection (implicit StoryBrand-like structure)
- No intake folder scanning, no analysis modules, no config/*.json generation
- No agent sub-coordination

---

## Files to Adapt (From Existing Codebase)

Each agent needs these modifications:
1. **Path references:** `client-context/` → `marketing/` throughout
2. **Strip infrastructure refs:** Remove mentions of Airtable, content-bank.md, Perplexity, Playwright, config/*.json
3. **Keep everything else:** Persona, expertise, approach, deliverable standards, stop hooks

| Source | Adaptation Level |
|--------|-----------------|
| `brand-strategy-consultant.md` (48 lines) | Minimal — nearly infrastructure-free already |
| `marketing-analytics-specialist.md` (63 lines) | Light — remove Playwright refs |
| `seo-optimization-specialist.md` (86 lines) | Moderate — remove Perplexity/Playwright |
| `social-media-strategist.md` (112 lines) | Moderate — remove content-bank, Perplexity |
| `content-marketing-strategist.md` (115 lines) | Moderate — remove Airtable, change paths |
| Growth/Enterprise agents (74-200 lines each) | Same pattern — path changes + strip infra |

---

## Repository Setup

**Separate repo:** `marketing-agent-lite` (or similar name TBD)

The plugin lives in its own repository, independent from the full `marketing-agent` system. Agent files are adapted copies (not symlinks or submodules) so the plugin repo is fully standalone with no dependency on the parent repo.

This means:
- Independent versioning and releases
- Can be distributed as a GitHub repo clone, zip download, or future npm package
- Changes to agents in the full system don't auto-propagate (intentional — plugin agents are stripped-down variants)
- The full system remains unmodified by this work

## Implementation Sequence

### Phase 1: New Repo + Core Tier (MVP)
1. Create new repo with plugin directory structure
2. Write `manifest.json`
3. Adapt 5 core agents from `marketing-agent/.claude/agents/` (path changes, strip infrastructure)
4. Write `marketing.md` core variant (~200 lines, modeled after `cmo.md`)
5. Write `brand-setup.md` (~120 lines, modeled after `onboard.md`)
6. Write `check-marketing-setup.sh` (~15 lines)
7. Write `claude-md-section.md` (~40 lines)
8. Write `setup.sh` (core tier only initially)
9. Write `uninstall.sh`
10. Write `README.md` with installation guide

### Phase 2: Growth + Enterprise Tiers
1. Adapt 4 growth agents from source repo
2. Write `marketing.md` growth variant
3. Adapt 6 enterprise agents from source repo
4. Write `marketing.md` enterprise variant
5. Extend `setup.sh` for tier selection + upgrade

### Phase 3: Polish
1. Test install into a clean project directory
2. Test upgrade from core → growth → enterprise
3. Test uninstall (clean removal)
4. Test CLAUDE.md append/replace idempotency
5. Test settings.json merge with existing hooks

---

## Key Design Decisions

**Why `marketing/` not `client-context/`:** Avoids collision with existing project directories. Clear namespace. Easy to .gitignore if needed.

**Why `Maven` not `Cleon`:** If someone later upgrades to the full system, distinct personas prevent confusion. Maven = strategist, Cleon = CMO.

**Why 3 pre-built command variants (not runtime patching):** Each is ~200 lines. The duplication is small (~600 lines total). Runtime patching with sed/awk is fragile and harder to debug.

**Why HTML comment markers in CLAUDE.md:** Invisible in rendered markdown, machine-parseable for idempotent updates, clean removal by uninstall.sh.

**Why no Agent Teams in plugin:** Requires experimental flag + adds complexity. Plugin should be zero-config.

---

## Verification

1. **Fresh install test:** Create empty project dir → run `setup.sh` → verify agents/commands/hooks installed → run `/brand-setup` → answer 5 questions → verify `marketing/brand/` populated → run `/marketing` → select pathway 1 → verify agent spawns and produces output
2. **Existing project test:** Take a project with existing CLAUDE.md + `.claude/settings.json` → run `setup.sh` → verify CLAUDE.md appended (not replaced) → verify settings.json hooks merged (existing hooks preserved) → verify no file collisions
3. **Upgrade test:** Install core → run `setup.sh --tier growth` → verify 4 new agents added → verify marketing.md replaced with growth variant → verify `.marketing-plugin.json` updated
4. **Uninstall test:** Run `uninstall.sh` → verify all plugin files removed → verify CLAUDE.md section stripped → verify settings.json hook removed → verify existing project files untouched
5. **Collision test:** Create a project with an existing `brand-strategy-consultant.md` agent → run `setup.sh` → verify warning + overwrite/skip prompt

---

## Critical Source Files

| File | Why It Matters |
|------|----------------|
| `.claude/commands/cmo.md` | Template for `marketing.md` — strategic_pathways YAML, orchestration workflow, context validation |
| `.claude/commands/onboard.md` | Template for `brand-setup.md` — question flow, output architecture |
| `.claude/agents/brand-strategy-consultant.md` | Lightest agent (48 lines) — reference for minimal adaptation needed |
| `.claude/settings.json` | Hook structure that `setup.sh` must merge into |
| `.claude/hooks/check-onboarding.sh` | Template for `check-marketing-setup.sh` — JSON output pattern |
| All 15 agent files in `.claude/agents/` | Source material for adapted plugin agents |
