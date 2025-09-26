# 2025-09-26 Probes Smoke — Raw Capture

Use this single page to dump every artifact from the latest smoke test before handing it back for synthesis. Keep the structure; paste verbatim outputs inside the fenced blocks so nothing gets lost.

## 1. Run Metadata

- **Date & time (local):** 12:12 PM (NYC) · 2025-09-26
- **Branch / commit:** `debug/batch0-baseline` @ `c962c318`
- **Device & browser:** MacBook Pro (M1 Pro, 16 GB) · Chrome 140 (incognito)
- **URL / query params:** `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1`
- **Screenshot file:** `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-09-26-probes-smoke.png`

## 2. Terminal Commands & Results

```
 node  /workspace   debug/batch0-baseline ● ⍟14  git status -sb
## debug/batch0-baseline...origin/debug/batch0-baseline
 M apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
 node  /workspace   debug/batch0-baseline ● ⍟14  pnpm install --frozen-lockfile
Scope: all 19 workspace projects
Lockfile is up to date, resolution step is skipped
Already up to date

   ╭───────────────────────────────────────────────────────────────────╮
   │                                                                   │
   │                Update available! 9.15.1 → 10.17.1.                │
   │   Changelog: https://github.com/pnpm/pnpm/releases/tag/v10.17.1   │
   │                 Run "pnpm add -g pnpm" to update.                 │
   │                                                                   │
   ╰───────────────────────────────────────────────────────────────────╯

. prepare$ husky install
│ husky - install command is DEPRECATED
└─ Done in 93ms
Done in 3.4s
 node  /workspace   debug/batch0-baseline ● ⍟14  pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit
 node  /workspace   debug/batch0-baseline ● ⍟14  pnpm --filter cryptiq-mindmap-demo run lint || true

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
1446:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
1875:198  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/components/brainAnchors.worker.ts
68:78  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
149:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
150:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
152:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/components/dreamdust/DreamdustMaterial.ts
70:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
572:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
584:34  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
585:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
586:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
586:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
587:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
604:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
606:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
609:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
610:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
612:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
613:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
616:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
618:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
621:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
623:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
636:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
637:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
637:73  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
637:88  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
638:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

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
 node  /workspace   debug/batch0-baseline ● ⍟14  pnpm --filter cryptiq-mindmap-demo run lint || true

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
1446:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
1875:198  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/components/brainAnchors.worker.ts
68:78  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
149:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
150:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
152:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/components/dreamdust/DreamdustMaterial.ts
70:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
572:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
584:34  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
585:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
586:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
586:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
587:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
604:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
606:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
609:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
610:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
612:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
613:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
616:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
618:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
621:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
623:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
636:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
637:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
637:73  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
637:88  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
638:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

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
 node  /workspace   debug/batch0-baseline ● ⍟14  CI=1 pnpm --filter cryptiq-mindmap-demo run build

> cryptiq-mindmap-demo@0.1.0 build /workspace/apps/cryptiq-mindmap-demo
> next build

   ▲ Next.js 15.3.5
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 17.0s
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

 node  /workspace   debug/batch0-baseline ● ⍟14  pnpm --filter cryptiq-mindmap-demo run start

> cryptiq-mindmap-demo@0.1.0 start /workspace/apps/cryptiq-mindmap-demo
> next start

   ▲ Next.js 15.3.5
   - Local:        http://localhost:3000
   - Network:      http://172.17.0.2:3000

 ✓ Starting...
 ✓ Ready in 803ms
^C%
 node  /workspace   debug/batch0-baseline ● ? ⍟14 
 node  /workspace   debug/batch0-baseline ● ? ⍟14  ✘ 
```

## 3. Initial Console Batch (on first reveal)

