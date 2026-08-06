"""
Paired dataset loader for KLA degraded/ground-truth image pairs.

Expects a directory layout like:
    data/
      train/
        degraded/   <-- noisy + downsampled images (e.g. 0001.png)
        clean/      <-- matching ground truth, same filename, 2x resolution

Handles:
 - both 512<-256 and 256<-128 pairs (fully agnostic, just needs a 2x ratio)
 - grayscale single-channel loading
 - random crop / flip / rotate augmentation (paired, so crops match)
 - NOT normalizing away the out-of-range speckle pixels -- the model
   expects the raw [0,1]-ish degraded range, including excursions above 1.
"""

import random
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from torch.utils.data import Dataset


class PairedRestorationDataset(Dataset):
    def __init__(self, root: str, split: str = "train", crop_size: int = 128, augment: bool = True):
        self.degraded_dir = Path(root) / split / "degraded"
        self.clean_dir = Path(root) / split / "clean"
        self.files = sorted(p.name for p in self.degraded_dir.glob("*.png"))
        if not self.files:
            self.files = sorted(p.name for p in self.degraded_dir.glob("*.tif"))
        self.crop_size = crop_size
        self.augment = augment and split == "train"

    def __len__(self):
        return len(self.files)

    def _load(self, path: Path) -> np.ndarray:
        img = Image.open(path).convert("L")  # single channel grayscale
        arr = np.asarray(img, dtype=np.float32) / 255.0
        return arr

    def __getitem__(self, idx):
        name = self.files[idx]
        degraded = self._load(self.degraded_dir / name)
        clean = self._load(self.clean_dir / name)

        assert clean.shape[0] == degraded.shape[0] * 2 and clean.shape[1] == degraded.shape[1] * 2, (
            f"Expected exact 2x resolution ratio, got degraded {degraded.shape} vs clean {clean.shape} "
            f"for {name}. Resize/crop your dataset pairs to a clean 2x ratio first."
        )

        if self.augment:
            h, w = degraded.shape
            cs = min(self.crop_size, h, w)
            top = random.randint(0, h - cs)
            left = random.randint(0, w - cs)
            degraded = degraded[top:top + cs, left:left + cs]
            clean = clean[top * 2:(top + cs) * 2, left * 2:(left + cs) * 2]

            if random.random() < 0.5:
                degraded, clean = np.fliplr(degraded).copy(), np.fliplr(clean).copy()
            if random.random() < 0.5:
                degraded, clean = np.flipud(degraded).copy(), np.flipud(clean).copy()
            k = random.randint(0, 3)
            if k:
                degraded, clean = np.rot90(degraded, k).copy(), np.rot90(clean, k).copy()

        degraded_t = torch.from_numpy(degraded).unsqueeze(0).float()
        clean_t = torch.from_numpy(clean).unsqueeze(0).float()
        return degraded_t, clean_t
