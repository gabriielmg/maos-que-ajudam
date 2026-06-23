"use client";

interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  percentage,
  color = "#2E8B57",
  height = "h-3",
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const isComplete = clamped >= 100;

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${animated ? "animate-pulse-subtle" : ""} ${isComplete ? "progress-complete" : ""}`}
          style={{
            width: `${clamped}%`,
            background: isComplete
              ? "linear-gradient(90deg, #2E8B57, #3CB371)"
              : `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: isComplete ? "0 0 8px rgba(46, 139, 87, 0.6)" : "none",
          }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1 text-right">{clamped}%</p>
      )}
    </div>
  );
}
