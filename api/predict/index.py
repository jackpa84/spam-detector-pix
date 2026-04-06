"""
Vercel Python Serverless Function - Spam Detector PIX
Endpoint: POST /api/predict
"""

import json
import joblib
import os

# Carregar modelo (cached globalmente entre invocações)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "spam_model.pkl")
_model = None


def get_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


def handler(request):
    if request.method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    if request.method != "POST":
        return {
            "statusCode": 405,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            "body": json.dumps({"error": "Method not allowed"}),
        }

    try:
        body = json.loads(request.body or "{}")
        message = body.get("message", "").strip()

        if not message:
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
                "body": json.dumps({
                    "label": "INDEFINIDO",
                    "confidence": 0.0,
                    "is_spam": False,
                    "risk_level": "info",
                }),
            }

        model = get_model()
        pred = model.predict([message])[0]
        proba = model.predict_proba([message])[0]

        confidence = float(proba[1] if pred == 1 else proba[0])
        is_spam = bool(pred == 1)

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

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            "body": json.dumps({
                "label": label,
                "confidence": round(confidence, 4),
                "is_spam": is_spam,
                "risk_level": risk_level,
            }),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            "body": json.dumps({"error": str(e)}),
        }
