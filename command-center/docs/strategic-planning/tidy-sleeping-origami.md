# Settings Workspace — Implementation Plan

## Context
Users need a way to configure API keys (Airtable, OpenRouter, etc.) directly from the Command Center UI instead of manually editing the `.env` file. This workspace also provides authentication guidance for the Claude Code CLI integration.

## Changes

### 1. Server endpoints — `command-center/server.ts`

Add two API routes after the `/api/context/health` block (line 304):

- **`GET /api/env`** — Reads `.env` from project root, returns masked values. Uses a whitelist of 9 known keys. Values masked to last 4 chars (e.g. `"••••Xk3m"`). Never returns plaintext.
- **`PUT /api/env`** — Accepts `{ key, value }` JSON body. Validates key is in whitelist. Reads `.env`, updates/adds/removes the line, writes back. Preserves comments and blank lines.
- **`GET /api/auth/status`** — Returns static auth method info (OAuth model, hint to run `claude login`).

Helper functions: `parseEnvFile()` (line-by-line parser handling quotes, `export` prefix, inline comments) and `maskValue()` (show last 4 chars).

### 2. HTML shell — `command-center/ui/index.html`

- Add settings gear icon rail button after the Activity button (line 95), before `</div>` of `rail-top`. Feather gear SVG, `data-workspace="settings"`, tooltip "Settings Cmd+6".
- Add workspace panel div after the activity workspace (line 195): `<div class="workspace-settings"><div id="settingsView"></div></div>`

### 3. New module — `command-center/ui/modules/settings.js`

Declarative `ENV_SCHEMA` grouping keys by service (Airtable, OpenRouter, Other) with label, description, required flag, placeholder.

- `renderSettings()` — Renders grouped key rows with masked values + Edit buttons, and auth card section
- `loadEnvData()` — Fetches `GET /api/env` and `GET /api/auth/status`, then renders
- `editEnvKey(key)` — Replaces row value area with inline input + Save/Cancel
- `saveEnvKey(key)` — PUTs to `/api/env`, toasts result, refreshes
- `cancelEditKey(key)` — Restores masked view
- `setupSettings()` — Subscribes to workspace switch, triggers load on "settings"

### 4. Keyboard — `command-center/ui/modules/keyboard.js`

- Add `'6': 'settings'` to `WORKSPACE_KEYS` (line 8)
- Add `'settings'` to `panels` array in `switchWorkspace()` (line 17)

### 5. Init wiring — `command-center/ui/modules/init.js`

- Import `setupSettings`, `editEnvKey`, `saveEnvKey`, `cancelEditKey` from settings.js
- Add to `window.CC` object
- Call `setupSettings()` alongside other setup calls

### 6. Layout CSS — `command-center/ui/styles/layout.css`

- Add `.workspace-settings` to panel hidden selector (line 210-214)
- Add `.workspace-settings.active` to panel visible selector (line 225-229)

### 7. Component CSS — `command-center/ui/styles/components.css`

Settings-specific styles: `.settings-container`, `.settings-section`, `.settings-group`, `.settings-key-row` (flex row with label + masked value + edit button), `.settings-key-edit-form` (inline input + save/cancel), `.settings-auth-card` (status dot + description + hint).

### 8. Command Palette — `command-center/ui/modules/command-palette.js`

Add Settings workspace entry to the Navigation items (`{ name: 'settings', label: 'Settings', icon: gear, key: 'Cmd+6' }`).

## File List

| File | Action |
|------|--------|
| `command-center/server.ts` | Add GET/PUT `/api/env`, GET `/api/auth/status` |
| `command-center/ui/index.html` | Add rail button + workspace panel |
| `command-center/ui/modules/settings.js` | NEW — entire settings module |
| `command-center/ui/modules/keyboard.js` | Add '6' mapping + 'settings' to panels |
| `command-center/ui/modules/init.js` | Import + wire settings module |
| `command-center/ui/modules/command-palette.js` | Add Settings to navigation items |
| `command-center/ui/styles/layout.css` | Add `.workspace-settings` selectors |
| `command-center/ui/styles/components.css` | Add settings styles |

## Verification

1. Reload Command Center at localhost:3457
2. Cmd+6 or click gear icon switches to Settings workspace
3. API keys grouped by service with masked values or "Not configured"
4. Click Edit on a key, type value, click Save — verify `.env` file updated
5. Refresh page — saved key shows masked value
6. Auth section shows OAuth description and `claude login` hint
7. Command palette (Cmd+K) shows "Settings" in Navigation section
