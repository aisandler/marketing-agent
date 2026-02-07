# Plan: Marketing Agent Guide → Remotion Video

## Goal
Create a new `GuideShowcase` Remotion composition (75 seconds, 1920x1080, 30fps) that transforms the 6-section HTML marketing guide into an animated explainer video. Lives alongside the existing `MarketingShowcase` — no existing files modified except `Root.tsx` for registration.

---

## Scene Breakdown (7 scenes, 2250 frames)

| # | Scene | Duration | Frames | Content |
|---|-------|----------|--------|---------|
| G1 | Journey Map | 12s | 360 | 3-phase flow (/onboard → /cmo → /analyst) + 5 tool chips |
| G2 | Command Explorer | 12s | 360 | 4 category pills + 8 command cards in 4×2 grid |
| G3 | Context Architecture | 15s | 450 | 5-layer flow diagram with write-back loop (SVG) |
| G4 | Weekly Playbook | 10s | 300 | 5-day calendar grid with color-coded tasks |
| G5 | Agent Team | 15s | 450 | 13 agents in 4 discipline groups with connection pulse |
| G6 | Quick Reference | 5s | 150 | 6-row animated reference table |
| G7 | CTA | 6s | 180 | Gradient title + particle ring + typewriter command |

---

## File Structure

All new files under `my-video/src/guide/`:

```
src/guide/
  GuideShowcase.tsx                    # Main composition (Sequence orchestration)
  data/
    guideData.ts                       # Static data extracted from HTML
  components/
    PhaseCard.tsx                       # Journey phase card with number badge
    ToolChip.tsx                        # Small tool pill (icon + label)
    AnimatedArrow.tsx                   # SVG arrow with strokeDashoffset draw-on
    CommandCard.tsx                     # Command card (icon, name, role, desc)
    CategoryPill.tsx                    # Filter pill with colored dot
    ContextLayer.tsx                    # Single horizontal layer bar
    FlowDiagram.tsx                    # Full 5-layer diagram + arrows + write-back
    CalendarGrid.tsx                   # 5-column weekly layout
    DayColumn.tsx                      # Single day with header + tasks
    TaskItem.tsx                       # Task with colored dot + command
    AgentTeamGrid.tsx                  # 4-discipline layout
    DisciplineGroup.tsx                # Labeled group of agent cards
    AgentCard.tsx                      # Compact card (icon + name + role)
    ReferenceTable.tsx                 # Animated table with row entrances
  scenes/
    GuideScene1Journey.tsx
    GuideScene2Commands.tsx
    GuideScene3Flow.tsx
    GuideScene4Playbook.tsx
    GuideScene5Agents.tsx
    GuideScene6Reference.tsx
    GuideScene7CTA.tsx
```

**Modified:** `my-video/src/Root.tsx` — add GuideShowcase composition + Guide-Scenes folder

---

## Component Reuse

| Existing Component | Used In | How |
|--------------------|---------|-----|
| `AnimatedText` | All scenes | Direct import for titles (spring fade-in + Y-translate) |
| `TypewriterText` | G7 CTA | Direct import for `/onboard` command prompt |
| `AgentNode` pattern | G5 | Adapt circular icon + glow for AgentCard |
| `Scene6CTA` pattern | G7 | Adapt particle ring + gradient text |

---

## Animation Approach Per Scene

**G1 Journey Map:** Phase cards appear left-to-right (spring damping:200, 35-frame stagger). SVG arrows draw on between cards via `strokeDashoffset` interpolation. Tool chips fade in as staggered row below.

**G2 Command Explorer:** Category pills pop in (spring damping:20, stiffness:200 — snappy). 8 command cards stagger into 4×2 grid (15-frame stagger, slide-up + fade). Spotlight effect on /cmo card mid-scene (scale 1.05, glow border, others dim).

**G3 Flow Diagram:** 5 colored layer bars build top-to-bottom (25-frame stagger). Downward arrows draw on between layers. Dashed purple write-back path draws on right side. "Intelligence Loop" label pulses with `Math.sin` opacity.

**G4 Weekly Playbook:** 5 day columns slide up from bottom (12-frame stagger, spring damping:20). Tasks within each column fade in with 8-frame stagger. Mon/Wed/Fri get subtle highlight backgrounds.

**G5 Agent Team:** 4 discipline groups reveal sequentially — label slides in, then agent cards stagger (5-frame stagger within group, 20-frame gap between groups). After all visible, connection lines pulse from agents toward central hub.

**G6 Quick Reference:** Table header slides in, then 6 rows stagger from right (10-frame each, spring damping:200). Category badges use color-coded pills.

**G7 CTA:** Particle ring fades in (30 orbiting dots). Main title scales from 0.8→1.0 with gradient (blue→purple→pink). Tagline shows 4 categories. TypewriterText types `$ /onboard`.

---

## Data Layer

`guideData.ts` contains all content extracted from the HTML:
- `journeyPhases` — 3 phases with command, description, category
- `supportingTools` — 5 tools with icon, command, description, category
- `commands` — 8 command definitions for explorer cards
- `contextLayers` — 5 layers with name, subtitle, color
- `weeklyPlaybook` — 5 days with task arrays
- `agentDisciplines` — 4 groups totaling 13 agents
- `categoryColors` — shared color map (strategy/content/intelligence/setup)

---

## Color System

Dark theme matching existing project. Guide HTML colors mapped to Tailwind equivalents:

| Category | Color | Usage |
|----------|-------|-------|
| Strategy | `#3b82f6` (blue) | /cmo, /analyst badges |
| Content | `#10b981` (green) | /transcript, /images badges |
| Intelligence | `#8b5cf6` (purple) | /intel, /report badges |
| Setup | `#f59e0b` (amber) | /onboard, /discover badges |
| Background | `#0f172a` | All scenes |
| Card BG | `#1e293b` | Card surfaces |

---

## Registration (Root.tsx changes)

Add after existing compositions:
- `GuideShowcase` composition (2250 frames, 30fps, 1920×1080)
- `Guide-Scenes` folder with 7 individual scene compositions for preview/testing

---

## Implementation Order

1. `guideData.ts` — data layer (all scenes depend on it)
2. Shared components — PhaseCard, ToolChip, AnimatedArrow, CommandCard, CategoryPill, ContextLayer, TaskItem, AgentCard, CategoryPill
3. Composite components — FlowDiagram, CalendarGrid, DayColumn, AgentTeamGrid, DisciplineGroup, ReferenceTable
4. Scenes G1–G7 (each independently testable)
5. `GuideShowcase.tsx` — wire scenes with Sequence timing
6. `Root.tsx` — register composition + folder

---

## Verification

1. Run `npm run dev` in `my-video/` to open Remotion Studio
2. Test each scene individually via Guide-Scenes folder
3. Play full GuideShowcase composition end-to-end
4. Confirm: all animations frame-driven (no CSS transitions), correct timing, readable text hold times
5. Optional: render with `npx remotion render GuideShowcase out/guide.mp4`
