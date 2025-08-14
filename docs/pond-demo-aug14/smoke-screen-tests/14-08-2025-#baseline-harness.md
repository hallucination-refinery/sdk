# Baseline Smoke (Harness)

## Steps
1) From /workspace/worktrees/feat-pond-demo-aug14: `NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1 pnpm -w dev --filter cryptic-vault-demo`
2) Open http://localhost:3000/harness/latent
3) Verify: HUD immediate; nodes spawn at (0,0,0); exactly one burst (300–600ms); no drift.

## Notes
- Harness imports @refinery/canvas-latent directly to avoid @refinery/canvas-r3f errors.
- If anything fails, STOP and log expected vs observed in a new scratchpad.
