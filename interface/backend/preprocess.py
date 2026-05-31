"""
Preprocessing aligned with densenet121-seuiltbadel.ipynb / apresentraain notebooks.
"""

from __future__ import annotations

import io
from typing import List, Optional

import cv2
import numpy as np
from PIL import Image

from labels import (
    DEFAULT_METADATA,
    IMAGENET_MEAN,
    IMAGENET_STD,
    IMAGE_SIZE,
    N_META_FEATURES,
)


def parse_metadata(
    age: Optional[float] = None,
    sex: Optional[str] = None,
    projection: Optional[str] = None,
    year: Optional[float] = None,
) -> List[float]:
    """6 features: age_norm, sex_M, sex_F, proj_PA, proj_AP, year_norm."""
    if age is None:
        age_norm = DEFAULT_METADATA[0]
    else:
        age_norm = float(np.clip((age - 18) / (100 - 18), 0, 1))

    sex = (sex or "M").upper()
    if sex in ("M", "MALE"):
        sex_m, sex_f = 1.0, 0.0
    elif sex in ("F", "FEMALE"):
        sex_m, sex_f = 0.0, 1.0
    else:
        sex_m, sex_f = 0.5, 0.5

    proj = (projection or "PA").upper()
    proj_pa = 1.0 if proj == "PA" else 0.0
    proj_ap = 1.0 if proj == "AP" else 0.0

    if year is None:
        year_norm = DEFAULT_METADATA[5]
    else:
        year_norm = float(np.clip((year - 2009) / (2017 - 2009), 0, 1))

    return [age_norm, sex_m, sex_f, proj_pa, proj_ap, year_norm]


def _grayscale_to_rgb_chw(img_gray: np.ndarray, use_imagenet: bool = True) -> np.ndarray:
    """Grayscale HxW → normalized CHW (3, 224, 224)."""
    img = img_gray.astype(np.float32) / 255.0
    img = np.stack([img, img, img], axis=0)
    if use_imagenet:
        for c in range(3):
            img[c] = (img[c] - IMAGENET_MEAN[c]) / IMAGENET_STD[c]
    return img


def preprocess_image_bytes(
    image_bytes: bytes,
    size: int = IMAGE_SIZE,
    use_clahe: bool = False,
) -> np.ndarray:
    """
    Inference preprocessing (val_test_transform):
    grayscale → resize → optional CLAHE (GradCAM only) → ImageNet normalize.
    """
    arr = np.frombuffer(image_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_GRAYSCALE)
    if img is None:
        pil = Image.open(io.BytesIO(image_bytes)).convert("L")
        img = np.array(pil, dtype=np.uint8)

    if img.shape[0] != size or img.shape[1] != size:
        img = cv2.resize(img, (size, size), interpolation=cv2.INTER_AREA)

    if use_clahe:
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        img = clahe.apply(img)

    return _grayscale_to_rgb_chw(img, use_imagenet=True)


def preprocess_for_gradcam_display(image_bytes: bytes, size: int = IMAGE_SIZE) -> tuple:
    """Returns (tensor_chw, rgb_float_hwc for overlay) per apresentraain notebook."""
    arr = np.frombuffer(image_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_GRAYSCALE)
    if img is None:
        pil = Image.open(io.BytesIO(image_bytes)).convert("L")
        img = np.array(pil, dtype=np.uint8)
    img = cv2.resize(img, (size, size))
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    img = clahe.apply(img)
    rgb = np.stack([img, img, img], axis=-1).astype(np.float32) / 255.0
    chw = _grayscale_to_rgb_chw(img, use_imagenet=True)
    return chw, rgb


def to_torch_batch(image_chw: np.ndarray, meta: List[float]):
    import torch

    image = torch.from_numpy(image_chw).unsqueeze(0).float()
    metadata = torch.tensor([meta[:N_META_FEATURES]], dtype=torch.float32)
    if metadata.shape[1] < N_META_FEATURES:
        pad = DEFAULT_METADATA.copy()
        pad[: metadata.shape[1]] = meta
        metadata = torch.tensor([pad], dtype=torch.float32)
    return image, metadata
