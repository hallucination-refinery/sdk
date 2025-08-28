# Depth CLI (image → depth)

A separate, self-contained environment to generate 16‑bit depth maps on Mac (Apple Silicon) with PyTorch MPS.

- Input: color image(s) (.png/.jpg/.jpeg/.webp)
- Output: 16‑bit linear `*_depth16.png` (+ optional preview `*_depth_vis.png`)
- Model: MiDaS DPT Hybrid (default). Runs on MPS automatically if available.

## Quick start (Mac, Apple Silicon)

```bash
cd tools/depth-cli
make setup
# Single image
python depth_cli.py --input ./samples/image.png --output ./outputs --vis
# Batch a folder
python depth_cli.py --input ./samples --output ./outputs --vis
```

## Options

```bash
python depth_cli.py --help
```

Key flags:
- `--model {dpt_hybrid,dpt_large}`: quality/speed tradeoff
- `--minp 2 --maxp 98`: percentile normalization window
- `--vis`: also save a colormapped preview PNG for quick QA
- `--max-edge 1536`: constrain longest side for faster inference

Outputs go to `./outputs` by default.

## Notes
- First run downloads MiDaS weights via torch.hub (~0.5–1.0 GB). Cached afterwards.
- On Apple Silicon, PyTorch uses MPS automatically when available.

