"""
Train SemiRestoreNet.

Usage:
    python scripts/train.py --data-root ./data --epochs 60 --batch-size 16

Tracks PSNR/SSIM on a held-out validation split each epoch and saves the
best checkpoint. Uses AMP (mixed precision) for faster training.
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
from model.losses import SemiRestoreLoss
from scripts.dataset import PairedRestorationDataset


def psnr(pred, target):
    mse = F.mse_loss(pred, target).item()
    if mse == 0:
        return 99.0
    return 10 * torch.log10(torch.tensor(1.0 / mse)).item()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data-root", default="./data")
    ap.add_argument("--epochs", type=int, default=60)
    ap.add_argument("--batch-size", type=int, default=16)
    ap.add_argument("--lr", type=float, default=2e-4)
    ap.add_argument("--crop-size", type=int, default=128)
    ap.add_argument("--out", default="./checkpoints")
    args = ap.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    Path(args.out).mkdir(parents=True, exist_ok=True)

    train_ds = PairedRestorationDataset(args.data_root, "train", args.crop_size, augment=True)
    val_ds = PairedRestorationDataset(args.data_root, "val", args.crop_size, augment=False)
    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True,
                               num_workers=4, pin_memory=True, drop_last=True)
    val_loader = DataLoader(val_ds, batch_size=1, shuffle=False, num_workers=2)

    model = SemiRestoreNet().to(device)
    criterion = SemiRestoreLoss().to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-5)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)
    scaler = torch.cuda.amp.GradScaler(enabled=(device.type == "cuda"))

    best_psnr = 0.0
    for epoch in range(1, args.epochs + 1):
        model.train()
        t0 = time.time()
        running_loss = 0.0
        for degraded, clean in train_loader:
            degraded, clean = degraded.to(device), clean.to(device)
            optimizer.zero_grad()
            with torch.cuda.amp.autocast(enabled=(device.type == "cuda")):
                pred = model(degraded)
                loss, parts = criterion(pred, clean)
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            running_loss += loss.item()
        scheduler.step()

        model.eval()
        val_psnr = 0.0
        with torch.no_grad():
            for degraded, clean in val_loader:
                degraded, clean = degraded.to(device), clean.to(device)
                pred = model(degraded)
                val_psnr += psnr(pred, clean)
        val_psnr /= max(len(val_loader), 1)

        dt = time.time() - t0
        print(f"epoch {epoch:03d}/{args.epochs} | train_loss {running_loss/len(train_loader):.4f} "
              f"| val_psnr {val_psnr:.2f} dB | {dt:.1f}s")

        if val_psnr > best_psnr:
            best_psnr = val_psnr
            torch.save(model.state_dict(), Path(args.out) / "best.pt")
            print(f"  -> new best checkpoint saved ({best_psnr:.2f} dB)")

        torch.save(model.state_dict(), Path(args.out) / "last.pt")

    print(f"Training done. Best val PSNR: {best_psnr:.2f} dB")


if __name__ == "__main__":
    main()