```
184.0f5886d962503000.js:83 [PC] prebaked positions Object
184.0f5886d962503000.js:83 [PC] prebaked AABB Object
184.0f5886d962503000.js:83 [PC] prebaked PCA orientation applied
184.0f5886d962503000.js:83 [PC] prebaked present; using positions/colors, fallback images not required
184.0f5886d962503000.js:83 [PC] instances: 89441
page-93c82d875ae85a9e.js:1 [dreamdust] caps Object
page-93c82d875ae85a9e.js:1 [dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
page-93c82d875ae85a9e.js:1 [dreamdust] ink-tex bind Object
184.0f5886d962503000.js:83 [Dreamdust] ink-tex bind Object
184.0f5886d962503000.js:83 [PC] attach controls to <canvas data-engine=​"three.js r176" width=​"2466" height=​"1840" style=​"display:​ block;​ width:​ 1370px;​ height:​ 1022.22px;​ touch-action:​ auto;​ pointer-events:​ auto;​">​
184.0f5886d962503000.js:83 [Dreamdust] reveal start Object
184.0f5886d962503000.js:83 [engine] sim on { count:89441, texSize:[300,299] }
184.0f5886d962503000.js:83 [dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8 }
184.0f5886d962503000.js:83 [engine] sim fit { radius:0.382, center:[0.01,-0.03,1.13] }
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [Dreamdust] reveal end Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
page-93c82d875ae85a9e.js:1 [dreamdust] frame-percentiles Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics Object
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [PC] ink debug {vertexInkOk: true, uViewport: Array(2), inkIntensity: 0.75}
page-93c82d875ae85a9e.js:1 [dreamdust] ink-latency {ms: 38.6, frames: 2.32}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
```

```
{
    "min": 0,
    "max": 1.5524,
    "avg": 1.0165,
    "nanCount": 0,
    "infCount": 0,
    "samples": [
        0.8177,
        0.8177,
        0.8235,
        1.5524,
        1.5524,
        1.5524,
        0.8235,
        1.5524,
        0.8235,
        0.8235,
        1.5493,
        1.5493,
        0.8177,
        0.8235,
        0.8177,
        1.5493,
        0.8177,
        0.8235,
        1.5524,
        1.5493,
        0.8235,
        0.8235,
        0.8177,
        1.5493,
        0.8235,
        0.8235,
        0.8177,
        1.5524,
        0.8177,
        1.5524,
        1.5524,
        1.5493,
        0.8235,
        1.5524,
        0.8177,
        0.8235,
        1.5493,
        1.5493,
        1.5493,
        0.8235,
        1.5524,
        1.5493,
        1.5493,
        1.5524,
        0.8235,
        0.8235,
        1.5493,
        0.8235,
        0.8235,
        0.8235,
        0.8177,
        1.5524,
        0.8177,
        1.5493,
        0.8235,
        0.8177,
        0.8235,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    "texSize": [
        300,
        299
    ],
    "grid": 8
}
```

## 4. Gesture Logs & Telemetry

- **Short tap (T+0 s) logs:**

```
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [PC] ink debug {vertexInkOk: true, uViewport: Array(2), inkIntensity: 0.75}
page-93c82d875ae85a9e.js:1 [dreamdust] ink-latency {ms: 38.6, frames: 2.32}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
```

```
[PC] ink debug
{
    "vertexInkOk": true,
    "uViewport": [
        1370,
        1022
    ],
    "inkIntensity": 0.75
}
```

```
[dreamdust] ink-latency
{
    "ms": 38.6,
    "frames": 2.32
}
```

- **Long drag (≈T+30 s) logs:**
  There's **no** fucking ink log at all.

```
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
184.0f5886d962503000.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0165, nanCount: 0, infCount: 0, …}
```

## 5. Visual Observations

- **Condensation / hold:** None the canvas is completely blank.
- **Probe visuals (teal ink / red VTF):** None.
- **Breath / drift / cascade notes:** None.
- **Perf behavior (p50/p90 spikes, stutter, etc.):** I don't fucking know you DIDNT FUCKING TELL ME TO COPY THAT I fucking told you **not** to make me fucking think it's laggy and I can't see shit what fucking more do you want from me?

## 6. Outstanding Issues / Follow-ups

- ITS FUCKING SHIT
-
-

## 7. Additional Artifacts (Optional)

- **Performance trace URL / file:**
- **Extra screenshots:**
- **Misc notes:**

---

