# Manual Visual Confirmation Smoke

## Context

**Conducted:** 1:00 PM EST, 14-08-2025

- Branch: `canvas-latent-integration`
- Commit: 9de01233 - 'core(attributes): crash-proof flush() with defensive updateRange handling; DynamicDrawUsage init on setMesh(); fallback to needsUpdate for full updates'
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- File: packages/canvas-latent/src/core/NodeAttributeManager.ts
- Change:
  Make flush() crash-proof and visible-first:
  - For each attribute target (instanceMatrix, instanceColor, aOpacity):
  - If attribute missing: skip it.
  - If attribute.updateRange is undefined: set attribute.needsUpdate = true and continue (full update fallback).
  - Else compute offset = minIndex _ itemSize and count = (maxIndex - minIndex + 1) _ itemSize, set attribute.updateRange.offset/count, then attribute.needsUpdate = true.
  - Optionally, in setMesh(): ensure each attribute exists and initialize attribute.updateRange = { offset: 0, count: -1 }; set attribute.usage = DynamicDrawUsage.
- Rationale: this removes the hard crash immediately and yields visible output even if range math is imperfect, unlocking the rest of the demo path.

# TEST 1 - LOAD & OBSERVE

## TEST 1 - PROCESS

**Run from integration worktree (do not cd):**

1.

```bash
rm -rf apps/legacy-import/cryptic-vault-demo/.next
```

2.

```bash
NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo
```

**Open (note dynamic port):**

- If 3000 is in use, Next chooses 3001. Use the URL it prints, then visit:
  - http://localhost:3001/harness/latent (or the printed port)

**Verify (stop immediately if any fail):**

- Spheres visible on screen (not just badges).
- No legacy `@refinery/canvas-r3f` errors.
- No React “unknown prop” warnings.

**If white screen persists:**

- Paste first 10 console lines and first 10 server logs from startup.
- Stop; do not proceed to next prompts.

---

# TEST 1 - USER REPORTED CHRONOLOGICAL ACCOUNT

1. I ran the following commands:
   1.1

```bash
rm -rf apps/legacy-import/cryptic-vault-demo/.next
```

1.2

```bash
NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo
```

