# Marketing Agent TUI Command Center — Build Prompt

## What You're Building

A React Ink terminal UI (TUI) that serves as the **operator command center** for this marketing agent system. It should feel like opening Claude Code itself — terminal-native, keyboard-driven, dark background, monospace aesthetic — but with panels and views specific to this marketing organization.

This is NOT a client-facing dashboard. This is the operator's cockpit: fast access to context files, one-key agent launching, real-time activity streams, pipeline status, and intelligence freshness. Think of it as a custom shell wrapped around the marketing agent.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  MARKETING COMMAND CENTER                          Session: abc123  │
│  ◉ Onboarded  ◉ Intel Fresh  ◉ 3 Agents Active      12:34 PM     │
├──────────────────┬──────────────────────┬───────────────────────────┤
│  AGENTS          │  ACTIVITY STREAM     │  CONTEXT & INTEL          │
│                  │                      │                           │
│  [C] CMO       ● │  [CMO] 12:31 ▶ SPAWN│  CONTEXT FILES            │
│   ├─ [d] Cont  ● │    content-market..  │  [1] brand.json           │
│   └─ [n] SEO   ● │  [Cont] 12:31 → TOOL│  [2] voice-guide.md       │
│  [A] Analyst   ○ │    Read content-b..  │  [3] content-bank.md      │
│  ──────────────  │  [SEO]  12:32 → TOOL│  [4] competitive.md       │
│  SPECIALISTS     │    WebSearch "keyw.. │  [5] partners.json        │
│  [b] Brand Strat │  [Cont] 12:32 ✓ DONE│  [6] airtable.json        │
│  [c] Comp Intel  │    Write blog-pos..  │  ──────────────────────   │
│▸ [d] Content Mkt │  [Cont] 12:32 ■ STOP│  INTELLIGENCE STATUS      │
│  [e] Conv Flow   │  [CMO] 12:33 ▶ SPAWN│  Competitive: 12d ago ●   │
│  [f] Creative    │    email-marketing.. │  Performance: 5d ago ●    │
│  [g] Crisis Resp │                      │  Seasonal: 30d ago ◐      │
│  [h] Email Mkt   │  ─── Content Mkt ─── │  Website: Never run ○     │
│  [i] Lead Writer │  Running: 2m 14s     │  Ledger: 8 sessions       │
│  [j] Market Res  │  Tools: 8 (3R 2W 2G) │                           │
│  [k] Mkt Analyt  │  Parent: CMO         │                           │
│  [l] Content Pln │                      │                           │
│  [m] Paid Media  │                      │                           │
│  [n] SEO Optim   │                      │                           │
│  [o] Social Med  │                      │                           │
│  [p] Website An  │                      │                           │
├──────────────────┴──────────────────────┴───────────────────────────┤
│  > _                                                     [?] help  │
│  /cmo  /analyst  /onboard  /images  /intel  /report  /transcript   │
└─────────────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Runtime**: Bun (already used by the project's TypeScript tooling)
- **TUI Framework**: React Ink (`ink` + `ink-text-input` + `ink-select-input` + `ink-spinner`)
- **Event Server**: Bun HTTP server with WebSocket (receives hook events, broadcasts to TUI)
- **Database**: SQLite via `bun:sqlite` (stores hook events for replay/history)
- **Process Management**: Bun subprocess API for launching agents

Install location: `command-center/` at project root (sibling to `automation/`, `visualizers/`, etc.)

```
command-center/
├── package.json
├── tsconfig.json
├── server.ts              # Bun HTTP + WebSocket event server
├── cli.ts                 # Main entry point (launches server + TUI)
├── db.ts                  # SQLite schema and queries
├── hooks/                 # Hook scripts that POST events to server
│   ├── event-forwarder.sh # Universal hook script (reads stdin, POSTs JSON)
│   └── install.sh         # Adds hooks to .claude/settings.json
├── src/
│   ├── App.tsx            # Root layout component
│   ├── panels/
│   │   ├── AgentPanel.tsx      # Left panel: agent roster + launcher
│   │   ├── ActivityStream.tsx  # Center panel: real-time event feed
│   │   ├── ContextPanel.tsx    # Right panel: context files + intel status
│   │   └── CommandBar.tsx      # Bottom: command input + quick actions
│   ├── components/
│   │   ├── StatusBar.tsx       # Top bar: session info, pipeline counts
│   │   ├── EventCard.tsx       # Single event in the activity stream
│   │   ├── AgentRow.tsx        # Single agent in the roster
│   │   └── IntelIndicator.tsx  # Freshness dot indicator
│   ├── hooks/
│   │   ├── useWebSocket.ts     # WebSocket connection to event server
│   │   ├── useAgentStatus.ts   # Track which agents are active (status, tree, tool counts)
│   │   ├── useAgentEvents.ts   # Per-agent event index for filtered views
│   │   ├── useAgentFilter.ts   # Filter state: selected agent, filter active/inactive
│   │   └── useIntelStatus.ts   # Check intelligence file freshness
│   └── utils/
│       ├── config.ts           # Read brand.json, partners.json, airtable.json
│       ├── agents.ts           # Agent roster metadata (parsed from .claude/agents/)
│       └── colors.ts           # Terminal color theme
└── README.md
```

## Build Phases

Build this in 4 phases. Verify each phase works before moving to the next.

---

### Phase 1: Event Server + Hook Infrastructure

**Goal**: Hook events flow from Claude Code → event server → SQLite.

#### 1a. Create the event forwarder hook script

Write `command-center/hooks/event-forwarder.sh`:
- Reads JSON from stdin (Claude Code hook input)
- Adds a timestamp field
- HTTP POSTs the JSON to `http://localhost:3457/events`
- Exits 0 immediately (never blocks Claude Code)
- Must be fast — under 100ms

```bash
#!/bin/bash
INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ENRICHED=$(echo "$INPUT" | jq --arg ts "$TIMESTAMP" '. + {received_at: $ts}')
curl -s -X POST http://localhost:3457/events \
  -H "Content-Type: application/json" \
  -d "$ENRICHED" \
  > /dev/null 2>&1 &
exit 0
```

#### 1b. Create the hook installer

Write `command-center/hooks/install.sh` that merges new hook entries into `.claude/settings.json` WITHOUT overwriting the existing SessionStart and SessionEnd hooks. Add the event forwarder to these events:

- `PreToolUse` (matcher: `*`)
- `PostToolUse` (matcher: `*`)
- `PostToolUseFailure` (matcher: `*`)
- `SubagentStart` (matcher: `*`)
- `SubagentStop` (matcher: `*`)
- `Stop`
- `SessionStart` (matcher: `*`) — ADD alongside existing check-onboarding.sh
- `SessionEnd` (matcher: `*`) — ADD alongside existing save-session-ledger.sh

Each hook entry should be async (`"async": true`) so it never blocks the agent.

IMPORTANT: The existing hooks in `.claude/settings.json` must be preserved exactly:
```json
{
  "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" },
  "plansDirectory": "docs/strategic-planning",
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-onboarding.sh", "statusMessage": "Checking brand configuration..." }]
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/save-session-ledger.sh" }]
      }
    ]
  }
}
```

Add new matcher groups for the forwarder — don't modify existing ones.

#### 1c. Create the Bun event server

Write `command-center/server.ts`:
- HTTP server on port 3457
- `POST /events` — receives hook event JSON, stores in SQLite, broadcasts via WebSocket
- `GET /events` — returns recent events (for initial load when TUI connects)
- `GET /events/stream` — WebSocket upgrade for real-time events
- `GET /health` — server status

SQLite schema (`command-center/db.ts`):
```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  hook_event_name TEXT,
  tool_name TEXT,
  agent_type TEXT,
  agent_id TEXT,
  payload JSON,
  received_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_session ON events(session_id);
CREATE INDEX idx_event ON events(hook_event_name);
```

#### Phase 1 Verification

1. Start the server: `bun run command-center/server.ts`
2. Send a test event: `echo '{"hook_event_name":"test","session_id":"test123"}' | curl -X POST http://localhost:3457/events -H "Content-Type: application/json" -d @-`
3. Query it back: `curl http://localhost:3457/events`
4. Verify SQLite has the row

---

### Phase 2: TUI Shell + Layout

**Goal**: The React Ink app renders the 3-panel layout with static content.

#### 2a. Initialize the React Ink project

```bash
cd command-center
bun init
bun add ink ink-text-input ink-spinner ink-select-input react
bun add -d @types/react typescript
```

#### 2b. Build the layout

The TUI has 4 zones:

**Top Status Bar** (`StatusBar.tsx`):
- Left: "MARKETING COMMAND CENTER" in bold
- Center: Status indicators (Onboarded ●/○, Intel Fresh ●/◐/○, Active Agents count)
- Right: Current session ID (from most recent SessionStart event) + time

**Left Panel — Agent Roster** (`AgentPanel.tsx`):
- Header: "AGENTS"
- Two sections separated by a dim line:
  - **ORCHESTRATORS** (pinned at top):
    - `[C]` CMO — the primary orchestrator (launches via: `claude --agent .claude/commands/cmo.md`)
    - `[A]` Analyst — intelligence & optimization
  - **SPECIALISTS** (alphabetical, single-letter hotkeys):
    - `[b]` Brand Strategy Consultant (blue)
    - `[c]` Competitive Intelligence Analyst (purple)
    - `[d]` Content Marketing Strategist (green)
    - `[e]` Conversion Flow Optimizer (green)
    - `[f]` Creative Director (pink)
    - `[g]` Crisis Response Specialist (red)
    - `[h]` Email Marketing Specialist (blue)
    - `[i]` Lead Writer (blue)
    - `[j]` Market Research Specialist (cyan)
    - `[k]` Marketing Analytics Specialist (orange)
    - `[l]` Monthly Content Planner
    - `[m]` Paid Media Specialist (amber)
    - `[n]` SEO Optimization Specialist (cyan)
    - `[o]` Social Media Strategist (pink)
    - `[p]` Website Analysis Specialist (blue)
- Each row shows: hotkey, name (truncated to fit), status indicator (idle/active/spawning)
- Status derived from SubagentStart/SubagentStop events
- The `color` field from each agent's frontmatter maps to terminal colors
- **Selection cursor**: Arrow keys move a highlight cursor through the roster. The selected agent is shown with a `▸` marker and a brighter background. Selection is independent of launching — it's for observation.
- **Agent detail view**: When an agent is selected and currently active, the bottom of the panel shows a mini stats block:
  ```
  ▸ Content Marketing Strategist ● ACTIVE
    Running: 2m 14s
    Tools: 8 calls (3 Read, 2 Write, 2 Grep, 1 Bash)
    Parent: CMO (session abc123)
  ```
  For idle agents, show last active time and total tool calls from the current session.
- **Spawn tree indicator**: Active agents spawned by an orchestrator show an indent/tree connector:
  ```
  [C] CMO                    ●
    ├─ [d] Content Mkt       ●
    └─ [n] SEO Optim         ●
  [A] Analyst                ○
  ```
  The tree builds dynamically from SubagentStart events that include a parent `session_id`. Root-level agents (launched from TUI directly) appear at top indent level.

Agent metadata source: Parse the YAML frontmatter from each `.claude/agents/*.md` file at startup to extract `name`, `color`, and `description`.

**Center Panel — Activity Stream** (`ActivityStream.tsx`):
- Header: "ACTIVITY STREAM" (shows filter indicator when filtered, e.g. "ACTIVITY STREAM ◈ brand-strategy-consultant")
- Scrollable list of events, newest at bottom
- Each event card shows:
  - **Agent color stripe** — a 1-char left border colored with the agent's roster color (from frontmatter). This is the primary visual for distinguishing which agent produced the event. Events from unknown/root sessions use the dim border color.
  - **Agent tag** — short label before the timestamp showing the agent source, e.g. `[CMO]`, `[Brand]`, `[SEO]`. Colored with the agent's roster color. When only one agent is active, the tag is dimmed to reduce noise.
  - Timestamp (HH:MM:SS)
  - Event type (color-coded):
    - `SubagentStart` → green "▶ SPAWN"
    - `SubagentStop` → dim "■ STOP"
    - `PreToolUse` → yellow "→ TOOL"
    - `PostToolUse` → cyan "✓ DONE"
    - `PostToolUseFailure` → red "✗ FAIL"
    - `Stop` → dim "◼ END"
    - `SessionStart` → green "● START"
    - `SessionEnd` → dim "○ END"
  - Context line: tool name + brief description
- **Agent filtering**: Press `f` to toggle filter mode. When an agent is selected in the roster (highlighted), pressing `f` filters the stream to only that agent's events. Press `f` again or `Escape` to clear the filter and show all events. The header updates to show which agent is filtered.
- **Parent-child grouping**: When a `SubagentStart` event arrives, indent all subsequent events from that agent_id by 1 level (2 chars). If that subagent spawns another (nested teams), indent by 2 levels. `SubagentStop` closes the indentation. This creates a visual tree:
  ```
  [CMO]  12:31 ▶ SPAWN content-marketing-strategist
    [Content]  12:31 → TOOL Read voice-guide.md
    [Content]  12:32 ✓ DONE Write blog-post.md
    [Content]  12:32 ■ STOP
  [CMO]  12:32 ▶ SPAWN seo-optimization-specialist
    [SEO]  12:33 → TOOL WebSearch "keyword research"
    [SEO]  12:33 ✓ DONE Write keyword-report.md
  ```
- Auto-scrolls to bottom on new events (pauses auto-scroll when user scrolls up, resumes when they scroll to bottom)
- Maximum 200 events in memory (older ones still in SQLite)

**Right Panel — Context & Intel** (`ContextPanel.tsx`):
- Header: "CONTEXT & INTEL"
- **CONTEXT FILES** section — numbered hotkeys to open in `$EDITOR`:
  - `[1]` `config/brand.json` — Brand colors, pillars, style
  - `[2]` `client-context/brand/voice-and-tone-guide.md` — Voice guide
  - `[3]` `content/social/content-bank.md` — Content themes (may not exist pre-onboarding)
  - `[4]` `client-context/competitors/differentiation-strategy.md` — Competitive analysis
  - `[5]` `config/partners.json` — Partner configuration
  - `[6]` `config/airtable.json` — Airtable field mappings
  - `[7]` `client-context/business/` — Business info (opens directory)
  - `[8]` `client-context/keywords/` — SEO keywords (opens directory)
  - `[9]` `docs/intelligence/internal/context-intelligence-ledger.md` — Session ledger

  When a number is pressed, spawn `$EDITOR <filepath>` (falling back to `less`).

- **INTELLIGENCE STATUS** section — check freshness of:
  - `docs/intelligence/internal/competitive-intelligence-tracking.md` — parse `**Last Updated:**` line
  - `docs/intelligence/internal/performance-analysis-history.md` — same pattern
  - `docs/intelligence/internal/seasonal-patterns.md` — same pattern
  - Website report: check `.website-report-state.json` for `lastRunDate`
  - Session ledger: count entries in `docs/intelligence/internal/context-intelligence-ledger.md`

  Display each with: name, "Xd ago" or "Never", and a colored dot:
  - ● green = less than 7 days
  - ◐ yellow = 7-30 days
  - ○ red = over 30 days or never

  This replicates the logic in `.claude/hooks/check-onboarding.sh` but as a persistent visual.

**Bottom — Command Bar** (`CommandBar.tsx`):
- Text input with `> ` prompt
- Below the input: a row of quick-action labels showing available commands:
  `/cmo  /analyst  /onboard  /images  /intel  /report  /transcript`
- When user types a slash command and presses Enter:
  - If it matches a known command, launch it via `bun spawn` calling `claude` with the appropriate `--agent` flag or directly
  - The launched process runs in the background; its hook events flow through the event server into the activity stream
- `[?]` shows a help overlay with all keybindings
- `[q]` quits the TUI (but leaves the event server running)

#### 2c. Wire up the main entry point

`command-center/cli.ts`:
1. Start the event server (as a subprocess or inline)
2. Render the React Ink app
3. Connect to WebSocket for event streaming
4. Load initial state (recent events from `GET /events`, agent metadata from disk, intel freshness from disk)

Add to `package.json`:
```json
{
  "scripts": {
    "start": "bun run cli.ts",
    "server": "bun run server.ts",
    "install-hooks": "bash hooks/install.sh"
  },
  "bin": {
    "mktg": "./cli.ts"
  }
}
```

#### Phase 2 Verification

1. Run `bun run command-center/cli.ts`
2. The 3-panel layout renders in the terminal
3. Pressing number keys opens context files in editor
4. The intel status section shows correct freshness data from disk
5. The agent roster shows all 15 agents

---

### Phase 3: Live Event Streaming

**Goal**: Hook events from Claude Code appear in the activity stream in real-time.

#### 3a. WebSocket client in the TUI

`src/hooks/useWebSocket.ts`:
- Connect to `ws://localhost:3457/events/stream`
- On message: parse JSON, dispatch to activity stream and agent status tracker
- Auto-reconnect on disconnect (with backoff)
- Show connection status in the status bar (connected/disconnected indicator)

#### 3b. Agent status tracking

`src/hooks/useAgentStatus.ts`:
- Listen for `SubagentStart` events → mark agent as active (match `agent_type` to roster)
- Listen for `SubagentStop` events → mark agent as idle
- Maintain a Map of agent_id → {type, status, startedAt, parentSessionId, toolCounts}
- **Parent-child tracking**: When a `SubagentStart` event includes a `session_id` from the spawning agent, record it as `parentSessionId`. This builds the spawn tree displayed in the agent panel.
- **Tool counting**: On each `PostToolUse` or `PostToolUseFailure` event, increment the tool count for that agent_id, bucketed by tool_name (e.g. `{Read: 3, Write: 2, Grep: 1}`). Resets when the agent stops.
- The agent panel reads from this to show active/idle indicators, spawn tree, and detail stats

#### 3b-2. Agent-to-event mapping

`src/hooks/useAgentEvents.ts`:
- Maintain a Map of agent_id → event[] (subset of the full stream)
- When agent filter is active, the ActivityStream reads from this map instead of the full event list
- Keeps max 100 events per agent (older ones still in SQLite)

#### 3c. Event card rendering

`src/components/EventCard.tsx`:
- Render based on `hook_event_name`
- **Agent color stripe**: Render a left border character (`▎`) colored with the agent's roster color. Look up agent_type from the event's agent_id (via useAgentStatus map) and match to the roster's color field.
- **Agent tag**: Short bracketed label like `[CMO]`, `[Brand]`, `[SEO]`. Derive abbreviation from agent_type (first word, max 7 chars). Colored with roster color. Dimmed when only 1 agent is active.
- **Indentation**: If the event's agent has a parentSessionId, indent the card by 2 chars per nesting level.
- For tool events: show `tool_name` and a smart summary:
  - `Bash` → show first 40 chars of `tool_input.command`
  - `Read` → show filename from `tool_input.file_path`
  - `Write` / `Edit` → show filename from `tool_input.file_path`
  - `Glob` → show `tool_input.pattern`
  - `Grep` → show `tool_input.pattern`
  - `WebFetch` → show domain from `tool_input.url`
  - `WebSearch` → show `tool_input.query`
  - `Task` → show `tool_input.description`
- For SubagentStart/Stop: show `agent_type`
- Color-code by event type (see color mapping in Phase 2)

#### Phase 3 Verification

1. Start the command center: `bun run command-center/cli.ts`
2. In a separate terminal, start a Claude Code session in this project
3. Run `/cmo` or any command that triggers tool calls
4. Verify events appear in the activity stream in real-time
5. Verify agent status indicators update when subagents spawn/stop

---

### Phase 4: Agent Launcher + Command Execution

**Goal**: Launch agents and commands directly from the TUI.

#### 4a. Agent launching

When a hotkey is pressed (e.g., `b` for Brand Strategy Consultant):
1. Show a mini input prompt: "Launch brand-strategy-consultant with task: ___"
2. User types a task description and presses Enter
3. Spawn: `claude --agent .claude/agents/brand-strategy-consultant.md --prompt "<task>"`
4. The process runs in background
5. Its hook events flow through the event server → activity stream
6. The agent roster shows it as active

For the orchestrators (CMO, Analyst):
- `[C]` → `claude --agent .claude/commands/cmo.md --prompt "<task>"`
- `[A]` → `claude --agent .claude/commands/analyst.md --prompt "<task>"`

#### 4b. Command bar execution

When user types in the command bar:
- `/cmo <args>` → launch CMO with args as prompt
- `/analyst <args>` → launch Analyst with args
- `/onboard` → launch onboarding flow
- `/images status` → run `npx tsx automation/image-generation/generate-images.ts --status` and display output
- `/images generate` → run `npx tsx automation/image-generation/generate-images.ts --limit 5`
- `/intel status` → run intelligence freshness check and display
- `/report` → launch website report generation
- `/transcript` → launch transcript processing
- Any other input → pass as prompt to a new Claude Code session

#### 4c. Process management

Track all spawned processes:
- Show count of active processes in status bar
- Allow `Ctrl+K` to list active processes and kill selected one
- When a process exits, log it in the activity stream

#### Phase 4 Verification

1. Press `b` in the TUI, enter a task, verify the agent launches
2. Type `/cmo plan February calendar` in the command bar, verify it launches
3. Type `/images status` and verify output appears
4. Verify the status bar shows correct active process count
5. Kill a process with Ctrl+K and verify cleanup

---

## Color Theme

Match Claude Code's aesthetic. Use these terminal colors:

```typescript
const theme = {
  bg: 'black',
  fg: '#e0e0e0',           // Default text
  dim: '#666666',           // Borders, separators, inactive items
  accent: '#7c6bff',        // Purple accent (Claude brand)
  success: '#4ade80',       // Green for active, success, spawns
  warning: '#fbbf24',       // Yellow/amber for stale intel, warnings
  error: '#ef4444',         // Red for failures, errors, crisis
  info: '#22d3ee',          // Cyan for info, reads, searches

  // Agent colors (from frontmatter)
  agentColors: {
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
    pink: '#ec4899',
    red: '#ef4444',
    cyan: '#06b6d4',
    orange: '#f97316',
    amber: '#f59e0b',
  },

  // Panel borders
  border: '#333333',
  borderActive: '#7c6bff',  // Highlighted panel border
};
```

## Key Bindings

```
GLOBAL
  q           Quit TUI (server keeps running)
  ?           Toggle help overlay
  Tab         Cycle focus between panels
  Ctrl+K      List/kill active processes
  Ctrl+R      Refresh intel status from disk
  Ctrl+L      Clear activity stream
  f           Toggle agent filter on activity stream (uses selected agent)

AGENT PANEL (when focused)
  C           Launch CMO
  A           Launch Analyst
  b-p         Launch specialist agent (shows task input)
  Up/Down     Move selection cursor through agent roster
  Enter       Show full detail for selected agent (expands detail view)
  Escape      Cancel agent launch input / collapse detail view

ACTIVITY STREAM (when focused)
  Up/Down     Scroll through events (pauses auto-scroll)
  End         Jump to bottom (resumes auto-scroll)
  f           Filter to selected agent / clear filter

CONTEXT PANEL (when focused)
  1-9         Open context file in $EDITOR

COMMAND BAR (always accessible)
  /           Focus command bar
  Enter       Execute command
  Escape      Cancel input
```

## Important Implementation Notes

1. **Don't break existing hooks.** The SessionStart `check-onboarding.sh` and SessionEnd `save-session-ledger.sh` hooks are critical to the system. The new event forwarder hooks must be ADDED alongside them, not replace them.

2. **Async hooks only.** All event forwarder hooks must use `"async": true` so they never block Claude Code's execution. The event forwarder script should fire-and-forget the HTTP POST.

3. **Graceful degradation.** If the event server isn't running, the hook script should fail silently (curl timeout, exit 0). Claude Code should never be affected by the command center being down.

4. **Agent metadata at startup.** Parse `.claude/agents/*.md` frontmatter once at startup to build the roster. Don't re-read on every render.

5. **Intel freshness from disk.** The intelligence status reads files directly from disk, not from hook events. Use the same date-parsing logic as `.claude/hooks/check-onboarding.sh` (parse `**Last Updated:**` lines). Some context files (like `content/social/content-bank.md` and files in `client-context/brand/`) only exist after `/onboard` has been run. Show "Not configured" gracefully for missing files.

6. **The factory visualizer is separate.** Don't modify or integrate with `visualizers/factory-visualizer-portable/`. This command center is a new, independent tool.

7. **Settings.json is the source of truth for hooks.** The install script should use `jq` to safely merge new hooks into the existing settings without overwriting anything.

8. **Terminal size.** Use `process.stdout.columns` and `process.stdout.rows` to adapt panel widths. Minimum viable: 120 columns, 30 rows. Show a warning if terminal is too small.

9. **No external dependencies for the hook script.** The `event-forwarder.sh` script should only need `curl` and `jq` (both available on macOS by default).

10. **The command center should be launchable with a single command.** `bun run command-center/cli.ts` or ideally just `mktg` after linking the bin.

## File Reference

These are the key files in this project that the command center needs to know about:

### Agent Definitions (`.claude/agents/`)
| File | Name | Color | Has Hooks |
|------|------|-------|-----------|
| `brand-strategy-consultant.md` | Brand Strategy Consultant | blue | Stop |
| `competitive-intelligence-analyst.md` | Competitive Intelligence Analyst | purple | — |
| `content-marketing-strategist.md` | Content Marketing Strategist | green | Stop |
| `conversion-flow-optimizer.md` | Conversion Flow Optimizer | green | — |
| `creative-director.md` | Creative Director | pink | — |
| `crisis-response-specialist.md` | Crisis Response Specialist | red | — |
| `email-marketing-specialist.md` | Email Marketing Specialist | blue | — |
| `lead-writer.md` | Lead Writer | blue | PreToolUse |
| `market-research-specialist.md` | Market Research Specialist | cyan | — |
| `marketing-analytics-specialist.md` | Marketing Analytics Specialist | orange | — |
| `monthly-content-planner.md` | Monthly Content Planner | — | PreToolUse |
| `paid-media-specialist.md` | Paid Media Specialist | amber | — |
| `seo-optimization-specialist.md` | SEO Optimization Specialist | cyan | PreToolUse |
| `social-media-strategist.md` | Social Media Strategist | pink | — |
| `website-analysis-specialist.md` | Website Analysis Specialist | blue | — |

### Slash Commands (`.claude/commands/`)
| File | Command | Size |
|------|---------|------|
| `cmo.md` | `/cmo` | 46KB (primary orchestrator) |
| `analyst.md` | `/analyst` | 22KB |
| `onboard.md` | `/onboard` | 16KB |
| `discover.md` | `/discover` | 4KB |
| `health.md` | `/health` | 5KB |
| `brand-export.md` | `/brand-export` | 2KB |
| `overview.md` | `/overview` | 3KB |

### Config Files (`config/`)
| File | Purpose |
|------|---------|
| `brand.json` | Brand colors, tagline, content pillars, image style directive |
| `partners.json` | Partner accounts, names, initials, UI colors |
| `airtable.json` | Content Calendar field mappings and schema |

### Intelligence Files (`docs/intelligence/internal/`)
| File | Freshness Check |
|------|----------------|
| `competitive-intelligence-tracking.md` | Parse `**Last Updated:**` line |
| `performance-analysis-history.md` | Parse `**Last Updated:**` line |
| `seasonal-patterns.md` | Parse `**Last Updated:**` line |
| `context-intelligence-ledger.md` | Count `### Session:` entries |

### Other Key Files
| File | Purpose |
|------|---------|
| `.claude/settings.json` | Hook configuration (DO NOT OVERWRITE) |
| `.website-report-state.json` | Website report last run date |
| `content/social/content-bank.md` | Local content themes & usage tracking |
| `client-context/brand/voice-and-tone-guide.md` | Brand voice guide |
| `client-context/competitors/differentiation-strategy.md` | Competitive analysis |

## Success Criteria

When you're done, running `bun run command-center/cli.ts` should:

1. Start the event server on port 3457
2. Render a full-screen TUI with 3 panels + status bar + command bar
3. Show all 15 agents in the roster with idle/active status
4. Show intelligence freshness indicators reading from actual files on disk
5. Accept keyboard shortcuts to open context files in `$EDITOR`
6. Accept keyboard shortcuts to launch agents with task prompts
7. Accept command bar input to run slash commands and automation scripts
8. Display real-time hook events in the activity stream when Claude Code is running alongside
9. Look and feel like a native terminal application — not a web page in a terminal