# 2025-09-26 Probe Smoke — Uniform Dump

Use this second section for the new run focused on uniform inspection.

## A. Run Metadata

- **Date & time (local):** 1:01 PM (NYC) · 2025-09-26
- **Branch / commit:** `debug/batch0-baseline` @ `b76ff7ff`
- **Device & browser:** MacBook Pro (M1 Pro, 16 GB) · Chrome 140 (incognito)
- **Route:** `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1`
- **Screenshot file:** `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-09-26-probes-smoke.png`

## B. Terminal Commands & Results

```
 node  /workspace   debug/batch0-baseline ⍟14  git status -sb
## debug/batch0-baseline...origin/debug/batch0-baseline
 node  /workspace   debug/batch0-baseline ⍟14  pnpm install --frozen-lockfile
Scope: all 19 workspace projects
Lockfile is up to date, resolution step is skipped
Already up to date
. prepare$ husky install
│ husky - install command is DEPRECATED
└─ Done in 71ms
Done in 2s
 node  /workspace   debug/batch0-baseline ⍟14  pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit
 node  /workspace   debug/batch0-baseline ⍟14  pnpm --filter cryptiq-mindmap-demo run lint || true

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
1446:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
1875:198  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/components/brainAnchors.worker.ts
68:78  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
149:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
150:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
152:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./app/components/dreamdust/DreamdustMaterial.ts
70:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
572:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
584:34  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
585:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
586:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
586:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
587:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
604:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
606:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
609:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
610:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
612:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
613:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
616:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
618:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
621:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
623:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
636:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
637:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
637:73  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
637:88  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
638:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

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
 node  /workspace   debug/batch0-baseline ⍟14  CI=1 pnpm --filter cryptiq-mindmap-demo run build

> cryptiq-mindmap-demo@0.1.0 build /workspace/apps/cryptiq-mindmap-demo
> next build

   ▲ Next.js 15.3.5
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 17.0s
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

 node  /workspace   debug/batch0-baseline ⍟14  pnpm --filter cryptiq-mindmap-demo run start

> cryptiq-mindmap-demo@0.1.0 start /workspace/apps/cryptiq-mindmap-demo
> next start

   ▲ Next.js 15.3.5
   - Local:        http://localhost:3000
   - Network:      http://172.17.0.2:3000

 ✓ Starting...
 ✓ Ready in 650ms
^C%
 node  /workspace   debug/batch0-baseline ● ⍟14 
 node  /workspace   debug/batch0-baseline ● ? ⍟14  ✘ 
```

## C. Initial Console Batch

