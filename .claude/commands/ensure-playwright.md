---
name: ensure-playwright
description: Prepare Playwright in non-root cache and set env for browser-gated runs
args: []
---

Behavior

- Run `scripts/ensure-playwright.sh` to install Chromium into `/workspace/.playwright-browsers`, create symlink `/home/node/.cache/ms-playwright`, and set `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`.
- Print Node, pnpm, and Playwright versions for provenance.

Usage

```
/ensure-playwright
```

Notes

- Requires pnpm to be available and internet access for the first install.
- Subsequent runs are idempotent and fast due to cached browsers.
- If `tests/brain.smoke.spec.ts` lacks a local baseline and `VISUAL_BASELINE_AUTO=1`, run:
  `pnpm exec playwright test tests/brain.smoke.spec.ts --update-snapshots` to seed the baseline automatically.
