### Cryptiq Mindmap — Landing Page Requirements (Current vs Desired)

This document specifies exactly how the landing page’s background brain, intro animation, and HUD presently work, how they differ from the `/brain` page, and what needs to change to meet the intended experience. All claims are cross‑referenced to concrete code lines and files.

---

### 1) Current Landing Page Behavior (Evidence)

- Background scene component and mount location
  - File: `apps/cryptiq-mindmap-demo/app/page.tsx`
  - The landing page dynamically mounts the background scene component and overlays HUD:

```97:109:apps/cryptiq-mindmap-demo/app/page.tsx
  return (
    <main
      style={{ position: 'relative', width: '100vw', height: '100vh', background: '#010c2a', overflow: 'hidden' }}
    >
      <BackgroundBrain />
      <IntroParticles />
      <HUDPrompt />
    </main>
  )
```

- Background brain canvas configuration
  - File: `apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx`
  - The canvas is fixed behind the HUD with a solid background and no alpha; camera preset is wide:

```85:93:apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} aria-hidden>
      <Canvas
        camera={{ position: [0, 80, 220], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#010C2A' }}
      >
        <CameraFitter target={0.72} />
```

- Camera fitting logic
  - File: `apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx`
  - Computes centroid and radius of loaded vertices, then sets camera distance based on `target`:

```65:81:apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx
function CameraFitter({ target = 0.72 }: { target?: number }) {
  const { camera } = useThree()
  useMemo(() => {
    if (vertices.length === 0) return
    const c = vertices.reduce((acc, v) => acc.add(v), new THREE.Vector3()).multiplyScalar(1 / vertices.length)
    let r = 0
    for (const v of vertices) r = Math.max(r, v.distanceTo(c))
    if ((camera as any).isPerspectiveCamera) {
      const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180
      const z = r / Math.max(0.1, target * Math.tan(fov / 2))
      camera.position.set(0, 80, z)
      camera.lookAt(0, 0, 0)
      ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
    }
  }, [camera, vertices, target])
}
```

- Screenshot mode gating (env or query)
  - File: `apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx`
  - Landing toggles material mode via env var or `?screenshot` query param:

```12:15:apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx
const isScreenshotMode =
  typeof window !== 'undefined' &&
  (process.env.NEXT_PUBLIC_SCREENSHOT_MODE === '1' ||
    window.location.search.includes('screenshot'))
```

- Brain model and material pathing (wireframe in non‑screenshot mode)
  - File: `apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx`
  - In landing, `wireframe={!isScreenshotMode}` and `usePhysical={isScreenshotMode}` so dev defaults to wireframe:

```99:107:apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx
<BrainMesh
  modelPath="/models/brain.obj"
  wireframeColor={isScreenshotMode ? '#081E4A' : '#3eb4ff'}
  opacity={isScreenshotMode ? 0.08 : 1}
  wireframe={!isScreenshotMode}
  depthWrite={false}
  usePhysical={isScreenshotMode}
```

- The actual materials used are determined in `packages/canvas-r3f/src/BrainMesh.tsx`:

```198:229:packages/canvas-r3f/src/BrainMesh.tsx
if (usePhysical) {
  child.material = new THREE.MeshPhysicalMaterial({
    color: wireframeColor,
    transparent: true,
    blending: blending ?? THREE.AdditiveBlending,
    opacity,
    transmission: physicalTransmission ?? 1,
    thickness: physicalThickness ?? 0.2,
    roughness: 0.6,
    metalness: 0.0,
    ior: 1.45,
    clearcoat: 0.7,
    clearcoatRoughness: 0.1,
    side: THREE.FrontSide,
    emissive: new THREE.Color(0x1e7cff),
    emissiveIntensity: emissiveIntensity ?? 0.3,
    depthTest: true,
    depthWrite,
  })
} else {
  child.material = new THREE.MeshPhongMaterial({
    color: wireframeColor,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    shininess: 40,
    specular: 0x222222,
    emissive: new THREE.Color(0x0f8ed0),
    emissiveIntensity: emissiveIntensity ?? 0.1,
    depthTest: true,
    depthWrite,
  })
}
```

- Vertices loading, intro animation, and orbs
  - Vertices are extracted on load and passed up:

```101:171:packages/canvas-r3f/src/BrainMesh.tsx
// Extract vertices ... onVerticesLoaded(resultVertices)
```

- Landing intro modulates brain opacity/scale over ~1.5s:

```38:63:apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx
setBrainOpacity(0.32 * e)
setBrainScale(0.9 + 0.1 * e)
```

- Concept orbs (spheres) render once vertices + concepts are present; size and intro controls:

