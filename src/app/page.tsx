"use client";

import { useState } from "react";
import ResultCard from "@/app/components/ResultCard";
import HistoryPanel from "@/app/components/HistoryPanel";

const isDev = process.env.NODE_ENV === "development";
const API_URL = isDev ? "http://localhost:8000" : "";

interface HistoryEntry {
  id: number;
  message: string;
  label: string;
  confidence: number;
  isSpam: boolean;
  riskLevel: string;
  timestamp: Date;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{
    label: string;
    confidence: number;
    isSpam: boolean;
    riskLevel: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const analyze = async () => {
    if (!message.trim()) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResult(data);

      setHistory((prev) => [
        {
          id: Date.now(),
          message,
          label: data.label,
          confidence: data.confidence,
          isSpam: data.is_spam,
          riskLevel: data.risk_level,
          timestamp: new Date(),
        },
        ...prev.slice(0, 4),
      ]);
    } catch {
      setError("Erro ao conectar com o servidor. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Spam Detector PIX
            </h1>
          </div>
          <p className="text-gray-400 max-w-xl mx-auto">
            Analise mensagens de transferência com{" "}
            <span className="text-indigo-400 font-medium">Inteligência Artificial</span>.
            Detecte fraudes, golpes e mensagens suspeitas instantaneamente.
          </p>
        </header>

        {/* Input Card */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Digite a mensagem para análise
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Ex: "URGENTE! Sua conta sera bloqueada clique aqui para verificar"'
            className="w-full h-32 px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          />

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={analyze}
              disabled={loading || !message.trim()}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analisando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Analisar Mensagem
                </span>
              )}
            </button>
            <button
              onClick={() => setMessage("")}
              className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 rounded-xl transition"
            >
              Limpar
            </button>
          </div>

          {/* Quick Examples */}
          <div className="mt-6">
            <p className="text-xs text-gray-500 mb-2">Exemplos rápidos:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "URGENTE! Sua conta sera bloqueada clique aqui",
                "Transferencia de R$80 referente ao jantar",
                "Voce recebeu um PIX de R$5000 clique no link para sacar",
                "Oi te ligo mais tarde para combinar o almoco",
              ].map((ex) => (
                <button
                  key={ex}
                  onClick={() => setMessage(ex)}
                  className="text-xs px-3 py-1.5 bg-gray-800/60 hover:bg-gray-700 border border-gray-700/50 text-gray-400 rounded-full transition truncate max-w-[200px]"
                >
                  {ex.slice(0, 35)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        {result && <ResultCard result={result} message={message} />}

        {/* History */}
        {history.length > 0 && (
          <HistoryPanel history={history} onClear={clearHistory} />
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-xs">
          <p>
            Modelo: TF-IDF + Ensemble (Naive Bayes + Logistic Regression) | FastAPI + Next.js
          </p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} Spam Detector PIX — Projeto Open Source
          </p>
        </footer>
      </div>
    </div>
  );
}
