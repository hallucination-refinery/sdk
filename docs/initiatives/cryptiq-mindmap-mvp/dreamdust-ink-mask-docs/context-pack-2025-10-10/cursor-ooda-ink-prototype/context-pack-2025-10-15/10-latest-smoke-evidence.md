---
title: Latest Smoke Evidence – Prod URL (scene-03)
date: 2025-10-16T01:44:44Z
tags: [evidence, smoke, prod]
commit: 635c225f
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&falloff=1
---

Summary: shader gate clean; fluid initialized; particles not visible in screenshot.

Key console lines:
- "[PC] fluid uniforms prime {invSize: [...], velToNdc: 0.028, inkBlend: 0.78}"
- "[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}"
- "[PC] fluid init {size: 256, iters: 10}"
- No THREE.WebGLProgram validation errors observed.

Screenshots:
- pre: assets/prod-correct-url-pre.png (UI visible; particles not apparent)

Decision: FAIL (visibility) – raise alpha/point size and retest under‑finger motion.