```
184.aeec8df6325e4886.js:83 [PC] prebaked positions Object
184.aeec8df6325e4886.js:83 [PC] prebaked AABB Object
184.aeec8df6325e4886.js:83 [PC] prebaked PCA orientation applied
184.aeec8df6325e4886.js:83 [PC] prebaked present; using positions/colors, fallback images not required
184.aeec8df6325e4886.js:83 [PC] instances: 89441
page-93c82d875ae85a9e.js:1 [dreamdust] caps Object
page-93c82d875ae85a9e.js:1 [dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
page-93c82d875ae85a9e.js:1 [dreamdust] ink-tex bind Object
184.aeec8df6325e4886.js:83 [Dreamdust] ink-tex bind Object
184.aeec8df6325e4886.js:83 [PC] attach controls to <canvas data-engine=​"three.js r176" width=​"2466" height=​"1840" style=​"display:​ block;​ width:​ 1370px;​ height:​ 1022.22px;​ touch-action:​ auto;​ pointer-events:​ auto;​">​
184.aeec8df6325e4886.js:83 [Dreamdust] reveal start Object
184.aeec8df6325e4886.js:83 [engine] sim on { count:89441, texSize:[300,299] }
184.aeec8df6325e4886.js:83 [dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8 }
184.aeec8df6325e4886.js:83 [engine] sim fit { radius:0.382, center:[0.01,-0.03,1.13] }
184.aeec8df6325e4886.js:83 [sim] metrics Object
184.aeec8df6325e4886.js:83 [sim] metrics Object
184.aeec8df6325e4886.js:83 [Dreamdust] reveal end Object
184.aeec8df6325e4886.js:83 [sim] metrics Object
184.aeec8df6325e4886.js:83 [sim] metrics Object
184.aeec8df6325e4886.js:83 [sim] metrics Object
184.aeec8df6325e4886.js:83 [sim] metrics Object
184.aeec8df6325e4886.js:83 [sim] metrics Object
184.aeec8df6325e4886.js:83 [sim] metrics Object
page-93c82d875ae85a9e.js:1 [dreamdust] frame-percentiles Object
184.aeec8df6325e4886.js:83 [sim] metrics Object
184.aeec8df6325e4886.js:83 [sim] metrics Object
184.aeec8df6325e4886.js:83 [sim] metrics Object
184.aeec8df6325e4886.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0279, nanCount: 0, infCount: 0, …}
378-cb34f75c0438ec32.js:1 [Violation] 'requestAnimationFrame' handler took 52ms
184.aeec8df6325e4886.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0279, nanCount: 0, infCount: 0, …}
378-cb34f75c0438ec32.js:1 [Violation] 'requestAnimationFrame' handler took 88ms
184.aeec8df6325e4886.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0279, nanCount: 0, infCount: 0, …}
378-cb34f75c0438ec32.js:1 [Violation] 'requestAnimationFrame' handler took 83ms
184.aeec8df6325e4886.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 1.0279, nanCount: 0, infCount: 0, …}
378-cb34f75c0438ec32.js:1 [Violation] 'requestAnimationFrame' handler took 85ms
```

--

```
[PC] prebaked positions
{
    "bytes": 3219888,
    "count": 268324,
    "sample": [
        -0.2320713847875595,
        -0.23154249787330627,
        1.183864712715149,
        -0.22892270982265472,
        -0.22928693890571594,
        1.1723296642303467
    ]
}
```

---

```
[PC] prebaked AABB
{
    "min": [
        -0.24537451565265656,
        -0.26912346482276917,
        0.7519106268882751
    ],
    "max": [
        0.2641647160053253,
        0.20759183168411255,
        1.515622615814209
    ],
    "extent": [
        0.5095392316579819,
        0.4767152965068817,
        0.7637119889259338
    ],
    "maxExtent": 0.7637119889259338,
    "scale": 1309.3941361407406,
    "radius": 500
}
```

---

```
[dreamdust] ink-tex bind
{
    "width": 256,
    "height": 256,
    "needsUpdate": false
}
```

--

```
[dreamdust] caps
{
    "vertexInkOk": true,
    "floatOk": true,
    "aliasedPointSizeRange": [
        1,
        511
    ],
    "dpr": 1.7999999523162842,
    "dprClamp": 1.7999999523162842,
    "dprLimit": 1.8
}
```

---

```
[Dreamdust] reveal start
{
    "duration": 2
}
```

---

```
[Dreamdust] reveal end
{
    "duration": 2
}
```

---

```
[sim] metrics
{
    "min": 0,
    "max": 1.5524,
    "avg": 1.0279,
    "nanCount": 0,
    "infCount": 0,
    "samples": [
        0.8177,
        1.5493,
        0.8235,
        1.5524,
        1.5524,
        1.5524,
        0.8235,
        1.5524,
        0.8235,
        0.8235,
        1.5493,
        1.5493,
        0.8177,
        0.8235,
        0.8177,
        1.5493,
        0.8177,
        0.8235,
        1.5524,
        1.5493,
        0.8235,
        0.8235,
        0.8177,
        1.5493,
        0.8235,
        0.8235,
        0.8177,
        1.5524,
        0.8177,
        1.5524,
        1.5524,
        1.5493,
        0.8235,
        1.5524,
        0.8177,
        0.8235,
        1.5493,
        1.5493,
        1.5493,
        0.8235,
        1.5524,
        1.5493,
        1.5493,
        1.5524,
        0.8235,
        0.8235,
        1.5493,
        0.8235,
        0.8235,
        0.8235,
        0.8177,
        1.5524,
        0.8177,
        1.5493,
        0.8235,
        0.8177,
        0.8235,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    "texSize": [
        300,
        299
    ],
    "grid": 8
}
```

