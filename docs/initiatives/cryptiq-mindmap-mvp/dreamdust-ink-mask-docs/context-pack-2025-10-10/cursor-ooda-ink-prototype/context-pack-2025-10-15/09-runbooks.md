---
title: Cursor OODA – Runbooks (Prod Build, MCP, Playwright)
date: 2025-10-16T19:15:43Z
tags: [runbook, smoke, prod, mcp, playwright]
commit: 4aeec57e
branch: docs/ink-falloff-flag-latch-2025-10-12
---

## 1) Production build & start (Node 20)
- Ensure Node 20: `nvm use 20`
- Clean caches: `rm -rf apps/cryptiq-mindmap-demo/.next`
- Build: `pnpm --filter cryptiq-mindmap-demo run build`
- Start (prod): `pnpm --filter cryptiq-mindmap-demo run start`
- Verify service is up: `curl -I 127.0.0.1:3000` → expect `HTTP/1.1 200 OK`
- URL under test: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&falloff=1`

## 2) MCP browser smoke (operator-driven)
Steps
- Navigate: browser_navigate to the URL above
- Wait for reveal logs
- Collect console: browser_console_messages (save to console/ with {commit}/{branch}/{ts}); optional this pass if console JSON is unavailable
- Screenshot: optional future step (skip capture this pass; retain placeholders)
- Assert: no `THREE.WebGLProgram`/`VALIDATE_STATUS` errors in console

Artifacts (required)
- Console logs → `cursor-ooda-ink-prototype/console/{commit}/{branch}/{ts}/console.json`
- Screenshots → `cursor-ooda-ink-prototype/assets/{commit}/{branch}/{ts}/YYYY-MM-DD-*.png`

## 3) Playwright smoke (CI‑ready)
Environment
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03`

Run
- `pnpm playwright test tests/brain.smoke.spec.ts --reporter=line`
- TODO: author `tests/ink.smoke.spec.ts` or parameterize the existing spec for quiz routes; current `tests/brain.smoke.spec.ts` expects the `/brain` overlay.

Gates
- Canvas visible; reveal complete
- No console errors; no shader link/validate errors
- Screenshot saved to artifacts dir

## 4) Evidence capture checklist
- Copy “[PC] uniforms after-reveal …” line
- Copy “[PC] fluid uniforms prime …” and “[PC] fluid init …” lines
- Console: when captured, store JSON under `cursor-ooda-ink-prototype/console/{commit}/{branch}/{ts}/console.json`; screenshots remain optional this pass (keep placeholders)
- Update latest evidence doc with paths

## 5) Tuning loop (post‑unblock)
- One knob per run: increase `uVelToNdc` (+0.01) or `uInkBlend` (≤1.0)
- Record decision: visible under‑finger motion ≤2 frames → pass; else next knob

## 6) Troubleshooting quick refs
- Black screen: shader preamble, RT feedback, Spector.js capture
- No particles: alpha/size/depth/blend gates, premult pipeline
- No motion: onForceSplat, Temp intensity, uVelocity swap, uVelToNdc/uInkBlend

References
- 01‑vision-and-acceptance.md
- 10‑latest‑smoke‑evidence.md
- 02‑architecture‑overview.md
- 03‑rendering‑pipeline‑trace.md
- context‑pack‑2025‑10‑15/04‑resources‑guide.md
