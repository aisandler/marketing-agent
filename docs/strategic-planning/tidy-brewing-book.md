# Marketing Agent Guide - Enhancement Plan

## Audience & Tone
A marketing professional (consultant, agency) who uses Claude Code to produce marketing output for their clients. The guide should feel like an **onboarding walkthrough**, not a technical manual. Everything is facilitated through Claude Code — no terminal commands, no environment variables, no npm installs. Just "type this, get that."

---

## Changes Overview

### 1. Add Example Use Cases / User Flows to Command Details
**The highest-impact addition.** Each command's detail panel gets 2-3 real-world example prompts showing what to actually say after launching a command. These should read like natural conversation, not CLI syntax.

Add an `examples` field to each entry in the `commandData` JavaScript object. Render them in the detail panel as styled prompt cards.

**Examples by command:**

- `/onboard` — "I have a pest control company in Phoenix. Here are our materials." / "We're rebranding — rebuild our brand architecture with a StoryBrand framework."
- `/cmo` — "Plan our February content calendar for LinkedIn and Facebook." / "Create a spring campaign around our new service launch." / "We need 4 blog post outlines targeting homeowners with pest problems."
- `/analyst` — "How did our content perform last month?" / "What are our competitors posting about this week?" / "Audit our brand context and suggest improvements."
- `/transcript` — "Here's a transcript from a client discovery call — extract the marketing insights." / "Process these meeting notes from our partner onboarding session."
- `/images` — "Check what posts need images." / "Generate images for next week's scheduled posts." / "Show me the cost report for this month."
- `/intel` — "How fresh is our competitive intelligence?" / "Collect LinkedIn posts from our competitors." / "What visual trends are our competitors using?"
- `/report` — "Generate a website performance report for the last 30 days." / "How is our organic search trending?"
- `/discover` — "Show me everything this system can do." / "I'm new — where should I start?"
- `/health` (new) — "Is everything configured correctly?" / "Check if any intelligence data is stale."
- `/brand-export` (new) — "Generate a one-page brand summary I can share with a new partner." / "Export the full brand guide as a document."

**Implementation:** Add `examples` array to each `commandData` entry. Add rendering block in `openDetail()`. Add CSS for example cards (light background, monospace-ish, with a "Try saying..." label).

### 2. New Section: "Your Agent Team"
A new sidebar section showing the 13 specialist agents. Positioned as "the team behind the scenes" — these are the specialists that /cmo and /analyst deploy automatically. The user doesn't invoke them directly, but knowing they exist builds trust in the output quality.

**Layout:** A visual grid of agent cards, grouped by discipline:
- **Strategy & Brand**: Brand Strategy Consultant, Competitive Intelligence Analyst, Crisis Response Specialist
- **Content Creation**: Content Marketing Strategist, Lead Writer, Creative Director
- **Distribution & Growth**: Email Marketing Specialist, Social Media Strategist, SEO Optimization Specialist
- **Research & Analytics**: Market Research Specialist, Marketing Analytics Specialist, Monthly Content Planner, Website Analysis Specialist

Each card shows: icon, agent name, one-line role description, and which executive command typically deploys them (e.g., "Deployed by /cmo").

**Tone:** "You don't call these agents directly — they're activated automatically when /cmo or /analyst needs specialized expertise."

**Implementation:** New sidebar nav link, new `<section>`, agent card grid with CSS. Static HTML, no JavaScript interaction needed beyond section switching.

### 3. Add Missing Commands to Command Explorer + Quick Reference
Add 3 commands for completeness:

- `/health` — category: setup, description: "Check system configuration, brand context status, and intelligence freshness."
- `/brand-export` — category: setup, description: "Generate portable brand documents to share with partners or clients."
- `/report-setup` — category: setup, description: "One-time setup to connect Google Analytics and Search Console."

**Implementation:** Add entries to `commandData` object, add `cmd-card` elements in Command Explorer grid, add rows to both Quick Reference tables.

### 4. Minor Content Refinements
- **Intelligence write-back box** (How It Connects section): Name the 4 specific files so users understand what's accumulating: session history, competitive tracking, performance metrics, seasonal patterns. Keep it brief — one sentence each.
- **Weekly Playbook cadence tips**: Add a tip about `/health` for periodic system checks.

---

## What We're NOT Adding
- Prerequisites/setup section (it's all through Claude Code)
- Partner Portal documentation (infrastructure, not user-facing)
- Factory Visualizer (developer tool)
- Dashboard/API server details (backend)
- Email campaign generator scripts (CLI automation)
- Dark mode, print stylesheet (polish for later)
- Troubleshooting/FAQ (can be a future addition)

---

## File to Modify
- `docs/marketing-agent-guide.html` — single file, all changes

## Implementation Steps

1. **CSS additions** (~30 lines)
   - `.example-prompts` container style
   - `.example-card` style (light bg, subtle border, prompt text)
   - `.agent-grid` and `.agent-card` styles for the team section

2. **New "Agent Team" section** (~100 lines)
   - Sidebar nav link
   - Section with intro paragraph + agent card grid
   - 13 agent cards organized by discipline group

3. **Extend `commandData` with examples** (~60 lines)
   - Add `examples` array to all 8 existing commands
   - Add 3 new command entries (`health`, `brandExport`, `reportSetup`)

4. **Update `openDetail()` to render examples** (~15 lines)
   - After the detail grid, render example prompts if present
   - "Try saying..." label with styled prompt cards

5. **Add new command cards to Command Explorer grid** (~30 lines)
   - 3 new `cmd-card` elements for health, brand-export, report-setup

6. **Update Quick Reference tables** (~15 lines)
   - Add rows for the 3 new commands

7. **Expand write-back info box** (~10 lines)
   - Name the 4 intelligence files with brief descriptions

## Verification
- Open `docs/marketing-agent-guide.html` in a browser
- Verify all sidebar sections navigate correctly (including new "Agent Team")
- Click each command card and confirm example prompts appear in detail panel
- Verify 3 new commands appear in Command Explorer and Quick Reference
- Test category filters still work with new command cards
- Test search in Quick Reference finds new entries
- Check mobile responsive layout
- Verify no JavaScript console errors
