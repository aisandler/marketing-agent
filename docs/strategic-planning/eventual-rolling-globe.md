# Plan: The Viable Edge — Marketing OS Video (Remotion)

## Context

Building a 75-second premium product explainer video for The Viable Edge Marketing OS. The video will be embedded on a homepage and needs to feel confident and clean — text-driven with minimal animation on a dark background.

The existing Remotion project at `my-video/` already has 4 video compositions using the same toolchain (Remotion 4.0.410, React 19, Tailwind v4, Inter font). We'll add a 5th composition following the same architectural patterns.

## File Structure

All new files go inside `my-video/src/viable-edge/`:

```
my-video/src/viable-edge/
├── constants/
│   └── theme.ts              # Design tokens, scene durations, spring configs
├── components/
│   └── LayerCard.tsx          # Reusable component for Scenes 5-8
├── scenes/
│   ├── HookScene.tsx          # Scene 1: Pain line (5s / 150f)
│   ├── PromiseScene.tsx       # Scene 2: Main headline (7s / 210f)
│   ├── SubheadScene.tsx       # Scene 3: Supporting context (6s / 180f)
│   ├── OverviewScene.tsx      # Scene 4: "What's Inside" card (4s / 120f)
│   ├── LayerContextScene.tsx  # Scene 5: 01 Context Layer (8s / 240f)
│   ├── LayerSkillsScene.tsx   # Scene 6: 02 Skills Library (8s / 240f)
│   ├── LayerAgentsScene.tsx   # Scene 7: 03 Agent Workflows (8s / 240f)
│   ├── LayerPerformScene.tsx  # Scene 8: 04 Performance Loop (8s / 240f)
│   ├── DifferentiatorScene.tsx # Scene 9: "A system you own" (8s / 240f)
│   └── CTAScene.tsx           # Scene 10: Logo + CTA (8s / 240f)
└── ViableEdgeVideo.tsx        # Main composition using <Series>
```

Plus modifications to:
- `my-video/src/Root.tsx` — Register new composition + individual scene folder

## Implementation Steps

### Step 1: Theme Constants (`constants/theme.ts`)

Create design tokens matching the brief's specs:

- **Colors**: `bg: "#0a0a0a"`, `text: "#ffffff"`, `textMuted: "#a0a0a0"`, `accent: "#3b82f6"`
- **Font**: `display: "Inter, system-ui, sans-serif"`
- **Springs**: `smooth: { damping: 200, stiffness: 400 }` (no bouncy configs — nothing bouncy per brief)
- **Scene durations** object (frames at 30fps):
  - hook: 150, promise: 210, subhead: 180, overview: 120
  - layer1: 240, layer2: 240, layer3: 240, layer4: 240
  - differentiator: 240, cta: 240
  - **Total: 2100 frames (70s)** — fits within the 70-80s target
- Computed `totalDuration` via `Object.values().reduce()`

### Step 2: LayerCard Component (`components/LayerCard.tsx`)

Reusable for Scenes 5-8. Props:

```ts
type LayerCardProps = {
  number: string;       // "01", "02", etc.
  title: string;
  description: string;
  accentTitle?: boolean; // renders title in accent blue
};
```

Animation pattern (all using `useCurrentFrame()` + `spring()` + `interpolate()`):
1. Number appears first — `spring({ frame, fps, config: theme.spring.smooth })`, fade + scale from 0.8 to 1
2. Title fades in 15 frames later — `spring({ frame: frame - 15, ... })`, translateY 20px to 0
3. Description fades in 15 frames after title — `spring({ frame: frame - 30, ... })`, opacity only

Layout: Left-aligned with number in large accent blue on the left, title + description stacked on the right. Use flexbox row with ~120px left column for the number.

Exit animation: At `durationInFrames - 20`, content slides left 60px and fades out using `interpolate()` with the scene's remaining frames.

### Step 3: Scene Components (10 scenes)

Each scene follows this pattern (matching existing codebase conventions):
- `AbsoluteFill` with `backgroundColor: theme.colors.bg`
- `useCurrentFrame()` + `useVideoConfig()` hooks
- `spring()` with `damping: 200` for all motion
- `interpolate()` with `extrapolateLeft: 'clamp', extrapolateRight: 'clamp'`
- All text via CSS inline styles, no canvas/SVG

