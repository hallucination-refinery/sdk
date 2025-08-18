Goal: Generate a repository inventory and write it to `docs/context/repo-inventory.md`.

You MUST:
- Use read-only discovery tools (`rg`, `cloc`, `find`, `ls`, `cat`). Do not modify source files.
- Keep output concise and scannable. Prefer tables and bullet lists.

Steps:
1. Detect languages with `cloc` and summarize top languages.
2. List top-level packages/modules by detecting common manifests (`package.json`, `pyproject.toml`/`setup.py`, `go.mod`, `Cargo.toml`).
3. For each module, capture: path, purpose (one-line guess from README/package description if present), and primary language.
4. Write `docs/context/repo-inventory.md` with sections:
   - Languages summary
   - Modules table (path | purpose | language)
   - Entry points/binaries (if any)

Output:
- A brief summary and a link to the created/updated `docs/context/repo-inventory.md`.

