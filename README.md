#  PadChest224 — Multi-Model Chest X-Ray Classification + XAI
## Automatic detection of 14 chest pathologies from X-ray images using DenseNet121, ResNet50 and EfficientNet-B4 — with full Explainability (Grad-CAM · EigenCAM )
### Overview
This project implements a complete, production-grade multi-label classification pipeline on the PadChest dataset (160K chest X-rays). Three CNN backbones are trained, evaluated and explained side by side, with every best practice for medical imaging baked in from the start.
| Feature | Details |
|---|---|
| Dataset | PadChest 224 (images resized to 224×224) |
| Task | Multi-label classification · 14 pathology classes |
| Models | DenseNet121 · ResNet50 · EfficientNet-B4 |
| Preprocessing | CLAHE contrast enhancement |
| Augmentation | Rotation · Affine · ColorJitter · GaussianBlur · Mixup |
| Training | Mixed Precision AMP · Warmup LR · CosineAnnealing · Early Stopping |
| Test-Time Aug | TTA (n=2 augmented passes) |
| Thresholds | Per-class F1-optimal thresholds on the val set |
| XAI | Grad-CAM · EigenCAM · SHAP · Aggregated heatmaps |
| KPIs | AUC-ROC · mAP · F1 · Hamming Loss · Exact Match · Sensitivity · Specificity |
### Dataset
The PadChest dataset contains over 160,000 chest X-ray images from Hospital San Juan de Alicante (Spain, 2009–2017), annotated with 174 different findings.
This pipeline focuses on 14 clinically relevant pathologies:
normal · copd signs · cardiomegaly · pleural effusion · interstitial pattern
alveolar pattern · nodule · atelectasis · hilar enlargement · pulmonary fibrosis
tuberculosis sequelae · rib fracture · pneumothorax · mediastinal mass
### Data Preparation Steps
| Step | Details |
|---|---|
| **"Unchanged" label resolution** | Longitudinal propagation of last known diagnosis |
| **Filtering** | PA/AP projections only · Adults (18–100 y.o.) · No pediatric cases |
| **Patient-level split** | 70% / 15% / 15% (train / val / test) — no data leakage |
| **Multi-label binarization** | Using `MultiLabelBinarizer` on the 14 target classes |
### EDA Visualizations
<img width="1198" height="333" alt="Screenshot 2026-05-24 144537" src="https://github.com/user-attachments/assets/d657fc6c-47d4-430a-85d2-f3603b102a0a" />

<img width="814" height="682" alt="Screenshot 2026-05-24 144557" src="https://github.com/user-attachments/assets/548f7072-b0cf-487f-b8cf-c3708566e678" />
Distribution of the 14 pathologies and their co-occurrence matrix

### Architecture
Each model follows the same pattern: a pretrained CNN backbone + a metadata branch (age, sex, projection, year) that are concatenated before the final classifier.
Input Image (224×224×3)          Metadata (6 features)
        │                                 │
  CNN Backbone                    Linear(6→64)
  (timm pretrained)               BatchNorm · ReLU
  global avg pool                 Dropout(0.3)
        │                         Linear(64→32)
        │                                │
        └──────────── cat ───────────────┘
                       │
              Dropout + Linear
              BatchNorm + ReLU
              Dropout + Linear
                       │
              14-class logits
| Model | Backbone Feat Dim | Params |
|---|---|---|
| **DenseNet121** | 1024 | ~8M |
| **ResNet50** | 2048 | ~25M |
| **EfficientNet-B4** | 1792 | ~19M |
#### interface
<img width="1502" height="748" alt="Screenshot 2026-05-31 173232" src="https://github.com/user-attachments/assets/6fb7cab4-8b6e-4029-bf51-a01fcb043306" />
<img width="1519" height="849" alt="Screenshot 2026-05-31 173204" src="https://github.com/user-attachments/assets/02e315bf-d8d1-42bb-8420-f373059f4cf1" />

