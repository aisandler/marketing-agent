# Plan: Update User Guide Weekly Playbook for Paid Media

## Context

The paid-media-specialist and conversion-flow-optimizer agents have been fully integrated into the system (agent files, CMO pathways, Analyst journeys, onboarding, HTML guide agent cards, commandData). However, the **Weekly Playbook** section of `docs/marketing-agent-guide.html` — the practical "how to use this week-to-week" guide — has no paid media or conversion optimization touchpoint. Users running paid ads need a recurring cadence prompt.

## File to Modify

`docs/marketing-agent-guide.html` — Weekly Playbook section (lines 1589-1701)

## Changes

### 1. Add paid media check to Wednesday (lines 1628-1640)

Wednesday currently has "Content creation session" and "Mid-week performance check". Add a third task:

```html
<div class="day-task">
  <div class="task-dot" style="background:var(--amber)"></div>
  <div><span class="task-cmd">/analyst</span><br>Paid media performance check</div>
</div>
```

This fits Wednesday's "check in on performance" theme and uses the amber dot color (matching paid media's color). Uses `/analyst` since `paid_performance_check` is an analyst journey.

### 2. Add cadence tip for paid media (after existing tips, line ~1699)

Add a new `<li>` to the Cadence Tips list:

```html
<li style="padding: 6px 0; padding-left: 20px; position: relative;">
  <span style="position: absolute; left: 0; color: var(--amber);">&#9679;</span>
  <strong>Monitor ad spend mid-week.</strong> Run a paid performance check on Wednesdays to catch budget issues before they burn through the week.
</li>
```

## Verification

Open `docs/marketing-agent-guide.html` in a browser. Navigate to "Weekly Playbook" section. Confirm:
- Wednesday now shows 3 tasks (content, performance, paid media)
- Cadence Tips section has 6 bullets (was 5)
- Amber dot color matches the paid media theme
