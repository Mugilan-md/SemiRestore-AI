"""
Two things in one file:

1. infer(): run a single image through the trained model, save the result,
   and print inference time (for the "speed matters" benchmark).
2. export_onnx(): export the trained checkpoint to ONNX with a dynamic
   input size, so the SAME model file can run:
     - server-side via onnxruntime (Python)
     - client-side in the browser via onnxruntime-web, directly in your
       existing React/Vite frontend, with zero backend hosting.

Usage:
    python scripts/export_and_infer.py infer --ckpt checkpoints/best.pt --image sample.png --out restored.png
    python scripts/export_and_infer.py export --ckpt checkpoints/best.pt --out public/model/semirestore.onnx
"""

import argparse
import sys
import time
from pathlib import Path

import numpy as np
import torch
from PIL import Image

sys.path.append(str(Path(__file__).resolve().parents[1]))
from model.network import SemiRestoreNet


def load_model(ckpt_path: str, device: str = "cpu") -> SemiRestoreNet:
    model = SemiRestoreNet()
    state = torch.load(ckpt_path, map_location=device)
    model.load_state_dict(state)
    model.eval()
    return model.to(device)


def infer(args):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = load_model(args.ckpt, device)

    img = Image.open(args.image).convert("L")
    arr = np.asarray(img, dtype=np.float32) / 255.0
    tensor = torch.from_numpy(arr).unsqueeze(0).unsqueeze(0).to(device)

    # warmup for accurate timing
    with torch.no_grad():
        model(tensor)

    t0 = time.time()
    with torch.no_grad():
        out = model(tensor)
    elapsed = time.time() - t0
    print(f"Inference time: {elapsed*1000:.1f} ms on {device}")

    out_arr = (out.squeeze().cpu().numpy() * 255.0).clip(0, 255).astype(np.uint8)
    Image.fromarray(out_arr).save(args.out)
    print(f"Saved restored image to {args.out}")


def export_onnx(args):
    model = load_model(args.ckpt, "cpu")
    dummy = torch.rand(1, 1, 256, 256)  # example shape; export allows dynamic H/W

    torch.onnx.export(
        model,
        dummy,
        args.out,
        input_names=["degraded_image"],
        output_names=["restored_image"],
        dynamic_axes={
            "degraded_image": {0: "batch", 2: "height", 3: "width"},
            "restored_image": {0: "batch", 2: "height", 3: "width"},
        },
        opset_version=17,
    )
    print(f"Exported ONNX model to {args.out}")
    print("This file can be loaded client-side with onnxruntime-web -- see web/inference.ts or src/services/onnxInference.ts")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_infer = sub.add_parser("infer")
    p_infer.add_argument("--ckpt", required=True)
    p_infer.add_argument("--image", required=True)
    p_infer.add_argument("--out", default="restored.png")
    p_infer.set_defaults(func=infer)

    p_export = sub.add_parser("export")
    p_export.add_argument("--ckpt", required=True)
    p_export.add_argument("--out", default="public/model/semirestore.onnx")
    p_export.set_defaults(func=export_onnx)

    args = ap.parse_args()
    args.func(args)
