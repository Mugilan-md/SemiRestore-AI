"""
SemiRestoreNet (Restormer) — Standalone Evaluation Script
=========================================================
SEMICON India Hackathon 2026 | Problem: AI-Based Restoration of Degraded SEM Images
Sponsored by KLA Corporation & Applied Materials

USAGE (matches hackathon benchmark spec):
    # PyTorch inference:
    python infer.py --test-dir /path/to/test/images --out-dir /path/to/output

    # ONNX inference (alternative runtime):
    python infer.py --onnx checkpoints/semirestore.onnx --test-dir /path/to/test/images --out-dir /path/to/output

Arguments:
    --test-dir   Path to directory containing degraded input images (.png / .tif / .jpg) OR a single image
    --image      (optional) Path to a single input image
    --out-dir    Path to directory where restored images will be written
    --ckpt       (optional) Path to PyTorch model checkpoint. Default: checkpoints/best.pt (or best_model.pth)
    --onnx       (optional) Path to ONNX model. Default: checkpoints/semirestore.onnx
"""

from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

# ── resolve project root so imports work from any working directory ─────────
ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

SUPPORTED_EXT = {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp"}


def _ensure_dependencies():
    """Ensure required core libraries are installed before running inference."""
    missing = []
    try:
        # pyrefly: ignore [missing-import]
        import numpy as np  # noqa: F401
    except ImportError:
        missing.append("numpy")

    try:
        # pyrefly: ignore [missing-import]
        from PIL import Image  # noqa: F401
    except ImportError:
        missing.append("pillow")

    if missing:
        print(f"[ERROR] Missing required Python packages: {', '.join(missing)}")
        print(f"Please install dependencies with: pip install {' '.join(missing)}")
        sys.exit(1)


def load_image_as_float(path: Path) -> Any:
    """Load any image as a float32 numpy array in [0, 1], grayscale."""
    # pyrefly: ignore [missing-import]
    import numpy as np
    from PIL import Image

    with Image.open(path) as img:
        if img.mode in ("I;16", "I;16B", "I;16L", "I;16S", "I"):
            arr = np.asarray(img, dtype=np.float32)
            max_val = float(arr.max()) if arr.size > 0 else 1.0
            if max_val > 255.0:
                return arr / 65535.0
            elif max_val > 1.0:
                return arr / 255.0
            return arr
        elif img.mode == "F":
            arr = np.asarray(img, dtype=np.float32)
            max_val = float(arr.max()) if arr.size > 0 else 1.0
            if max_val > 1.0:
                return arr / 255.0
            return arr
        else:
            img_gray = img.convert("L")
            return np.asarray(img_gray, dtype=np.float32) / 255.0


def save_float_image(arr: Any, path: Path) -> None:
    """Save a float32 [0,1] numpy array as a grayscale PNG."""
    # pyrefly: ignore [missing-import]
    import numpy as np
    from PIL import Image

    path.parent.mkdir(parents=True, exist_ok=True)
    # Ensure 2D (H, W) array
    arr_2d = np.squeeze(arr)
    if arr_2d.ndim != 2:
        raise ValueError(f"Expected 2D array for grayscale image, got shape {arr.shape}")

    out = np.clip(np.round(arr_2d * 255.0), 0, 255).astype(np.uint8)
    Image.fromarray(out, mode="L").save(str(path))


def collect_images(input_path: Path) -> List[Path]:
    """Collect image paths whether given a directory or single file."""
    if input_path.is_file():
        if input_path.suffix.lower() in SUPPORTED_EXT:
            return [input_path]
        else:
            print(f"[ERROR] Unsupported file format: {input_path}")
            sys.exit(1)
    elif input_path.is_dir():
        images = sorted([p for p in input_path.iterdir() if p.is_file() and p.suffix.lower() in SUPPORTED_EXT])
        if not images:
            # Also check subdirectories recursively if root dir contains nested subfolders
            images = sorted([p for p in input_path.rglob("*") if p.is_file() and p.suffix.lower() in SUPPORTED_EXT])
        return images
    else:
        print(f"[ERROR] Input path does not exist: {input_path}")
        sys.exit(1)


# ── PyTorch inference ────────────────────────────────────────────────────────
def run_pytorch(ckpt_path: Path, image_paths: List[Path], out_dir: Path):
    _ensure_dependencies()
    # pyrefly: ignore [missing-import]
    import numpy as np

    try:
        # pyrefly: ignore [missing-import]
        import torch
        import torch.nn.functional as F
        from model.network import Restormer, SemiRestoreNet  # noqa: F401
    except ImportError as e:
        print(f"[ERROR] Cannot import PyTorch or model package: {e}")
        print("Install with: pip install torch torchvision")
        sys.exit(1)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Using PyTorch on device: {device}")

    model = Restormer(inp_channels=1, out_channels=1).to(device)

    try:
        checkpoint = torch.load(str(ckpt_path), map_location=device, weights_only=False)
    except Exception:
        checkpoint = torch.load(str(ckpt_path), map_location=device)

    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        state = checkpoint["model_state_dict"]
    elif isinstance(checkpoint, dict) and "state_dict" in checkpoint:
        state = checkpoint["state_dict"]
    else:
        state = checkpoint

    # Clean DDP / DataParallel / torch.compile prefixes if present
    cleaned_state: Dict[str, Any] = {}
    for k, v in state.items():
        key = str(k)
        if key.startswith("module."):
            key = key[7:]
        if key.startswith("_orig_mod."):
            key = key[10:]
        cleaned_state[key] = v

    model.load_state_dict(cleaned_state)
    model.eval()
    print(f"[INFO] Loaded PyTorch checkpoint: {ckpt_path}")
    print(f"[INFO] Found {len(image_paths)} images. Running inference...")

    # Warmup model once before timing loop
    with torch.no_grad():
        dummy = torch.zeros((1, 1, 64, 64), dtype=torch.float32, device=device)
        _ = model(dummy)
        if device.type == "cuda":
            torch.cuda.synchronize()

    times: List[float] = []
    with torch.no_grad():
        for img_path in image_paths:
            arr = load_image_as_float(img_path)
            h, w = arr.shape
            tensor = torch.from_numpy(arr).unsqueeze(0).unsqueeze(0).to(device)

            # Pad to multiple of 8 for Restormer hierarchical downsampling
            pad_h = (8 - h % 8) % 8
            pad_w = (8 - w % 8) % 8
            if pad_h > 0 or pad_w > 0:
                tensor = F.pad(tensor, (0, pad_w, 0, pad_h), mode="reflect")

            if device.type == "cuda":
                torch.cuda.synchronize()
            t0 = time.perf_counter()
            out = model(tensor)
            if device.type == "cuda":
                torch.cuda.synchronize()
            elapsed_ms = (time.perf_counter() - t0) * 1000

            if pad_h > 0 or pad_w > 0:
                out = out[:, :, :h, :w]

            out_arr = out[0, 0].cpu().numpy()
            out_path = out_dir / img_path.name
            save_float_image(out_arr, out_path)
            times.append(elapsed_ms)
            print(f"  [{elapsed_ms:6.1f} ms] {img_path.name} -> {out_path.name}")

    avg_time = sum(times) / max(len(times), 1)
    print(f"\n[RESULT] {len(image_paths)} images restored -> {out_dir}")
    print(f"[RESULT] Avg inference time: {avg_time:.1f} ms/image")


# ── ONNX inference ───────────────────────────────────────────────────────────
def run_onnx(onnx_path: Path, image_paths: List[Path], out_dir: Path):
    _ensure_dependencies()
    # pyrefly: ignore [missing-import]
    import numpy as np

    try:
        # pyrefly: ignore [missing-import]
        import onnxruntime as ort
    except ImportError as e:
        print(f"[ERROR] Cannot import onnxruntime: {e}")
        print("Install with: pip install onnxruntime (or onnxruntime-gpu)")
        sys.exit(1)

    available_providers = ort.get_available_providers()
    providers = ["CUDAExecutionProvider", "CPUExecutionProvider"] if "CUDAExecutionProvider" in available_providers else ["CPUExecutionProvider"]

    session = ort.InferenceSession(str(onnx_path), providers=providers)
    active_provider = session.get_providers()[0]
    print(f"[INFO] Using ONNX Runtime provider: {active_provider}")
    print(f"[INFO] Loaded ONNX model: {onnx_path}")
    print(f"[INFO] Found {len(image_paths)} images. Running inference...")

    input_name = session.get_inputs()[0].name
    output_name = session.get_outputs()[0].name

    # Warmup once
    dummy = np.zeros((1, 1, 64, 64), dtype=np.float32)
    _ = session.run([output_name], {input_name: dummy})

    times: List[float] = []
    for img_path in image_paths:
        arr = load_image_as_float(img_path)
        tensor = arr[np.newaxis, np.newaxis, :, :]  # Shape: (1, 1, H, W)

        t0 = time.perf_counter()
        out = session.run([output_name], {input_name: tensor})[0]
        elapsed_ms = (time.perf_counter() - t0) * 1000

        out_arr = np.squeeze(out)
        out_path = out_dir / img_path.name
        save_float_image(out_arr, out_path)
        times.append(elapsed_ms)
        print(f"  [{elapsed_ms:6.1f} ms] {img_path.name} -> {out_path.name}")

    avg_time = sum(times) / max(len(times), 1)
    print(f"\n[RESULT] {len(image_paths)} images restored -> {out_dir}")
    print(f"[RESULT] Avg inference time: {avg_time:.1f} ms/image")


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(
        description="SemiRestoreNet — Standalone Evaluation Script for SEMICON India Hackathon 2026"
    )
    ap.add_argument(
        "--test-dir", default=None,
        help="Path to directory containing degraded test images (or single image)"
    )
    ap.add_argument(
        "--image", default=None,
        help="Path to a single degraded test image"
    )
    ap.add_argument(
        "--out-dir", required=True,
        help="Path to directory where restored images will be written"
    )
    ap.add_argument(
        "--ckpt", default=None,
        help="Path to PyTorch checkpoint (default: checkpoints/best.pt or checkpoints/best_model.pth)"
    )
    ap.add_argument(
        "--onnx", nargs="?", const="checkpoints/semirestore.onnx", default=None,
        help="Path to ONNX model to run with onnxruntime (default: checkpoints/semirestore.onnx)"
    )
    args = ap.parse_args()

    # Resolve input path
    raw_input = args.test_dir or args.image
    if not raw_input:
        print("[ERROR] Please provide either --test-dir <dir/image> or --image <file>")
        sys.exit(1)

    input_path = Path(raw_input)
    image_paths = collect_images(input_path)
    if not image_paths:
        print(f"[ERROR] No supported images found in: {input_path}")
        sys.exit(1)

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # ── ONNX Execution Path ──
    if args.onnx is not None:
        onnx_candidates = [
            Path(args.onnx),
            Path("checkpoints/semirestore.onnx"),
            Path("public/model/semirestore.onnx"),
            Path("semirestore.onnx"),
        ]
        onnx_path = next((p for p in onnx_candidates if p.exists() and p.is_file()), None)

        if not onnx_path:
            print(f"[ERROR] ONNX model not found. Checked: {args.onnx}")
            print("Tip: Export ONNX with: python scripts/export_and_infer.py export --ckpt checkpoints/best.pt --out checkpoints/semirestore.onnx")
            sys.exit(1)

        run_onnx(onnx_path, image_paths, out_dir)
        return

    # ── PyTorch Execution Path ──
    ckpt_candidates = []
    if args.ckpt:
        ckpt_candidates.append(Path(args.ckpt))
    ckpt_candidates.extend([
        Path("checkpoints/best.pt"),
        Path("checkpoints/best_model.pth"),
        Path("checkpoints/best_model.pt"),
        Path("checkpoints/best.pth"),
        Path("best.pt"),
        Path("best_model.pth"),
    ])

    ckpt_path = next((p for p in ckpt_candidates if p.exists() and p.is_file()), None)

    if not ckpt_path:
        print(f"[ERROR] PyTorch checkpoint not found.")
        print("Checked paths:")
        for c in ckpt_candidates[:4]:
            print(f"  - {c}")
        print("\nTip: Download 'best.pt' from the Google Drive / Colab link in README.md and place it in checkpoints/best.pt")
        print("Link: https://colab.research.google.com/drive/1B7xNmDLNU8NaZrXY1KEy3jNJZcaAOh19?usp=drive_link")
        sys.exit(1)

    run_pytorch(ckpt_path, image_paths, out_dir)


if __name__ == "__main__":
    main()
