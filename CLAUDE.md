# CLAUDE.md

## Goal

- Rapid context consolidation to decide next actions; no CI and no docs site.

## Scope / Non-goals

- Do: read-only discovery; small output edits to `docs/context/*`; light meta logs to `.clmem/*`.
- Do not: refactor, build infra, publish, or push.

## Safety & Rules

- Read-only first; non-interactive commands; avoid pagers (append `| cat` when unsure).
- No destructive ops (no `rm -rf`, no publish, no `git push`).
- Keep diffs small and isolated to outputs; use `/clear` between tasks.

## Allowed tools (must match settings)

- Edit
- Bash(ls:_), Bash(cat:_), Bash(rg:_), Bash(grep:_), Bash(find:_), Bash(cloc:_), Bash(git status:_), Bash(git diff:_)

## Outputs

- `docs/context/repo-inventory.md`
- `docs/context/branch-map.md`
- `docs/context/findings.md`
- `docs/context/open-questions.md`
- Meta: `.clmem/workflows/*`, `.clmem/git-archaeology/*`

## Commands (tasks)

- `/project:repo-inventory`
- `/project:branch-map`

## Launch protocol

1. `/clear`
2. Run `/project:repo-inventory`
3. Run `/project:branch-map`
4. New session (Synthesis) writes `findings.md` and `open-questions.md`
5. Stop and request review before expanding tools/scope

## Sub-agents

- A — Discovery: inventory + branch map
- B — Synthesis: findings + open questions

## Meta-learning

- Record brief metrics/deltas in `.clmem/workflows/*`; refine heuristics only when progress plateaus.

References: Claude Code best practices and sub-agents — https://www.anthropic.com/engineering/claude-code-best-practices, https://docs.anthropic.com/en/docs/claude-code/sub-agents
