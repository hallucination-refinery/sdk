---
title: Cursor OODA – Runbooks (Prod Build, MCP, Playwright)
date: 2025-10-16T00:00:00Z
tags: [runbook, smoke, prod, mcp, playwright]
commit: [STUB: commit]
branch: [STUB: branch]
---

## 1) Production build & start (Node 20)
- Ensure Node 20: `nvm use 20`
- Clean caches: `rm -rf apps/cryptiq-mindmap-demo/.next`
- Build: `pnpm --filter cryptiq-mindmap-demo run build`
- Start (prod): `pnpm --filter cryptiq-mindmap-demo run start`
- URL under test: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&falloff=1`

## 2) MCP browser smoke (operator‑driven)
Steps
- Navigate: browser_navigate to the URL above
- Wait for reveal logs
- Collect console: browser_console_messages (save to console/ with {commit}/{branch}/{ts})
- Screenshot: pre (browser_take_screenshot), optional mid/post
- Assert: no `THREE.WebGLProgram`/`VALIDATE_STATUS` errors in console

Artifacts
- Screenshots → `cursor-ooda-ink-prototype/assets/{commit}/{branch}/{ts}/`
- Console logs → `cursor-ooda-ink-prototype/console/{commit}/{branch}/{ts}/`

## 3) Playwright smoke (CI‑ready)
Environment
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03`

Run
- `pnpm playwright test tests/brain.smoke.spec.ts --reporter=line`

Gates
- Canvas visible; reveal complete
- No console errors; no shader link/validate errors
- Screenshot saved to artifacts dir

## 4) Evidence capture checklist
- Copy “[PC] uniforms after-reveal …” line
- Copy “[PC] fluid uniforms prime …” and “[PC] fluid init …” lines
- Store 3 screenshots (pre/tap/drag) and console dump
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

