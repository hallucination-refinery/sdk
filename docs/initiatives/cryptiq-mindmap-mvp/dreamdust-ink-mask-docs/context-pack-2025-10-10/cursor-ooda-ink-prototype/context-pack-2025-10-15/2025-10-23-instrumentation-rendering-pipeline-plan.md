---
title: Instrumentation Plan – Rendering Pipeline (Dreamdust Fallback)
date: 2025-10-23T22:40:00Z
commit: ed09b59e
branch: docs/ink-falloff-flag-latch-2025-10-12
tags: [diagnostics, rendering, instrumentation, dreamdust]
---

## Objective
- Capture decisive runtime evidence showing where Dreamdust particles drop out between geometry prep and GPU draw when vertex textures are unavailable (`vertexInkOk: false`).
- Provide logs that can be cross-linked from `03-rendering-pipeline-trace.md` to document the current regression behavior.
- Avoid altering functional behavior except for temporary diagnostics; changes must be surgical and easily removed after investigation.

## Preconditions
- Latest code at commit `ed09b59e` (velocity guard applied).
- Smoke harness (MCP + Playwright) ready to capture console outputs.
- Ensure logging format is compatible with existing MCP console capture (stringified payloads).

## Implementation Steps

### 1. Material Define Snapshot
1. File: `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`
2. After `material.defines` mutations (post `syncLegacyVertexInkDefine`) and before `material.needsUpdate = true`, insert a guarded `console.info`:
   - Tag: `[PC] material-defines`
   - Payload:
     ```ts
     {
       vertexInkOk: resolved.vertexInkOk,
       useVertexInk: !!material.defines?.USE_VERTEX_INK,
       useVelocityDisp: !!material.defines?.USE_VELOCITY_DISP,
       blending: material.blending,
       depthTest: material.depthTest,
       depthWrite: material.depthWrite,
       toneMapped: material.toneMapped,
     }
     ```
3. Wrap logging in `try/catch` to avoid crashing builds without consoles.
4. Rationale: Confirms the shader guard is toggling as expected in fallback runs.

### 2. Geometry Attribute Verification
1. File: `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
2. Locate the existing `points-after-render` probe (search for `[PC] points-after-render`).
3. Immediately before logging, capture geometry attribute counts:
   - Example struct:
     ```ts
     const attrCounts = {
       position: geometry.getAttribute('position')?.count ?? 0,
       color: geometry.getAttribute('color')?.count ?? 0,
       aSimUv: geometry.getAttribute('aSimUv')?.count ?? 0,
       aDepth: geometry.getAttribute('aDepth')?.count ?? 0,
       drawRange: geometry.drawRange,
     }
     ```
4. Include `attrCounts` in the existing `[PC] points-after-render` payload.
5. Rationale: Ensures non-zero buffers reach the renderer even when render calls are 0.

### 3. Render List Snapshot (Augment Existing Hook)
1. File: `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
2. Inside the existing patch where `gl.renderLists.get` is overridden (search for `[PC] render-list` near the Canvas `onCreated` hook).
3. Augment the current `[PC] render-list` logging block instead of creating a new tag:
   - Tag: `[PC] render-list snapshot`
   - Payload includes:
     ```ts
     {
       opaqueCount: opaque.length,
       transparentCount: transparent.length,
       pointsInOpaque: opaque.some((entry) => entry?.object?.type === 'Points'),
       pointsInTransparent: transparent.some((entry) => entry?.object?.type === 'Points'),
       transparentSample: summarizeRenderEntries(transparent).slice(0, RENDER_LIST_SAMPLE_LIMIT),
       opaqueSample: summarizeRenderEntries(opaque).slice(0, RENDER_LIST_SAMPLE_LIMIT),
     }
     ```
   - Ensure `summarizeRenderEntries` already exists; otherwise, log minimal info (UUID + type).
4. Guard the log to emit only once per frame (reuse `renderListLoggedRef`).
5. Rationale: Proves whether the Dreamdust `Points` object survives into the draw queue.

