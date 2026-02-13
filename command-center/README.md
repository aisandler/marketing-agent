# Command Center

> **Status: Proof of Concept** | **Optional** — The marketing agent system works fully without this. CLI commands (`/cmo`, `/analyst`, etc.) remain the primary interface.

Optional browser interface for operating your AI marketing organization visually. Provides the same agent capabilities as the CLI — streaming chat, tool visibility, and permission handling — in a browser window instead of the terminal. Powered by the `@anthropic-ai/claude-agent-sdk`.

## Quick Start

```bash
cd command-center
bun install
bun run start
# Open http://localhost:3457
```

Uses your existing Claude Code authentication — no separate API keys needed.

## Architecture

```
Browser (UI)                    Bun Server                     Claude Agent SDK
┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
│  Single-file     │  WebSocket │  server.ts       │   SDK      │  Spawns Claude   │
│  HTML/CSS/JS     │◄──────────►│  sessions.ts     │◄──────────►│  Code CLI as     │
│  No build step   │    :3457   │  protocol.ts     │   query()  │  subprocess      │
└─────────────────┘            └─────────────────┘            └─────────────────┘
```

**Data flow:**
1. User clicks an agent in sidebar → `start_session` WebSocket message
2. Server creates SDK session via `query()` with agent's system prompt
3. SDK streams responses back → server broadcasts `text_delta` events
4. Browser renders markdown in real-time with streaming cursor
5. Tool use appears as collapsible cards; permission requests show Allow/Deny buttons
6. Multi-turn: user types follow-up → `user_message` → SDK continues conversation

## Features

- **Agent Roster**: All 15 specialist agents + 2 orchestrators in sidebar with hotkeys
- **Streaming Chat**: Token-by-token markdown rendering with syntax highlighting
- **Tool Cards**: Collapsible display of every tool call (Read, Write, Bash, etc.)
- **Permission Handling**: In-browser Allow/Deny for dangerous operations and AskUserQuestion
- **Multi-Session**: Run multiple agent sessions as tabs, switch between them
- **Context Panel**: Brand status, intel freshness, context file existence, live session stats
- **Keyboard Shortcuts**: Agent hotkeys, `/` to focus input, Cmd+Enter to send, Escape to stop

## File Structure

```
command-center/
├── server.ts          # Bun HTTP + WebSocket server (port 3457)
├── sessions.ts        # SDK session manager — streaming, permissions, multi-turn
├── protocol.ts        # TypeScript types for all WebSocket messages
├── agents.ts          # Loads agent metadata from .claude/agents/*.md
├── intel.ts           # Reads intel freshness and context file status
├── ui/
│   └── index.html     # Complete UI — HTML, CSS, JS in one file (no build)
├── package.json
├── .gitignore
└── README.md
```

## WebSocket Protocol

### Browser → Server

| Message | Purpose |
|---------|---------|
| `start_session` | Launch a new agent session with initial prompt |
| `user_message` | Send follow-up message to active session |
| `permission_response` | Allow/Deny a pending permission request |
| `interrupt_session` | Abort a running session |
| `sync` | Request full state (agents, sessions, intel) |

### Server → Browser

| Message | Purpose |
|---------|---------|
| `text_delta` | Streaming text token from agent |
| `assistant_message` | Complete assistant turn (text + tool_use blocks) |
| `tool_result` | Result of a tool execution |
| `permission_request` | Agent needs user approval for an action |
| `session_result` | Session completed — usage stats, duration |
| `session_status` | Status change (starting, running, waiting_permission, completed, error) |
| `sync_state` | Full state dump: all agents, sessions, intel |
| `error` | Error message |

## REST Endpoints

| Endpoint | Returns |
|----------|---------|
| `GET /` | UI (index.html) |
| `GET /api/agents` | Agent roster with metadata |
| `GET /api/intel` | Intel freshness + context files |
| `GET /api/sessions` | Active session list |
| `GET /health` | Server health (uptime, clients, sessions) |

## How Sessions Work

The SDK integration uses an async generator pattern for multi-turn conversations:

1. **Initial prompt** — User's first message yields immediately to the SDK
2. **Message queue** — Follow-up messages queue in memory, generator yields when available
3. **Wake mechanism** — Generator sleeps via Promise; `sendMessage()` resolves it
4. **Permission flow** — `canUseTool` callback forwards to browser, awaits Promise resolution
5. **Abort** — AbortController cancels the SDK query and wakes the generator

Permission mode is `acceptEdits` — Read, Write, Edit, Glob, Grep auto-approve. Dangerous Bash commands and AskUserQuestion route to the browser for explicit approval.

## Dependencies

- **Runtime**: [Bun](https://bun.sh) (v1.0+)
- **SDK**: `@anthropic-ai/claude-agent-sdk` — spawns Claude Code CLI as subprocess
- **Auth**: Uses existing Claude Code CLI authentication (claude.ai account)
- **CDN** (loaded by browser): marked.js (markdown), highlight.js (code blocks)

## Relationship to Other Components

| Component | Role |
|-----------|------|
| **Command Center** | Interactive browser UI for operating agents |
| **Factory Visualizer** | Read-only Factorio-style visualization of agent activity |
| **CLI Commands** | `/cmo`, `/analyst`, etc. — terminal-based agent operation |
| **Dashboard** | Content review & Airtable sync (port 3000) |

The Command Center is an alternative interface to CLI commands. Same agents, same capabilities, visual feedback instead of terminal output.

## Development Notes

**No build step.** The UI is a single HTML file with inline CSS and JS. Edit `ui/index.html` directly and refresh the browser.

**CDN dependencies** are loaded in the HTML head:
- `marked@15` — Markdown to HTML
- `highlight.js@11` — Syntax highlighting (github-dark-dimmed theme)

**Hot reload:** Not built-in yet. Manual browser refresh after UI changes.

**Session ID migration:** The browser creates temporary IDs when starting sessions (`temp-{timestamp}`). The server assigns real IDs (`{agent}-{timestamp}`). The UI migrates seamlessly via the `session_status` message.

## Future Directions

This is a proof of concept designed for rapid UI iteration. Planned improvements:

- Session history/persistence
- Agent conversation templates (pre-built prompts)
- Multi-agent orchestration view
- Real-time cost tracking dashboard
- Hot module reload for UI development
- Mobile-responsive layout
- Export session transcripts
- SaaS deployment model (see `docs/strategic-planning/command-center-saas-notes.md`)
