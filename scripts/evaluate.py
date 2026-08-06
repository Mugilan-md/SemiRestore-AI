"""
Evaluate a trained checkpoint on a test set, reporting PSNR and SSIM
separately for in-distribution and out-of-distribution samples (as called
out explicitly in the problem statement's test data section).

Usage:
    python scripts/evaluate.py --ckpt checkpoints/best.pt --data-root ./data \
        --split test_in_distribution
    python scripts/evaluate.py --ckpt checkpoints/best.pt --data-root ./data \
        --split test_ood
"""

import argparse
import sys
import time
from pathlib import Path

import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader

sys.path.append(str(Path(__file__).resolve().parents[1]))
from model.network import SemiRestoreNet
from model.losses import SSIMLoss
from scripts.dataset import PairedRestorationDataset


def psnr(pred, target):
    mse = F.mse_loss(pred, target).item()
    if mse == 0:
        return 99.0
    return 10 * torch.log10(torch.tensor(1.0 / mse)).item()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ckpt", required=True)
    ap.add_argument("--data-root", default="./data")
    ap.add_argument("--split", default="test")
    args = ap.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = SemiRestoreNet().to(device)
    model.load_state_dict(torch.load(args.ckpt, map_location=device))
    model.eval()

    ssim_fn = SSIMLoss().to(device)
    ds = PairedRestorationDataset(args.data_root, args.split, augment=False)
    loader = DataLoader(ds, batch_size=1, shuffle=False, num_workers=2)

    total_psnr, total_ssim, total_ms, n = 0.0, 0.0, 0.0, 0
    with torch.no_grad():
        for degraded, clean in loader:
            degraded, clean = degraded.to(device), clean.to(device)
            t0 = time.time()
            pred = model(degraded)
            total_ms += (time.time() - t0) * 1000
            total_psnr += psnr(pred, clean)
            total_ssim += 1 - ssim_fn(pred, clean).item()
            n += 1

    print(f"[{args.split}] n={n}")
    print(f"  PSNR: {total_psnr/n:.2f} dB")
    print(f"  SSIM: {total_ssim/n:.4f}")
    print(f"  Avg inference time: {total_ms/n:.1f} ms/image")


if __name__ == "__main__":
    main()