```115:127:apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx
<ConceptParticles concepts={conceptArray} vertices={vertices} particleSize={3} renderMode={'spheres'} intro={true} introDurationMs={1200} />
```

- Ambient concept fallback to ensure intro always plays (prevents sparse look)
  - File: `apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx`

```22:36:apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx
const ambientConcepts = useMemo<Node[]>(() => {
  const cats = ['values', 'traits', 'emotions', 'coping', 'goals']
  return Array.from(
    { length: 500 },
    (_, i) => ({
      id: `ambient-${i + 1}`,
      label: `Ambient ${i + 1}`,
      size: 1,
      metadata: { category: cats[i % cats.length] } as any,
    }) as Node
  )
}, [])
```

- Orbs implementation details (glow, intro scatter→assemble→pulse) are in:

```508:576:packages/canvas-r3f/src/ConceptParticles.tsx
// useFrame ... assemble via per-instance delay + swirl; additive glow shader
```

---

### 2) Current `/brain` Page Behavior (Evidence)

- Integration page and acceptance testing
  - File: `packages/canvas-r3f/src/BrainIntegrationTest.tsx`
  - Uses the same `BrainMesh` and `ConceptParticles`, but also runs VertexMapper analysis and region‑quota mapping with farthest‑point sampling:

```261:358:packages/canvas-r3f/src/BrainIntegrationTest.tsx
const boundaries = calculateRegionBoundaries(brainVertices)
const R0..R3 = getRegionVertices(...)
const anchorsX = farthestSample(...)
const mappedIndices = conceptIds.map((_, i) => anchorPool[i % anchorPool.length])
```

- The test page can render points or spheres depending on `isScreenshotMode`:

```735:748:packages/canvas-r3f/src/BrainIntegrationTest.tsx
renderMode={isScreenshotMode ? 'spheres' : 'points'}
```

- Camera fitter uses a flexible `targetCoverage` (default ~0.75):

```75:81:packages/canvas-r3f/src/BrainIntegrationTest.tsx
const targetCoverage = ... default 0.75, clamped [0.5,0.9]
```

---

### 3) Key Differences: Landing vs `/brain`

- **Material path**
  - Landing defaults to wireframe unless `NEXT_PUBLIC_SCREENSHOT_MODE=1` (see landing callsite above).
  - `/brain` similarly gates physical material on screenshot mode, but often you run `/brain` in that mode for parity captures.

- **Mapping strategy for orbs**
  - Landing (current): hash‑based default inside `ConceptParticles` when `mappedIndices` is not provided; formerly we tried an in‑component farthest‑point mapping, but removed it to eliminate a 20–30s stall.
  - `/brain`: runs full VertexMapper region quotas + farthest‑point sampling and passes `mappedIndices` deterministically (lines 261–358 in `BrainIntegrationTest.tsx`).

  Evidence of hash‑based fallback in landing (`ConceptParticles.mapConceptToVertex`):

```246:255:packages/canvas-r3f/src/ConceptParticles.tsx
// djb2 hash implementation (from VertexMapper.ts)
let hash = 5381
for (let i = 0; i < concept.id.length; i++) {
  hash = (hash << 5) + hash + concept.id.charCodeAt(i)
}
const vertexIndex = Math.abs(hash) % vertices.length
return vertices[vertexIndex].clone()
```

- **Camera framing**
  - Landing: `CameraFitter target=0.72` (line 92 in `BackgroundBrain.tsx`).
  - `/brain`: `CameraFitter targetCoverage` defaults ~0.75 and is controllable via query param (lines 75–81).

- **Intro orchestration**
  - Both: orbs use vendor‑like scatter→assemble→pulse (lines 508–576 of `ConceptParticles.tsx`).
  - Landing: also fades in brain opacity/scale (lines 38–63 in `BackgroundBrain.tsx`).
  - Reduced‑motion is respected both in the landing overlay and inside `ConceptParticles`:

```7:15:apps/cryptiq-mindmap-demo/app/page.tsx
// IntroParticles reduced-motion check
const reduce = useMemo(
  () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  []
)
```

```281:285:packages/canvas-r3f/src/ConceptParticles.tsx
const reduceMotion = useMemo(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}, [])
```

- **Performance**
  - Landing now avoids O(N×k) mapping to ensure immediate first frame; `/brain` accepts the heavier mapping since it’s a test page.

---

### 4) Desired Landing Page Behavior (Authoritative Requirements)

- **Canonical visual spec**
  - Treat the finalized `/brain` visual after its acceptance sequence completes as the canonical reference for landing. Landing must match `/brain` exactly in materials/parameters and concept distribution.

- **Always‑on background scene across the app**
  - The landing page must show the brain immediately on first paint and keep it present behind UI (HUD, quiz, results).

