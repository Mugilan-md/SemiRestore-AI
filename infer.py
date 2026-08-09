"""
SemiRestoreNet (Restormer) — Standalone Evaluation Script
=========================================================
SEMICON India Hackathon 2026 | Problem: AI-Based Restoration of Degraded SEM Images
Sponsored by KLA Corporation & Applied Materials

USAGE (matches hackathon benchmark spec):
    python infer.py --test-dir /path/to/test/images --out-dir /path/to/output

Arguments:
    --test-dir   Path to directory containing degraded input images (.png / .tif / .jpg)
    --out-dir    Path to directory where restored images will be written
    --ckpt       (optional) Path to model checkpoint. Default: checkpoints/best_model.pth (or best.pt)
    --onnx       (optional) Use ONNX model instead of PyTorch. Default: checkpoints/semirestore.onnx
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
        import torch.nn.functional as F
        from model.network import Restormer
    except ImportError as e:
        print(f"[ERROR] Cannot import torch or model: {e}")
        print("Install with: pip install torch torchvision")
        sys.exit(1)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Using device: {device}")

    model = Restormer(inp_channels=1, out_channels=1).to(device)
    checkpoint = torch.load(str(ckpt_path), map_location=device)
    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        state = checkpoint["model_state_dict"]
    elif isinstance(checkpoint, dict) and "state_dict" in checkpoint:
        state = checkpoint["state_dict"]
    else:
        state = checkpoint

    model.load_state_dict(state)
    model.eval()
    print(f"[INFO] Loaded checkpoint: {ckpt_path}")

    images = sorted([p for p in test_dir.iterdir() if p.suffix.lower() in SUPPORTED_EXT])
    if not images:
        print(f"[ERROR] No images found in {test_dir}")
        sys.exit(1)

    print(f"[INFO] Found {len(images)} images. Running inference...")
    times = []
    with torch.no_grad():
        for img_path in images:
            arr = load_image_as_float(img_path)
            h, w = arr.shape
            tensor = torch.from_numpy(arr).unsqueeze(0).unsqueeze(0).to(device)

            # Pad to multiple of 8 for Restormer downsampling
            pad_h = (8 - h % 8) % 8
            pad_w = (8 - w % 8) % 8
            if pad_h > 0 or pad_w > 0:
                tensor = F.pad(tensor, (0, pad_w, 0, pad_h), mode="reflect")

            # Warmup
            _ = model(tensor)

            t0 = time.perf_counter()
            out = model(tensor)
            elapsed_ms = (time.perf_counter() - t0) * 1000

            if pad_h > 0 or pad_w > 0:
                out = out[:, :, :h, :w]

            out_arr = out.squeeze().cpu().numpy()
            out_path = out_dir / img_path.name
            save_float_image(out_arr, out_path)
            times.append(elapsed_ms)
            print(f"  [{elapsed_ms:6.1f} ms] {img_path.name} -> {out_path.name}")

    print(f"\n[RESULT] {len(images)} images restored -> {out_dir}")
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
        "--ckpt", default="checkpoints/best_model.pth",
        help="Path to PyTorch checkpoint (default: checkpoints/best_model.pth or checkpoints/best.pt)"
    )
    args = ap.parse_args()

    test_dir = Path(args.test_dir)
    out_dir = Path(args.out_dir)

    if not test_dir.exists():
        print(f"[ERROR] --test-dir does not exist: {test_dir}")
        sys.exit(1)

    out_dir.mkdir(parents=True, exist_ok=True)

    ckpt_path = Path(args.ckpt)
    if not ckpt_path.exists() and Path("checkpoints/best.pt").exists():
        ckpt_path = Path("checkpoints/best.pt")

    if not ckpt_path.exists():
        print(f"[ERROR] Checkpoint not found: {ckpt_path}")
        print("Tip: Download best_model.pth from Google Drive link in README.md")
        sys.exit(1)

    run_pytorch(ckpt_path, test_dir, out_dir)


if __name__ == "__main__":
    main()
