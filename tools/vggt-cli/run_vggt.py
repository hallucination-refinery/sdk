#!/usr/bin/env python3
"""
VGGT single-image exporter

Runs VGGT on a single RGB image and writes:
- positions.f32 (Float32Array of shape [N,3], little-endian)
- colors.u8     (optional, uint8 RGB, shape [N,3])
- meta.json     (counts, source paths)

Console stays quiet on success except for one success line.
On errors, shows attempted builder paths and exception messages.
"""
import argparse
import json
import os
import sys


def _append_vggt_repo_to_path():
    # Add the vendored repo to sys.path so `import vggt` resolves
    tools_dir = os.path.dirname(__file__)
    repo_root = os.path.abspath(os.path.join(tools_dir, "../_third_party/vggt"))
    if repo_root not in sys.path:
        sys.path.append(repo_root)


def _pick_device(torch):
    if torch.cuda.is_available():
        return torch.device("cuda")
    # Apple Silicon Metal Performance Shaders
    try:
        if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            return torch.device("mps")
    except Exception:
        pass
    return torch.device("cpu")


def load_vggt():
    """
    Try multiple paths to obtain a ready-to-eval VGGT model with pretrained weights.
    Order:
    1) Top-level builder: from vggt import build_vggt
    2) HuggingFace hub: VGGT.from_pretrained("facebook/VGGT-1B")
    3) Direct URL state_dict: instantiate VGGT() then load_state_dict from model.pt URL

    Returns: (model, device)
    Raises: RuntimeError with attempted import paths and exceptions.
    """
    _append_vggt_repo_to_path()
    attempts = []

    try:
        import torch  # noqa: F401
    except Exception as e:
        raise RuntimeError(
            "Torch not installed. Create venv and install torch."
        ) from e

    import importlib
    import traceback

    # Select device
    import torch as _torch
    device = _pick_device(_torch)

    # 0) Try local checkpoint paths (env or common locations)
    try:
        models_mod = importlib.import_module("vggt.models.vggt")
        VGGT = getattr(models_mod, "VGGT")
        model = VGGT()

        # Candidate paths in priority order
        candidate_envs = [
            os.getenv("VGGT_WEIGHTS"),
            os.getenv("VGGT_CKPT"),
            os.getenv("VGGT_CHECKPOINT"),
            os.getenv("VGGT_MODEL"),
        ]
        candidate_paths = [p for p in candidate_envs if p and os.path.isfile(p)]

        # Also check common local paths within repo/cache
        tools_dir = os.path.dirname(__file__)
        repo_root = os.path.abspath(os.path.join(tools_dir, "../_third_party/vggt"))
        defaults = [
            os.path.join(repo_root, "model.pt"),
            os.path.join(repo_root, "weights", "model.pt"),
            os.path.expanduser("~/.cache/torch/hub/checkpoints/model.pt"),
        ]
        candidate_paths.extend([p for p in defaults if os.path.isfile(p)])

        load_errors = []
        for pth in candidate_paths:
            try:
                sd = _torch.load(pth, map_location="cpu")
                if isinstance(sd, dict) and "state_dict" in sd and isinstance(sd["state_dict"], dict):
                    sd = sd["state_dict"]
                model.load_state_dict(sd, strict=False)
                model.eval().to(device)
                return model, device
            except Exception as _e:
                load_errors.append((pth, f"{_e.__class__.__name__}: {_e}"))
        if load_errors:
            for pth, msg in load_errors:
                attempts.append((f"VGGT() + torch.load('{pth}')", msg))
        else:
            attempts.append(("VGGT() + local checkpoint", "No candidate local checkpoint paths found"))
    except Exception as e:
        attempts.append(("Instantiate VGGT() for local checkpoint load", f"{e.__class__.__name__}: {e}"))

    # 1) Try a known builder symbol
    try:
        vggt_mod = importlib.import_module("vggt")
        if hasattr(vggt_mod, "build_vggt"):
            model = getattr(vggt_mod, "build_vggt")()
            model.eval().to(device)
            return model, device
        else:
            attempts.append(("vggt.build_vggt", "Attribute not found"))
    except Exception as e:
        attempts.append(("vggt.build_vggt", f"{e.__class__.__name__}: {e}"))

    # 2) Try HuggingFace hub path
    try:
        models_mod = importlib.import_module("vggt.models.vggt")
        VGGT = getattr(models_mod, "VGGT")
        model = VGGT.from_pretrained("facebook/VGGT-1B")
        model.eval().to(device)
        return model, device
    except Exception as e:
        attempts.append(("vggt.models.vggt.VGGT.from_pretrained('facebook/VGGT-1B')", f"{e.__class__.__name__}: {e}"))

    # 3) Fallback to direct URL state_dict
    try:
        models_mod = importlib.import_module("vggt.models.vggt")
        VGGT = getattr(models_mod, "VGGT")
        model = VGGT()
        url = "https://huggingface.co/facebook/VGGT-1B/resolve/main/model.pt"
        state = _torch.hub.load_state_dict_from_url(url)
        model.load_state_dict(state)
        model.eval().to(device)
        return model, device
    except Exception as e:
        tb = traceback.format_exc()
        attempts.append(("VGGT() + load_state_dict_from_url(model.pt)", f"{e.__class__.__name__}: {e}\n{tb}"))

    # If all failed, construct clear error
    detail_lines = []
    for path, err in attempts:
        detail_lines.append(f"- {path}: {err}")
    tried = "\n".join(detail_lines)
    raise RuntimeError(
        "VGGT not available. Ensure repo is cloned and requirements installed.\n"
        "Tried:\n" + tried + "\n\n"
        "You can set an environment variable to point to a local checkpoint to avoid downloads:\n"
        "  export VGGT_WEIGHTS=/path/to/model.pt  (or VGGT_CKPT/VGGT_CHECKPOINT/VGGT_MODEL)\n\n"
        "On host: git clone https://github.com/facebookresearch/vggt.git tools/_third_party/vggt && "
        "pip install -e tools/_third_party/vggt -r tools/_third_party/vggt/requirements_demo.txt"
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True, help="Path to input image")
    parser.add_argument("--out", required=True, help="Output directory (will be created)")
    parser.add_argument("--write_colors", action="store_true", help="Also write colors.u8")
    args = parser.parse_args()

    _append_vggt_repo_to_path()

    try:
        import torch
        import numpy as np
        from vggt.utils.pose_enc import pose_encoding_to_extri_intri
        from vggt.utils.geometry import unproject_depth_map_to_point_map
        from vggt.utils.load_fn import load_and_preprocess_images
    except Exception as e:
        print("[VGGT-CLI] VGGT not available. On host: git clone https://github.com/facebookresearch/vggt.git tools/_third_party/vggt && pip install -e tools/_third_party/vggt -r tools/_third_party/vggt/requirements_demo.txt")
        print(f"[VGGT-CLI] Details: {e}")
        sys.exit(1)

    try:
        model, device = load_vggt()
    except Exception as e:
        print("[VGGT-CLI] VGGT not available. On host: git clone https://github.com/facebookresearch/vggt.git tools/_third_party/vggt && pip install -e tools/_third_party/vggt -r tools/_third_party/vggt/requirements_demo.txt")
        print(f"[VGGT-CLI] Details: {e}")
        sys.exit(1)

    os.makedirs(args.out, exist_ok=True)

    # Preprocess image (pad to 518 square while preserving all pixels)
    images = load_and_preprocess_images([args.image], mode="pad")  # (1,3,H,W), H=W=518
    H, W = int(images.shape[-2]), int(images.shape[-1])
    images = images.to(device)

    # Forward: aggregator -> camera_head -> depth_head
    with torch.no_grad():
        imgs_batched = images.unsqueeze(0)  # (1,1,3,H,W)
        aggregated_tokens_list, ps_idx = model.aggregator(imgs_batched)
        pose_enc = model.camera_head(aggregated_tokens_list)[-1]
        extrinsic, intrinsic = pose_encoding_to_extri_intri(pose_enc, imgs_batched.shape[-2:])
        depth_map, depth_conf = model.depth_head(aggregated_tokens_list, imgs_batched, ps_idx)

    # Convert and squeeze batch dimension
    depth_np = depth_map.squeeze(0)  # (S,H,W,1)
    extr_np = extrinsic.squeeze(0)
    intr_np = intrinsic.squeeze(0)

    # Unproject to world points (S,H,W,3) numpy
    world_points = unproject_depth_map_to_point_map(depth_np, extr_np, intr_np)

    # Prepare masks: valid depth (>0) and finite coordinates
    import numpy as _np
    depth_arr = depth_np.detach().cpu().numpy() if hasattr(depth_np, "detach") else _np.asarray(depth_np)
    depth_arr = depth_arr.squeeze(-1)  # (S,H,W)
    valid_depth = depth_arr > 0.0

    pts = world_points.reshape(-1, 3).astype(_np.float32)
    finite_mask = _np.isfinite(pts).all(axis=1)
    # Combine masks
    valid_mask = finite_mask & valid_depth.reshape(-1)
    pts = pts[valid_mask]

    # Write positions (Float32 little-endian)
    pos_path = os.path.join(args.out, "positions.f32")
    pts.astype("<f4").tofile(pos_path)

    meta = {
        "image": os.path.relpath(args.image),
        "width": int(W),
        "height": int(H),
        "positions_f32": os.path.relpath(pos_path),
        "num_points": int(pts.shape[0]),
    }

    # Optional colors: use preprocessed image to match geometry grid
    if args.write_colors:
        img_u8 = (images.squeeze(0).permute(1, 2, 0).detach().cpu().numpy() * 255.0).astype(_np.uint8)  # (H,W,3)
        colors = img_u8.reshape(-1, 3)[valid_mask]
        col_path = os.path.join(args.out, "colors.u8")
        colors.tofile(col_path)
        meta["colors_u8"] = os.path.relpath(col_path)

    with open(os.path.join(args.out, "meta.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print(f"[VGGT-CLI] Wrote {meta['num_points']} points → {pos_path}")


if __name__ == "__main__":
    main()


