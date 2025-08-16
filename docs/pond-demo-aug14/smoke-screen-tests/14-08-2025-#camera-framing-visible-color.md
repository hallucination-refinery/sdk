# Manual Visual Confirmation Smoke

## Context

**Conducted:** 1:30 PM EST, 14-08-2025

- Branch: `canvas-latent-integration`
- Commit: dcf92277 - 'viz(camera,colors,background): immediate+delayed zoomToFit; initialize instanceColor pre-flush; dark canvas background; material transparent=false for clear contrast'
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Files: `packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx`, `packages/canvas-latent/src/core/InstancedNodeMesh.ts`
- Change:
  - Camera framing
    - After FORCE_VISIBLE flush: call zoomToFit immediately, then schedule a one-shot reframe 200–400ms later.
    - After burst completes (t==1): keep the existing zoomToFit and also schedule a one-shot reframe 200–400ms later.
  - Visible color and background - Initialize instanceColor for all nodes before the first flush in BOTH paths (FORCE_VISIBLE and burst). Use nodeColor?.(node) if present, else a readable default (e.g., medium-blue 0x2196f3). - Set a dark neutral background on the R3F Canvas (e.g., '#0d1117'). Keep MeshBasicMaterial; vertexColors on; transparent=false for now.

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
3. Viewport loads, the backgroud is dark. All nodes visible immediately, the 3 dark blue nodes seem to burst up and down from the center and then stablize. (although maybe this is the camera because the central node remains stationary)
4. The top left UI component, with labels saying "Debug_Graph" and "Latent_Trace", is visible
5. There are **no errors**, the console log fires once and stops.

# TEST 1 - CONSOLE LOG

## TEST 1 - BROWSER LOG

Below is the entire browser log _for test 1:_

```
Navigated to http://localhost:3000/harness/latent
page.tsx:29 [HARNESS] HUD Mount Check - Immediate
page.tsx:32 [DEBUG_GRAPH] GraphData: {nodes: Array(3), links: Array(2)}
page.tsx:36 [LATENT_TRACE] Component mounted with ref: {graphData: ƒ, cameraPosition: ƒ, zoomToFit: ƒ, centerAt: ƒ, zoom: ƒ, …}
page.tsx:41 [HARNESS] Triggering one-burst animation

```

## TEST 1 - TERMINAL

Below are the terminal logs:

```
 node  canvas-latent-integration   canvas-latent-integration  ✘  rm -rf apps/legacy-import/cryptic-vault-demo/.next
 node  canvas-latent-integration   canvas-latent-integration ● 
 node  canvas-latent-integration   canvas-latent-integration  NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo
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
cryptic-vault-demo:dev:  ✓ Ready in 3s
cryptic-vault-demo:dev:  ○ Compiling /harness/latent ...
cryptic-vault-demo:dev:  ✓ Compiled /harness/latent in 15.1s (1890 modules)
cryptic-vault-demo:dev:  GET /harness/latent 200 in 16243ms
cryptic-vault-demo:dev:  ○ Compiling /_not-found ...
cryptic-vault-demo:dev:  ✓ Compiled /_not-found in 2.9s (1880 modules)
cryptic-vault-demo:dev:  GET /.well-known/appspecific/com.chrome.devtools.json 404 in 3055ms
cryptic-vault-demo:dev:  GET /harness/latent 200 in 460ms
cryptic-vault-demo:dev:  GET /.well-known/appspecific/com.chrome.devtools.json 404 in 53ms
cryptic-vault-demo:dev:  GET /harness/latent 200 in 88ms
cryptic-vault-demo:dev:  GET /.well-known/appspecific/com.chrome.devtools.json 404 in 43ms
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
3. Viewport loads, the backgroud is dark. All nodes visible immediately, the 3 dark blue nodes _did not_ seem to burst up and down from the center and then stablize this time.
4. There were two distinct camera movements although the background makes it hard to tell
5. The top left UI component now _only_ has one label, that says "Debug_Graph"
6. I then scroll to zoom out
7. There are **no errors**, the console log fires once and stops.

# TEST 2 - CONSOLE LOG

## TEST 2 - BROWSER LOG

Below is the entire browser log _for test 2:_

```
Navigated to http://localhost:3000/harness/latent
page.tsx:29 [HARNESS] HUD Mount Check - Immediate
page.tsx:32 [DEBUG_GRAPH] GraphData: {nodes: Array(3), links: Array(2)}
page.tsx:41 [HARNESS] Triggering one-burst animation
report-hmr-latency.js:14 [Fast Refresh] done in 1755192328690ms
```

## TEST 2 - TERMINAL

Below are the terminal logs:

```
 rm -rf apps/legacy-import/cryptic-vault-demo/.next
 node  canvas-latent-integration   canvas-latent-integration  NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=0 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo
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
cryptic-vault-demo:dev:  ✓ Ready in 4.8s
cryptic-vault-demo:dev:  ○ Compiling /harness/latent ...
cryptic-vault-demo:dev:  ✓ Compiled /harness/latent in 13.6s (1890 modules)
cryptic-vault-demo:dev:  GET /harness/latent 200 in 14815ms
cryptic-vault-demo:dev:  ○ Compiling /_not-found ...
cryptic-vault-demo:dev:  ✓ Compiled /_not-found in 2.7s (1880 modules)
cryptic-vault-demo:dev:  GET /.well-known/appspecific/com.chrome.devtools.json 404 in 2945ms
```
