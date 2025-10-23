# 2025-09-28 Alpha Force Diagnostic — Raw Capture

## 1. Metadata

- Branch / PR: codex/investigate-alpha-choke-in-dreamdust (PR #244)
- Device & Browser: Google Chrome Incognito Tab, M1 Pro MacBook Pro 16GB RAM (10-20 Safari Tabs Open, Claude Desktop App Open, Docker Open, Cursor IDE Open, etc.).
- URL: http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1&forceAlpha=1
- Screenshot: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-09-28-alpha-force.png

## 2. Terminal Session

```
 node  /workspace   codex/investigate-alpha-choke-in-dreamdust ⍟14  pnpm install --frozen-lockfile
Scope: all 19 workspace projects
Lockfile is up to date, resolution step is skipped
Already up to date
. prepare$ husky install
│ husky - install command is DEPRECATED
└─ Done in 304ms
Done in 4.2s
 node  /workspace   codex/investigate-alpha-choke-in-dreamdust ⍟14  pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit || pnpm --filter cryptiq-mindmap-demo exec tsc -p apps/cryptiq-mindmap-demo/tsconfig.typecheck.json --noEmit
 node  /workspace   codex/investigate-alpha-choke-in-dreamdust ⍟14  pnpm --filter cryptiq-mindmap-demo run lint || true

> cryptiq-mindmap-demo@0.1.0 lint /workspace/apps/cryptiq-mindmap-demo
> next lint


./app/components/BackgroundBrain.tsx
112:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
121:6  Warning: React Hook useEffect has a missing dependency: 'pixelSize'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
412:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
467:8  Warning: React Hook useEffect has an unnecessary dependency: 'vertices'. Either exclude it or remove the dependency array. Outer scope values like 'vertices' aren't valid dependencies because mutating them doesn't re-render the component.  react-hooks/exhaustive-deps

./app/components/PointCloudStage.tsx
836:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
837:27  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
838:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
1451:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
1883:198  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/components/brainAnchors.worker.ts
68:78  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
149:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
150:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
152:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/components/dreamdust/DreamdustMaterial.ts
73:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
586:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
598:34  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
599:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
600:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
600:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
601:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
618:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
620:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
623:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
624:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
626:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
627:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
630:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
632:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
635:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
637:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
640:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
642:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
655:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
656:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
656:73  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
656:88  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
657:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/components/dreamdust/sim/ParticleSim.ts
81:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
82:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
83:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
84:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
94:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
98:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
99:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
111:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
115:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
116:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/draw3d/modules/AppHost.tsx
24:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
135:27  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
157:9  Warning: The 'classifyNow' function makes the dependencies of useEffect Hook (at line 358) change on every render. To fix this, wrap the definition of 'classifyNow' in its own useCallback() Hook.  react-hooks/exhaustive-deps
287:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
287:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
287:85  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
288:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
354:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
356:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/draw3d/modules/canvas/preprocess.ts
4:81  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
21:85  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/draw3d/modules/geometry/__tests__/strokeToCloud.test.ts
5:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/draw3d/modules/ml/doodlenet.ts
11:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
13:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
19:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
20:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
26:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
37:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
37:43  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/draw3d/modules/renderer/FormationView.tsx
14:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/draw3d/modules/renderer/MorphFormationView.tsx
25:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
26:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
78:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
79:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
82:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
83:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
86:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
91:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
169:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/draw3d/modules/renderer/transitions.ts
9:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
13:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
38:36  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
55:36  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/draw3d/modules/ui/HUD.tsx
37:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
44:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
45:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/page.tsx
7:10  Error: 'tweenCamera' is defined but never used.  @typescript-eslint/no-unused-vars
8:10  Error: 'getR3FStateOrNull' is defined but never used.  @typescript-eslint/no-unused-vars
18:11  Error: 'hyperdriveDone' is assigned a value but never used.  @typescript-eslint/no-unused-vars
18:27  Error: 'startCountdown' is assigned a value but never used.  @typescript-eslint/no-unused-vars

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
/workspace/apps/cryptiq-mindmap-demo:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  cryptiq-mindmap-demo@0.1.0 lint: `next lint`
Exit status 1
 node  /workspace   codex/investigate-alpha-choke-in-dreamdust ⍟14  CI=1 pnpm --filter cryptiq-mindmap-demo run build

> cryptiq-mindmap-demo@0.1.0 build /workspace/apps/cryptiq-mindmap-demo
> next build

   ▲ Next.js 15.3.5
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 20.0s
   Skipping validation of types
   Skipping linting
 ⚠ Using edge runtime on a page currently disables static generation for that page
 ✓ Collecting page data
 ✓ Generating static pages (7/7)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                                 Size  First Load JS
┌ ○ /                                    3.71 kB         106 kB
├ ○ /_not-found                            143 B         102 kB
├ ƒ /api/brain-acceptance                  143 B         102 kB
├ ƒ /api/og                                143 B         102 kB
├ ○ /brain                                 27 kB         357 kB
├ ○ /debug/caps                          5.38 kB         107 kB
├ ○ /draw3d                              7.83 kB         335 kB
├ ƒ /quiz/[slug]                         31.9 kB         362 kB
└ ƒ /result/[id]                         2.04 kB         104 kB
+ First Load JS shared by all             102 kB
  ├ chunks/226-5dcf7e3380d711a9.js       46.6 kB
  ├ chunks/8d5daf79-879d5759a0deefd7.js  53.2 kB
  └ other shared chunks (total)          2.22 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

 node  /workspace   codex/investigate-alpha-choke-in-dreamdust ⍟14  pnpm --filter cryptiq-mindmap-demo run start

> cryptiq-mindmap-demo@0.1.0 start /workspace/apps/cryptiq-mindmap-demo
> next start

   ▲ Next.js 15.3.5
   - Local:        http://localhost:3000
   - Network:      http://172.17.0.2:3000

 ✓ Starting...
 ✓ Ready in 792ms
^C%
 node  /workspace   codex/investigate-alpha-choke-in-dreamdust ↑1 ⍟14 
 node  /workspace   codex/investigate-alpha-choke-in-dreamdust ↑1 ⍟14  ✘  pnpm --filter cryptiq-mindmap-demo run start

> cryptiq-mindmap-demo@0.1.0 start /workspace/apps/cryptiq-mindmap-demo
> next start

   ▲ Next.js 15.3.5
   - Local:        http://localhost:3000
   - Network:      http://172.17.0.2:3000

 ✓ Starting...
 ✓ Ready in 716ms
^C%
 node  /workspace   codex/investigate-alpha-choke-in-dreamdust ● ↑1 ⍟14 
 node  /workspace   codex/investigate-alpha-choke-in-dreamdust ● ↑1 ⍟14  ✘ 
```

## 3. Console Objects

### [dreamdust] frame-percentiles

```json
{
  "sampleCount": 240,
  "p50Ms": 8.4,
  "p90Ms": 9.4
}
```

### [PC] ink debug

```json
{
  "vertexInkOk": true,
  "uViewport": [1452, 1004],
  "inkIntensity": 0.75
}
```

### [dreamdust] ink-latency

```json
{
  "ms": 5.8,
  "frames": 0.35
}
```

### [sim] metrics (tap-adjacent)

```json
{
  "min": 0,
  "max": 1.5524,
  "avg": 1.062,
  "nanCount": 0,
  "infCount": 0,
  "samples": [
    1.5493, 1.5493, 0.8235, 0.8235, 0.8177, 1.5524, 0.8235, 1.5524, 0.8177, 0.8235, 1.5493, 1.5493,
    1.5493, 1.5493, 0.8177, 1.5493, 1.5493, 0.8235, 1.5524, 1.5493, 0.8177, 0.8235, 0.8177, 1.5524,
    0.8235, 0.8235, 1.5493, 1.5524, 0.8235, 1.5524, 1.5524, 1.5493, 0.8235, 1.5524, 0.8177, 1.5493,
    1.5524, 1.5524, 1.5493, 0.8235, 1.5524, 1.5493, 1.5493, 1.5524, 0.8235, 0.8235, 1.5493, 0.8177,
    0.8235, 0.8235, 0.8177, 1.5524, 0.8177, 0.8177, 0.8235, 0.8177, 0.8235, 0, 0, 0, 0, 0, 0, 0
  ],
  "texSize": [300, 299],
  "grid": 8
}
```

### [sim] metrics (late run)

```json
{
  "min": 0,
  "max": 1.5524,
  "avg": 1.062,
  "nanCount": 0,
  "infCount": 0,
  "samples": [
    1.5493, 1.5493, 0.8235, 0.8235, 0.8177, 1.5524, 0.8235, 1.5524, 0.8177, 0.8235, 1.5493, 1.5493,
    1.5493, 1.5493, 0.8177, 1.5493, 1.5493, 0.8235, 1.5524, 1.5493, 0.8177, 0.8235, 0.8177, 1.5524,
    0.8235, 0.8235, 1.5493, 1.5524, 0.8235, 1.5524, 1.5524, 1.5493, 0.8235, 1.5524, 0.8177, 1.5493,
    1.5524, 1.5524, 1.5493, 0.8235, 1.5524, 1.5493, 1.5493, 1.5524, 0.8235, 0.8235, 1.5493, 0.8177,
    0.8235, 0.8235, 0.8177, 1.5524, 0.8177, 0.8177, 0.8235, 0.8177, 0.8235, 0, 0, 0, 0, 0, 0, 0
  ],
  "texSize": [300, 299],
  "grid": 8
}
```

---

## 4. Screenshot Notes

- Saved at: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-09-28-alpha-force.png
- Visual summary: image taken after things settle. The white speck is no longer visible on the settle at the end of the process (i.e , red cloud/cloth, gradually smaller specks appearing in a semi-circle down the left side of the viewport).

## 5. Observations (one-liners for later synthesis)

I may have noticed **slightly** more lag at the _beginning_ but _less_ lag overall. It also seems like the `[Violation] 'requestAnimationFrame' handler took <N>ms` doesn't appear nearly as often or maybe only appears after the tap (see logs below). But beyond that, nothing visually has changed from the last time (i.e, red cloud/cloth, gradually smaller specks appearing in a semi-circle down through the last spec **no longer is visible**, no visual feedback on tap, etc.).

## 7. Full Browser Log

```
184.8acf35cf92644d4b.js:83 [PC] prebaked positions Object
184.8acf35cf92644d4b.js:83 [PC] prebaked AABB Object
184.8acf35cf92644d4b.js:83 [PC] prebaked PCA orientation applied
184.8acf35cf92644d4b.js:83 [PC] prebaked present; using positions/colors, fallback images not required
184.8acf35cf92644d4b.js:83 [PC] instances: 89441
page-93c82d875ae85a9e.js:1 [dreamdust] caps Object
page-93c82d875ae85a9e.js:1 [dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
page-93c82d875ae85a9e.js:1 [dreamdust] ink-tex bind Object
184.8acf35cf92644d4b.js:83 [Dreamdust] ink-tex bind Object
184.8acf35cf92644d4b.js:83 [PC] attach controls to <canvas data-engine=​"three.js r176" width=​"2614" height=​"1808" style=​"display:​ block;​ width:​ 1452.22px;​ height:​ 1004.44px;​ touch-action:​ auto;​ pointer-events:​ auto;​">​
184.8acf35cf92644d4b.js:83 [Dreamdust] reveal start Object
184.8acf35cf92644d4b.js:83 [engine] sim on { count:89441, texSize:[300,299] }
184.8acf35cf92644d4b.js:83 [dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8 }
184.8acf35cf92644d4b.js:83 [engine] sim fit { radius:0.382, center:[0.01,-0.03,1.13] }
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [Dreamdust] reveal end Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
page-93c82d875ae85a9e.js:1 [dreamdust] frame-percentiles Objectp50Ms: 8.4p90Ms: 9.4sampleCount: 240[[Prototype]]: Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [sim] metrics Object
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [PC] ink debug {vertexInkOk: true, uViewport: Array(2), inkIntensity: 0.75}inkIntensity: 0.75uViewport: (2) [1452, 1004]vertexInkOk: true[[Prototype]]: Object
page-93c82d875ae85a9e.js:1 [dreamdust] ink-latency {ms: 5.8, frames: 0.35}frames: 0.35ms: 5.8[[Prototype]]: Object
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}avg: 1.062grid: 8infCount: 0max: 1.5524min: 0nanCount: 0samples: (64) [1.5493, 1.5493, 0.8235, 0.8235, 0.8177, 1.5524, 0.8235, 1.5524, 0.8177, 0.8235, 1.5493, 1.5493, 1.5493, 1.5493, 0.8177, 1.5493, 1.5493, 0.8235, 1.5524, 1.5493, 0.8177, 0.8235, 0.8177, 1.5524, 0.8235, 0.8235, 1.5493, 1.5524, 0.8235, 1.5524, 1.5524, 1.5493, 0.8235, 1.5524, 0.8177, 1.5493, 1.5524, 1.5524, 1.5493, 0.8235, 1.5524, 1.5493, 1.5493, 1.5524, 0.8235, 0.8235, 1.5493, 0.8177, 0.8235, 0.8235, 0.8177, 1.5524, 0.8177, 0.8177, 0.8235, 0.8177, 0.8235, 0, 0, 0, 0, 0, 0, 0]texSize: (2) [300, 299][[Prototype]]: Object
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
378-cb34f75c0438ec32.js:1 [Violation] 'requestAnimationFrame' handler took 64ms
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
378-cb34f75c0438ec32.js:1 [Violation] 'requestAnimationFrame' handler took 66ms
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
378-cb34f75c0438ec32.js:1 [Violation] 'requestAnimationFrame' handler took 90ms
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
184.8acf35cf92644d4b.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.062, nanCount: 0, infCount: 0, …}
378-cb34f75c0438ec32.js:1 [Violation] 'requestAnimationFrame' handler took 67ms
```
