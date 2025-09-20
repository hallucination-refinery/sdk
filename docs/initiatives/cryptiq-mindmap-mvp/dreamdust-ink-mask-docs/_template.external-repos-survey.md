# External Repos Survey — Adaptation Plan (Template)

## Candidates (one section per repo)

### {Repo Name}

- Link: {URL}
- What it demonstrates: {1 line}
- Relevant techniques to adapt: {bullets}
- Files of interest: {paths or modules in the repo}
- License/attribution: {MIT/etc}
- Adaptation plan: {what to copy/port and where in our app}
- Risks/unknowns: {perf, API, license}

### {Next Repo}

- Link: {URL}
- What it demonstrates: {1 line}
- Relevant techniques to adapt: {bullets}
- Files of interest: {paths}
- License/attribution: {type}
- Adaptation plan: {mapping to our files}
- Risks/unknowns: {notes}

## Mapping to Our Codebase

- Interaction texture: from {repo} → `app/components/dreamdust/InkSurface.tsx` / `uInkTex`
- Curl/FBM: from {repo} → `glsl/chunks.ts`
- Bloom/post: from {repo} → stage post stack
- Morph/reveal bias: from {repo} → reveal timeline / weights map

## Next Steps

- Pick 1–2 high‑impact techniques; open tiny PR plan with collision matrix and checks.
