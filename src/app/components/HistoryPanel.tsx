interface HistoryEntry {
  id: number;
  message: string;
  label: string;
  confidence: number;
  isSpam: boolean;
  riskLevel: string;
  timestamp: Date;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClear: () => void;
}

const riskColors: Record<string, string> = {
  critical: "text-red-400 bg-red-950/40 border-red-800",
  warning: "text-orange-400 bg-orange-950/40 border-orange-800",
  caution: "text-yellow-400 bg-yellow-950/40 border-yellow-800",
  safe: "text-emerald-400 bg-emerald-950/40 border-emerald-800",
  likely_safe: "text-green-400 bg-green-950/40 border-green-800",
  uncertain: "text-gray-400 bg-gray-800/40 border-gray-700",
};

export default function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  return (
    <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Últimas Análises
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-300 transition"
        >
          Limpar
        </button>
      </div>

      <div className="space-y-3">
        {history.map((entry) => {
          const colorClass = riskColors[entry.riskLevel] || riskColors.uncertain;
          return (
            <div
              key={entry.id}
              className="p-3 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:bg-gray-800/60 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">&quot;{entry.message}&quot;</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full border ${colorClass}`}>
                    {entry.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(entry.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