**Scene 1 — HookScene (150f / 5s)**
- Line 1 ("You're spending money on marketing.") fades in at frame 0
- Line 2 ("You just can't tell where it's going.") fades in at frame 20
- Both lines: centered, muted white (#d0d0d0), medium size (~28px), normal weight
- Hold until frame ~100, then both lines fade out over ~30 frames

**Scene 2 — PromiseScene (210f / 7s)**
- "The marketing system that" in white, bold, large (~52px)
- "learns what works." in accent blue (#3b82f6), same size
- Fade up from bottom: translateY 30px to 0, opacity 0 to 1
- Spring entrance, hold ~90 frames, fade out over final 30 frames

**Scene 3 — SubheadScene (180f / 6s)**
- Two-line block, centered, muted gray (#a0a0a0), ~24px
- Subtle upward motion (translateY 20px to 0)
- Hold ~90 frames, fade out

**Scene 4 — OverviewScene (120f / 4s)**
- "What's Inside" centered, white, bold, ~40px
- Small muted subtitle below: "Everything you need to run marketing like a system."
- Fade in, hold ~75 frames, fade out

**Scenes 5-8 — Layer scenes using `<LayerCard>`**
- Each wraps `<LayerCard>` with the appropriate props:
  - Scene 5: number="01", title="Context Layer", description="Brand voice, audience profiles...", accentTitle=false
  - Scene 6: number="02", title="Skills Library", description="Modular capabilities...", accentTitle=false
  - Scene 7: number="03", title="Agent Workflows", description="Multi-step workflows...", accentTitle=false
  - Scene 8: number="04", title="Performance Loop", description="See what moved...", accentTitle=true

**Scene 9 — DifferentiatorScene (240f / 8s)**
- Line 1: "No agency. No guesswork." — muted gray, ~30px, centered
- Line 2: "A system " in white bold + "you own." in accent blue — slightly larger (~36px)
- Line 1 fades in first, line 2 fades in 20 frames later
- Hold ~120 frames, fade out

**Scene 10 — CTAScene (240f / 8s)**
- Logo from `public/logo.png` fades in at center via `<Img>` from remotion
- After 30 frames: "Get the System" button shape — rounded rectangle with accent blue bg, white text, ~20px, px-32 py-12
- After 45 frames: "viableedge.com" small muted text below
- Hold ~150 frames, then entire scene fades to black over final 30 frames

### Step 4: Main Composition (`ViableEdgeVideo.tsx`)

Uses `<Series>` (matching TerminalGuideVideo and HeroGuideVideo patterns):

```tsx
<Series>
  <Series.Sequence durationInFrames={sceneDurations.hook}>
    <HookScene />
  </Series.Sequence>
  <Series.Sequence durationInFrames={sceneDurations.promise}>
    <PromiseScene />
  </Series.Sequence>
  // ... 8 more sequences
</Series>
```

No transitions between sequences — the scenes themselves handle their own fade-in/fade-out, which creates clean fades between scenes against the shared dark background.

### Step 5: Register in Root.tsx

Add to `Root.tsx`:

1. Import `ViableEdgeVideo` and all 10 scene components + `veTotalDuration` and `veSceneDurations`
2. Add main composition:
   ```tsx
   <Composition
     id="ViableEdge"
     component={ViableEdgeVideo}
     durationInFrames={veTotalDuration}
     fps={30}
     width={1920}
     height={1080}
   />
   ```
3. Add `<Folder name="ViableEdge-Scenes">` with individual scene compositions for preview

## Build Order (per user request)

Build incrementally, reviewing in Remotion Studio between batches:

1. **Batch 1**: `theme.ts` + `HookScene` + `PromiseScene` + `ViableEdgeVideo` (partial) + Root.tsx registration
2. **Batch 2**: `SubheadScene` + `OverviewScene` — add to ViableEdgeVideo
3. **Batch 3**: `LayerCard` + all 4 layer scenes (5-8) — add to ViableEdgeVideo
4. **Batch 4**: `DifferentiatorScene` + `CTAScene` — complete ViableEdgeVideo

## Key Patterns to Follow (from existing codebase)

- **Reuse**: `ve` theme object pattern from `hero-guide/constants/theme.ts` (similar dark palette)
- **Series**: Use `<Series>` component for scene sequencing (matches TerminalGuideVideo + HeroGuideVideo)
- **Springs**: `spring({ frame, fps, config: { damping: 200 } })` — never bouncy per brief
- **Clamp**: Every `interpolate()` call uses `extrapolateLeft: 'clamp', extrapolateRight: 'clamp'`
- **Deterministic**: No `Math.random()` — all animation is frame-based
- **No CSS transitions**: All animation via `useCurrentFrame()` + Remotion utilities
- **Font loading**: Inter is already configured in the project via system-ui fallback

## Critical Files to Modify

| File | Action |
|------|--------|
| `my-video/src/Root.tsx` | Add ViableEdge composition + scene folder |
| `my-video/public/logo.png` | User must place logo here before Scene 10 |

## Verification

1. Run `cd my-video && npm run dev` to launch Remotion Studio
2. After each batch, preview individual scenes in the "ViableEdge-Scenes" folder
3. Preview full "ViableEdge" composition for timing and flow
4. Check total runtime stays in 70-80s range (currently planned at 70s / 2100 frames)
5. Verify all text renders correctly with Inter font
6. Confirm no bouncy animations — all motion should feel smooth and high-damping
7. Run `npm run lint` to verify TypeScript/ESLint compliance
