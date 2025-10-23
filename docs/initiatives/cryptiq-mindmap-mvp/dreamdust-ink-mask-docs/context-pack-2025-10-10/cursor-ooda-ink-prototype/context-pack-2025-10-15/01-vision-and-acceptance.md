---
title: Vision & Acceptance Gates – Ink Prototype
date: 2025-10-16T01:44:44Z
tags: [vision, acceptance, ink]
commit: a4c4b0fd
branch: docs/ink-falloff-flag-latch-2025-10-12
---

Vision (particles are ink):
- Touch causes immediate particle motion under the finger; looks like ink in air.
- Localized response (~10–20% footprint), screen‑space consistent; smooth decay.
- Camera/framing fixed; no overlays interfering with the view.

Acceptance gates (must all be true):
- Under-finger visible motion within ≤2 frames after tap.
- Motion localized and decays smoothly; no global jerk.
- Camera unchanged; shader gate clean; p50 ≤10 ms.

- Current status vs gates: `10-latest-smoke-evidence.md` — FAIL (visibility); shader gate clean; fluid init present; size override used; logs not persisted due to pipeline bug; next gate: force‑visible preset then under‑finger motion ≤2 frames.

Status: shader gate is clean; particles currently not visible on screen. Next: raise visibility to verify under-finger motion.

