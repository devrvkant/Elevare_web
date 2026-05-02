import { useState, useEffect } from "react";

/**
 * SVG Donut Chart with animated fill and center text
 * @param {number} value - Percentage value 0-100
 * @param {number} size - Chart size in pixels
 * @param {string} label - Center label text
 * @param {string} color - Primary color for the chart
 */
export default function DonutChart({
  value = 0,
  size = 200,
  label = "Score",
  color = "var(--primary)",
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const strokeDashoffset =
    circumference - (animatedValue / 100) * circumference;

  // Color based on score
  const getScoreColor = () => {
    if (value >= 75) return "#10b981"; // Green
    if (value >= 50) return "#f59e0b"; // Amber
    if (value >= 25) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const scoreColor = color === "auto" ? getScoreColor() : color;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* Animated fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: `drop-shadow(0 0 6px ${scoreColor}40)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-bold"
          style={{ color: scoreColor }}
        >
          {Math.round(animatedValue)}
        </span>
        <span className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  );
}
