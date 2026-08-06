# SemiRestore.AI — AI-Based Restoration of Degraded Images for Semiconductor Inspection

**SemiRestore.AI** is an end-to-end deep-learning image restoration platform designed for sub-7nm photolithography, EUV reticle mask metrology, and silicon wafer die inspection.

It features a **React 19 + Vite frontend application** paired with a **PyTorch neural network engine (`SemiRestoreNet`)** that handles multi-speckle noise reduction, 2x super-resolution, edge preservation, and real-time ONNX browser inference.

---

## 🏗 System Architecture

```
├── model/
│   ├── network.py           # SemiRestoreNet PyTorch architecture (~1.1M params, log-domain transform)
│   ├── losses.py            # Charbonnier + SSIM + Sobel Gradient combined loss
│   └── __init__.py          # Module exports
├── scripts/
│   ├── dataset.py           # Paired degraded/ground-truth loader + crop/flip/rotate augmentation
│   ├── train.py             # Training loop with PSNR validation + checkpointing
│   ├── evaluate.py          # Metrics evaluation (PSNR/SSIM) split by in-distribution vs OOD
│   └── export_and_infer.py  # Single-image PyTorch inference & ONNX model exporter
├── src/
│   ├── components/          # Dashboard, Inspection Workspace, Live Pipeline, Heatmap, Metrics, Settings
│   ├── services/            # Image processing engine & ONNX browser inference module
│   └── types/               # TypeScript interfaces for semiconductor wafer metrics
├── web/
│   └── inference.ts         # Client-side ONNX Runtime Web integration module
└── public/
    └── model/               # Location for exported ONNX model (`semirestore.onnx`)
```

---

## ⚡ Key AI Highlights & Engineering Rationale

1. **Log-Domain Transform (`model/network.py`)**: Converts multiplicative SEM detector speckle noise into an additive problem before feature extraction.
2. **Charbonnier + SSIM + Sobel Loss (`model/losses.py`)**: Eliminates reconstruction blur without introducing high-frequency ringing artifacts.
3. **Sub-pixel PixelShuffle Upsampling**: Achieves high-throughput 2x super-resolution without transpose-convolution checkerboard artifacts.
4. **ONNX Browser Inference (`src/services/onnxInference.ts`)**: Enables zero-latency, client-side inference using `onnxruntime-web`.

---

## 🛠 Quick Start

### 1. Web Application (Frontend)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### 2. PyTorch AI Model (Training & Export)

```bash
# Install Python requirements
pip install torch torchvision pillow numpy

# Train model on paired dataset
python scripts/train.py --data-root ./data --epochs 60 --batch-size 16

# Evaluate performance (In-Distribution & OOD)
python scripts/evaluate.py --ckpt checkpoints/best.pt --data-root ./data --split test_in_distribution
python scripts/evaluate.py --ckpt checkpoints/best.pt --data-root ./data --split test_ood

# Export model to ONNX format for browser inference
python scripts/export_and_infer.py export --ckpt checkpoints/best.pt --out public/model/semirestore.onnx
```

---

## 📄 Documentation
For detailed model benchmark results, evaluation methodology, and hackathon presentation tips, see [MODEL_README.md](file:///c:/Users/acer/OneDrive%20-%20ELCOT/PROJECTS/SEMICON/MODEL_README.md).
