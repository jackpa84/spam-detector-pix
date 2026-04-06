# 🛡️ Spam Detector PIX — Classificador de Fraudes em Transações

[![Python](https://img.shields.io/badge/Python-3.12-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6-orange)](https://scikit-learn.org/)

Detector de spam e fraudes em mensagens de PIX usando **Machine Learning** com interface web moderna.

## 🚀 Como Rodar

### 1. Treinar o modelo (gera o arquivo `.pkl`)
```bash
pip install -r requirements.txt
python train_model.py
```

### 2. Subir com Docker Compose
```bash
docker compose up --build
```

### 3. Acessar
- **Frontend:** http://localhost:3000
- **API:** http://localhost:8000/docs (Swagger)

## 📁 Estrutura

```
spam-detector/
├── api/
│   ├── predict.py          # FastAPI app
│   ├── spam_model.pkl      # modelo treinado (gerado pelo train_model.py)
│   └── Dockerfile
├── src/app/                # Next.js frontend
│   ├── page.tsx            # Página principal
│   └── components/
│       ├── ResultCard.tsx   # Card de resultado
│       └── HistoryPanel.tsx # Histórico de análises
├── train_model.py          # Script para treinar o modelo
├── requirements.txt
├── docker-compose.yml
└── Dockerfile.dev
```

## 🧠 Modelo

- **Algoritmo:** Ensemble Voting Classifier (Naive Bayes + Logistic Regression)
- **Features:** TF-IDF com ngrams (1, 2)
- **Dataset:** Mensagens simuladas de fraudes PIX + mensagens legítimas

## 📡 API Endpoints

### POST /predict
```json
{ "message": "URGENTE! Sua conta sera bloqueada clique aqui" }
```
**Resposta:**
```json
{
  "label": "ALTO RISCO",
  "confidence": 0.9523,
  "is_spam": true,
  "risk_level": "critical"
}
```

### GET /health
```json
{ "status": "ok", "model_loaded": true }
```

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| ML | scikit-learn, TF-IDF, Naive Bayes, Logistic Regression |
| Backend | FastAPI, Uvicorn, Pydantic |
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Deploy | Docker, Docker Compose |

## 📸 Features

- ✅ Análise em tempo real com IA
- ✅ Níveis de risco: crítico, suspeito, pouco seguro, seguro
- ✅ Barra de confiança visual
- ✅ Histórico das últimas 5 análises
- ✅ Exemplos rápidos para teste
- ✅ Recomendações de segurança para mensagens suspeitas
- ✅ UI dark mode moderna com gradientes

## 📝 License

MIT
