# Command Center: Interactive Web Interface

## Context

The current command-center is a monitoring dashboard that watches terminal sessions. The user wants the browser to BE the primary interface for operating Claude Code agents — full interactive chat, streaming responses, tool approvals, multi-turn conversation. No terminal needed.

This means scrapping the current monitoring dashboard and rebuilding as an interactive control plane powered by the `@anthropic-ai/claude-agent-sdk`.

## Architecture

```
Browser (UI) <--WebSocket--> Bun Server <--SDK--> Claude Agent SDK --> Anthropic API
                                                  (uses existing Claude Code auth)
```

No separate API keys. The SDK inherits the user's existing Claude Code authentication.

## What Gets Scrapped

- `command-center/server.ts` — rewrite entirely
- `command-center/ui/index.html` — rewrite entirely
- `command-center/db.ts` — delete (no SQLite needed; sessions are source of truth)
- `command-center/hooks/` — delete (events come from SDK directly, not external hooks)

## What Gets Kept

- `command-center/agents.ts` — agent metadata parser (name, color, description, filePath, isOrchestrator)
- `command-center/intel.ts` — intel freshness + context file status + isOnboarded check

## Final File Structure

```
command-center/
  server.ts         — Bun HTTP + WebSocket server (~250 lines)
  sessions.ts       — SDK session lifecycle manager (~200 lines)
  protocol.ts       — WebSocket message type definitions (~80 lines)
  agents.ts         — KEEP unchanged
  intel.ts          — KEEP unchanged
  ui/
    index.html      — Single-file interactive UI (~1800 lines)
  package.json      — Add @anthropic-ai/claude-agent-sdk dependency
  .gitignore
```

7 files total. No build step, no frontend framework.

## Core Mechanism: Streaming Input Sessions

The SDK's `query()` accepts an `AsyncGenerator` as the prompt, enabling multi-turn conversations within a single session:

```typescript
async function* messageGenerator() {
  yield { role: "user", content: initialPrompt };
  while (true) {
    if (queue.length > 0) yield queue.shift();
    else await new Promise(r => { wakeUp = r; });
  }
}

const session = query({ prompt: messageGenerator(), options });
for await (const message of session) { /* stream to browser */ }
```

When the browser sends a new message, the server pushes it into the queue and wakes the generator. The SDK continues the conversation seamlessly.

## WebSocket Protocol

**Browser → Server:**
| Type | Purpose |
|------|---------|
| `start_session` | Select agent + initial prompt → creates SDK session |
| `user_message` | Send follow-up message to active session |
| `permission_response` | Allow/deny a tool call |
| `interrupt_session` | Stop a running session |
| `sync` | Request full state (on reconnect) |

**Server → Browser:**
| Type | Purpose |
|------|---------|
| `text_delta` | Streaming text chunk (character-by-character) |
| `assistant_message` | Complete message with text + tool_use blocks |
| `tool_call` | Agent is calling a tool (name + input) |
| `tool_result` | Tool finished (success/fail + summary) |
| `permission_request` | Agent needs approval for a tool call |
| `session_result` | Session completed (cost, turns, duration) |
| `session_status` | Session state changed (starting/running/completed) |
| `sync_state` | Full state dump (all sessions + agents + intel) |

## UI Layout

```
+------------------+------------------------------------+-----------------+
|  AGENTS          |  CHAT                              | CONTEXT & INTEL |
|                  |                                    |                 |
|  Orchestrators   |  [Session tabs if multiple]        | Brand Status    |
|  * CMO           |                                    | Intel Freshness |
|  * Analyst       |  User: Plan Feb content calendar   | Context Files   |
|                  |                                    | Session Stats   |
|  Specialists     |  CMO: Here are your options:       |   Cost: $0.14   |
|  * Brand Strat.  |  1. Monthly Content Strategy       |   Turns: 3      |
|  * Content Mkt.  |  2. Campaign Development...        |   Duration: 2m  |
|  * SEO Opt.      |                                    |                 |
|  * Creative Dir. |  [Tool: Read] cmo.md               |                 |
|  * ... (15)      |  [Tool: Glob] .claude/**           |                 |
|                  |                                    |                 |
|  Sessions        |  [Permission Card]                 |                 |
|  * cmo-abc123    |  Bash: rm old-content/             |                 |
|                  |  [Allow] [Deny]                    |                 |
+------------------+------------------------------------+-----------------+
|  > Type a message...                            [Send] [Stop]          |
+------------------------------------------------------------------------+
```

**Key UI behaviors:**
- Click agent in sidebar → start new session with that agent
- Chat area shows streaming markdown-rendered responses
- Tool calls appear as collapsible cards inline in the chat
- Permission requests show as interactive cards with Allow/Deny buttons
- AskUserQuestion renders as interactive option cards
- Multiple sessions shown as tabs, switchable
- Context panel shows intel freshness and brand config status

**CDN deps (no build step):** `marked.js` for markdown, `highlight.js` for code blocks.

## Permission Handling

- `permissionMode: "acceptEdits"` — auto-approves Read, Write, Edit, Glob, Grep
- `canUseTool` callback forwards dangerous Bash commands to browser for approval
- AskUserQuestion tool calls are forwarded as interactive question cards
- User responds via buttons in the chat UI

## Agent Activation

- **Orchestrators** (CMO/Analyst): Initial prompt includes `/<command>` to trigger slash command loading via the Claude Code preset system prompt
- **Specialists**: Agent `.md` file content is appended to system prompt so the agent persona is loaded

## Build Phases

### Phase 1: Foundation
- `protocol.ts` — message type definitions
- `sessions.ts` — session manager with streaming input, SDK integration, permission forwarding
- `server.ts` — Bun HTTP + WebSocket, routes messages to sessions
- Minimal `ui/index.html` — agent sidebar, chat area, input bar, streaming text rendering
- **Test**: Select CMO, type prompt, see streaming response in browser

### Phase 2: Tool & Permission UX
- Tool call cards in chat (collapsible, color-coded)
- Permission request cards with Allow/Deny buttons
- AskUserQuestion interactive cards
- Tool result display (success/fail)
- **Test**: Run a CMO pathway that spawns agents and uses tools

### Phase 3: Multi-Session & Polish
- Session tabs for concurrent sessions
- Session list in sidebar with status dots
- Context panel (reuse intel.ts data)
- Session stats (cost, turns, duration)
- WebSocket reconnect + full state sync
- Stop/interrupt button
- **Test**: Run CMO and Analyst simultaneously, switch between tabs

### Phase 4: Refinements
- Keyboard shortcuts (Cmd+Enter send, Escape cancel)
- `/command` shortcuts in input bar
- Toast notifications for background session events
- Onboarding flow (detect unboarded state, prompt /onboard)

## Cleanup

After build is complete:
- Delete `command-center/db.ts`
- Delete `command-center/hooks/` directory
- Remove hook entries from `.claude/settings.json` related to the event forwarder
- Update `package.json` (remove old scripts, add SDK dep)

## Verification

1. `cd command-center && bun install` — SDK installs
2. `bun run server.ts` — server starts on port 3457
3. Open `http://localhost:3457` — UI loads with agent roster
4. Click CMO → type "Plan February content" → see streaming response
5. Agent spawns tools → see tool cards in chat
6. Permission prompt appears → click Allow → session continues
7. Open second tab → start Analyst session → switch between tabs
8. Refresh browser → sessions restore via sync
