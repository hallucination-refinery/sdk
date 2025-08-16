# Smoke: Color Visible on First Paint

## Steps
1) From integration worktree, start dev: `NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo`
2) Open the printed URL → /harness/latent
3) Verify: nodes are colored (not black), no console errors.

## Observations
- Paste first 10 console lines; note color state.
