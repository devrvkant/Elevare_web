import { useState, useEffect, useMemo } from "react";

/**
 * SVG Radar/Spider Chart comparing current vs required skill levels
 * @param {Array} categories - Array of { label, current, required } objects
 * @param {number} size - Chart size in pixels
 */
export default function RadarChart({ categories = [], size = 320 }) {
  const [animated, setAnimated] = useState(false);
  const center = size / 2;
  const radius = (size - 140) / 2; // Increased padding for longer labels
  const levels = 5; // Concentric rings

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const angleSlice = (2 * Math.PI) / categories.length;

  // Get point coordinates for a value at a given index
  const getPoint = (index, value) => {
    const angle = angleSlice * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Create polygon path from values
  const createPath = (values) => {
    return values
      .map((val, i) => {
        const point = getPoint(i, animated ? val : 0);
        return `${point.x},${point.y}`;
      })
      .join(" ");
  };

  // Grid lines (concentric polygons)
  const gridLines = useMemo(() => {
    return Array.from({ length: levels }, (_, levelIndex) => {
      const levelValue = ((levelIndex + 1) / levels) * 100;
      const points = categories
        .map((_, i) => {
          const point = getPoint(i, levelValue);
          return `${point.x},${point.y}`;
        })
        .join(" ");
      return points;
    });
  }, [categories, center, radius, levels]);

  // Axis lines
  const axisLines = useMemo(() => {
    return categories.map((_, i) => {
      const point = getPoint(i, 100);
      return { x1: center, y1: center, x2: point.x, y2: point.y };
    });
  }, [categories, center]);

  // Labels
  const labels = useMemo(() => {
    return categories.map((cat, i) => {
      const point = getPoint(i, 115);
      return { ...cat, x: point.x, y: point.y };
    });
  }, [categories]);

  const currentValues = categories.map((c) => c.current);
  const requiredValues = categories.map((c) => c.required);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid */}
        {gridLines.map((points, i) => (
          <polygon
            key={`grid-${i}`}
            points={points}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
            opacity={0.3 + i * 0.1}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={`axis-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--border)"
            strokeWidth={1}
            opacity={0.4}
          />
        ))}

        {/* Required polygon (background) */}
        <polygon
          points={createPath(requiredValues)}
          fill="rgba(139, 92, 246, 0.08)"
          stroke="#8b5cf6"
          strokeWidth={2}
          strokeDasharray="6 3"
          opacity={0.7}
          style={{
            transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Current polygon (foreground) */}
        <polygon
          points={createPath(currentValues)}
          fill="rgba(16, 185, 129, 0.15)"
          stroke="#10b981"
          strokeWidth={2.5}
          style={{
            transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.3))",
          }}
        />

        {/* Data points - Required */}
        {requiredValues.map((val, i) => {
          const point = getPoint(i, animated ? val : 0);
          return (
            <circle
              key={`req-point-${i}`}
              cx={point.x}
              cy={point.y}
              r={3.5}
              fill="#8b5cf6"
              stroke="var(--card)"
              strokeWidth={2}
              style={{
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          );
        })}

        {/* Data points - Current */}
        {currentValues.map((val, i) => {
          const point = getPoint(i, animated ? val : 0);
          return (
            <circle
              key={`cur-point-${i}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="#10b981"
              stroke="var(--card)"
              strokeWidth={2}
              style={{
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          );
        })}

        {/* Labels */}
        {labels.map((label, i) => (
          <text
            key={`label-${i}`}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-[10px] font-medium"
            style={{ fontSize: "10px" }}
          >
            {label.label}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground font-medium">
            Your Skills
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: "#8b5cf6",
              border: "1px dashed #8b5cf6",
            }}
          />
          <span className="text-xs text-muted-foreground font-medium">
            Required
          </span>
        </div>
      </div>
    </div>
  );
}
