"""
Labels and constants — loaded from model_meta.json when present.
"""

from __future__ import annotations

import json
from pathlib import Path

BACKEND_DIR = Path(__file__).parent
META_PATH = BACKEND_DIR / "model_meta.json"

DEFAULT_TARGET_LABELS = [
    "normal",
    "copd signs",
    "cardiomegaly",
    "pleural effusion",
    "interstitial pattern",
    "alveolar pattern",
    "nodule",
    "atelectasis",
    "hilar enlargement",
    "pulmonary fibrosis",
    "tuberculosis sequelae",
    "rib fracture",
    "pneumothorax",
    "mediastinal mass",
]

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

IMAGE_SIZE = 224
N_META_FEATURES = 6

# [age_norm, sex_M, sex_F, proj_PA, proj_AP, year_norm] — training defaults
DEFAULT_METADATA = [0.524, 1.0, 0.0, 1.0, 0.0, 0.5]

# Never show 100% in UI — medical scores are uncertain
PROB_DISPLAY_CAP = 0.985


def load_meta() -> dict:
    if META_PATH.exists():
        with META_PATH.open(encoding="utf-8") as f:
            return json.load(f)
    return {}


_meta = load_meta()
TARGET_LABELS = _meta.get("target_diseases", DEFAULT_TARGET_LABELS)
N_META_FEATURES = int(_meta.get("n_meta", N_META_FEATURES))
VAL_METRICS = _meta.get("val_metrics", {})
BEST_AUC = float(_meta.get("best_auc", 0.0))
