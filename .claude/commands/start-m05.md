---
name: start-m05
description: Prints M0.5 objectives, acceptance bars, and Session 1 kickoff
args:
  - scope        # e.g., session1-only | session1-2
  - source_repo  # e.g., https://github.com/iamwallam/3dbrain.git
  - ref          # e.g., master or a commit SHA
  - source_path  # e.g., static/models/brain_vertex_low.obj
defaults:
  scope: session1-only
  source_repo: https://github.com/iamwallam/3dbrain.git
  ref: master
  source_path: static/models/brain_vertex_low.obj
---

Objectives

- Brain mesh loads in ≤2s
- 100 concepts deterministically placed
- Camera controls smooth at ≥50fps

Usage

- Run without args for defaults: `/start-m05`
- Or pass key=value pairs to tailor scope and source:
  - Example: `/start-m05 scope=session1-2 source_repo=https://github.com/iamwallam/3dbrain.git ref=master source_path=static/models/brain_vertex_low.obj`

Behavior

- If `scope=session1-only`, only print Session 1 plan/acceptance.
- If `scope=session1-2`, include Session 2 (OBJ loader integration) preview.
- If `source_repo`/`ref`/`source_path` are provided, echo them under Session 1 so the orchestrator can use them.

Session 1: Brain Mesh Acquisition

- Acquire `public/models/brain.obj`; if unavailable, note fallback: procedural sphere
- Log vertex count and topology notes
- Save path and source attribution

Acceptance

- `public/models/brain.obj` exists or fallback declared
- Vertex count recorded in `.clmem/discovery/brain-mesh.json`
- Provenance includes `source_repo`, `ref`, and `source_path`
- Next agent: `orchestrator` via Task to create todos

Session 2 (shown when `scope=session1-2`)

- Add minimal `BrainMesh.tsx` using R3F `useLoader(OBJLoader, NEXT_PUBLIC_BRAIN_MESH_URL)`
- Wireframe render; no camera/particles/state
- Acceptance: mesh outline renders; error fallback present
