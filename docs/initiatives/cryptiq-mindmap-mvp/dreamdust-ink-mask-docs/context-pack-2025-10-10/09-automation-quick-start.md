# Automated Ink Interaction Testing — Quick Start

## What This Automates (zero manual DevTools for you)
- ✓ Rebuild app with latest code
- ✓ Start production server
- ✓ Navigate to scene-03 with correct URL params
- ✓ Wait for reveal completion
- ✓ Inject probe commands (`ensureFalloff`, `dumpUniforms`)
- ✓ Simulate realistic stroke interaction (native mouse events)
- ✓ Capture console logs automatically
- ✓ Extract uniforms (`uTempIntensity`, `uTempFalloffOn`, `uTempRadius`, etc.)
- ✓ Take pre/mid/post screenshots
- ✓ Verify acceptance gates (≤2 frames, localized, falloff engaged, no errors)
- ✓ Generate evidence bundle (JSON + screenshots + console logs)
- ✓ Report PASS/FAIL to stdout

## One-Command Usage

**Run automated test:**
```bash
pnpm playwright test tests/ink-interaction.spec.ts --headed
```

**What you'll see:**
- Browser opens, navigates to scene-03
- Automated stroke interaction
- Console output shows gate results
- Evidence saved to `docs/.../assets/YYYY-MM-DD-automated-*.{png,json}`

**Your time:** ~2 minutes to review PASS/FAIL output and evidence

## Acceptance Gates Verified Automatically

1. **≤2 frames motion** — checks for `[PC] draw start/end` logs (interaction captured)
2. **Localized 10–20%** — checks `uTempIntensity` rose during stroke (force triggered)
3. **Falloff engaged** — checks `uTempFalloffOn: 1` (localized mode active)
4. **No errors** — verifies zero console errors

## Output Format

**Console:**
```
[Gate 1] ≤2 frames motion (draw events fired): PASS/FAIL
[Gate 2] Localized motion (intensity rose): PASS/FAIL
[Gate 3] Falloff engaged: PASS/FAIL
[Gate 4] No errors: PASS/FAIL

============================================================
AUTOMATED SMOKE TEST: PASS/FAIL
============================================================
Evidence: docs/.../assets/YYYY-MM-DD-automated-evidence.json
Screenshots: ...pre-stroke.png, ...mid-stroke.png, ...post-stroke.png
Uniforms: uTempIntensity=X, uTempFalloffOn=Y, uTempRadius=Z
```

**Evidence bundle** (JSON):
- Pre/post uniforms
- Draw event counts
- Console logs (last 50 lines)
- Screenshot paths
- Timestamp

## Workflow Integration

**When making a code change:**
1. Paste in Cursor: 
   ```
   FOCUS: Increase force scale 180→220 to make ≤2‑frame plume undeniable (closes gap to "tap ripple" vision).
   EXECUTE: OK
   ```
2. I edit code and commit
3. I run: `pnpm playwright test tests/ink-interaction.spec.ts --headed`
4. I report: "PASS: ≤2‑frame plume visible; 14% footprint; smooth decay; camera fixed" OR "FAIL: no draw events (gate 1)"
5. You reply: `APPROVED` or `REVERT`

**Your manual work:** ~5 minutes per iteration (authorize + review + decide)
**Eliminated:** DevTools, console copy, screenshot capture, uniform probing, gate checking

## Next Steps

1. Run the test once to verify it works:
   ```bash
   pnpm playwright test tests/ink-interaction.spec.ts --headed
   ```
2. Review evidence bundle and screenshots
3. Confirm this eliminates your manual testing tedium
4. Use this workflow for all future iterations

## Fallback (if automation fails)

Manual URL remains available:
```
http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&falloff=1
```

You can always run manual test if Playwright flakes; automation is additive, not required.

