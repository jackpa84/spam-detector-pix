import { NextResponse } from "next/server";

// Spam keywords and patterns (Portuguese PIX fraud indicators)
const SPAM_KEYWORDS = [
  "urgente", "bloqueada", "bloqueado", "clique aqui", "clique no link",
  "clique para", "confirmar", "confirme", "suspeita", "suspeito",
  "fraude", "clonado", "cancelado", "cancelada",
  "serasa", "protesto", "negativado", "irregular",
  "resgatar", "sacar agora", "receber agora", "gratis", "grátis",
  "exclusiva", "exclusivo", "promocao", "promoção", "limitada",
  "auxilio", "auxílio", "retido", "retenção", "pendente",
  "desbloquear", "liberar", "liberação", "liberacao",
  "seu cartao", "seu cartão", "ligue urgente", "ligue agora",
  "nao perca", "não perca", "perca tempo", "dados bancarios",
  "atualize seus dados", "atualizar", "regularize",
];

const HAM_KEYWORDS = [
  "obrigado", "obrigada", "combine", "combinado", "amanha",
  "almoco", "almoço", "jantar", "cinema", "festa", "faculdade",
  "aluguel", "boleto", "mercado", "restaurante",
  "reunião", "reuniao", "ferias", "férias", "presente",
  "ligo mais tarde", "te ligo",
];

const URL_PATTERN = /(https?:\/\/|clique aqui|clique no|link abaixo|link para)/i;
const EXCLAMATION_PATTERN = /(!|urgente|atencao|alerta|aviso)/i;
const PIX_VALUES = /r\$\s*\d+/i;
const PHONE_PATTERN = /\d{3}\.\d{3}\.\d{3}-\d{2}/;

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function analyzeMessage(message: string) {
  const text = normalizeText(message);
  let spamScore = 0;
  let hamScore = 0;

  // Check spam keywords
  for (const keyword of SPAM_KEYWORDS) {
    const normalized = normalizeText(keyword);
    if (text.includes(normalized)) spamScore += 2;
  }

  // Check ham keywords
  for (const keyword of HAM_KEYWORDS) {
    const normalized = normalizeText(keyword);
    if (text.includes(normalized)) hamScore += 2;
  }

  // Pattern-based scoring
  if (URL_PATTERN.test(text)) spamScore += 2;
  if (EXCLAMATION_PATTERN.test(text)) spamScore += 1;
  if (PIX_VALUES.test(text) && URL_PATTERN.test(text)) spamScore += 3;
  if (PHONE_PATTERN.test(text) && /urgente|ligue/i.test(text)) spamScore += 2;

  // Friendly patterns
  if (/^(oi|ola|hey|ei)\b/i.test(text)) hamScore += 2;
  if (/te ligo|ligo mais tarde|te aviso/i.test(text)) hamScore += 2;
  if (/referente|dividir|conta do/i.test(text)) hamScore += 2;

  // Calculate confidence
  const totalScore = spamScore + hamScore;
  let confidence: number;
  let isSpam: boolean;

  if (totalScore === 0) {
    confidence = 0.5;
    isSpam = false;
  } else {
    isSpam = spamScore > hamScore;
    confidence = Math.min(spamScore / (spamScore + hamScore) * 0.95 + 0.05, 0.98);
    confidence = Math.max(confidence, 0.55);
  }

  // Determine risk level
  let riskLevel: string;
  let label: string;

  if (isSpam) {
    if (confidence >= 0.9) { riskLevel = "critical"; label = "ALTO RISCO"; }
    else if (confidence >= 0.7) { riskLevel = "warning"; label = "SUSPEITO"; }
    else { riskLevel = "caution"; label = "POUCO SEGURO"; }
  } else {
    if (confidence >= 0.9) { riskLevel = "safe"; label = "SEGURO"; }
    else if (confidence >= 0.7) { riskLevel = "likely_safe"; label = "PROVAVELMENTE SEGURO"; }
    else { riskLevel = "uncertain"; label = "INDEFINIDO"; }
  }

  return {
    label,
    confidence: Math.round(confidence * 10000) / 10000,
    is_spam: isSpam,
    risk_level: riskLevel,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message?.trim() || "";

    if (!message) {
      return NextResponse.json({
        label: "INDEFINIDO",
        confidence: 0.0,
        is_spam: false,
        risk_level: "info",
      });
    }

    const result = analyzeMessage(message);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar mensagem" },
      { status: 500 }
    );
  }
}
