interface ResultProps {
  result: {
    label: string;
    confidence: number;
    isSpam: boolean;
    riskLevel: string;
  };
  message: string;
}

const riskConfig: Record<string, { bg: string; border: string; icon: string; gradient: string }> = {
  critical: {
    bg: "bg-red-950/60",
    border: "border-red-500",
    icon: "🚨",
    gradient: "from-red-500 to-orange-500",
  },
  warning: {
    bg: "bg-orange-950/60",
    border: "border-orange-500",
    icon: "⚠️",
    gradient: "from-orange-500 to-yellow-500",
  },
  caution: {
    bg: "bg-yellow-950/60",
    border: "border-yellow-500",
    icon: "⚡",
    gradient: "from-yellow-500 to-amber-500",
  },
  safe: {
    bg: "bg-emerald-950/60",
    border: "border-emerald-500",
    icon: "✅",
    gradient: "from-emerald-500 to-green-500",
  },
  likely_safe: {
    bg: "bg-green-950/60",
    border: "border-green-500",
    icon: "🛡️",
    gradient: "from-green-500 to-emerald-500",
  },
  uncertain: {
    bg: "bg-gray-800/60",
    border: "border-gray-500",
    icon: "❓",
    gradient: "from-gray-500 to-gray-400",
  },
};

export default function ResultCard({ result, message }: ResultProps) {
  const config = riskConfig[result.riskLevel] || riskConfig.uncertain;
  const confidencePercent = result.confidence * 100;

  return (
    <div className={`${config.bg} backdrop-blur-xl border ${config.border} rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl">{config.icon}</div>
        <div>
          <h2 className="text-2xl font-bold text-white">{result.label}</h2>
          <p className="text-gray-400 text-sm">
            Confiança da análise:{" "}
            <span className="text-white font-semibold">{confidencePercent.toFixed(1)}%</span>
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Seguro</span>
          <span>Suspeito</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-700`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Message Analyzed */}
      <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-700/50">
        <p className="text-xs text-gray-500 mb-1">Mensagem analisada:</p>
        <p className="text-gray-300 text-sm">&quot;{message}&quot;</p>
      </div>

      {/* Tips */}
      {result.isSpam && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-800/50 rounded-xl">
          <p className="text-red-400 text-sm font-medium mb-2">⚠️ Recomendações:</p>
          <ul className="text-red-300/80 text-xs space-y-1">
            <li>• Não clique em links suspeitos</li>
            <li>• Não compartilhe dados pessoais ou bancários</li>
            <li>• Verifique diretamente no app do seu banco</li>
            <li>• Em caso de dúvida, denuncie ao banco</li>
          </ul>
        </div>
      )}
    </div>
  );
}
