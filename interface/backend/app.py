"""
ChestVision AI — FastAPI backend for DenseNet121PadChest (PadChest).
"""

from typing import Dict, Optional

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predict import predict_from_bytes
from model_loader import get_model_info
from gradcam import compute_gradcam
from model_loader import load_model

app = FastAPI(
    title="ChestVision AI API",
    description="DenseNet121PadChest multi-label chest X-ray diagnosis (PadChest)",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictResponse(BaseModel):
    predictions: Dict[str, float]
    model: str = "DenseNet121PadChest"


class HealthResponse(BaseModel):
    status: str
    model: dict


@app.on_event("startup")
async def startup():
    try:
        load_model()
    except Exception as e:
        print(f"[startup] Model load deferred: {e}")


@app.get("/health", response_model=HealthResponse)
async def health():
    try:
        info = get_model_info()
        status = "ok" if info.get("model_loaded") else "no_model"
        return HealthResponse(status=status, model=info)
    except Exception as e:
        return HealthResponse(status="degraded", model={"error": str(e)})


@app.post("/predict", response_model=PredictResponse)
async def predict(
    file: UploadFile = File(...),
    age: Optional[float] = Form(None),
    sex: Optional[str] = Form(None),
    projection: Optional[str] = Form(None),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (PNG, JPG, etc.)")

    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        if len(contents) > 15 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 15MB)")

        predictions = predict_from_bytes(
            contents,
            age=age,
            sex=sex,
            projection=projection,
        )
        return PredictResponse(predictions=predictions)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/gradcam")
async def gradcam(
    file: UploadFile = File(...),
    target_disease: Optional[str] = Form(None),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        contents = await file.read()
        return compute_gradcam(contents, target_disease=target_disease)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    return {
        "service": "ChestVision AI",
        "model": "DenseNet121PadChest",
        "endpoints": ["/health", "/predict", "/gradcam"],
    }
