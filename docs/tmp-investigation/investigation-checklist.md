# Investigation Checklist – `legacy-archive` vs `main`

> **Why this document exists**  
> You just froze the historical `replace-interaction-with-store` branch under the tag **`legacy‑archive`** and switched back to **`main`** to start fresh.  
> Before ripping or cherry‑picking code you need a _clear map_ of what changed, what still matters, and what can be safely ignored.  
> This checklist walks you through a focused diff‑driven investigation so decisions are evidence‑based, not guess‑based.

---

## Quick Setup

1. `git fetch --all --tags`  // ensure tag is local
2. Install any missing deps so both trees build & lint without mod‑ding files.

---

## Diff Recon

| Step | Command                                                           | Purpose                                                |
| ---- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| 1.1  | `git diff --stat legacy-archive..main`                            | Quick size/area sense.                                 |
| 1.2  | `git diff --dirstat=files,0 legacy-archive..main`                 | Heat‑map of directories.                               |
| 1.3  | `git log --oneline --graph --decorate legacy-archive..main`       | Commit chronology that never reached `legacy‑archive`. |
| 1.4  | _(Optional)_ `npx madge --image graph.svg apps && open graph.svg` | Visualize dependency shifts.                           |

Capture notable patterns (big deleted dirs, new packages etc.) in `answers.md`.

---

## 3. File‑level Triage

1. Run:
   ```bash
   git diff --name-status legacy-archive..main > /tmp/diff-list.txt
   ```
2. Categorize **each** path into **Investigate Further / Possibly Relevant / Likely Irrelevant** columns inside a simple CSV (`triage.csv`).  
   _Guideline:_ only “Investigate Further” if it **directly** supports the MVP scope from Q‑0.1.

Helpful lenses:

- **Core logic** (graph algorithms, store utilities)
- **UI scaffolding** (components, hooks)
- **Config / infra** (tsconfig, eslint, pnpm workspaces)
- **Tests & fixtures**

---

## 4. Deep Dives (only for “Keep” or “Reference” items)

For each candidate file or module:

| Checklist                                              | Notes location          |
| ------------------------------------------------------ | ----------------------- |
| Does it compile against `main`‑branch type signatures? | `deep‑dive/<module>.md` |
| Hidden coupling to removed code?                       |                         |
| Overlapping functionality now present in SDK?          |                         |
| Unit / integration test coverage? salvageable?         |                         |
| Performance or immutability hacks worth porting?       |                         |

---

## 5. Summarize Investigation Results (no decisions)

After completing the investigative steps above, produce **evidence‑only outputs**:

1. `findings.md` – bullet list of observed differences, unanswered questions, and notable code artifacts.
2. `triage.csv` – raw categorization data from Step 3 (use the flags **Investigate Further / Possibly Relevant / Likely Irrelevant**, no “keep / delete” verdicts).
3. `deep‑dive/` notes – one Markdown file per module analyzed in Step 4.
4. `open_questions.md` – any ambiguities or risks that require human product/engineering calls.

_Do **not** propose solutions, cherry‑picks, or code changes in these docs – strictly report facts and uncertainties._

---

## 6. Investigation Caveats

- Avoid conflating **observation** with **recommendation** – record what you see, not what to do.
- If a file appears obsolete, note why in `open_questions.md`; do **not** flag it for deletion yourself.
- Document performance or immutability hacks objectively; assessing their value is outside the investigation scope.

---

**End of checklist – adapt as reality dictates.**
