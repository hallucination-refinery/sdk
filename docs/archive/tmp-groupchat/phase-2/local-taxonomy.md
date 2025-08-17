# Force‑Graph Phase‑2 Local Taxonomy & Ontology (v0 .3)

\_Last updated: 11:00 PM EST, 25/07/2025.md

---

## 1  Frame the Target Slice 🧭

| Item                 | Content                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Problem‑lens**     | _Explain → fix_ the residual mismatches between **intended UX** and the **observed graph behaviour** (burst timing, FPS, interactions) in order to declare **W – Phase 2 complete**. |
| **Out‑of‑scope**     | • Lens/timeline UI redesign<br>• Docker / host GPU tuning outside repo<br>• Phase‑3 multi‑user edits                                                                                 |
| **Axis coordinates** | Understanding 70 % ↔ Use 30 % &nbsp;&nbsp;·&nbsp;&nbsp; General 35 % ↔ Local 65 %                                                                                                  |

---

## 2  Harvest Primitives 👜  (“bag table”)

| #      | Concrete instance (commit / log)             | Affordance (handle)                        | Causal hint                      |
| ------ | -------------------------------------------- | ------------------------------------------ | -------------------------------- |
| **P1** | `4dd3c2b` – _burst then settle, 40–60 FPS_   | visual baseline that almost meets spec     | shows physics active             |
| **P2** | `e8ad9a67` – _burst + 1‑2 FPS in Docker_     | perf stress case                           | uncapped tick loop or heavy logs |
| **P3** | Logs show **7‑method API**, no `alpha()`     | tells us what we cannot poke               | wrapper limitation               |
| **P4** | `undefined` → **graphVersion now defined**   | state pipe test                            | SEL cluster resolved             |
| **P5** | No hover / click visual feedback             | interaction handle                         | renderer glue missing            |
| **P6** | “Ref not ready, will retry …” spam           | diagnostics for polling                    | minor perf + log noise           |
| **P7** | Forced‑tick caps (max 20) merged             | knob to change FPS                         | direct PHY lever                 |
| **P8** | Initial pos set to **random sphere @ r 299** | matches no‑clump but **not** spec (origin) | UX gap (burst source)            |

---

## 3  Cluster & Name 🌳

Rule: coverage, mutual exclusivity, memorable 3‑letter codes.

| Code    | Verb‑friendly label                    | Members                                |
| ------- | -------------------------------------- | -------------------------------------- |
| **CFG** | _Burst‑Source Gap_ (config graph init) | P8                                     |
| **PHY** | _Physics Perf_ (FPS / tick cost)       | P1 P2 P6 P7                            |
| **INT** | _Interaction Dead_                     | P5                                     |
| **API** | _Introspection Limit_                  | P3                                     |
| **SEL** | _Selector‑Break_                       | — **RESOLVED** (kept for traceability) |
| **RTB** | _Run‑Time Break_                       | — **RESOLVED**                         |

_Coverage check_: every primitive mapped.  
_Mutual exclusivity_: each now addresses exactly one type of gap.  
_Mnemonic_: three‑letter verbs/nouns.

---

## 4  Thin Logic (ontology) 🔗

