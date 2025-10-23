# Motion Analysis Prompt — Reference Video Analysis

## Context

You are analyzing a reference video to determine the nature of particle motion in a visual effect that the viewer describes as having "smokey, plumy, Harry Potter pensieve-like" quality. Previous frame-by-frame analysis concluded particles are static with only alpha fade animation, but the viewer watching the full video sees clear flowing/smoking motion.

**Your goal:** Determine definitively whether particles are:
1. **Static positions** with rendering illusion of motion
2. **Gently drifting** (subtle spatial motion creating flow)
3. **Actively flowing** (coherent advection simulation)

## Assets Available

**60fps frame sequences extracted:**
- `assets/motion-reanalysis-60fps/cohere/` - 202 frames (0.0-3.4s, cohere phase)
- `assets/motion-reanalysis-60fps/dissipate/` - 254 frames (13.0-17.2s, dissipate phase)

**Original video:**
- `assets/fojcik_tweet_effect_replication_bundle/Fojcik-Reference-Video.mp4`
- Native 60fps, 17.2s duration, 720x720px

## Analysis Tasks

### Task 1: Consecutive Frame Comparison (Micro Motion)

**Examine these frame triplets at 60fps (16.7ms apart):**

**Cohere phase:**
- Frames 30, 31, 32 (0.5s mark)
- Frames 60, 61, 62 (1.0s mark)
- Frames 120, 121, 122 (2.0s mark)

**Dissipate phase:**
- Frames 60, 61, 62 (14.0s mark)
- Frames 120, 121, 122 (15.0s mark)
- Frames 180, 181, 182 (16.0s mark)

**For each triplet, answer:**
1. Can you identify ANY individual particles across frames? (Yes/No)
2. If yes, measure spatial displacement of 3-5 particles in pixels
3. If no, describe what changes between frames (brightness, density, blur, etc.)
4. Do you see motion blur streaks? (suggests movement during exposure)

### Task 2: 1-Second Interval Comparison (Macro Motion)

**Compare these frame pairs 60 frames apart (1.0s):**

**Cohere phase:**
- Frame 1 vs Frame 60
- Frame 60 vs Frame 120
- Frame 120 vs Frame 180

**Dissipate phase:**
- Frame 1 vs Frame 60
- Frame 60 vs Frame 120
- Frame 120 vs Frame 180

**For each pair:**
1. Does the overall particle cloud structure shift spatially? (Yes/No + direction if yes)
2. Identify 3-5 landmark features (dense clusters, sparse gaps). Do they move or stay fixed?
3. Estimate cumulative displacement over 1 second (if detectable)
4. Does density/brightness change more than position? (Yes/No)

### Task 3: Visual Perception Analysis

**Watch the actual video file** (not just stills):
- Play `Fojcik-Reference-Video.mp4` from 0:00-3:22 (cohere)
- Play from 12:58-17:20 (dissipate)

**Answer these perception questions:**
1. When you watch (not analyze frames), do you PERCEIVE motion? (Yes/No)
2. If yes, describe the motion: flowing/drifting/swirling/rising/dissipating?
3. Is the motion coherent (particles move together) or random (individual jitter)?
4. Does it look like particles are MOVING or like they're FADING with soft rendering?
5. On a scale 1-10, how "static" vs "flowing" does it feel? (1=completely static, 10=fluid simulation)

### Task 4: Rendering Characteristics

**Examine particle appearance in frames 60, 120, 180 (both ranges):**

1. **Particle size:** Estimate diameter in pixels (measure 5 particles, average)
2. **Edge softness:** Hard circles or soft/blurry? (rate 1-5, 1=hard edge, 5=very blurry)
3. **Halos:** Do particles have visible bloom halos larger than particle core? (Yes/No + estimate halo:core ratio)
4. **Overlaps:** In dense regions, do overlapping particles create bright glowing areas? (Yes/No)
5. **Colors:** Are colors vibrant (saturated) or muted? Rate 1-5 (1=grayscale, 5=highly saturated)
6. **Continuity:** In mid-density areas, do you see individual dots or continuous haze?

### Task 5: Motion Hypothesis Testing

**Based on all analysis above, which hypothesis best fits?**

**Hypothesis A: Purely Static Positions**
- Particles never move spatially
- All "smoke" effect from alpha fade + soft rendering + bloom
- Motion perception is illusion from temporal effects
- Evidence for: [list observations]
- Evidence against: [list observations]

**Hypothesis B: Gentle Drift**
- Particles slowly drift 2-10px per second
- Not enough to see frame-to-frame, but visible over 1-2 seconds
- Creates subtle "breathing" or "flowing" feel
- Evidence for: [list observations]
- Evidence against: [list observations]

**Hypothesis C: Active Flow Simulation**
- Particles follow coherent advection field (curl noise, velocity field)
- Clear spatial motion visible frame-to-frame
- Structured flow patterns (swirls, eddies, coherent movement)
- Evidence for: [list observations]
- Evidence against: [list observations]

**Hypothesis D: Hybrid Approach**
- Mostly static positions with localized motion/perturbation
- Alpha fade timeline choreographed with small position offsets
- Specific description: [explain]
- Evidence for: [list observations]

### Task 6: Implementation Recommendation

**Based on your analysis, to recreate this aesthetic, the implementation should:**

**Priority 1 (Essential):**
- [ ] Item (specific shader/rendering change)
- [ ] Item

**Priority 2 (Important):**
- [ ] Item
- [ ] Item

**Priority 3 (Nice to have):**
- [ ] Item

**DO NOT implement:** [list approaches that are unnecessary based on analysis]

## Critical Questions to Answer

**Before submitting analysis, explicitly answer:**

1. **Is there detectable spatial motion between consecutive 60fps frames?** (Yes/No + confidence %)
2. **Is there detectable spatial motion over 1-second intervals?** (Yes/No + confidence %)
3. **What percentage of the "smoke" effect comes from rendering (bloom/softness) vs motion?** (estimate %)
4. **If you had to implement this effect from scratch, would you add particle advection/flow?** (Yes/No + rationale)

## Output Format

Provide:
1. **Executive Summary** (2-3 sentences answering: static, drift, or flow?)
2. **Detailed findings** from Tasks 1-4 (bullet points with measurements)
3. **Hypothesis verdict** from Task 5 (which hypothesis + confidence %)
4. **Implementation checklist** from Task 6 (prioritized)
5. **Critical questions answers** (explicit Yes/No + numbers)

## Notes

- Be skeptical. Don't assume motion just because the viewer perceives it.
- Measure actual pixels, don't eyeball.
- If you can't track individual particles, say so explicitly.
- Your analysis will determine whether we implement flow simulation (4+ hours) or just improve rendering (1-2 hours).
- The previous analysis was done on 10fps extractions and may have missed motion. You have 60fps data.
- The user is confused because they CLEARLY see "pensieve smoke" flow in the video but frame analysis says "static." Help resolve this discrepancy.
