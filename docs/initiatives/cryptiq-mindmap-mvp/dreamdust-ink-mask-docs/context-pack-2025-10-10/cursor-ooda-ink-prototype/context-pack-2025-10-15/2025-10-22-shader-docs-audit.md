# SHADER DOCS AUDIT 1

**Key Terms (plain English)**  
- *Shader versions*: Think of shader language “dialects.” GLSL100 is the older wording (`gl_FragColor`, `texture2D`); GLSL300 is the newer wording (`out vec4`, `texture`). Three.js lets us choose via `glslVersion` (`THREE.GLSL1` or `THREE.GLSL3`, per docs API [`ShaderMaterial.glslVersion`](https://threejs.org/docs/api/en/materials/ShaderMaterial.html)).  
- *Premultiplied alpha*: We multiply color by transparency before blending. Three.js can respect this via `premultipliedAlpha` (docs [`Material.premultipliedAlpha`](https://threejs.org/docs/api/en/materials/Material.html)).  
- *Tone mapping*: A final color adjustment step. Materials default to following the renderer’s tone mapping when `toneMapped` is true (`Material.toneMapped`, same doc).  
- *Force-visible preset*: A debug routine that overrides depth and blending so particles should show up even if other gates misbehave.

---

**What the doc & code audit revealed (simple bullets first)**  
- Our change (dropping `glslVersion: GLSL3`) lines the shader up with GLSL100 semantics (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:748-758`), matching the docs’ requirement that code and version agree.  
- The material still declares `premultipliedAlpha: true` and chooses additive blending for certain presets (`DreamdustMaterial.ts:742-775`). Additive blending plus dark colors can look invisible even when points draw, consistent with the blank screenshots.  
- We also keep `toneMapped: true` while manually applying ACES + gamma in the shader (`DreamdustMaterial.ts:662-691`). The docs note that `toneMapped` lets the renderer apply another tone map, creating a double-pass that can crush or wash colors.  
- Smoke logs prove force-visible toggles between “applied false” and “true” within the same run (`console-chromium-20251022-184929.json#L20` vs `#L125`), so the view we capture might not actually have the overrides active.  
- Latest Playwright console confirms 90k points submit with no shader errors (`console-chromium-20251022-184929.json#L215`), but the user note and screenshot confirm particles remain unseen—so visibility, a required gate in `01-vision-and-acceptance.md`, still fails.

---

**Deeper cross-reference (why it matters to the Vision & Acceptance doc)**  
- Vision requires “under-finger visible motion” and the acceptance gate explicitly demands “visible motion within ≤2 frames” (`01-vision-and-acceptance.md:9-21`). We’re still stuck at “visible” because the screen is blank.  
- Additive blending + premultiplied alpha can zero-out darker colors; the Three.js blending reference highlights that Additive mode simply sums colors (`Materials.html:30-45`). Our shader lowers color before output (`DreamdustMaterial.ts:650-672`), so additive blending may simply show black.  
- By keeping `toneMapped: true`, we invite the renderer to run its own tone mapping over our already-tonemapped values. The docs call this out as tied to renderer toneMapping (`Material.html:332-348`). Double tone mapping could explain a flat, dark result even though alpha is non-zero.  
- The force-visible log flipping warns that our diagnostic override might switch off before the screenshot capture. That means the “fully open aperture” test we rely on may not actually be active when we evaluate the run, leaving room for depth/blend gating to hide the points.

---

**What we learned**  
- Shader compilation is truly fixed, but visibility still fails—the acceptance gate is not satisfied.  
- Two high-probability causes emerged from the audit:  
  1. **Render-state mismatch** (additive + premultiplied + momentarily disabled force-visible) hiding pixels.  
  2. **Color pipeline mismatch** (in-shader ACES/gamma + material tone mapping) double-processing the color to near-black.  
- We did *not* find evidence that a broad refactor is required—issues are localized to material state and capture timing.

---

**Next move: stay with SINGLE CHANGE → TEST → EVALUATE**  
- The evidence points to specific, testable toggles (e.g., temporarily set `toneMapped: false`, or force Normal blending for one smoke run). Each is a reversible, single-line change—ideal for the existing OODA loop.  
- A refactor (e.g., rewriting the entire shading pipeline or motion system) lacks justification: the engine already attaches scenes, submits points, and compiles; we just need to expose the pixels.  
- Confidence: ~80% that a single targeted state/tone tweak will make the particles appear; ~60–70% that once visible, we can tune under-finger motion without major rewrites.  
- Therefore, continue the disciplined single-change loop: pick the most-convincing visibility gate (e.g., disable toneMapped or enforce Normal blending during force-visible), run smoke, and reassess.

No files changed during this audit; documentation already overstates “COMPLETE SUCCESS,” so the next iteration should correct that when we introduce the next single change and gather fresh evidence.
