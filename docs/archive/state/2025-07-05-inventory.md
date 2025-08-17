# Repository Inventory — 5 July 2025

This document captures the current state of the **refinery-sdk** repository at the outset of the 7-day execution plan.

## Packages

| Package                   | Path                     | Build Status   | Tests       | Notes                      |
| ------------------------- | ------------------------ | -------------- | ----------- | -------------------------- |
| @refinery/schema          | packages/schema          | ✅ tsc clean   | ✅ 99.29 %  | Central schema & types     |
| @refinery/ops             | packages/ops             | ✅             | ✅ 95 %     | Pure functions             |
| @refinery/store           | packages/store           | ✅             | ⏳ no tests | Global state; coverage TBD |
| @refinery/canvas-r3f      | packages/canvas-r3f      | ✅             | ⏳          | R3F scene components       |
| @refinery/input-hub       | packages/input-hub       | ✅             | ⏳          | Input abstractions         |
| @refinery/widget-hud      | packages/widget-hud      | ✅             | ⏳          | HUD primitives             |
| @refinery/widget-aperture | packages/widget-aperture | ⚠️ type errors | ⏳          | IdeaAperture component     |

## Outstanding Type Errors

`widget-aperture` fails `tsc` due to prop type mismatch in `IdeaAperture.tsx`; see upcoming Task 4 fix.

## Public API Surface

_To be auto-generated: run `pnpm inventory:gen` once script exists._
