#!/usr/bin/env python3
"""
VGGT single-image exporter

Runs VGGT on a single RGB image and writes:
- positions.f32 (Float32Array of shape [N,3], little-endian)
- colors.u8     (optional, uint8 RGB, shape [N,3])
- meta.json     (counts, source paths)

This script is meant to run on the HOST (outside the Docker container).
If VGGT or Torch are missing, it will print a clear instruction and exit(1).
"""
import argparse
import json
import os
import sys
import struct


def require_modules():
    try:
        import torch  # noqa: F401
    except Exception as e:
        print("[VGGT-CLI] Torch not installed. On host: python3 -m venv .venv-vggt && source .venv-vggt/bin/activate && pip install torch --index-url https://download.pytorch.org/whl/cu121 (or CPU wheel)")
        print(f"[VGGT-CLI] Details: {e}")
        sys.exit(1)
    try:
        # Lazy import path; users clone into tools/_third_party/vggt
        sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../_third_party/vggt")))
        from vggt.utils.pose_enc import pose_encoding_to_extri_intri  # noqa: F401
        from vggt.utils.geometry import unproject_depth_map_to_point_map  # noqa: F401
        import torch  # noqa: F401
        import torchvision.transforms as T  # noqa: F401
        from PIL import Image  # noqa: F401
        import numpy as np  # noqa: F401
        from vggt import build_vggt  # type: ignore
    except Exception as e:
        print("[VGGT-CLI] VGGT not available. On host: git clone https://github.com/facebookresearch/vggt.git tools/_third_party/vggt && pip install -e tools/_third_party/vggt -r tools/_third_party/vggt/requirements_demo.txt")
        print(f"[VGGT-CLI] Details: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True, help="Path to input image")
    parser.add_argument("--out", required=True, help="Output directory (will be created)")
    parser.add_argument("--write_colors", action="store_true", help="Also write colors.u8")
    args = parser.parse_args()

    require_modules()
    from PIL import Image
    import numpy as np
    import torch
    import torchvision.transforms as T
    from vggt import build_vggt  # type: ignore
    from vggt.utils.pose_enc import pose_encoding_to_extri_intri
    from vggt.utils.geometry import unproject_depth_map_to_point_map

    os.makedirs(args.out, exist_ok=True)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    dtype = torch.float32

    # Load image
    pil = Image.open(args.image).convert("RGB")
    w, h = pil.size
    to_tensor = T.Compose([T.ToTensor()])
    img_t = to_tensor(pil).to(device)  # [3,H,W], 0..1

    # Build model (default checkpoint)
    model = build_vggt().to(device).eval()

    with torch.no_grad():
        images = img_t[None]  # [1,3,H,W]
        aggregated_tokens_list, ps_idx = model.aggregator(images)
        pose_enc = model.camera_head(aggregated_tokens_list)[-1]
        extrinsic, intrinsic = pose_encoding_to_extri_intri(pose_enc, images.shape[-2:])
        depth_map, depth_conf = model.depth_head(aggregated_tokens_list, images, ps_idx)
        # Unproject to 3D
        point_map = unproject_depth_map_to_point_map(
            depth_map.squeeze(0), extrinsic.squeeze(0), intrinsic.squeeze(0)
        )  # [3,H,W]

    pts = point_map.permute(1, 2, 0).reshape(-1, 3).contiguous().detach().cpu().numpy().astype(np.float32)
    # Filter invalid points (depth<=0)
    mask = np.isfinite(pts).all(axis=1)
    pts = pts[mask]

    pos_path = os.path.join(args.out, "positions.f32")
    pts.tofile(pos_path)

    meta = {
        "image": os.path.relpath(args.image),
        "width": int(w),
        "height": int(h),
        "positions_f32": os.path.relpath(pos_path),
        "num_points": int(pts.shape[0]),
    }

    if args.write_colors:
        rgb = np.asarray(pil, dtype=np.uint8).reshape(h * w, 3)[mask]
        col_path = os.path.join(args.out, "colors.u8")
        rgb.tofile(col_path)
        meta["colors_u8"] = os.path.relpath(col_path)

    with open(os.path.join(args.out, "meta.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print(f"[VGGT-CLI] Wrote {meta['num_points']} points → {pos_path}")


if __name__ == "__main__":
    main()