---

```
[dreamdust] frame-percentiles
{
    "sampleCount": 240,
    "p50Ms": 39.2,
    "p90Ms": 42
}
```

---

```
{
    "min": 0,
    "max": 1.5524,
    "avg": 1.0279,
    "nanCount": 0,
    "infCount": 0,
    "samples": [
        0.8177,
        1.5493,
        0.8235,
        1.5524,
        1.5524,
        1.5524,
        0.8235,
        1.5524,
        0.8235,
        0.8235,
        1.5493,
        1.5493,
        0.8177,
        0.8235,
        0.8177,
        1.5493,
        0.8177,
        0.8235,
        1.5524,
        1.5493,
        0.8235,
        0.8235,
        0.8177,
        1.5493,
        0.8235,
        0.8235,
        0.8177,
        1.5524,
        0.8177,
        1.5524,
        1.5524,
        1.5493,
        0.8235,
        1.5524,
        0.8177,
        0.8235,
        1.5493,
        1.5493,
        1.5493,
        0.8235,
        1.5524,
        1.5493,
        1.5493,
        1.5524,
        0.8235,
        0.8235,
        1.5493,
        0.8235,
        0.8235,
        0.8235,
        0.8177,
        1.5524,
        0.8177,
        1.5493,
        0.8235,
        0.8177,
        0.8235,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    "texSize": [
        300,
        299
    ],
    "grid": 8
}
```

---

---

## D. Uniform Snapshot (window.debugDreamdustUniforms)

