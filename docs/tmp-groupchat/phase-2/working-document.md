## **Last Updated:** Tuesday, 12:58 PM EST, 12-08-2025

# Executive Summary

Env is clean and building; baseline shows **HUD + render OK**, **timeline scrub works**, but **hover/click produce state logs with no visual response** and **lens switch does nothing**—logs indicate `ForceGraphAdapter.highlightNode/selectNode` early‑return due to missing `graphData`, plus immediate `clearSelection` microtasks. Biggest uncertainty: whether FG can be stabilized fast enough (dependency drift + stale refs vs. deeper API mismatch).  
**Sub‑W:** Make a **go/no‑go renderer decision by 2:00 PM ET today** and produce a **behavior‑parity stub** (either salvaged FG or canvas‑latent InstancedMesh) sufficient to record a usable 30–45s clip by tonight; this single decision gates all downstream polish and the Pond deliverable.

## W - Polished Demo Clip & SDK Status Update

The singular near-term objective is to submit a **Pond partner update by Thu Aug 14, 5:00 PM ET** containing a **new 30–45s Cryptiq Mindmap demo video** and a concise **SDK migration status note** that acknowledges the July slip while showing tangible progress. The execution plan is to **salvage ForceGraph Tuesday morning**; if not stable by 2:00 PM, **cut over to a canvas‑latent InstancedMesh path**, then **polish/record Wednesday**, and **QA + submit Thursday**. This preserves goodwill and optionality with Pond, clearing the runway for the hiring-track build immediately after.

## Intended Behaviour — User-Experience Checklist

**Note:** This checklist tracks **only** behavior parity between the legacy repo demo and the mid-migration demo in the new repo. It does **not describe** or evaluate the intended behavior of the future canvas-latent InstancedMesh implementation:

- [ ] **Initial load**
  - [ ] HUD appears immediately on first render
  - [ ] All nodes spawn at (0, 0, 0) and perform **one** outward burst
  - [ ] Nodes settle and stay static until a lens change occurs
- [ ] **Hover**
  - [ ] Hovering any node leaves all node positions unchanged
  - [ ] Physics engine remains idle (no forces applied)
- [ ] **Click / Selection**
  - [ ] Clicking a node highlights it **and** its directly related edges/nodes
  - [ ] Clicking a different node transfers the highlight accordingly
  - [ ] Clicking empty space clears all highlights
  - [ ] No node positions change; physics stays idle throughout
- [ ] **Timeline Scrub**
  - [ ] Dragging the timeline slider shows or hides nodes and links based on time
  - [ ] Node positions remain fixed during and after scrubbing
  - [ ] Physics engine remains idle
- [ ] **Category / Filter Toggle**
  - [ ] Toggling a filter hides or reveals matching nodes and links
  - [ ] Node positions stay unchanged while filtering
  - [ ] Physics engine remains idle
- [ ] **Lens Change (Causal ↔ Affinity ↔ Temporal)**
  - [ ] Switching the lens triggers **exactly one** fresh burst from the origin
  - [ ] Nodes resettle after the burst and stay static
  - [ ] After resettling, behaviour reverts to the Hover, Click/Selection, Timeline Scrub, and Filter rules until the next lens switch

---

# PLAN

## Sub-W — 2:00 PM ET Salvage‑or‑Pivot Decision + Behavior‑Parity Stub

Lock in a renderer path by **2:00 PM ET today** and ship a **minimal, stable behavior‑parity stub** (load → pan/zoom → lens morph → persistent selection → timeline fade) tonight to unblock polishing and recording on Wednesday.

### Sub-W Checklist - 2:00 PM ET Salvage‑or‑Pivot

