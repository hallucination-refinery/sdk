# Git Guard Hooks

This project uses Git hooks to enforce code quality standards before pushing changes to the repository.

## Overview

The pre-push hook automatically runs the following checks:
1. **TypeScript compilation** - Ensures all TypeScript code compiles without errors
2. **ForceGraphAdapter smoke test** - Verifies the critical ForceGraph component works correctly

## Installation

The hooks are automatically installed when you run `pnpm install` in the project root.

To manually install the hooks:
```bash
pnpm run install-hooks
```

## What Gets Checked

### TypeScript Compilation
- Runs `pnpm exec tsc --noEmit` to check all TypeScript files
- Ensures no type errors exist in the codebase
- Prevents pushing code that would break the build

### Smoke Test
- Runs the ForceGraphAdapter smoke test suite
- Verifies the component mounts without errors
- Ensures window.__FG is properly exposed with the refresh method
- Confirms no console errors occur during operation

## Bypassing Hooks

In emergency situations where you need to push despite failing checks:
```bash
git push --no-verify
```

**⚠️ Warning**: Only bypass hooks when absolutely necessary and create a follow-up task to fix the issues.

## Troubleshooting

### Hook Not Running
1. Ensure hooks are installed: `ls -la .git/hooks/pre-push`
2. Re-install hooks: `pnpm run install-hooks`
3. Check hook permissions: `chmod +x .git/hooks/pre-push`

### Tests Failing
1. Run tests locally: `pnpm test`
2. Check TypeScript: `pnpm exec tsc --noEmit`
3. Fix any errors before attempting to push

## Benefits

- **Prevents broken builds** - Catches errors before they reach CI
- **Maintains code quality** - Ensures TypeScript standards are met
- **Protects critical features** - Smoke tests verify essential functionality
- **Saves CI resources** - Catches issues locally before pushing