```yaml
classes: [CFG, PHY, INT, API, SEL, RTB]

relations:
  - SEL  blocks  CFG         # undefined version once blocked burst       (RESOLVED)
  - ADP? exacerbates PHY     # old‑tick adapter (now capped)              (SOFT, historical)
  - API  obscures  PHY       # cannot sample alpha, masks hot loops
  - PHY  masks    INT        # sub‑5 FPS can hide hover feedback
  - CFG  prerequisite_of INT # correct init needed before fine UX polish
axioms:
  - if FPS < 10 → PHY
  - if all nodes have |x|,|y|,|z| < 5 on frame 0 then CFG not satisfied
soft_relations:
  - PHY ⇆ DockerPerf         # external factor, uncertain

Only relations needed for immediate decisions are kept hard; the rest are annotated SOFT.

⸻

5  Sanity Test & Iterate 🧪

Instrumental test
Commit 4dd3c2b → ontology predicts:
	•	CFG still red (burst starts from sphere, not origin).
	•	PHY yellow (FPS ~50 then drops only if Docker constrained).
	•	INT red (hover inactive).
Result matches observation list A–G ⇒ model passes baseline.

Falsification poke
Commit e8ad9a67 (before tick cap) → ontology says PHY severe, INT unverifiable. Logs confirm 1–2 FPS & no hover feedback ⇒ model survives.

TODO recorded: need one counter‑example where FPS good but hover still dead (to break PHY masks INT relation).

⸻

6  Package & Expose 📦  (lightweight YAML)

# local-ontology.yaml (inline)
classes: {CFG, PHY, INT, API}
hard_relations:
  CFG prerequisite_of INT
  API obscures PHY
soft_relations:
  PHY masks INT
axioms:
  FPS_lt_10  => PHY
  allPos≈0   => !CFG
how_to_extend:
  - add new class with 3‑letter code under classes
  - declare hard_relations only when block / enable causal step
  - keep axioms minimal; put empirical thresholds in *_lt_* form

No external file created – snippet embedded here.

⸻

7  Recurse on Hotspot (PHY) 🔍

Mini‑cycle outcome → tick loop now capped.
Early measurements show 40–60 FPS on host, 15–25 FPS in Docker.
Remaining perf hit correlates with console spam (polling + deep inspection).
Action: gate verbose logs behind if (process.env.NODE_ENV==='development' && performance.now() < 2000) to prevent runtime spam.

⸻

8  Elevate Checkpoint ⛰️

Probability‑of‑W (Bayesian‐style delta ledger)

Cluster	Status	Δ P(W)
SEL	✅ resolved	+0 .15
RTB	✅ resolved	+0 .10
PHY	🟡 partially	+0 .20 (was 0 .05, gained 0 .15)
CFG	🔴 open	0
INT	🔴 open	0
API	🔴 inherent limit	0
Total	cumulative	P(W) ≈ 0 .45

(Priors: 0 .0; increments mirror earlier v0 .2 table for continuity.)

⸻

Key Uncertainties ❓

Question	Current belief (p)	Next falsifiable check
Do initial sphere coords violate UX spec enough to fail acceptance?	0 .6	Spawn all nodes at (0,0,0), measure burst feel vs spec
Is residual FPS drop ≥ 10 % caused by log spam rather than physics?	0 .5	Wrap logs in dev‑only guard, benchmark again
Can hover failure persist once FPS ≥ 30?	0 .4	Mock high‑perf run (Headless host), test onNodeHover
Is lack of alpha access a blocker for final W?	0 .3	Prototype kinetic‑energy sampler; if adequate, API cluster becomes INFO only


⸻

Immediate Action Backlog 📌  (ordered by impact × effort)
	1.	CFG‑1 — Spawn nodes at origin, remove sphere randomisation, keep tick cap → verify burst UX matches item #1 of spec.
	2.	PHY‑2 — Guard or remove verbose polling & deep‑inspection logs, re‑profile FPS inside Docker (target ≥ 20 stable).
	3.	INT‑1 — Add temporary console.log inside onNodeHover and onNodeClick props to confirm events fire; if yes, trace style update path; if no, inspect event binding.
	4.	API‑aux — Implement velocity‑diff sampler each frame to approximate simulation energy; expose as window.__ENERGY.
	5.	Sanity loop — Re‑run smoke test, update primitives → ontology delta.

⸻

Final reflective step 🔁
	•	Re‑scanned chain for hidden assumptions: largest risk is treating sphere→origin change as trivial; may re‑introduce clump. Added explicit check in backlog.
	•	Cross‑verified each relation with at least one commit log; left soft where inference rather than direct evidence.
	•	Ensured no new files demanded; YAML embedded.
	•	Paused and re‑imagined from scratch: alternative framing (delete r3f wrapper, adopt pure d3‑force) rejected as out‑of‑scope for Phase 2 timeline.

⸻

End of Local Taxonomy & Ontology v0 .3

---

### How this improves the previous version

* **CFG vs BURST clarification** – new cluster pinpoints *origin‑spawn mismatch* rather than blanket “configure graph”.
* **INT cluster added** – makes hover/click gap first‑class.
* **Hard vs soft relations** – distinguishes proven causality from plausible masking.
* **Probability tracker updated** – reflects latest P(W)=0.45 after perf patch.
* **Action backlog trimmed to five concrete, falsifiable tasks**, aligned with spec items.

A new contributor can now:

1. Read the table of primitives to see *exact* evidence.
2. Glance at the cluster list to grasp *which* problem they might tackle.
3. Follow the action backlog to execute the next high‑impact experiment without opening any other doc.

No further files or structure changes are needed to progress toward **W**.
```
