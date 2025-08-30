# VGGT CLI (host-side)

This script runs VGGT on a single image and exports prebaked point positions for the web viewer.

## Requirements (run on your Mac/host, not inside Docker)

```bash
cd /path/to/refinery-sdk
python3 -m venv .venv-vggt && source .venv-vggt/bin/activate
pip install torch --index-url https://download.pytorch.org/whl/cu121  # or CPU wheel if no CUDA
git clone https://github.com/facebookresearch/vggt.git tools/_third_party/vggt
pip install -e tools/_third_party/vggt -r tools/_third_party/vggt/requirements_demo.txt
```

## Export points from an image

```bash
python tools/vggt-cli/run_vggt.py \
  --image apps/cryptiq-mindmap-demo/public/assets/pointclouds/scene-01/color.png \
  --out   apps/cryptiq-mindmap-demo/public/assets/pointclouds/scene-01 \
  --write_colors
```

Outputs (in the same scene folder):
- positions.f32  (Float32Array [N,3], little‑endian)
- colors.u8      (optional, uint8 [N,3])
- meta.json      (N and provenance)

Refresh the quiz page with `?pc=scene-01` and the viewer will prefer `positions.f32` over depth.
