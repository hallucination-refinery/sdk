# Acceptance Keys Registry (Template)

## Canonical log keys (exact strings or regex you will use)
- key1: 
- key2: 
- key3: 

## Source of truth objects
- Example: “caps snapshot” emitted once at canvas/material creation
- Policy: emit once; freeze; consume consistently across modules

## Thresholds & single-shot policy
- Example thresholds (edit per project):
  - points ≤ {CAP}
  - DPR ≤ {MAX_DPR}
  - one caps log/session; one instances log/session
  - frame-percentiles: one snapshot after ~{N} frames; p50 ≤ {MS} desktop

## Validation notes
- Define which logs MUST appear once and which MUST NOT repeat
- Define acceptable ranges for performance proxies
