#!/usr/bin/env python3
import argparse
import sys
import time
from pathlib import Path
from typing import List, Optional

import cv2 as cv
import numpy as np
import torch


def list_images(path: Path) -> List[Path]:
	if path.is_file():
		return [path]
	exts = {'.png', '.jpg', '.jpeg', '.webp'}
	return sorted([p for p in path.rglob('*') if p.suffix.lower() in exts])


def pick_device(user_device: Optional[str] = None) -> torch.device:
	if user_device:
		return torch.device(user_device)
	if torch.backends.mps.is_available():
		return torch.device('mps')
	return torch.device('cpu')


def load_midas(model_name: str, device: torch.device):
	# MiDaS via torch.hub
	midas = torch.hub.load('intel-isl/MiDaS', 'DPT_Hybrid' if model_name == 'dpt_hybrid' else 'DPT_Large')
	midas.to(device)
	midas.eval()
	transforms = torch.hub.load('intel-isl/MiDaS', 'transforms')
	transform = transforms.dpt_transform if model_name in {'dpt_hybrid', 'dpt_large'} else transforms.small_transform
	return midas, transform


def normalize_to_uint16(depth: np.ndarray, minp: float, maxp: float) -> np.ndarray:
	finite = np.isfinite(depth)
	if not np.any(finite):
		raise ValueError('No finite values in depth map')
	lo, hi = np.percentile(depth[finite], [minp, maxp])
	if hi <= lo:
		hi = lo + 1e-6
	scaled = (depth - lo) / (hi - lo)
	scaled = np.clip(scaled, 0.0, 1.0)
	depth16 = (scaled * 65535.0 + 0.5).astype(np.uint16)
	return depth16


def save_vis(depth16: np.ndarray, out_path: Path):
	# 16-bit to 8-bit for visualization
	depth8 = (depth16.astype(np.float32) / 257.0).astype(np.uint8)
	vis = cv.applyColorMap(depth8, cv.COLORMAP_MAGMA)
	cv.imwrite(str(out_path), vis)


def resize_long_edge(img_rgb: np.ndarray, max_edge: int) -> np.ndarray:
	h, w = img_rgb.shape[:2]
	long = max(h, w)
	if long <= max_edge:
		return img_rgb
	scale = max_edge / float(long)
	new_w = int(round(w * scale))
	new_h = int(round(h * scale))
	return cv.resize(img_rgb, (new_w, new_h), interpolation=cv.INTER_AREA)


def infer_one(midas, transform, device: torch.device, img_path: Path, out_dir: Path, minp: float, maxp: float, vis: bool, max_edge: int):
	img_bgr = cv.imread(str(img_path), cv.IMREAD_COLOR)
	if img_bgr is None:
		raise FileNotFoundError(f'Cannot read image: {img_path}')
	img_rgb = cv.cvtColor(img_bgr, cv.COLOR_BGR2RGB)
	img_rgb = resize_long_edge(img_rgb, max_edge=max_edge)
	h, w = img_rgb.shape[:2]

	# Preprocess
	input_batch = transform(img_rgb).to(device)

	# Inference
	torch.set_grad_enabled(False)
	start = time.time()
	prediction = midas(input_batch)
	# Resize to original resolution
	prediction = torch.nn.functional.interpolate(
		prediction.unsqueeze(1), size=(h, w), mode='bicubic', align_corners=False
	).squeeze()
	pred = prediction.detach().to('cpu').numpy()
	dt = time.time() - start

	# Normalize to 16-bit
	depth16 = normalize_to_uint16(pred, minp=minp, maxp=maxp)

	stem = img_path.stem
	out_depth = out_dir / f'{stem}_depth16.png'
	out_vis = out_dir / f'{stem}_depth_vis.png'
	out_dir.mkdir(parents=True, exist_ok=True)
	cv.imwrite(str(out_depth), depth16)
	if vis:
		save_vis(depth16, out_vis)

	# Also save RG-packed 8-bit depth for web: hi in R, lo in G
	hi = (depth16 >> 8).astype(np.uint8)
	lo = (depth16 & 0xFF).astype(np.uint8)
	rg = np.stack([hi, lo, np.zeros_like(lo, dtype=np.uint8)], axis=-1)
	out_rg = out_dir / f'{stem}_depth_rg.png'
	cv.imwrite(str(out_rg), rg)

	print(f'[OK] {img_path.name} → {out_depth.name} ({dt*1000:.0f} ms)')


def main():
	parser = argparse.ArgumentParser(description='Image → 16-bit depth (MiDaS DPT)')
	parser.add_argument('--input', '-i', required=True, help='Image file or folder')
	parser.add_argument('--output', '-o', default='./outputs', help='Output directory')
	parser.add_argument('--model', choices=['dpt_hybrid', 'dpt_large'], default='dpt_hybrid', help='Model variant')
	parser.add_argument('--device', default=None, help='Force device (cpu|mps)')
	parser.add_argument('--minp', type=float, default=2.0, help='Lower percentile')
	parser.add_argument('--maxp', type=float, default=98.0, help='Upper percentile')
	parser.add_argument('--vis', action='store_true', help='Save preview colormap PNG')
	parser.add_argument('--max-edge', type=int, default=1536, help='Clamp longest image edge before inference')
	args = parser.parse_args()

	in_path = Path(args.input)
	out_dir = Path(args.output)
	device = pick_device(args.device)
	print(f'Using device: {device}')

	midas, transform = load_midas(args.model, device)

	images = list_images(in_path)
	if not images:
		print('No images found.', file=sys.stderr)
		return 1

	for p in images:
		try:
			infer_one(midas, transform, device, p, out_dir, args.minp, args.maxp, args.vis, args.max_edge)
		except Exception as e:
			print(f'[FAIL] {p.name}: {e}', file=sys.stderr)
	return 0


if __name__ == '__main__':
	sys.exit(main())


