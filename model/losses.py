"""
Loss functions for SemiRestoreNet.

The problem statement explicitly penalizes two failure modes:
  1. Blurring the image to "cheat" denoising (destroys real detail).
  2. Introducing ringing / artificial patterns while sharpening.

So we combine three complementary losses instead of plain MSE (MSE alone
produces blurry outputs -- well documented in SR literature):

  - Charbonnier loss (robust L1): main reconstruction term, sharper than
    MSE and more stable than raw L1 near zero.
  - SSIM loss: optimizes for structural / perceptual similarity, which is
    what "matches the ground truth" really means for inspection images.
  - Sobel gradient loss: explicitly penalizes edge mismatch, which
    directly rewards sharp restoration and directly punishes ringing
    (ringing shows up as spurious high-gradient halos).
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class CharbonnierLoss(nn.Module):
    def __init__(self, eps: float = 1e-3):
        super().__init__()
        self.eps = eps

    def forward(self, pred, target):
        diff = pred - target
        return torch.mean(torch.sqrt(diff * diff + self.eps * self.eps))


def _gaussian_window(window_size: int, sigma: float, device):
    coords = torch.arange(window_size, dtype=torch.float32, device=device) - window_size // 2
    g = torch.exp(-(coords ** 2) / (2 * sigma ** 2))
    g = g / g.sum()
    window = g.outer(g)
    return window.unsqueeze(0).unsqueeze(0)


class SSIMLoss(nn.Module):
    def __init__(self, window_size: int = 11):
        super().__init__()
        self.window_size = window_size

    def forward(self, pred, target):
        device = pred.device
        window = _gaussian_window(self.window_size, 1.5, device)
        pad = self.window_size // 2

        mu_p = F.conv2d(pred, window, padding=pad)
        mu_t = F.conv2d(target, window, padding=pad)
        mu_p2, mu_t2, mu_pt = mu_p * mu_p, mu_t * mu_t, mu_p * mu_t

        sigma_p2 = F.conv2d(pred * pred, window, padding=pad) - mu_p2
        sigma_t2 = F.conv2d(target * target, window, padding=pad) - mu_t2
        sigma_pt = F.conv2d(pred * target, window, padding=pad) - mu_pt

        c1, c2 = 0.01 ** 2, 0.03 ** 2
        ssim_map = ((2 * mu_pt + c1) * (2 * sigma_pt + c2)) / (
            (mu_p2 + mu_t2 + c1) * (sigma_p2 + sigma_t2 + c2)
        )
        return 1 - ssim_map.mean()


class SobelGradientLoss(nn.Module):
    def __init__(self):
        super().__init__()
        kx = torch.tensor([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=torch.float32)
        ky = kx.t()
        self.register_buffer("kx", kx.view(1, 1, 3, 3))
        self.register_buffer("ky", ky.view(1, 1, 3, 3))

    def forward(self, pred, target):
        gx_p = F.conv2d(pred, self.kx, padding=1)
        gy_p = F.conv2d(pred, self.ky, padding=1)
        gx_t = F.conv2d(target, self.kx, padding=1)
        gy_t = F.conv2d(target, self.ky, padding=1)
        return F.l1_loss(gx_p, gx_t) + F.l1_loss(gy_p, gy_t)


class SemiRestoreLoss(nn.Module):
    def __init__(self, w_charb: float = 1.0, w_ssim: float = 0.3, w_edge: float = 0.2):
        super().__init__()
        self.charb = CharbonnierLoss()
        self.ssim = SSIMLoss()
        self.edge = SobelGradientLoss()
        self.w_charb, self.w_ssim, self.w_edge = w_charb, w_ssim, w_edge

    def forward(self, pred, target):
        l_charb = self.charb(pred, target)
        l_ssim = self.ssim(pred, target)
        l_edge = self.edge(pred, target)
        total = self.w_charb * l_charb + self.w_ssim * l_ssim + self.w_edge * l_edge
        return total, {
            "charbonnier": l_charb.item(),
            "ssim_loss": l_ssim.item(),
            "edge": l_edge.item(),
        }
