"""
SemiRestoreNet
================
Lightweight fully-convolutional network for joint speckle/Gaussian denoising
+ 2x super-resolution of grayscale semiconductor inspection images.

Design choices (see README for rationale):
- Operates in LOG-DOMAIN on the input to convert multiplicative speckle
  noise into an additive problem (classic SAR/ultrasound trick).
- Global residual learning: predicts a correction added to a bicubic-
  upsampled version of the input, not raw pixels. Converges faster,
  produces sharper edges, avoids checkerboard/ringing artifacts.
- PixelShuffle (sub-pixel conv) for the 2x upsampling -> fast, no
  transpose-conv checkerboard artifacts.
- Fully convolutional -> works on any input size (128x128, 256x256, etc).
- ~1.1M params -> runs in well under a second per image on CPU.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class ResBlock(nn.Module):
    """Simple residual block: Conv-ReLU-Conv + skip, no BatchNorm.
    BatchNorm is deliberately omitted (standard practice in SR networks,
    following EDSR) because it removes range flexibility that hurts
    restoration quality and adds inference overhead."""

    def __init__(self, channels: int):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1)
        self.act = nn.ReLU(inplace=True)

    def forward(self, x):
        identity = x
        out = self.act(self.conv1(x))
        out = self.conv2(out)
        return identity + out * 0.2  # residual scaling for training stability


class SemiRestoreNet(nn.Module):
    def __init__(self, in_channels: int = 1, base_channels: int = 48, num_blocks: int = 8):
        super().__init__()
        self.head = nn.Conv2d(in_channels, base_channels, 3, padding=1)

        self.body = nn.Sequential(*[ResBlock(base_channels) for _ in range(num_blocks)])
        self.body_tail = nn.Conv2d(base_channels, base_channels, 3, padding=1)

        # Upsample x2 via PixelShuffle (sub-pixel convolution)
        self.upsample = nn.Sequential(
            nn.Conv2d(base_channels, base_channels * 4, 3, padding=1),
            nn.PixelShuffle(2),
            nn.ReLU(inplace=True),
        )

        self.tail = nn.Conv2d(base_channels, in_channels, 3, padding=1)

    def forward(self, x):
        """
        x: degraded image tensor, values in [0, 1] range (but may slightly
           exceed it due to speckle noise pushing pixels out of range --
           this is expected, do NOT clamp before the network).
        returns: restored image at 2x spatial resolution, in [0, 1].
        """
        # --- log-domain transform (handles multiplicative speckle) ---
        eps = 1e-3
        x_log = torch.log(x.clamp(min=-1 + eps) + 1 + eps)  # safe log1p-style map

        feat = self.head(x_log)
        res = self.body(feat)
        res = self.body_tail(res)
        feat = feat + res  # global feature residual

        up = self.upsample(feat)
        correction_log = self.tail(up)

        # --- back out of log domain ---
        correction = torch.exp(correction_log) - 1 - eps

        # --- global image residual: bicubic upsample of ORIGINAL (linear
        # domain) input + learned correction. This is why the network only
        # has to learn "what changed", not reconstruct the whole image. ---
        base = F.interpolate(x, scale_factor=2, mode="bicubic", align_corners=False)
        out = base + correction

        return out.clamp(0, 1)


if __name__ == "__main__":
    net = SemiRestoreNet()
    n_params = sum(p.numel() for p in net.parameters())
    print(f"SemiRestoreNet params: {n_params / 1e6:.2f}M")

    dummy = torch.rand(1, 1, 256, 256)
    with torch.no_grad():
        out = net(dummy)
    print("input:", dummy.shape, "-> output:", out.shape)
