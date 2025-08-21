# Workflow 02 Plan: Cryptiq Mindmap Baseline Visual Port (No‑Playwright Orchestrated Run)

Created: 2025‑08‑20
Scope: Deliver a baseline brain visualization on `/brain` with deterministic concept particles and smooth camera controls, executed fully by the Orchestrator without Playwright.
Constraints: No headless browser; visual verification via in‑app acceptance reporter endpoint and server logs; vendor demo kept isolated.

## Target End‑State

1. Opening `http://localhost:3000/brain` shows a fast‑loading (≤2s) blue wireframe brain on a ~40k‑vertex mesh with smooth orbit/zoom and no auto camera motion.
2. 500 concept nodes render as small, colored particles evenly distributed on the surface via deterministic mapping; hover/click updates a details panel; positions are stable across reloads (edges off by default).
3. Acceptance gates are green (35–50k vertex window, ≥50 FPS idle, no red console errors), and the vendor demo (`vendor/3dbrain`) remains isolated as a reference only.

## Sessions (0-10)

### Session 0 — Sanity, Clean Install, Typecheck (30 min)
Goal: Ensure workspace is healthy and reproducible.
Dependencies: None (starting point)

### Session 1 — Route Wiring Confirmation (15–30 min)
Goal: Confirm `/brain` page renders client component only.
Dependencies: Session 0 (clean install)

### Session 2 — Mesh Asset Check & Swap (30–45 min)
Goal: Ensure a ~40k‑vertex mesh is used.
Dependencies: None (can run parallel with Session 1)

### Session 3 — SSR Guard & Adapter Isolation (30 min)
Goal: Prevent SSR from importing client‑only modules.
Dependencies: Session 0 (typecheck must pass)

### Session 4 — Camera Controls & Limits (15–30 min)
Goal: Smooth orbit with no auto‑motion and adequate zoom range.
Dependencies: Session 1 (route exists), Session 3 (SSR guards)

### Session 5 — Deterministic Surface Mapping (45 min)
Goal: Map 500 concept nodes to brain‑surface vertices deterministically.
Dependencies: Session 2 (mesh asset ready), Session 4 (camera controls)

### Session 6 — Acceptance Reporter (No‑Browser) (45 min)
Goal: Add a client‑side reporter that writes acceptance metrics to disk via a Next API route.
Dependencies: Session 1 (route exists)

### Session 7 — Vendor Demo Isolation Check (15–30 min)
Goal: Keep `vendor/3dbrain` isolated.
Dependencies: None (verification only)

### Session 8 — Dev Server Launch & Health (30 min)
Goal: Run the app and reach `/brain` page; verify server‑side health.
Dependencies: Sessions 1-7 (all components ready)

### Session 9 — Acceptance Collection & Packaging (30 min)
Goal: Collect and freeze run artifacts.
Dependencies: Session 8 (server running), Session 6 (reporter ready)

### Session 10 — Documentation & Next‑Step Gates (30 min)
Goal: Update docs to reflect baseline and prep for visual polish.
Dependencies: Session 9 (acceptance collected)

## Acceptance Criteria

- ✓ OBJ served at `/models/brain.obj` (HTTP 200).
- ✓ Vertex count within 35–50k (else auto‑swap to fallback asset and re‑run).
- ✓ Client emits acceptance: `{ meshLoaded: true, vertexCount: [35k..50k], particles: 500, interactionsBound: true }`.
- ✓ Server logs contain zero "error" level lines after first render.
- ✓ Response time from first navigation until acceptance report ≤2s.