- [ ] **Freeze deps to known‑good env (8c587e11)**; rebuild to eliminate drift‑induced API mismatches.
- [ ] **Remove all `structuredClone`** in `CrypticAnimusScene.tsx` to preserve object identity for refs.
- [ ] **Replace `refresh()` calls** with **attribute‑only updates** in `ForceGraphAdapter.tsx` (avoid remount/teardown).
- [ ] **Delete `queueMicrotask` clears** in `ui-slice.ts` that immediately wipe selections; convert to explicit, debounced user‑intent clears.
- [ ] **Bind `graphDataRef` once** post‑mount; ensure `highlightNode/selectNode` read from a **live ref**, not a stale closure; assert `window.__FG` has required methods before enabling HUD.
- [ ] **Add `ready` latch**: block interactions until first frame + refs are valid; then run a single “burst” and freeze physics.
- [ ] **Checkpoint @ 2:00 PM**: if **smooth load + pan/zoom + one‑shot lens burst + selection persists**, proceed with FG; **else pivot**.
- [ ] **If pivoting (canvas‑latent InstancedMesh)**: single `InstancedMesh`; per‑instance attrs `{position, baseColor, alpha, hovered, selected}`; precomputed affinity/temporal coords; 300–600ms tween on lens switch; timeline drives `alpha`; stable `id→instanceIndex` map.
- [ ] **Record rough 30–45s clip (8–9 PM)** showing parity path; **draft SDK note (9 PM)**.

## ROADMAP

- **1) FG stabilization patch set (1:00–2:00 PM, ~60–70% chance)**
  - Why it might work: logs show adapter methods exist (`highlightNode/selectNode`) but **early‑return due to missing `graphData`** and **immediate `clearSelection`**; suggests **wiring/order bug**, not total API break.
  - Risks: hidden API changes; refresh causing re‑mount; identity loss from cloning.
  - Exit criteria: ready latch; one burst on lens switch; persistent selection; timeline fade unchanged.
- **2) Pivot: canvas‑latent InstancedMesh (3:00–6:30 PM, ~80% chance to parity stub)**
  - Scope: 2D camera; one mesh; attrs + tween; skip causal layout; only affinity/temporal precompute.
  - Risks: tween jitter, alpha sorting artifacts; mitigated via per‑instance depthWrite false + order‑independent alpha (approx).
- **3) Evening proof clip + note (6:30–9:30 PM)**
  - **90%** to capture a rough but usable 30–45s parity clip; **SDK note**: what broke (dep drift), what’s fixed (renderer path), what’s parked (physics/CRDT).
- **4) Wednesday polish (10:00 AM–4:00 PM)**
  - Tooltips (sentence/date), minimal HUD, zero console warnings, capture at 1080p/60, perf on **300–1000 nodes**.
  - Confidence: **~70%** that polish fits the window; fallback is to trim scope (fewer nodes / omit tooltips).
- **5) Write Pond update (Wed 4:00–6:00 PM)**
  - Milestones (renderer + parity clip), challenges (drift → adapter fix), next steps (interaction layer, full demo).
- **6) Thursday QA + submission (10:00 AM–5:00 PM)**
  - Fresh install test, verify playback, finalize text, attach **video + hero screenshot**, submit **by 5:00 PM ET**.

**Evidence & assumptions:**

- Logs show: `window.__FG` lacks `graphData` method; adapter exposes `highlightNode/selectNode`, but both **early‑return “no graphData”**; selection then **immediately cleared** via microtask; lens switch triggers only `clearSelection`—explains “no visual feedback”. These point to **ref/ordering issues** more than rendering incapability.

---

# RUNNING NOTES

1. **Top risk:** FG **stale ref / missing `graphData`** → no styling; fix likely via ref binding + identity preservation (remove clones) + avoiding `refresh()` remounts.
2. **Time risk:** Overspending past **2:00 PM** on FG; enforce hard pivot to protect deliverable.
3. **Selection thrash:** `clearSelection` microtasks fire after `selectNodes`; must remove or gate to allow persistent selection.
4. **Lens behavior:** Need **exactly one burst** per lens switch, then freeze physics; ensure forces disabled outside burst.
5. **Instanced fallback risks:** alpha sorting / hover hit‑testing; mitigate via CPU hit map + per‑instance flags, and conservative blending.
6. **Capture quality:** lock 1080p/60, zero console errors; if perf dips >5% at 1000 nodes, cap to ~500 for demo.
7. **Messaging:** SDK note must **acknowledge July slip** and show concrete forward motion (renderer decision + parity clip).
