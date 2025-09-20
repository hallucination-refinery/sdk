## Scope
- Files changed match the task prompt only
- Minimal, reversible diff; no lockfile or unrelated package changes

## Evidence
- Inputs (template/refs used): {list}
- Outputs (files/paths): {list}
- Citations (code paths/logs): {list with paths or verbatim log lines}

## Baseline outputs (paste)
Internal Error: EACCES: permission denied, symlink '../lib/node_modules/corepack/dist/pnpm.js' -> '/usr/local/bin/pnpm'
    at async Object.symlink (node:internal/fs/promises:1004:10)
    at async EnableCommand.generatePosixLink (/usr/local/lib/node_modules/corepack/dist/lib/corepack.cjs:23156:5)
    at async Promise.all (index 0)
    at async EnableCommand.execute (/usr/local/lib/node_modules/corepack/dist/lib/corepack.cjs:23143:5)
    at async EnableCommand.validateAndExecute (/usr/local/lib/node_modules/corepack/dist/lib/corepack.cjs:20258:22)
    at async _Cli.run (/usr/local/lib/node_modules/corepack/dist/lib/corepack.cjs:21195:18)
    at async Object.runMain (/usr/local/lib/node_modules/corepack/dist/lib/corepack.cjs:23642:19)
Scope: all 19 workspace projects
Lockfile is up to date, resolution step is skipped
Already up to date

. prepare$ husky install
. prepare: husky - install command is DEPRECATED
. prepare: Done
Done in 2.2s

> cryptiq-mindmap-demo@0.1.0 lint /workspace/apps/cryptiq-mindmap-demo
> next lint

/workspace/apps/cryptiq-mindmap-demo:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  cryptiq-mindmap-demo@0.1.0 lint: `next lint`
Exit status 1

> cryptiq-mindmap-demo@0.1.0 build /workspace/apps/cryptiq-mindmap-demo
> next build

   ▲ Next.js 15.3.5
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 15.0s
   Skipping validation of types
   Skipping linting
   Collecting page data ...
   Generating static pages (0/7) ...
   Generating static pages (1/7) 
   Generating static pages (3/7) 
   Generating static pages (5/7) 
 ✓ Generating static pages (7/7)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ○ /                                    3.71 kB         106 kB
├ ○ /_not-found                            143 B         102 kB
├ ƒ /api/brain-acceptance                  143 B         102 kB
├ ƒ /api/og                                143 B         102 kB
├ ○ /brain                                 27 kB         357 kB
├ ○ /debug/caps                             5 kB         107 kB
├ ○ /draw3d                              7.83 kB         335 kB
├ ƒ /quiz/[slug]                         31.5 kB         362 kB
└ ƒ /result/[id]                         2.04 kB         104 kB
+ First Load JS shared by all             102 kB
  ├ chunks/226-98d803d27003ca72.js       46.6 kB
  ├ chunks/8d5daf79-879d5759a0deefd7.js  53.2 kB
  └ other shared chunks (total)          2.22 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand


> @refinery/monorepo@0.0.0 smoke /workspace
> node -e "console.log('smoke ok')"

smoke ok
