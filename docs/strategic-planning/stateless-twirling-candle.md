# Plan: Add Agent Teams to HeroGuide Video

## Goal
Replace the existing HeroAgents scene (currently last, 4.5s) with a new **HeroTeamMode** scene placed **second** (right after Intro) — showcasing the 13-agent team and Team Mode parallel collaboration upfront.

## New Scene Order (30s total, 900 frames)

| # | Scene | Frames | Duration | Change |
|---|-------|--------|----------|--------|
| 1 | Intro | 90 | 3s | unchanged |
| 2 | **TeamMode** | **210** | **7s** | **NEW — replaces Agents** |
| 3 | Journey | 180 | 6s | trimmed from 7s |
| 4 | Commands | 180 | 6s | trimmed from 7s |
| 5 | Architecture | 165 | 5.5s | trimmed from 6s |
| 6 | CTA | 75 | 2.5s | unchanged |

---

## New Scene: HeroTeamMode

### Layout (1080x1080)
```
  "Your Agent Team"  (headline, gradient blue->green)

  +--------------+  +--------------+
  | Strategy &   |  | Content      |
  | Brand (blue) |  | Creation(grn)|
  | 3 agent pills|  | 3 agent pills|
  +--------------+  +--------------+
  +--------------+  +--------------+
  | Distribution |  | Research &   |
  | & Growth(pur)|  | Analytics(am)|
  | 3 agent pills|  | 4 agent pills|
  +--------------+  +--------------+

  [gear] Team Mode — agents work in parallel
```

Animated connection dots travel between cards after frame 100 to visualize agents "sharing findings."

### Animation Choreography (210 frames)
- **0-25**: Headline springs in (bouncy), scene zoom 1.06->1.0
- **15-90**: 4 discipline cards stagger in (delay 15 + dIdx*12), bouncy spring, scale 0.8->1, translateY 40->0
- **70-140**: Team Mode bar slides up from below (snappy spring)
- **100-210**: Connection dots animate between cards (6 paths using sin-wave travel), cycling spotlight highlights one discipline every 22 frames
- **Throughout**: Gentle float on all cards (sin wave)

### Card Design
- Reuses the existing HeroAgents card structure (icon badge + discipline title)
- Agent names displayed as compact inline pills within each card (more "team" feeling than a list)
- Cycling highlight border + glow (same pattern as current HeroAgents)

### Team Mode Bar
- Horizontal bar at bottom with gear icon
- "Team Mode" in bold white + "agents work in parallel, sharing findings" in textSecondary
- Background: `ve.colors.bgElevated`, border: `ve.colors.strategy` at 25% opacity

### Connection Dots
- 6 paths connecting adjacent + diagonal card pairs
- Small dots (6px) with glow (12px) using discipline colors
- Travel via `sin(frame * 0.08 + phaseOffset)` mapped to 0..1 path progress
- Only visible after frame 100

---

## Files to Modify

### 1. CREATE `my-video/src/hero-guide/scenes/HeroTeamMode.tsx`
- New scene component following exact same patterns as HeroAgents
- Imports: `AbsoluteFill`, `useCurrentFrame`, `useVideoConfig`, `spring`, `interpolate`, `ve`, `FloatingOrbs`, `agentDisciplines`
- Three visual layers: headline, 2x2 discipline grid with agent pills, Team Mode bar + connection dots

### 2. EDIT `my-video/src/hero-guide/constants/theme.ts`
- Replace `agents: 135` with `teamMode: 210` in `heroSceneDurations`
- Update `journey: 180`, `commands: 180`, `architecture: 165`
- Total stays 900

### 3. EDIT `my-video/src/hero-guide/HeroGuideVideo.tsx`
- Import `HeroTeamMode` instead of `HeroAgents`
- Place TeamMode sequence as position 2 (after Intro, before Journey)
- Remove HeroAgents sequence
- Update duration references to use `heroSceneDurations.teamMode`

### 4. EDIT `my-video/src/Root.tsx`
- Add `HeroTeamMode` import and `<Composition id="Hero-TeamMode">` in Hero-Scenes folder
- Remove `Hero-Agents` composition entry (or keep for standalone preview)
- Update `heroSceneDurations.agents` -> `heroSceneDurations.teamMode`

### 5. EDIT `my-video/src/hero-guide/scenes/HeroJourney.tsx` (minor)
- Tighten stagger delays to fit 180 frames (reduce delay increments by ~20%)

### 6. EDIT `my-video/src/hero-guide/scenes/HeroCommands.tsx` (minor)
- Tighten stagger delays to fit 180 frames

**No changes needed**: `HeroAgents.tsx` stays as-is for standalone preview, `guideData.ts` already has all needed data.

---

## Verification
1. Run `npx remotion studio` from `my-video/` — preview HeroGuide composition
2. Verify scene order: Intro -> TeamMode -> Journey -> Commands -> Architecture -> CTA
3. Check TeamMode scene: discipline cards appear, Team Mode bar slides in, connection dots animate
4. Verify total duration = 900 frames in Root.tsx composition
5. Preview trimmed Journey/Commands scenes — ensure cards still fully animate within reduced time
6. Render: `npx remotion render HeroGuide --output out/HeroGuide.mp4`