2. I navigated to 'http://localhost:3000/harness/latent',
3. The browser loads (see screenshot: @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/smoke-screen-tests/browser-screenshot-14-08-2025-#crash-proof-flush.png)
   3.1 The viewport has a white background like before, I see two stationary black spheres. **Everything** appears all at once.
   3.2 The top left UI component, with labels saying "Debug_Graph" and "Latent_Trace", is visible
   3.3 There are **no errors**, the console log fires once and stops.
4. Encouraged, I stop the dev server and proceed to the next test.

# TEST 1 - CONSOLE LOG

## TEST 1 - BROWSER LOG

Below is the entire browser log _for test 1:_

```
Navigated to http://localhost:3000/harness/latent
page.tsx:29 [HARNESS] HUD Mount Check - Immediate
page.tsx:32 [DEBUG_GRAPH] GraphData: {nodes: Array(3), links: Array(2)}
page.tsx:36 [LATENT_TRACE] Component mounted with ref: {graphData: ƒ, cameraPosition: ƒ, zoomToFit: ƒ, centerAt: ƒ, zoom: ƒ, …}
page.tsx:41 [HARNESS] Triggering one-burst animation
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 389ms
```

## TEST 1 - TERMINAL

Below are the terminal logs:

```
node  canvas-latent-integration   canvas-latent-integration ●  ✘  rm -rf apps/legacy-import/cryptic-vault-demo/.next
 node  canvas-latent-integration   canvas-latent-integration ●  NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo
╭──────────────────────────────────────────────────────────────────────────╮
│                                                                          │
│                     Update available v2.5.4 ≫ v2.5.5                     │
│    Changelog: https://github.com/vercel/turborepo/releases/tag/v2.5.5    │
│          Run "pnpm dlx @turbo/codemod@latest update" to update           │
│                                                                          │
│          Follow @turborepo for updates: https://x.com/turborepo          │
╰──────────────────────────────────────────────────────────────────────────╯
turbo 2.5.4

• Packages in scope: cryptic-vault-demo
• Running dev in 1 packages
• Remote caching disabled
cryptic-vault-demo:dev: cache bypass, force executing b537a66e64d6eea7
cryptic-vault-demo:dev:
cryptic-vault-demo:dev: > cryptic-vault-demo@0.1.0 dev /workspace/worktrees/canvas-latent-integration/apps/legacy-import/cryptic-vault-demo
cryptic-vault-demo:dev: > next dev
cryptic-vault-demo:dev:
cryptic-vault-demo:dev:    ▲ Next.js 15.3.2
cryptic-vault-demo:dev:    - Local:        http://localhost:3000
cryptic-vault-demo:dev:    - Network:      http://172.17.0.2:3000
cryptic-vault-demo:dev:
cryptic-vault-demo:dev:  ✓ Starting...
cryptic-vault-demo:dev: Attention: Next.js now collects completely anonymous telemetry regarding usage.
cryptic-vault-demo:dev: This information is used to shape Next.js' roadmap and prioritize features.
cryptic-vault-demo:dev: You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
cryptic-vault-demo:dev: https://nextjs.org/telemetry
cryptic-vault-demo:dev:
cryptic-vault-demo:dev:  ✓ Ready in 3.8s
cryptic-vault-demo:dev:  ○ Compiling /harness/latent ...
cryptic-vault-demo:dev:  ✓ Compiled /harness/latent in 16.4s (1890 modules)
cryptic-vault-demo:dev:  GET /harness/latent 200 in 17078ms
cryptic-vault-demo:dev:  ○ Compiling /_not-found ...
cryptic-vault-demo:dev:  ✓ Compiled /_not-found in 3.5s (1880 modules)
cryptic-vault-demo:dev:  GET /.well-known/appspecific/com.chrome.devtools.json 404 in 3664ms
```

# TEST 2 - CONFIRM ONE-TIME BURST & ZOOM TO FIT

## TEST 2 - PROCESS

**Run from integration worktree (do not cd):**

1.

```bash
rm -rf apps/legacy-import/cryptic-vault-demo/.next
```

2.

```bash
NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=0 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo
```

**Open (note dynamic port):**

- If 3000 is in use, Next chooses 3001. Use the URL it prints, then visit:
  - http://localhost:3001/harness/latent (or the printed port)

**Verify (stop immediately if any fail):**

- Spheres visible on screen (not just badges).
- No legacy `@refinery/canvas-r3f` errors.
- No React “unknown prop” warnings.

**If white screen persists:**

- Paste first 10 console lines and first 10 server logs from startup.
- Stop; do not proceed to next prompts.

---

# TEST 2 - USER REPORTED CHRONOLOGICAL ACCOUNT

1. I ran the following commands:
   1.1

```bash
rm -rf apps/legacy-import/cryptic-vault-demo/.next
```

1.2

```bash
NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=0 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo
```

2. I navigated to 'http://localhost:3000/harness/latent',
3. The browser loads (see screenshot: @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/smoke-screen-tests/test2-screenshot-14-08-2025-#crash-proof-flush.png)
   3.1 The viewport has a white background.
   3.2 The two black spheres _seem_ to appear **on a delay** this time. (I _assume_ this is the burst behavior)
   3.3 The top left UI component now _only_ has one label, that says "Debug_Graph"
   3.4 There are **no errors**, the console log fires once and stops.
4. I then scroll to zoom out, seeing **another** black sphere.

# TEST 2 - CONSOLE LOG

## TEST 2 - BROWSER LOG

Below is the entire browser log _for test 2:_

```
Navigated to http://localhost:3000/harness/latent
page.tsx:29 [HARNESS] HUD Mount Check - Immediate
page.tsx:32 [DEBUG_GRAPH] GraphData: {nodes: Array(3), links: Array(2)}
page.tsx:41 [HARNESS] Triggering one-burst animation
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 655ms
use-websocket.js:113 [Violation] 'setInterval' handler took 1205ms

```

## TEST 1 - TERMINAL

Below are the terminal logs:

```
 node  canvas-latent-integration   canvas-latent-integration ●  ✘  rm -rf apps/legacy-import/cryptic-vault-demo/.next
 node  canvas-latent-integration   canvas-latent-integration ●  NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=0 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo
╭──────────────────────────────────────────────────────────────────────────╮
│                                                                          │
│                     Update available v2.5.4 ≫ v2.5.5                     │
│    Changelog: https://github.com/vercel/turborepo/releases/tag/v2.5.5    │
│          Run "pnpm dlx @turbo/codemod@latest update" to update           │
│                                                                          │
│          Follow @turborepo for updates: https://x.com/turborepo          │
╰──────────────────────────────────────────────────────────────────────────╯
turbo 2.5.4

• Packages in scope: cryptic-vault-demo
• Running dev in 1 packages
• Remote caching disabled
cryptic-vault-demo:dev: cache bypass, force executing 8eb5ec01d596e3ed
cryptic-vault-demo:dev:
cryptic-vault-demo:dev: > cryptic-vault-demo@0.1.0 dev /workspace/worktrees/canvas-latent-integration/apps/legacy-import/cryptic-vault-demo
cryptic-vault-demo:dev: > next dev
cryptic-vault-demo:dev:
cryptic-vault-demo:dev:    ▲ Next.js 15.3.2
cryptic-vault-demo:dev:    - Local:        http://localhost:3000
cryptic-vault-demo:dev:    - Network:      http://172.17.0.2:3000
cryptic-vault-demo:dev:
cryptic-vault-demo:dev:  ✓ Starting...
cryptic-vault-demo:dev: Attention: Next.js now collects completely anonymous telemetry regarding usage.
cryptic-vault-demo:dev: This information is used to shape Next.js' roadmap and prioritize features.
cryptic-vault-demo:dev: You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
cryptic-vault-demo:dev: https://nextjs.org/telemetry
cryptic-vault-demo:dev:
cryptic-vault-demo:dev:  ✓ Ready in 2.7s
cryptic-vault-demo:dev:  ○ Compiling /harness/latent ...
cryptic-vault-demo:dev:  ✓ Compiled /harness/latent in 12s (1890 modules)
cryptic-vault-demo:dev:  GET /harness/latent 200 in 12655ms
cryptic-vault-demo:dev:  ○ Compiling /_not-found ...
cryptic-vault-demo:dev:  ✓ Compiled /_not-found in 2.6s (1880 modules)
cryptic-vault-demo:dev:  GET /.well-known/appspecific/com.chrome.devtools.json 404 in 2729ms
```
