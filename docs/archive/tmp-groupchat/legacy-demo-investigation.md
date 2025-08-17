# Legacy Demo End-to-End Data-Flow Investigation — Consolidated Report (2025-07-15)

This document merges and reconciles the results of three parallel Claude Code investigations (flow-segment 1 / 2 / 3) **and** their associated verifier audits. It provides a single authoritative view of how data travels through the _cryptic-vault-demo_ legacy application, highlights dead or misleading code, and enumerates architectural gaps to inform the upcoming SDK migration.

---

## 1 Scope & Method

1. **Segments analysed**  
   • Segment 1 (Claude-1): JSON → `InteractionProvider` dispatch  
   • Segment 2 (Claude-2): `InteractionState` → props in `CrypticVaultScene.tsx`  
   • Segment 3 (Claude-3): Props → sprite/edge rendering via `CrypticAnimusScene`
2. Each segment was independently verified; discrepancies were logged and resolved here.
3. Filesystem anomalies (duplicate files with newline chars) were inspected but excluded from flow analysis—they will be tracked in a separate hygiene task.

---

## 2 End-to-End Data-Flow Map (ground truth)

```mermaid
flowchart TD
    subgraph Load
      A(graph_bundle.json) --> B[CrypticVaultScene.tsx<br/>require(...) ]
    end
    subgraph Transform
      B --> C[rawNodes / rawEdges]
      C --> D[nodeCache<br/>linkCache (no real caching)]
      D --> E[allNodes / allLinks]
      E --> F[visibleIdSet (by timeIndex)]
    end
    subgraph Store
      E -->|graphData| G[SET_MASTER_GRAPH_DATA<br/>dispatch]
      F --> H[visibleNodesCurrent<br/>visibleEdgesCurrent]
    end
    subgraph Props
      G --> I[interactionState]
      H --> I
      I --> J[SceneContent]
    end
    subgraph Render
      J --> K[CrypticAnimusScene]
      K --> L[ForceGraph3D nodes/edges<br/>Three.js sprites & lines]
    end
```

Key notes:

- The _@refinery/store_ package is **unused**; data goes through a lightweight React Context (`InteractionProvider`).
- `visibleIdSet` filters nodes/edges temporally; `activeLens` filters edge type (causal / affinity / temporal).
- Sprite opacity and link styling update each frame in `CrypticAnimusScene` via `useFrame`.

---

## 3 Confirmed Dead / Misleading Code

| Area                    | Details                                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Unused packages**     | `@refinery/store` present but never imported; no `batchAddNodes/Edges` calls                                               |
| **Dead imports**        | `conceptsJson`, `convertConceptsToIdeaNodes`, `useThree` in `CrypticVaultScene.tsx`                                        |
| **Unused components**   | `MemoryNodes.tsx`, `ParticleCloud.tsx`, `EnergyRippleOverlay`, _cluster_ & _brain_ views unreachable (viewMode hard-coded) |
| **Write-only state**    | `timelineDate`, `mouseHoveredNodeId`, `dialState`                                                                          |
| **Unset state**         | `searchResultNodeIds`, `currentInteractionMode`, `gesturedNodeId` have no actions                                          |
| **Props contract gaps** | `showSecrets`, `activeTags` defined in `CrypticAnimusScene` but never provided                                             |
| **Fake caching**        | `nodeCache` / `linkCache` store objects but are never reused meaningfully                                                  |

Implication: ~35-40 % of the component code is redundant or misleading, complicating migration and performance.

---

## 4 Segment-Verifier Discrepancies (all resolved)

1. **File / line counts** — original diff doc off by +1 file and several line counts (now corrected).
2. **Omitted hook (`setTimeIndex`)** — added to final map; no functional impact.
3. **Additional dead props and state** — surfaced by verifiers and included in section 3.

No outstanding factual conflicts remain between segment reports.

---

## 5 Architectural Findings

- **State pattern drift** — Legacy demo mixes global Context, local `useState`, and placeholder store APIs; true SDK integration is absent.
- **Performance traps** — Infinite physics simulation (`cooldownTime = Infinity`) and per-frame opacity loops will bottleneck large graphs.
- **Maintainability risk** — Dead code and misleading comments obscure the real data flow, increasing onboarding cost.
- **Filesystem hygiene** — Duplicate files with newline characters indicate prior tooling errors; must be cleaned before refactor.

---

## 6 Recommendations Before SDK Migration

1. **Code hygiene pass** — Delete dead imports/components, remove newline-named artefacts, and collapse fake caches.
2. **State refactor spike** — Replace `InteractionProvider` with `@refinery/store`, wiring real `batchAddNodes/Edges`; drop unused state fields.
3. **Performance guardrail** — Cap physics simulation (cooldownTime) and move opacity calculation to shader or batched uniform update.
4. **Type-safety sweep** — Introduce strict TS config and address ~91 current errors; enforce via CI.
5. **Incremental viewMode** — Either implement cluster/brain views or remove scaffolding until needed.

Executing steps 1-2 on the clean baseline branch will significantly de-risk the upcoming SDK migration and make performance profiling meaningful.
