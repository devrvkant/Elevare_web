import { useState, useEffect } from "react";

/**
 * Animated progress bar with category label, score, and gradient fill
 * @param {string} label - Category name
 * @param {number} value - Progress percentage 0-100
 * @param {string} details - Optional detail text
 */
export default function ProgressBar({
  label = "",
  value = 0,
  details = "",
}) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 150);
    return () => clearTimeout(timer);
  }, [value]);

  const getColor = () => {
    if (value >= 75) return { bg: "bg-emerald-500/15", fill: "from-emerald-500 to-green-400", text: "text-emerald-500" };
    if (value >= 50) return { bg: "bg-amber-500/15", fill: "from-amber-500 to-yellow-400", text: "text-amber-500" };
    if (value >= 25) return { bg: "bg-orange-500/15", fill: "from-orange-500 to-amber-400", text: "text-orange-500" };
    return { bg: "bg-red-500/15", fill: "from-red-500 to-rose-400", text: "text-red-500" };
  };

  const colors = getColor();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className={`text-sm font-bold ${colors.text}`}>
          {Math.round(animatedValue)}%
        </span>
      </div>
      <div className={`h-3 rounded-full ${colors.bg} overflow-hidden`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors.fill} shadow-sm`}
          style={{
            width: `${animatedValue}%`,
            transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
      {details && (
        <p className="text-xs text-muted-foreground leading-relaxed">{details}</p>
      )}
    </div>
  );
}
