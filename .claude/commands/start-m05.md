---
name: start-m05
description: Prints M0.5 objectives, acceptance bars, and Session 1 kickoff
---

Objectives

- Brain mesh loads in ≤2s
- 100 concepts deterministically placed
- Camera controls smooth at ≥50fps

Session 1: Brain Mesh Acquisition

- Acquire `public/models/brain.obj`; if unavailable, note fallback: procedural sphere
- Log vertex count and topology notes
- Save path and source attribution

Acceptance

- `public/models/brain.obj` exists or fallback declared
- Vertex count recorded in `.clmem/discovery/brain-mesh.json`
- Next agent: `orchestrator` via Task to create todos
