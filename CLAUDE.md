# Refinery SDK – Claude Code Quick-Start

> Always open **@docs/PROJECT_HUB.md** first; it links to the current spec, scratchpad, and decision log.

## Canonical Docs

| Purpose              | Path                                    |
| -------------------- | --------------------------------------- |
| Project hub / status | `docs/PROJECT_HUB.md`                   |
| Active sprint spec   | `docs/guides/store-spec.md`             |
| Today's scratchpad   | `.taskmaster/scratchpads/YYYY-MM-DD.md` |
| Decision log         | `.cursor/decision_log.yaml`             |
| Full reference guide | `docs/CLAUDE-REFERENCE.md`              |

## Daily OODA Loop

1. **Orient** – `/clear`, load hub + scratchpad.
2. **Decide** – `task-master next` → choose top task, `task-master show <id>` to inspect.
3. **Act** – Implement; append reasoning to scratchpad; commit small diffs (`git commit -m "feat: … (task <id>)"`).
4. **Update** – `task-master set-status --id=<id> --status=in-progress|done`.
5. Repeat.

## Working Norms

- Append-only scratchpad – never delete history.
- Ask permission before leaving the critical path.
- Keep commits atomic (<200 LOC) and reference Task IDs.
- Use `/clear` when switching tasks to free context tokens.

## Tool Preferences & Guard-Rails

- Use **`rg`** (ripgrep) for code search; avoid `grep`.
- Package manager is **pnpm**—never run `npm install`.

### Git: Good vs Bad

| Good commit                                          | Bad commit                |
| ---------------------------------------------------- | ------------------------- |
| `git commit -m "feat(store): add selector (task 4)"` | `git commit -m "changes"` |
| `git push origin feature/canvas`                     | `git push --force`        |

### Forbidden Boiler-Plate Patterns

- Do **not** start answers with "The answer is…".
- Leave `// TODO: description` rather than empty-string placeholders.

### Commit Scaffold

Before each code edit:

1. Add a `<commit_analysis>` block – one sentence explaining the diff & risk.
2. Perform the code change.
3. Commit referencing Task ID.

---

_For extended Task Master commands, MCP setup, API key matrix, and troubleshooting, see `docs/CLAUDE-REFERENCE.md`._
