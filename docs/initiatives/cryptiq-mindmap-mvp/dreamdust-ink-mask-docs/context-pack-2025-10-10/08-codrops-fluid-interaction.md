## How the GPU-Fluid-Experiments WebGL fluid interaction works

Built as a 2D incompressible Navier–Stokes solver that runs on the GPU and renders in the browser. Authored in Haxe targeting WebGL; repository license GPL-3.0. The public experiment page states “Navier-Stokes fluid simulation with particles, written in Haxe”. A live demo exposes a “Solver Iterations” control, which implies an iterative pressure solve typical of GPU stable‑fluids.

Core simulation method follows the established GPU approach from GPU Gems Ch. 38: advect, add forces, enforce incompressibility using a Poisson pressure solve, subtract pressure gradient, then render.

---

### System overview
- State on textures (2D grids): velocity field u(x,y), pressure p(x,y), optionally dye (for color/smoke), plus scratch targets (divergence, temporary velocity). Stored as floating‑point render targets and ping‑ponged each pass.
- Frontend: Haxe → WebGL app (repo shows Haxe and GLSL as primary languages).
- Particles: separate visualization layer seeded/advected by the velocity field; experiment mentions particles colored by speed.

---

### Data layout (render targets)

Typical targets match the GPU‑Gems solver and the UI knobs in the demo:
- Velocity: RG (vx, vy)
- Pressure: R
- Dye/Color: RGBA (visualization only)
- Divergence: R (scratch)
- Temporaries: copies for ping‑pong during advection/solve

This layout is the canonical mapping for the chapter’s algorithm realized on WebGL.

---

### Per‑frame pipeline

Each step is a full‑screen draw into a framebuffer‑attached texture (FBO). Alternate read/write targets (“ping‑pong”) to avoid hazards.
1. Advection (semi‑Lagrangian): for each cell center x, sample previous field at x − Δt·u(x) with bilinear filtering; applied to velocity and dye.
2. Add forces / user input: map mouse/touch to local coordinates and add an impulse (“splat”) into velocity (and optionally dye).
3. Compute divergence: evaluate ∇·u into a divergence texture on the advected+forced velocity.
4. Pressure solve (Poisson): solve ∇²p = ∇·u with N iterative relaxations (Jacobi or similar). “Solver Iterations” maps to N.
5. Projection (subtract pressure gradient): update velocity u ← u − ∇p to enforce ∇·u ≈ 0.
6. Optional diffusion / viscosity: low viscosity for crisp motion; sometimes folded into advection.
7. Render:
   - Particles: integrate positions x ← x + u(x)·Δt and draw (often colored by |u|).
   - Dye: blit dye texture as smoke/ink.

---

### Boundary conditions and obstacles
- Domain edges: zero‑normal velocity; pressure boundary per standard GPU‑Gems setup so velocity doesn’t leak.
- Obstacles (if any): mask and enforce zero‑normal velocity in advection and projection.

---

### Controls and their effects
- Quality / Resolution: simulation texture size; cost scales quadratically with size.
- Solver Iterations: number of Jacobi relaxations; trades performance for tighter incompressibility.
- Reset / Stop: clear or pause the step loop.

---

### Implementation stack
- Language/tooling: Haxe project targeting the web.
- Typical deps (from forked builds): Haxe 3.2.1 plus libs like shaderblox and gltoolbox for shader/GL plumbing.

---

### Minimal pass graph (pseudo)

```
loop each frame:
  // 1) external forces
  addForces(velocity, input, out=velocity')

  // 2) advect velocity
  advect(velocity', velocity', dt, out=velocity)

  // 3) make divergence
  divergence(velocity, out=div)

  // 4) solve Poisson for pressure
  pressure = 0
  repeat N times:
    jacobi(div, pressure, out=pressure)

  // 5) project
  project(velocity, pressure, out=velocity')

  // 6) advect dye and particles
  advect(dye, velocity', dt, out=dye)
  integrateParticles(particles, velocity', dt)

  // 7) render
  draw(dye or particles)
swap buffers as needed
```

Matches the GPU‑Gems algorithm and the demo’s iteration control.

---

### Performance characteristics
- All‑GPU multi‑pass pipeline (one quad per pass over a 2D grid).
- Stable at larger Δt due to semi‑Lagrangian advection; sharpness depends on resolution/viscosity/vorticity treatment.
- Cost scales with grid size × number of pressure iterations; “Solver Iterations” controls this trade‑off.

---

### What is certain vs. inferred

Certain from public sources linked to this repo:
- Navier‑Stokes WebGL fluid with particles, authored in Haxe.
- Exposes solver iterations at runtime → iterative pressure projection.
- GPL‑3.0; sources primarily Haxe + GLSL.

Standard, well‑documented method this project aligns with:
- Semi‑Lagrangian advection, Poisson pressure solve via Jacobi, projection to divergence‑free velocity, boundary enforcement.

Uncertainties (not explicitly stated):
- Exact shader filenames, whether vorticity confinement/diffusion are present, precise buffer formats.

---

### Build pointers (forked variant)

The original repo references aging build steps and links a fork with working instructions: Haxe 3.2.1 + shaderblox/gltoolbox and a web build. Community users confirm this path.

---

### One‑screen checklist to recreate the interaction
- Allocate float textures: vel, velTmp, press, pressTmp, dye, div.
- Implement five fragment shaders: advect, addForces, divergence, jacobi, project.
- Wire ping‑pong FBOs.
- Map pointer to sim‑space and “splat” impulses each frame.
- Run N Jacobi steps per frame from the UI.
- Advect and draw dye or particles for output.

Algorithmic correctness and the role of each pass follow the reference chapter used across WebGL fluid sims.

---

### Sources
- Repository landing page, license, languages.
- Chrome Experiments entry describing the project and linking the repo.
- Live demo UI showing Solver Iterations and interaction controls.
- GPU Gems Ch. 38: canonical GPU fluid method mirrored by this interaction.
- Linked fork with working build instructions and Haxe dependencies.

---

### Bottom line

This interaction is a textbook GPU stable‑fluids pipeline implemented in Haxe/WebGL, with particles as a velocity‑field visualization and a user‑controlled iterative pressure projection (“Solver Iterations”). The steps above are sufficient to re‑implement it one pass at a time.