### 4. Renderer Info Augment
1. File: `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
2. In the block logging `[PC] render-info`, append `info.memory` snapshot and a timestamp:
   ```ts
   console.info('[PC] render-info', {
     calls: info?.calls ?? null,
     points: info?.points ?? null,
     triangles: info?.triangles ?? null,
     memory: info?.memory ?? null,
     timestamp: Date.now(),
   })
   ```
3. Rationale: Confirms whether the renderer accumulates geometry/material stats even without draw calls.

### 5. Attach Diagnostic Keys to Global (Optional)
1. For advanced probing, expose `window.__dreamdustRenderState = { materialDefines: material.defines, lastRenderList: ... }`.
2. Use only if MCP/Playwright harness needs to fetch data via `page.evaluate`; otherwise keep logging-only.

## Post-Implementation Validation
- Run local build (`pnpm --filter cryptiq-mindmap-demo run build`) to ensure no TypeScript/webpack errors.
- Execute MCP smoke pass; verify new logs appear in `console-mcp.json` under the expected tags.
- Playwright smoke optional; focus on MCP output for initial triage.
- Cross-link captured console lines into `03-rendering-pipeline-trace.md` under a new dated section once evidence exists.

## Rollback Plan
- All instrumentation is additive logging; removing the new `console.info` blocks reverts to previous behavior.
- Track new logs via tag prefixes `[PC] material-defines`, `[PC] render-list snapshot`, `[PC] points-after-render`, `[PC] render-info`.

## Next Steps (After Evidence)
- Analyze whether the render list contains the points:
  - If yes and draw calls remain zero → inspect material state (depth/blend) or renderer ordering.
  - If no → walk backwards to stage root to see why the `Points` object was removed or hidden.
- Update `03-rendering-pipeline-trace.md` with findings and artifacts referencing MCP console paths.

---

## Independent Verification Audit
**Date**: 2025-10-23
**Auditor**: Independent Verification Agent
**Commit**: ed09b59e

### Audit Findings (By Severity)

#### CRITICAL
1. **Discrepancy in render stats reporting** ([PointCloudStage.tsx:1072](apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx#L1072) vs [PointCloudStage.tsx:3527](apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx#L3527))
   - Evidence: `[PC] render-info` reports 0 points while `[PC] points-after-render` reports 90650 points in same frame
   - Impact: Indicates particle dropout occurs between these two logging points
   - Recommendation: Priority implementation of geometry attribute logging to isolate the failure point

#### HIGH
2. **Missing shader define diagnostics** ([DreamdustMaterial.ts:791](apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts#L791))
   - Evidence: No logging of `USE_VERTEX_INK`/`USE_VELOCITY_DISP` state changes
   - Impact: Cannot verify if shader guards are correctly applied during fallback
   - Recommendation: Implement `[PC] material-defines` logging as specified

3. **Incomplete geometry buffer verification** ([PointCloudStage.tsx:3527-3543](apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx#L3527))
   - Evidence: Current probe lacks attribute count data (`position`, `color`, `aSimUv`, `aDepth`)
   - Impact: Cannot confirm if buffers are populated when render calls are zero
   - Recommendation: Add `attrCounts` field to existing `[PC] points-after-render` probe

#### MEDIUM
4. **Ambiguous render list logging strategy**
   - Evidence: Plan proposes new `[PC] render-list snapshot` but `[PC] render-list` already exists at [PointCloudStage.tsx:3784](apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx#L3784)
   - Impact: May duplicate logging or create confusion
   - Recommendation: Clarify if this should augment the existing probe or create a new one

5. **Missing renderer memory stats** ([PointCloudStage.tsx:1072](apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx#L1072))
   - Evidence: `[PC] render-info` lacks `info.memory` and `timestamp` fields
   - Impact: Cannot track memory usage patterns during particle dropout
   - Recommendation: Add fields as specified in plan

#### LOW
6. **Sample limit inconsistency**
   - Evidence: Plan specifies `.slice(0, 5)` but `RENDER_LIST_SAMPLE_LIMIT = 12` at [PointCloudStage.tsx:62](apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx#L62)
   - Impact: Minor logging verbosity difference
   - Recommendation: Use existing constant for consistency

### Confidence Notes

**HIGH CONFIDENCE**:
- All referenced files and functions exist at specified locations
- Regression symptoms confirmed via console evidence in context pack (10-latest-smoke-evidence.md)
- `syncLegacyVertexInkDefine` implementation verified and called at correct points

**PARTIAL EVIDENCE**:
- `summarizeRenderEntries` helper exists but with different sample limit than plan specifies
- Existing diagnostic flags (`DREAMDUST_SOLID_COLOR_DIAG`, `CAMERA_DIAGNOSTIC_ACTIVE`) are intentionally enabled

**AMBIGUOUS**:
- Whether plan intends to replace or augment existing `[PC] render-list` logging
- Rationale for 5 vs 12 sample limit choice

### Implementation Prerequisites

1. **Verified preconditions** ✅:
   - Latest code at commit `ed09b59e` (velocity guard applied)
   - Smoke harness (MCP + Playwright) operational
   - Existing try/catch guard pattern in place

2. **Missing components** ⚠️:
   - `[PC] material-defines` logging (not implemented)
   - `attrCounts` field in `[PC] points-after-render` (not implemented)
   - `memory` and `timestamp` fields in `[PC] render-info` (not implemented)

3. **Risk assessment**:
   - **Low risk**: All changes are additive logging with try/catch guards
   - **No functional impact**: Diagnostics don't alter rendering behavior
   - **Easy rollback**: Remove console.info statements to revert

### Recommendations

1. **Implement all four instrumentation points** — they address critical diagnostic gaps
2. **Priority order**:
   1. Material defines snapshot (identifies shader state)
   2. Geometry attribute counts (confirms buffer population)
   3. Render info augmentation (adds memory tracking)
   4. Render list snapshot (if distinct from existing probe)
3. **Testing protocol**:
   - Build locally first: `pnpm --filter cryptiq-mindmap-demo run build`
   - Run MCP smoke with new logging
   - Verify tags appear in console capture
   - Cross-link findings to 03-rendering-pipeline-trace.md
4. **Documentation updates**:
   - Add dated section to 03-rendering-pipeline-trace.md after evidence collection
   - Include console line references with exact timestamps
   - Link to MCP console artifact paths

### Conclusion

The instrumentation plan is **valid and implementable**. All core code elements exist, though the proposed logging is not yet implemented. The plan correctly identifies diagnostic gaps that explain why particles disappear in the fallback case (`vertexInkOk: false`). Implementation should proceed with minor clarifications on render list logging strategy.
