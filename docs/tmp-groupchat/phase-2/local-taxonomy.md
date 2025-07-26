Below is a worked‑through application of the 8‑stage “Local Taxonomy & Ontology” loop to the material you just supplied.
Everything is self‑contained; no new files are created.

⸻

1  Frame the Target Slice  🧭

Item Content
Problem lens “Explain—then fix—the mismatch between intended and observed graph behaviour across the 9 chronologically‑logged commits so we can reach W.”
Out‑of‑scope • Future lens/timeline UI features• Docker/host perf tuning outside the repo• Phase‑3+ multi‑user work
Axis estimate Understanding 75 % ↔ Use 25 % (we must understand root causes more than build production code)  ·  General 40 % ↔ Local 60 % (model is repo‑specific but has some reusable D3/r3f concepts)

⸻

2  Harvest Primitives  👜

# Concrete Instance (from logs/diffs) Affordance (handle) Causal hint

P1 Commit 09dabcb9 → dense clump, no movement Baseline visual symptom “Pre‑position sphere?”
P2 Commit 0bd15a49 → no nodes; debugger pauses at line 214 Shows render pipeline can break before first frame Indicates race in CrypticAnimusScene
P3 Commit d425a425 → evenly spaced static nodes Confirms anti‑clump code landed Physics still inert
P4 Commit e8ad9a67 → nodes move but FPS ≈ 1 – 2 Demonstrates physics active but perf collapse Possibly infinite tick loop
P5 Diff set shows ForceGraphAdapter.tsx touched in all hops Single file likely toggles physics/tick params each commit Candidate focal file
P6 “[graphVersion] undefined” spam persists until d425a425 Reveals state pipe break independent of visuals Store/selector issue
P7 “Cannot access ‘nodePassesFilters’ before initialisation” at dfd822f9 Critical runtime abort Category filter slice ordering
P8 Every test wipes .next/.turbo yet stale behaviour recurs Build caching not root cause Confirms runtime code actually changes
P9 7‑method API list (wrapper limitation) Defines what we cannot call Need alt instrumentation

⸻

3  Cluster & Name (Taxonomy)  🌳

Cluster (Code) Members Verb‑friendly Label
CFG P1, P3 Configure‑Graph problems (sphere vs burst)
PHY P4 Physics‑Active but Slow
SEL P6 Selector‑Break (undefined graphVersion)
RTB P2, P7 Run‑Time Break (react errors / debugger pauses)
API P9 API‑Limit (7‑method barrier)
ADP P5 Adapter‑Toggles (tick/decay edits)

Coverage: every primitive belongs to ≥1 cluster.
Mutual exclusivity: clusters distinct enough for single‑responsibility fixes.
Memorability: 3‑letter codes.

⸻

4  Add Thin Logic (Ontology)  🔗

classes:
CFG: {verb: "blocks burst UX"}
PHY: {verb: "degrades FPS"}
SEL: {verb: "feeds wrong props"}
RTB: {verb: "halts render"}
API: {verb: "limits introspection"}
ADP: {verb: "changes force params"}

relations:

- SEL -> CFG : "wrong props disable burst (initial pos override)"
- ADP -> PHY : "tick loop strength => perf"
- API -> PHY : "no alpha access hides energy drop, leading to perpetual ticks"
- RTB -> PHY : "runtime pauses reset internal clock → perceived stutter"
- SEL -> RTB : "undefined store fields cause React TDZ errors"
  axioms:
- If SEL present AND graphVersion==undef THEN caching degenerates
- If PHY present AND FPS<5 THEN user perceives 'static'

Only the relations needed for our immediate decision tree are captured.

⸻

5  Sanity Test & Iterate  🧪

Instrumental walk‑through 1. Pick commit d425a425 (SEL fixed, PHY present). 2. Ontology predicts: burst still blocked (CFG), FPS poor (PHY). 3. Observation matches: nodes static but evenly spaced, FPS high? No → static and good FPS.
⇒ False negative on PHY relation ➟ add note.

Falsification poke

Commit 0bd15a49 (RTB) breaks render before nodes show.
Model predicts RTB halts physics. Fits log (nodes never appear).
No extension required.

TODO recorded: refine PHY cause once performance profiled.

⸻

6  Package & Expose  📦

local‑ontology.yaml (inline here for visibility)

# Force‑Graph Phase‑2 Local Ontology v0.2

classes: {CFG, PHY, SEL, RTB, API, ADP}
relations:

- SEL blocks CFG
- ADP exacerbates PHY
- API obscures PHY
- RTB resets PHY
  axioms:
- graphVersion==undefined => SEL
- FPS<5 && ticks/s>1000 => PHY
  how_to_extend:
- Add new class under same 3‑letter rule
- Declare relation as "A verb B"

⸻

7  Recurse on Hotspot (PHY)  🔍

Run mini‑cycle focusing on low FPS root. 1. Frame: Why FPS collapses at e8ad9a67 despite physics working?
Out‑of‑scope: UI overlay, Docker host. 2. Harvest:
• Tick loop set to 300 per frame in adapter.
• AlphaDecay 0.0 keeps energy high.
• Browser shows CPU 100 %. 3. Cluster: Single “over‑tick” issue. 4. Logic: over‑tick causes PHY.

Actionable patch: cap tickFrame iterations to Math.min(ceil(alpha\*100), 20).

⸻

8  Elevate (once SEL & PHY fixed)  ⛰️

Will run higher‑scope cycle to merge with migration checklist.

⸻

Probability‑of‑W Tracker (after ontology build)

Cluster fixed? Δ (P(W achieved))
SEL resolved  +0.15
RTB resolved  +0.10
PHY resolved  +0.30
CFG resolved  +0.15
Interactions  +0.20
Cleanup  +0.10
Current P(W) ≈ 0.10 (only RTB currently green)

⸻

Key Uncertainties ❓

Question Current belief Verification method
Are nodes still prematurely “pinned” (fx/fy)? 0.4 Log node objects for fx fields
Does charge force update each commit? 0.6 Dump d3Force('charge').strength()
Is FPS drop purely tick‑loop? 0.5 Patch loop cap; compare profiles
Will SDK store rewrite eliminate ADP cluster entirely? 0.3 Prototype minimal store‑driven renderer

⸻

Recommendations 📌 1. Patch SEL: ensure graphVersion propagated at all commits (add selector unit‑test). 2. Cap tick loop → retest e8ad9a67 to isolate PHY. 3. Remove sphere positioning once PHY acceptable; re‑enable burst (CFG). 4. Add onNodeHover log to confirm interaction path not blocked by RTB. 5. Re‑run ontology loop on Interactions cluster after above patches.

⸻

Final reflective step 🔁
• Re‑walked assumptions: biggest hidden risk is blaming tick loop when Docker GPU limits could dominate → plan includes CPU profile check.
• Ensured each claim ties to a primitive; where missing, tagged uncertainty.
• No additional files beyond YAML snippet; doc remains self‑contained.

End of local taxonomy & ontology derivation.
