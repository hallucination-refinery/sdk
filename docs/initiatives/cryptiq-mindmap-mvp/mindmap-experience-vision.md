# Cryptiq Mindmap — Experience Vision

## High-level experience (5–10 bullets)

- Homepage stays familiar with slight layout tweaks and the existing intro animation; a "press any key/space to start" affordance; menu includes Cryptiq integration, info/disclaimer, and Begin.
- Begin triggers a sci-fi "hyperdrive" zoom into a colored brain node and a brief acclimation moment — minimal guidance instead of a full tutorial.
- Each round presents a timed prompt (text or image; Rorschach-style) inviting "draw the first thing you see," for roughly 8–10 masks/rounds.
- You draw quickly; on commit, the sketch morphs into a model (e.g., cat/dog), with stochastic variation influenced by drawing dynamics (speed/width/gesture).
- After morph, the model shrinks into a progress/rounds indicator; the camera zooms out to the brain, then in to the next node.
- Playful, "Stanley Parable"-like running commentary accompanies the interaction, reacting to what/how you drew.
- Between rounds, cinematic brain transitions (zoom out/in across nodes) set pacing and context.
- Finale: a large zoom-out and "brain processing" sequence reveals the final brain visualization.
- A Spotify Wrapped-style recap summarizes archetypes, plus interactive hover on graph edges leveraging existing point-cloud interactions.
- Shareables and future: social cards for posting; later, consider NFTs/collectibles integration and how they plug into the flow.

---

## Transcript (verbatim)

```
Okay. So, you navigate to the homepage. It's going to look almost the same as it does now, except I think that the layout is going to change a little bit. And the introductory animation plays all the same. There's a press any key or press space to start. And then also, I'm not exactly sure what the menu options are going to be, but one of them necessarily has to be some kind of integration with Cryptic. Maybe one is like an info page or like an explainer or disclaimer, etc. And then begin. And I'm not really kind of sure what happens here in the flow, but I think that there has to kind of be a way of kind of acclimating people to the process. And it's basically, you know, maybe there should be kind of—it's simple enough not to have a tutorial, but you kind of would explain. Also, with the begin, what happens is there's like, I don't know, almost like a sci-fi or kind of Star Wars-like hyperdrive kind of animation of zooming into one of the nodes on the brain, you know, one of the colored orbs on the brain surface. And then there's kind of like a description of draw anything you want, whatever. And then some kind of way to actually start. And then, you know, there's like a timer and kind of countdown. And then like a textual prompt or an image or something like that. I'm not exactly sure. Some kind of way of kind of prompting the Rorschach thing that's kind of compelling and interesting. And, you know, like maybe we reuse the point cloud, maybe not, maybe something else. Maybe it's just kind of a textual prompt. Maybe you just kind of keep it simple. I don't know. And, you know, you have, I think, eight to ten kind of masks. And there's a timer. And you have to kind of quickly draw the first thing that comes to mind with the prompt on the timer. And then the drawing will kind of morph. And it will morph to kind of maybe the first, I don't know, let's say you draw a cat or a dog or something like that. And some kind of stochastic or kind of random property to do with like how quickly you draw the strokes and how wide or like whatever will impact the kind of the model that is kind of shown. And then that kind of model like as you move to the next round kind of shrinks and then goes to kind of like the maybe like the loading kind of bar where the like eight or ten kind of masks kind of rounds are shown. And you go through that process. And then, you know, maybe like I'm not exactly sure. You know, there's kind of some running like Stanley Parable kind of like commentary. And then you go through all the masks. And then each time you go to each kind of mask, there's like a zoom out to the brain and then a zoom in to kind of another node and stuff like that. And at the end, there's kind of some zoom out from the brain and some kind of brain processing animation. And yeah, you get access to like the final brain. And I have a few kind of references that I have in mind there. But, you know, I'm thinking of kind of like a Spotify wrapped kind of thing with the archetypes that you kind of fall into as well as the, you know, the hover to kind of view interaction of the edges and stuff like that that already exists. And yeah, and then there's kind of like hard like social media cards for ways of kind of sharing things. And then the very last thing, and I don't mean maybe this is the last thing in the flow, but I just meant it as the very last kind of point, was that we have to think through how the NFTs and collectibles are being kind of integrated and how exactly that works. Yeah.
```

---

## Production readiness and go‑to‑market bullets

- Core product state: draw → recognize → morph loop is stable and instrumented; landing is centered and polished; Guided Round 1 is one seam (onResult) away from full arc (hyperdrive → countdown → draw → morph → progress).
- “Fun/novel/insight” lift: ship 4–6 curated formations you care about; add punchy commentary lines per result; sprinkle juice (subtle sound, easing, scale/alpha pops); map a few stroke traits → playful “readings.”
- Shareability: auto-generate a session “Wrapped” card/GIF (title, top archetypes, 3–6 formations, color palette), permalink to view/replay, one‑click share (X/IG/TikTok), copy-to-clipboard.
- Collectibles v1: claimable session token (off‑chain ID) with optional on‑chain mint later; rarity from stroke metrics/confidence; edition model (per prompt/per session); custodial fallback; clear T&Cs.
- Mechanisms: 8–10 round progression, association rounds seeded by last 3D, streak bonuses/Easter eggs, keep unknowns tidy and capped, confidence gates for curated-first.
- Marketing: soft launch + waitlist, 30–45s demo cut, limited “founders” collectible drop, community/influencer seeding, Product Hunt day, capture press kit (screens, logo, colors).
- Technical hardening: prod build across devices, DPR/instance caps verified, zero hydration/WebGL context loss, CDN cache for ml5/model/assets, error overlays off in prod, basic uptime/crash logs.
- Privacy/compliance: explicit share consent, opt‑in telemetry, trace redaction, delete‑my‑data path, clear licensing for user formations/collectibles.
- Release criteria: p95 infer < 200 ms (warm), mobile FPS ≥ 30, unknown rate within target, 100% successful morphs, one onResult per commit, Wrapped card renders in < 1 s.
- Timeline: 1–2 sprints to finish Guided Round 1 + share card + claimable collectible; 1 sprint to expand rounds/associations + marketing ramp; mint/on‑chain optional in a follow‑up.

---

## Addendum — Dream‑sequence draw interaction (verbatim)

### User description (verbatim)

```
Okay, how about this? Just breakdown what you think I'm saying:

Each individual mask or item in the quiz is like a dream sequence of images that flash. A selection of images flashes, and when you put your mouse down to draw, it stops on one image.

As you draw, something happens to the image behind it — it becomes grainy or shows an exposure effect, pixelation, or a color change. Then the morphing effect happens.
```

### Assistant summary (verbatim)

```
- Each mask is a rapid “dream sequence” slideshow; images cycle until you press/drag to draw, which freezes the current frame as the prompt.
- While you draw, the frozen image reacts (grain/exposure/pixelate/color shift) under the ink, reinforcing the act of drawing.
- On idle commit, strokes fade → hold → the point‑cloud morph plays; the background image effect can intensify or cross‑fade out during the morph.
- The interaction feels reactive and cinematic: image drives the prompt, your drawing alters it, then the drawing transforms into a 3D formation.
```