- **Intro sequence**
  - On initial load: vendor‑style particle intro (scatter → assemble to brain surface → glow pulse) while the brain shell morphs in (opacity/scale ease). Do not replicate `/brain`’s initial “bunched orbs” state or its acceptance/progress UI on landing. The intro should start only after display mapping is ready so particles assemble directly to their final mapped positions.

- **Material**
  - Use the translucent “gel‑like” shell (MeshPhysicalMaterial) even outside screenshot mode; target parameters (baseline from current code): transmission ~0.2–1.0, thickness ~0.2+, roughness ~0.6, ior ~1.45, clearcoat ~0.7, emissive subtle; depthWrite=false to keep interior orbs visible.
  - Evidence of current gating that must change: `wireframe={!isScreenshotMode}`, `usePhysical={isScreenshotMode}` at lines 101–107 in `BackgroundBrain.tsx`.

- **Orb distribution**
  - Use the exact `/brain` VertexMapper distribution for parity across pages, but without blocking first frame. Acceptable mechanisms:
    - Precompute and cache `mappedIndices` keyed by OBJ hash and N, then hydrate landing.
    - Ship a static JSON of anchors per OBJ version.
    - Offload mapping to a Web Worker and only start the intro once indices arrive.
  - Evidence of `/brain` mapping reference: lines 261–358 in `BrainIntegrationTest.tsx`.

- **Performance targets**
  - ≤2s first frame and ≥50fps thereafter. Avoid main‑thread stalls from heavy mapping; prefer cached/worker solutions.

---

### 5) Minimal Changes Needed to Meet Requirements

- **Material in landing**
  - Change landing callsite to use physical material unconditionally (not gated by screenshot mode):
    - From: `wireframe={!isScreenshotMode}`, `usePhysical={isScreenshotMode}` (lines 101–107, `BackgroundBrain.tsx`).
    - To: `wireframe={false}`, `usePhysical={true}` with tuned parameters.

- **Parity mapping without stalls**
  - Implement one of:
    - Cache: Compute `mappedIndices` once on `/brain`, store by OBJ‑hash+N in localStorage or the Zustand store, hydrate on landing.
    - Static anchors: Check in a JSON of region anchors; map deterministically by concept order.
    - Web Worker: Run region quotas + farthest‑point sampling in a worker; gate intro start until indices are ready (keep first frame wide).

- **Framing polish**
  - Keep `CameraFitter target≈0.72–0.75` until mapping ready; then allow intro to proceed.

- **Accessibility**
  - Respect `prefers-reduced-motion` for the intro (already present in `IntroParticles`, lines 7–15 in `app/page.tsx`, and in `ConceptParticles`, lines 281–285).

- **No changes to `/brain`**
  - The `/brain` page remains as is. Only the landing page should adopt `/brain`’s finalized visuals (materials + distribution) without the slow initialization or acceptance/test progress UI.

---

### 6) Acceptance Checklist

- First frame within 2s, no long stalls (load metrics OK).
- Brain shell uses MeshPhysicalMaterial on landing, not wireframe (visually verified).
- Visual parity with `/brain` (post‑acceptance): materials/parameters and distribution match exactly.
- Orb distribution on landing matches `/brain` for the same concept set (index‑level parity when using cached or shipped anchors).
- Intro animation: scatter→assemble→glow pulse plays after first frame; reduced‑motion respected.
- HUD is overlaid and interactive.
- Brain background should remain visible across quiz and result routes. Note: today the quiz page renders `<BackgroundBrain />`, but the result page currently mounts the dynamic component incorrectly (function reference instead of element), so the background does not render there. Fix by assigning the dynamic import to a component and using it as `<BackgroundBrain />`.

  Evidence of current result page issue:

```92:96:apps/cryptiq-mindmap-demo/app/result/[id]/page.tsx
{dynamic(() => import('../../components/BackgroundBrain'), { ssr: false }) as any}
<div style={{ padding: 24, maxWidth: 880, margin: '0 auto' }}>
```

Expected pattern (as used on landing/quiz):

```31:34:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx
const BackgroundBrain = useMemo(
  () => dynamic(() => import('../../components/BackgroundBrain'), { ssr: false }),
  []
)
```

And then render `<BackgroundBrain />`.

Additional supporting evidence (PRD alignment):

```39:43:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx
const res = await fetch('/packs/archetype-01.json')
const pack = await res.json()
state.loadPack(pack)
```

```3:12:apps/cryptiq-mindmap-demo/app/api/og/route.ts
export const runtime = 'edge'
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Cryptiq Mindmap'
  const text = searchParams.get('text') || 'Composite archetypes'
  // Minimal SVG OG placeholder
}
```
