"""
Inference with probability calibration for display (never flat 100%).
"""

from __future__ import annotations

from typing import Dict, Optional

import numpy as np

from labels import PROB_DISPLAY_CAP, TARGET_LABELS
from model_loader import get_model_info, load_model, run_inference
from preprocess import parse_metadata, preprocess_image_bytes, to_torch_batch


def calibrate_probabilities(probs: np.ndarray) -> np.ndarray:
    """
    Raw sigmoid probs → display-friendly scores.
    - Soft temperature (reduces overconfidence)
    - Hard cap below 100%
    """
    p = np.clip(probs.astype(np.float64), 1e-6, 1 - 1e-6)
    # Mild de-sharpening: pull extreme values toward 0.5
    temperature = 1.15
    logit = np.log(p / (1 - p))
    p = 1.0 / (1.0 + np.exp(-logit / temperature))
    return np.clip(p, 0.0, PROB_DISPLAY_CAP)


def predict_from_bytes(
    image_bytes: bytes,
    age: Optional[float] = None,
    sex: Optional[str] = None,
    projection: Optional[str] = None,
    year: Optional[float] = None,
    raw: bool = False,
) -> Dict[str, float]:
    meta = parse_metadata(age=age, sex=sex, projection=projection, year=year)
    image_chw = preprocess_image_bytes(image_bytes, use_clahe=False)
    image_t, meta_t = to_torch_batch(image_chw, meta)

    probs = run_inference(image_t, meta_t)
    if not raw:
        probs = calibrate_probabilities(probs)

    result = {
        TARGET_LABELS[i]: float(np.clip(probs[i], 0.0, 1.0))
        for i in range(min(len(TARGET_LABELS), len(probs)))
    }
    return dict(sorted(result.items(), key=lambda x: -x[1]))


IMAGE_SIZE = (224, 224)
