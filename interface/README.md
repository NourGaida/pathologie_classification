# ChestVision AI — Chest X-Ray Diagnosis Platform

AI medical dashboard for **DenseNet121PadChest** multi-label chest X-ray diagnosis (trained on PadChest). React frontend + FastAPI + **PyTorch** backend.

![Stack](https://img.shields.io/badge/React-Vite-61DAFB)
![Stack](https://img.shields.io/badge/FastAPI-009688)
![Stack](https://img.shields.io/badge/PyTorch-EE4C2C)

## Your model architecture

```
DenseNet121PadChest
├── backbone (timm densenet121, global_pool=avg)
├── meta_branch (Linear 5→64→32)   # age, sex_M, sex_F, proj_PA, proj_AP
└── classifier (concat → 512 → 14 logits)
```

Inference: `logits = model(image, metadata)` then **sigmoid** for probabilities.

## Features

- 6 dashboard pages with glassmorphism UI
- Drag-and-drop X-ray upload + PadChest preprocessing (CLAHE, mean/std)
- 14 pathology classes (same order as training notebook)
- Optional patient metadata (age, sex, projection)
- GradCAM (eager `.pth`) or placeholder overlay (TorchScript)

## Project structure

```
interface/
├── frontend/
├── backend/
│   ├── app.py
│   ├── model_loader.py      # Loads model.pt or .pth
│   ├── model_arch.py        # DenseNet121PadChest (for .pth)
│   ├── preprocess.py        # PadChest pipeline
│   ├── labels.py            # TARGET_LABELS order
│   ├── predict.py
│   ├── gradcam.py
│   ├── export_model.py        # .pth → model.pt
│   └── model.pt               # ← place your TorchScript here
└── README.md
```

## Quick start

### 1. Add your trained model

**Option A — TorchScript (recommended, matches your `RecursiveScriptModule`):**

Copy your scripted file to:

```
backend/model.pt
```

**Option B — PyTorch checkpoint:**

```bash
cd backend
python export_model.py path/to/best_model.pth --output model.pt
```

Or place `best_model.pth` directly in `backend/` (auto-detected).

### 2. Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Use **Python 3.10 or 3.11** for best PyTorch support.

### 3. Frontend

```powershell
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:8000/docs  

## API

### `POST /predict`

| Field | Type | Description |
|-------|------|-------------|
| `file` | image | Chest X-ray (required) |
| `age` | float | Optional, normalized like training |
| `sex` | string | `M` / `F` |
| `projection` | string | `PA` / `AP` |

**Response:**

```json
{
  "predictions": {
    "cardiomegaly": 0.91,
    "pleural effusion": 0.52
  },
  "model": "DenseNet121PadChest"
}
```

### `GET /health`

Returns model path, labels, device, and whether weights are loaded.

## Disease classes (output order)

| # | Label |
|---|--------|
| 0 | normal |
| 1 | pneumonia |
| 2 | nodule |
| 3 | pleural effusion |
| 4 | cardiomegaly |
| 5 | pneumothorax |
| 6 | pulmonary fibrosis |
| 7 | consolidation |
| 8 | atelectasis |
| 9 | ground glass pattern |
| 10 | emphysema |
| 11 | interstitial pattern |
| 12 | bronchiectasis |
| 13 | mass |

This order **must** match `MultiLabelBinarizer(classes=TARGET_LABELS)` in `version1-finale.ipynb`.

## Metadata defaults

If age/sex/projection are not sent, the API uses training-style defaults: ~61y, male, PA — same as `PadChestDataset` fillna.

## Disclaimer

Research and demonstration only — not a certified medical device.

## License

MIT
