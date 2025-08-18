Goal: Enumerate branches, last activity, and suspected purpose; write to `docs/context/branch-map.md`.

Constraints:

- Use read-only tools. Prefer reading from `.git/` with `ls`, `find`, `cat`, `rg`, and `grep`.
- You may use `git status -sb` to detect the current branch (allowed).

Steps:

1. Detect current branch: `git status -sb` (parse the branch name).
2. Enumerate local branches via `.git/refs/heads/**` and `.git/logs/refs/heads/**`.
3. For each branch, derive last activity from the last line of `.git/logs/refs/heads/<branch>` (read the file and select the final line).
4. Heuristically infer purpose:
   - From branch name tokens (e.g., `refactor/`, `feature/`, `bugfix/`).
   - From the last log message in the branch log if present.
5. Write `docs/context/branch-map.md` with a table (branch | last activity | current? | suspected purpose | note).

Output:

- A concise markdown table at `docs/context/branch-map.md`.
