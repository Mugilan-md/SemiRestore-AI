# SemiRestore AI — Model & Integration Plan

Restoration pipeline for the SEMICON India Hackathon 2026 problem statement
("AI-Based Restoration of Degraded Images for Semiconductor Inspection").

## Why this approach

The problem statement quietly tells you what separates a winning submission
from an average one:

- **"pixel values pushed beyond the true image range"** → this is
  multiplicative speckle noise, not additive. Treating it like Gaussian
  noise (plain L2/MSE loss) will systematically underperform. We convert
  it to an additive problem via a log-domain transform before the network
  sees it (`model/network.py`).
- **"Do not blur the image to remove noise"** + **"without introducing
  artificial patterns or ringing"** → plain MSE loss produces blur; naive
  GAN losses produce ringing/hallucinated texture. We use a combined
  Charbonnier + SSIM + Sobel-edge loss instead (`model/losses.py`), which
  rewards sharp, structurally faithful output without rewarding
  hallucinated high-frequency noise.
- **"Speed matters... benchmarked on inference time"** → we use a compact
  ~1.1M parameter fully-convolutional residual net with PixelShuffle
  upsampling, not a transformer or diffusion model. It also exports
  cleanly to ONNX for **browser-side inference** — see below.
- **"Test set includes out-of-distribution samples... model must
  generalize"** → aggressive crop/flip/rotate augmentation, no
  overfitting-prone components (no BatchNorm, moderate model capacity),
  and `scripts/evaluate.py` reports in-distribution vs OOD metrics separately so
  you can show judges you measured this deliberately.

## Pipeline Structure

```
model/
  network.py     SemiRestoreNet architecture (~1.1M params, log-domain transform, residual scaling)
  losses.py      Charbonnier + SSIM + Sobel-edge combined loss
scripts/
  dataset.py     Paired degraded/clean dataset loader + augmentation
  train.py       Training loop with PSNR validation + checkpointing
  evaluate.py    PSNR/SSIM reporting, split by in-dist vs OOD
  export_and_infer.py   Single-image inference + ONNX export
web/ & src/services/
  inference.ts / onnxInference.ts   Browser inference module for the frontend
```

## Setup & Training

```bash
pip install torch torchvision pillow numpy

# expected data layout (see scripts/dataset.py):
# data/train/degraded/*.png   data/train/clean/*.png
# data/val/degraded/*.png     data/val/clean/*.png
# data/test_in_distribution/... 
# data/test_ood/...

python scripts/train.py --data-root ./data --epochs 60 --batch-size 16
python scripts/evaluate.py --ckpt checkpoints/best.pt --data-root ./data --split test_in_distribution
python scripts/evaluate.py --ckpt checkpoints/best.pt --data-root ./data --split test_ood
```

## Browser ONNX Inference Setup

1. `python scripts/export_and_infer.py export --ckpt checkpoints/best.pt --out public/model/semirestore.onnx`
2. `npm install onnxruntime-web`
3. Call `restoreImage(imgElement)` from your upload/workspace handlers (`src/services/onnxInference.ts`).

## Hackathon Presentation Strategy

1. Side-by-side degraded/restored/ground-truth for one in-distribution and one OOD sample.
2. The PSNR/SSIM table from `evaluate.py`, split by in-dist vs OOD — reporting this split directly aligns with problem requirements.
3. The live browser inference timer (`inferenceMs` from `restoreImage`).
4. Explanation of the log-domain transform for multiplicative speckle noise reduction in sub-7nm photolithography metrology.
