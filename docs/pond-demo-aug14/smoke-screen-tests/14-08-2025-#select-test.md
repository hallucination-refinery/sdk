# Manual Visual Confirmation Smoke

## Context

**Conducted:** 4:50 PM EST, 14-08-2025

- Branch: `canvas-latent-integration`
- Commit: 8d24d540 - 'ui(background,select): switch canvas background to white; add raycaster click-to-select (orange) with background-clear; defer flush to frame for stability'
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Files: `packages/canvas-latent/src/core/InstancedNodeMesh.ts`, `packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx`
- Change: Applied and pushed the two tiny fixes.
  - Instanced mesh/raycast:
    - geometry.computeBoundingSphere() on build.
    - mesh.updateMatrixWorld(true) before raycasting.
  - Color visibility:
    - material.color.set(0xffffff) to avoid tinting instance colors.
    - Forced an initial mgr.flush() after initializing colors so they show on first paint.

# TEST 1

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

- Paste console lines and server logs from startup.
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
3. Viewport loads, white background, all nodes visible and _burst_ up and down before settling _except_ for the node which remains in the center. The top left UI component, with labels saying "Debug_Graph" and "Latent_Trace", is visible. (there's **no** a zoom to fit or any camera movement)
4. All 3 nodes look **black**
5. Clicked on the background.
6. Then clicked on a node. **No visual change**, -> `[DEBUG_GRAPH] Background clicked` log fired.
7. Clicked on background (accidentally this time)
8. Zoomed in and clicked on same node. **No visual change** -> `[DEBUG_GRAPH] Background clicked` log fired.
9. There are **no errors**

# TEST 1 - CONSOLE LOG

## TEST 1 - BROWSER LOG

Below is the entire browser log _for test 1:_

```
Navigated to http://localhost:3000/harness/latent
page.tsx:29 [HARNESS] HUD Mount Check - Immediate
page.tsx:32 [DEBUG_GRAPH] GraphData: {nodes: Array(3), links: Array(2)}
page.tsx:36 [LATENT_TRACE] Component mounted with ref: {graphData: ƒ, cameraPosition: ƒ, zoomToFit: ƒ, centerAt: ƒ, zoom: ƒ, …}
page.tsx:41 [HARNESS] Triggering one-burst animation
page.tsx:72 [DEBUG_GRAPH] Background clicked
page.tsx:72 [DEBUG_GRAPH] Background clicked
page.tsx:72 [DEBUG_GRAPH] Background clicked
page.tsx:72 [DEBUG_GRAPH] Background clicked
page.tsx:72 [DEBUG_GRAPH] Background clicked
page.tsx:72 [DEBUG_GRAPH] Background clicked
```

## TEST 1 - TERMINAL

Below are the terminal logs:

```
node  canvas-latent-integration   canvas-latent-integration  ✘  rm -rf apps/legacy-import/cryptic-vault-demo/.next
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
cryptic-vault-demo:dev:  ✓ Ready in 4.6s
cryptic-vault-demo:dev:  ○ Compiling /harness/latent ...
cryptic-vault-demo:dev:  ✓ Compiled /harness/latent in 15.2s (1890 modules)
cryptic-vault-demo:dev:  GET /harness/latent 200 in 15877ms
cryptic-vault-demo:dev:  ○ Compiling /_not-found ...
cryptic-vault-demo:dev:  ✓ Compiled /_not-found in 2.9s (1880 modules)
cryptic-vault-demo:dev:  GET /.well-known/appspecific/com.chrome.devtools.json 404 in 3054ms
```

# TEST 2 -

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
3. Viewport loads, backgrounds white, the top left UI component is visible. There are **no nodes visible**
4. Then it _suddenly_ (maybe half a second later) the nodes appear stationary in their _final positions_. No perceptible movement or camera movement
5. I click twice on the background then scroll to zoom out.
6. I zoom back in, closing in on the central node.
7. I click on the central node, **No visual change** -> `[DEBUG_GRAPH] Background clicked` log fired.
8. There are **no errors** in the console log.

# TEST 2 - CONSOLE LOG

## TEST 2 - BROWSER LOG

Below is the entire browser log _for test 2:_

```
Navigated to http://localhost:3000/harness/latent
page.tsx:29 [HARNESS] HUD Mount Check - Immediate
page.tsx:32 [DEBUG_GRAPH] GraphData: {nodes: Array(3), links: Array(2)}
page.tsx:41 [HARNESS] Triggering one-burst animation
page.tsx:72 [DEBUG_GRAPH] Background clicked
page.tsx:72 [DEBUG_GRAPH] Background clicked
page.tsx:72 [DEBUG_GRAPH] Background clicked
```

## TEST 2 - TERMINAL

Below are the terminal logs:

```
 node  canvas-latent-integration   canvas-latent-integration ●  ✘  rm -rf apps/legacy-import/cryptic-vault-demo/.next
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
cryptic-vault-demo:dev:  ✓ Ready in 3.2s
cryptic-vault-demo:dev:  ○ Compiling /harness/latent ...
cryptic-vault-demo:dev:  ✓ Compiled /harness/latent in 12.7s (1890 modules)
cryptic-vault-demo:dev:  GET /harness/latent 200 in 13745ms
cryptic-vault-demo:dev:  ○ Compiling /_not-found ...
cryptic-vault-demo:dev:  ✓ Compiled /_not-found in 6.2s (1880 modules)
cryptic-vault-demo:dev:  GET /.well-known/appspecific/com.chrome.devtools.json 404 in 6387ms
```
