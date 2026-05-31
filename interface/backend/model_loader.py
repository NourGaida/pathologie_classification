"""
Load best_densenet121.pt checkpoint + model_meta.json
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Optional

import numpy as np

from labels import (
    BEST_AUC,
    META_PATH,
    N_META_FEATURES,
    TARGET_LABELS,
    VAL_METRICS,
    load_meta,
)

BACKEND_DIR = Path(__file__).parent

MODEL_CANDIDATES = [
    os.environ.get("MODEL_PATH"),
    str(BACKEND_DIR / "model.pt"),
    str(BACKEND_DIR / "best_densenet121.pt"),
]

_model: Any = None
_model_path: Optional[Path] = None
_device = "cpu"
_fixed_meta: Optional["torch.Tensor"] = None


def _get_torch():
    import torch
    return torch


def resolve_model_path() -> Optional[Path]:
    for p in MODEL_CANDIDATES:
        if p and Path(p).exists():
            return Path(p)
    return None


def _load_state_dict(path: Path):
    torch = _get_torch()
    from model_arch import DenseNet121PadChest

    meta = load_meta()
    n_classes = int(meta.get("n_classes", len(TARGET_LABELS)))
    n_meta = int(meta.get("n_meta", N_META_FEATURES))

    raw = torch.load(str(path), map_location=_device, weights_only=False)
    if isinstance(raw, dict) and "model_state_dict" in raw:
        state = raw["model_state_dict"]
    elif isinstance(raw, dict):
        state = raw
    else:
        raise ValueError("Unknown checkpoint format")

    model = DenseNet121PadChest(n_classes=n_classes, n_meta=n_meta, pretrained=False)
    model.load_state_dict(state, strict=True)
    model.to(_device)
    model.eval()
    return model


def get_fixed_metadata() -> "torch.Tensor":
    """Mean metadata vector (batch 1, 6) for GradCAM wrapper."""
    global _fixed_meta
    load_model()
    torch = _get_torch()
    if _fixed_meta is None:
        from labels import DEFAULT_METADATA
        _fixed_meta = torch.tensor([DEFAULT_METADATA], dtype=torch.float32, device=_device)
    return _fixed_meta


def _make_wrapper_class():
    torch = _get_torch()

    class ModelWrapperXAI(torch.nn.Module):
        """Same as apresentraain notebook — image only, fixed meta."""

        def __init__(self, model, fixed_meta):
            super().__init__()
            self.model = model
            self.fixed_meta = fixed_meta

        def forward(self, x):
            meta = self.fixed_meta.expand(x.size(0), -1)
            return self.model(x, meta)

    return ModelWrapperXAI


def load_model(force: bool = False):
    global _model, _model_path, _device

    if _model is not None and not force:
        return _model

    torch = _get_torch()
    _device = "cuda" if torch.cuda.is_available() else "cpu"
    path = resolve_model_path()

    if path is None:
        _model = None
        _model_path = None
        print("[model_loader] No model.pt found")
        return None

    _model_path = path
    try:
        _model = torch.jit.load(str(path), map_location=_device)
        _model.eval()
        print(f"[model_loader] TorchScript: {path}")
    except Exception:
        _model = _load_state_dict(path)
        print(f"[model_loader] Checkpoint: {path} | AUC={BEST_AUC:.4f}")

    return _model


def run_inference(image_tensor, meta_tensor) -> np.ndarray:
    torch = _get_torch()
    load_model()
    if _model is None:
        raise RuntimeError("Model not loaded")

    image_tensor = image_tensor.to(_device)
    meta_tensor = meta_tensor.to(_device)

    with torch.no_grad():
        logits = _model(image_tensor, meta_tensor)
        if not torch.is_tensor(logits):
            logits = logits[0] if isinstance(logits, (list, tuple)) else logits
        probs = torch.sigmoid(logits).cpu().numpy().squeeze()

    return np.atleast_1d(probs)


def get_model_wrapper():
    """Eager model + fixed meta for GradCAM."""
    load_model()
    if _model is None:
        raise RuntimeError("Model not loaded")
    torch = _get_torch()
    Wrapper = _make_wrapper_class()
    return Wrapper(_model, get_fixed_metadata()).to(_device).eval()


def get_target_layers():
    load_model()
    return [_model.backbone.features.denseblock4.denselayer16.conv2]


def get_model_info() -> dict:
    meta = load_meta()
    load_model()
    return {
        "architecture": "DenseNet121PadChest",
        "framework": "pytorch",
        "model_loaded": _model is not None,
        "model_path": str(_model_path) if _model_path else None,
        "device": _device,
        "num_classes": len(TARGET_LABELS),
        "labels": TARGET_LABELS,
        "n_meta_features": N_META_FEATURES,
        "best_auc": BEST_AUC,
        "val_metrics": VAL_METRICS,
        "input_size": [3, 224, 224],
        "normalization": "imagenet",
        "meta_path": str(META_PATH) if META_PATH.exists() else None,
    }
