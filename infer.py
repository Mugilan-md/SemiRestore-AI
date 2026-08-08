"""
SemiRestoreNet — Standalone Evaluation Script
=============================================
SEMICON India Hackathon 2026 | Problem: AI-Based Restoration of Degraded SEM Images
Sponsored by KLA Corporation

USAGE (exactly as required by the hackathon spec):
    python infer.py --test-dir /path/to/test/images --out-dir /path/to/output

Arguments:
    --test-dir   Path to directory containing degraded input images (.png / .tif / .jpg)
    --out-dir    Path to directory where restored images will be written
    --ckpt       (optional) Path to model checkpoint. Default: checkpoints/best.pt
    --onnx       (optional) Use ONNX model instead of PyTorch. Default: checkpoints/semirestore.onnx

This script:
  1. Loads the trained SemiRestoreNet model (PyTorch .pt OR ONNX .onnx)
  2. Runs inference on ALL images in --test-dir
  3. Writes restored images to --out-dir with the SAME filename
  4. Prints per-image inference time and a summary

It runs WITHOUT manual edits — tested on a clean machine.
"""

import argparse
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image

# ── resolve project root so imports work from any working directory ─────────
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

SUPPORTED_EXT = {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp"}


def load_image_as_float(path: Path) -> np.ndarray:
    """Load any image as a float32 numpy array in [0, 1], grayscale."""
    img = Image.open(path).convert("L")
    return np.asarray(img, dtype=np.float32) / 255.0


def save_float_image(arr: np.ndarray, path: Path) -> None:
    """Save a float32 [0,1] numpy array as a grayscale PNG."""
    out = (arr.clip(0, 1) * 255).astype(np.uint8)
    Image.fromarray(out, mode="L").save(str(path))


# ── PyTorch inference ────────────────────────────────────────────────────────
def run_pytorch(ckpt_path: Path, test_dir: Path, out_dir: Path):
    try:
        import torch
        from model.network import SemiRestoreNet
    except ImportError as e:
        print(f"[ERROR] Cannot import torch or model: {e}")
        print("Install with: pip install torch torchvision")
        sys.exit(1)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Using device: {device}")

    model = SemiRestoreNet()
    state = torch.load(str(ckpt_path), map_location=device)
    model.load_state_dict(state)
    model.eval()
    model.to(device)
    print(f"[INFO] Loaded checkpoint: {ckpt_path}")

    images = sorted([p for p in test_dir.iterdir() if p.suffix.lower() in SUPPORTED_EXT])
    if not images:
        print(f"[ERROR] No images found in {test_dir}")
        sys.exit(1)

    print(f"[INFO] Found {len(images)} images. Running inference...")
    times = []
    for img_path in images:
        arr = load_image_as_float(img_path)
        t = torch.from_numpy(arr).unsqueeze(0).unsqueeze(0).to(device)  # [1,1,H,W]

        with torch.no_grad():
            # warmup
            _ = model(t)
            t0 = time.perf_counter()
            out = model(t)
            elapsed_ms = (time.perf_counter() - t0) * 1000

        out_arr = out.squeeze().cpu().numpy()
        out_path = out_dir / img_path.name
        save_float_image(out_arr, out_path)
        times.append(elapsed_ms)
        print(f"  [{elapsed_ms:6.1f} ms] {img_path.name} → {out_path.name}")

    print(f"\n[RESULT] {len(images)} images restored → {out_dir}")
    print(f"[RESULT] Avg inference time: {sum(times)/len(times):.1f} ms/image")
    print(f"[RESULT] Min: {min(times):.1f} ms  Max: {max(times):.1f} ms")


# ── ONNX inference (no PyTorch required at runtime) ──────────────────────────
def run_onnx(onnx_path: Path, test_dir: Path, out_dir: Path):
    try:
        import onnxruntime as ort
    except ImportError:
        print("[ERROR] onnxruntime not installed. Run: pip install onnxruntime")
        sys.exit(1)

    providers = ["CUDAExecutionProvider", "CPUExecutionProvider"]
    session = ort.InferenceSession(str(onnx_path), providers=providers)
    input_name = session.get_inputs()[0].name
    output_name = session.get_outputs()[0].name
    print(f"[INFO] Loaded ONNX model: {onnx_path}")
    print(f"[INFO] Provider: {session.get_providers()[0]}")

    images = sorted([p for p in test_dir.iterdir() if p.suffix.lower() in SUPPORTED_EXT])
    if not images:
        print(f"[ERROR] No images found in {test_dir}")
        sys.exit(1)

    print(f"[INFO] Found {len(images)} images. Running ONNX inference...")
    times = []
    for img_path in images:
        arr = load_image_as_float(img_path)[None, None, :, :]  # [1,1,H,W]

        # warmup
        session.run([output_name], {input_name: arr})
        t0 = time.perf_counter()
        result = session.run([output_name], {input_name: arr})
        elapsed_ms = (time.perf_counter() - t0) * 1000

        out_arr = result[0].squeeze()  # [H,W]
        out_path = out_dir / img_path.name
        save_float_image(out_arr, out_path)
        times.append(elapsed_ms)
        print(f"  [{elapsed_ms:6.1f} ms] {img_path.name} → {out_path.name}")

    print(f"\n[RESULT] {len(images)} images restored → {out_dir}")
    print(f"[RESULT] Avg inference time: {sum(times)/len(times):.1f} ms/image")


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(
        description="SemiRestoreNet — Standalone Evaluation Script for SEMICON India Hackathon 2026"
    )
    ap.add_argument(
        "--test-dir", required=True,
        help="Path to directory containing degraded test images"
    )
    ap.add_argument(
        "--out-dir", required=True,
        help="Path to directory where restored images will be written"
    )
    ap.add_argument(
        "--ckpt", default="checkpoints/best.pt",
        help="Path to PyTorch checkpoint (default: checkpoints/best.pt)"
    )
    ap.add_argument(
        "--onnx", default=None,
        help="Path to ONNX model file. If provided, uses ONNX runtime instead of PyTorch."
    )
    args = ap.parse_args()

    test_dir = Path(args.test_dir)
    out_dir = Path(args.out_dir)

    if not test_dir.exists():
        print(f"[ERROR] --test-dir does not exist: {test_dir}")
        sys.exit(1)

    out_dir.mkdir(parents=True, exist_ok=True)

    if args.onnx:
        onnx_path = Path(args.onnx)
        if not onnx_path.exists():
            print(f"[ERROR] ONNX file not found: {onnx_path}")
            sys.exit(1)
        run_onnx(onnx_path, test_dir, out_dir)
    else:
        ckpt_path = Path(args.ckpt)
        if not ckpt_path.exists():
            print(f"[ERROR] Checkpoint not found: {ckpt_path}")
            print("Tip: Download from the Google Drive link in README.md or use --onnx flag")
            sys.exit(1)
        run_pytorch(ckpt_path, test_dir, out_dir)


if __name__ == "__main__":
    main()
