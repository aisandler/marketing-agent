# Plan: Universal Quick-Reply Button Detection

## Goal
Make ALL agent interactions that pose numbered/bulleted options render as clickable buttons in the Command Center UI — creating a guided, handheld experience across every agent.

## Single File Change
`command-center/ui/index.html` (~200 lines added)

---

## Step 1: Add Quick-Reply CSS (~40 lines)

Add styles for the quick-reply button grid after existing `.ask-card` styles:

- `.quick-replies` container: flex-wrap grid with gap, margin-top
- `.qr-btn` buttons: glass-styled, purple accent border, hover glow effect, transition
- `.qr-btn:hover`: gradient border, elevated shadow, slight scale
- `.qr-btn .qr-label`: bold title text (from `<strong>`)
- `.qr-btn .qr-desc`: smaller muted description text
- `.qr-btn.sent`: dimmed opacity, pointer-events none, "Sent" badge
- Responsive: stack full-width on narrow viewports

## Step 2: Detection Logic — `injectQuickReplies()` (~60 lines)

A DOM post-processing function called after `renderAssistant()` inserts content:

1. Find all `<ol>` elements in the just-rendered assistant message
2. For each `<ol>`, check if 60%+ of `<li>` children contain a `<strong>` or `<b>` tag as first significant child
3. If threshold met AND the message does NOT already contain `.ask-card` (AskUserQuestion guard), convert to quick-reply buttons
4. For each qualifying `<li>`:
   - Extract label from `<strong>`/`<b>` text
   - Extract description from remaining text (strip leading ` - `, `—`, `:`)
   - Build button HTML with `onclick="quickReply('label text')"`
5. Replace the `<ol>` with a `.quick-replies` container
6. Keep original `<ol>` hidden (with `display:none`) as fallback/reference

## Step 3: Click Handler — `quickReply()` (~30 lines)

- Receives the clicked option text
- Calls `doSend()` with the option text (same as typing + hitting send)
- Marks all `.qr-btn` in the same container as `.sent` (dims them)
- Highlights the clicked button differently (e.g., green check or "Sent" indicator)

## Step 4: Integration Point (~15 lines)

In the existing `renderAssistant()` function (or wherever assistant text blocks get appended to DOM):

- After `innerHTML` is set with marked.js output, call `injectQuickReplies(messageElement)`
- This catches ALL agent text output universally — CMO pathways, Analyst journeys, any agent that lists options

## Step 5: Edge Cases & Polish (~30 lines)

- **Short lists (2-3 items)**: Still render as buttons (no minimum)
- **Long lists (10+ items)**: Render in scrollable 2-column grid
- **Already-answered**: Track which messages have been replied to; show "sent" state on page re-render
- **Mixed content**: Only convert the `<ol>` portion; leave surrounding text paragraphs intact
- **Nested lists**: Ignore `<ol>` inside `<li>` (only process top-level)
- **Manual typing**: User can still type a custom response instead of clicking

## What This Catches

| Agent | Format | Detected? |
|-------|--------|-----------|
| CMO (13 pathways) | `1. **Title** - description` | Yes — `<ol>` with `<strong>` |
| Analyst (11 journeys) | `1. **Title** - description` | Yes — same pattern |
| Any agent numbered options | `1. **Option** — details` | Yes |
| AskUserQuestion tool | Already renders as `.ask-card` | Skipped (guard) |
| Plain numbered steps | `1. First do X` (no bold) | No — fails 60% threshold |

## Not Changed
- No backend changes (server.ts, sessions.ts, protocol.ts)
- No agent file changes (.claude/agents/*)
- AskUserQuestion rendering unchanged (already works great)
