"""
API FastAPI para detecção de spam/fraude em mensagens PIX.
Endpoint: POST /predict
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib
import numpy as np
import os

app = FastAPI(title="Spam Detector PIX API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carregar modelo
MODEL_PATH = os.path.join(os.path.dirname(__file__), "spam_model.pkl")
model = joblib.load(MODEL_PATH)


class PredictRequest(BaseModel):
    message: str


class PredictResponse(BaseModel):
    label: str
    confidence: float
    is_spam: bool
    risk_level: str
    message: Optional[str] = None


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    text = req.message.strip()

    if not text:
        return PredictResponse(
            label="INDEFINIDO",
            confidence=0.0,
            is_spam=False,
            risk_level="info",
            message="Digite uma mensagem para analisar",
        )

    pred = model.predict([text])[0]
    proba = model.predict_proba([text])[0]

    confidence = float(proba[1] if pred == 1 else proba[0])
    is_spam = bool(pred == 1)

    # Determinar nível de risco
    if is_spam:
        if confidence >= 0.9:
            risk_level = "critical"
            label = "ALTO RISCO"
        elif confidence >= 0.7:
            risk_level = "warning"
            label = "SUSPEITO"
        else:
            risk_level = "caution"
            label = "POUCO SEGURO"
    else:
        if confidence >= 0.9:
            risk_level = "safe"
            label = "SEGURO"
        elif confidence >= 0.7:
            risk_level = "likely_safe"
            label = "PROVAVELMENTE SEGURO"
        else:
            risk_level = "uncertain"
            label = "INDEFINIDO"

    return PredictResponse(
        label=label,
        confidence=round(confidence, 4),
        is_spam=is_spam,
        risk_level=risk_level,
    )


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True}


@app.get("/info")
def info():
    return {
        "model": "TF-IDF + Ensemble (Naive Bayes + Logistic Regression)",
        "features": "TF-IDF com ngrams (1,2)",
        "version": "1.0.0",
    }
