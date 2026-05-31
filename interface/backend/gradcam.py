"""
Grad-CAM natif PyTorch (sans pytorch-grad-cam — compatible Python 3.13).
"""

from __future__ import annotations

import base64
import io
from typing import Optional

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

from labels import DEFAULT_METADATA, PROB_DISPLAY_CAP, TARGET_LABELS
from model_loader import _device, get_model_wrapper, load_model
from predict import predict_from_bytes
from preprocess import preprocess_for_gradcam_display, to_torch_batch

NUM_SAMPLES = 5


def compute_gradcam(
    image_bytes: bytes,
    target_class: Optional[int] = None,
    target_disease: Optional[str] = None,
) -> dict:
    load_model()
    cls_idx = _resolve_class_idx(target_class, target_disease, image_bytes)
    disease = TARGET_LABELS[cls_idx]

    try:
        return _gradcam_native(image_bytes, cls_idx, disease)
    except Exception as e:
        print(f"[gradcam] native failed: {e}")
        return _fallback_sample(cls_idx, disease, image_bytes)


def _resolve_class_idx(target_class, target_disease, image_bytes) -> int:
    if target_disease and target_disease in TARGET_LABELS:
        return TARGET_LABELS.index(target_disease)
    if target_class is not None:
        return int(target_class)
    preds = predict_from_bytes(image_bytes, raw=True)
    top = max(preds.items(), key=lambda x: x[1])
    return TARGET_LABELS.index(top[0])


def _gradcam_native(image_bytes: bytes, cls_idx: int, disease: str) -> dict:
    import torch
    import torch.nn.functional as F

    chw, rgb = preprocess_for_gradcam_display(image_bytes)
    image_t, meta_t = to_torch_batch(chw, DEFAULT_METADATA)
    image_t = image_t.to(_device)
    meta_t = meta_t.to(_device)

    wrapper = get_model_wrapper()
    model = wrapper.model
    target_layer = model.backbone.features.denseblock4.denselayer16.conv2

    activations = []
    gradients = []

    def fwd_hook(_module, _inp, out):
        activations.append(out)

    def bwd_hook(_module, _gin, gout):
        gradients.append(gout[0])

    h1 = target_layer.register_forward_hook(fwd_hook)
    h2 = target_layer.register_full_backward_hook(bwd_hook)

    model.zero_grad(set_to_none=True)
    wrapper.eval()
    image_t = image_t.requires_grad_(True)

    logits = wrapper(image_t)
    score = logits[0, cls_idx]
    score.backward()

    h1.remove()
    h2.remove()

    acts = activations[0][0].detach().cpu()
    grads = gradients[0][0].detach().cpu()
    weights = grads.mean(dim=(1, 2))
    cam = (weights[:, None, None] * acts).sum(dim=0).numpy()
    cam = np.maximum(cam, 0)
    cam = cv2.resize(cam, (rgb.shape[1], rgb.shape[0]))
    cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    overlay = np.clip(heatmap * 0.55 + rgb * 0.45, 0, 1)

    preds = predict_from_bytes(image_bytes)
    conf = float(preds.get(disease, 0))

    overlay_img = _annotate_gradcam(overlay, disease, conf)

    buf = io.BytesIO()
    Image.fromarray(overlay_img).save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    return {
        "heatmap": f"data:image/png;base64,{b64}",
        "status": "gradcam",
        "target_class": disease,
        "confidence": conf,
        "message": f"Grad-CAM — {disease}",
    }


def _annotate_gradcam(rgb_uint8: np.ndarray, disease: str, conf: float) -> np.ndarray:
    """Style notebook: titre Grad-CAM + Conf=XX%"""
    img = Image.fromarray((rgb_uint8 * 255).astype(np.uint8))
    draw = ImageDraw.Draw(img)
    pct = min(conf, PROB_DISPLAY_CAP) * 100
    label = f"Grad-CAM\nConf={pct:.2f}%"
    try:
        font = ImageFont.truetype("arial.ttf", 14)
    except OSError:
        font = ImageFont.load_default()
    tw, th = draw.multiline_textbbox((0, 0), label, font=font)[2:]
    x = (img.width - tw) // 2
    draw.rectangle([x - 4, 2, x + tw + 4, th + 8], fill=(255, 255, 255, 230))
    draw.multiline_text((x, 4), label, fill=(0, 0, 0), font=font, align="center")
    return np.array(img)


def _fallback_sample(cls_idx: int, disease: str, image_bytes: bytes) -> dict:
    """Une des 5 images Grad-CAM de référence (stable si génération échoue)."""
    sample_idx = (cls_idx % NUM_SAMPLES) + 1
    preds = predict_from_bytes(image_bytes)
    conf = preds.get(disease, 0)
    return {
        "heatmap": f"/gradcam/samples/sample_{sample_idx}.png",
        "status": "sample",
        "sample_index": sample_idx,
        "target_class": disease,
        "confidence": conf,
        "message": f"Grad-CAM illustratif — {disease}",
    }