```
{
    "uTime": {
        "value": 56.863599999999785
    },
    "uViewport": {
        "value": [
            1370,
            1022
        ]
    },
    "uInkTex": {
        "value": {
            "metadata": {
                "version": 4.6,
                "type": "Texture",
                "generator": "Texture.toJSON"
            },
            "uuid": "5a72191d-6c8b-4ec9-9be5-7f5a0e88c694",
            "name": "",
            "image": "2a1837db-e6d3-4cbc-8c03-0281617ac90d",
            "mapping": 300,
            "channel": 0,
            "repeat": [
                1,
                1
            ],
            "offset": [
                0,
                0
            ],
            "center": [
                0,
                0
            ],
            "rotation": 0,
            "wrap": [
                1001,
                1001
            ],
            "format": 1023,
            "internalFormat": null,
            "type": 1009,
            "colorSpace": "",
            "minFilter": 1006,
            "magFilter": 1006,
            "anisotropy": 1,
            "flipY": false,
            "generateMipmaps": false,
            "premultiplyAlpha": false,
            "unpackAlignment": 1
        }
    },
    "uInkIntensity": {
        "value": 0
    },
    "uReveal": {
        "value": 1
    },
    "uBreath": {
        "value": 0.2541468009645155
    },
    "uBreathAmp": {
        "value": 0.05
    },
    "uCascade": {
        "value": 0
    },
    "uCascadeColor": {
        "value": [
            1,
            1,
            1
        ]
    },
    "uCascadeSizeBoost": {
        "value": 0
    },
    "uVaporGain": {
        "value": 0
    },
    "uNoiseScale": {
        "value": 0.0025
    },
    "uNoiseSpeed": {
        "value": 0.24
    },
    "uEvolution": {
        "value": 0.85
    },
    "uNoiseThreshold": {
        "value": 0.92
    },
    "uDriftAmp": {
        "value": 8
    },
    "uCurlAmp": {
        "value": 0.55
    },
    "uPointBaseSize": {
        "value": 1
    },
    "uDepthMin": {
        "value": 0.05
    },
    "uDepthMax": {
        "value": 0.95
    },
    "uDepthBias": {
        "value": 0.14
    },
    "uDepthNormScale": {
        "value": 0.00116
    },
    "uGamma": {
        "value": 0.82
    },
    "uRimGamma": {
        "value": 2.4
    },
    "uFocal": {
        "value": 1600
    },
    "uMinSize": {
        "value": 0.75
    },
    "uMaxSize": {
        "value": 9.5
    },
    "uSizeGain": {
        "value": 1
    },
    "uOffsetGain": {
        "value": 5
    },
    "uInkOffsetBoost": {
        "value": 1
    },
    "uInkSizeBoost": {
        "value": 1
    },
    "uTintGain": {
        "value": 0.2
    },
    "uInkTintBoost": {
        "value": 1
    },
    "uVertexInkOk": {
        "value": 1
    },
    "uBaseSize": {
        "value": 1
    },
    "uInvertDepth": {
        "value": 0
    },
    "uPVInvCapture": {
        "value": {
            "elements": [
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1
            ]
        }
    },
    "uHasCapture": {
        "value": 0
    },
    "uZNearNdc": {
        "value": -0.85
    },
    "uZFarNdc": {
        "value": 0.15
    },
    "uInkOffsetGain": {
        "value": 5
    },
    "uInkSizeGain": {
        "value": 1
    },
    "uInkTintGain": {
        "value": 0.2
    },
    "uPointSize": {
        "value": 1
    },
    "uThickness": {
        "value": 0.14
    },
    "uCurlFreq": {
        "value": 1
    },
    "uDriftSpeed": {
        "value": 0.28
    },
    "uTapGain": {
        "value": 0.5
    },
    "uTapTau": {
        "value": 2
    },
    "uSimPositionTex": {
        "value": {
            "metadata": {
                "version": 4.6,
                "type": "Texture",
                "generator": "Texture.toJSON"
            },
            "uuid": "a3a639aa-bdd5-484e-a155-211d55e95a2b",
            "name": "",
            "image": "1618fc3d-fcd4-4068-ab6a-3c207a31daf5",
            "mapping": 300,
            "channel": 0,
            "repeat": [
                1,
                1
            ],
            "offset": [
                0,
                0
            ],
            "center": [
                0,
                0
            ],
            "rotation": 0,
            "wrap": [
                1001,
                1001
            ],
            "format": 1023,
            "internalFormat": null,
            "type": 1015,
            "colorSpace": "",
            "minFilter": 1003,
            "magFilter": 1003,
            "anisotropy": 1,
            "flipY": false,
            "generateMipmaps": false,
            "premultiplyAlpha": false,
            "unpackAlignment": 1
        }
    },
    "uSimColorTex": {
        "value": {
            "metadata": {
                "version": 4.6,
                "type": "Texture",
                "generator": "Texture.toJSON"
            },
            "uuid": "ad388b4e-651f-475c-a9af-9cc7411b783b",
            "name": "",
            "image": "69cb4d48-5d9f-4bdd-9bea-bd9b2dbec950",
            "mapping": 300,
            "channel": 0,
            "repeat": [
                1,
                1
            ],
            "offset": [
                0,
                0
            ],
            "center": [
                0,
                0
            ],
            "rotation": 0,
            "wrap": [
                1001,
                1001
            ],
            "format": 1023,
            "internalFormat": null,
            "type": 1009,
            "colorSpace": "",
            "minFilter": 1003,
            "magFilter": 1003,
            "anisotropy": 1,
            "flipY": false,
            "generateMipmaps": false,
            "premultiplyAlpha": false,
            "unpackAlignment": 1
        }
    },
    "uAlphaFloor": {
        "value": 0.06
    }
```

## E. Gesture Logs & Telemetry

- **Short tap (T+0 s):**

```
[PC] ink debug
{
    "vertexInkOk": true,
    "uViewport": [
        1370,
        1022
    ],
    "inkIntensity": 0.75
}
[dreamdust] ink-latency
{
    "ms": 38.7,
    "frames": 2.32
}
```

- **Long drag (~T+30 s):**

```
No Additional Logs
```

## F. Visual Observations

- **Particles visible?:** No.
- **Probe diagnostics (teal/red):** Unchanged.
- **Perf behavior:** Noticibly **very** laggy
- **Other notes:** I'm very upset.

## G. Outstanding Issues / Follow-ups

-
-
-
