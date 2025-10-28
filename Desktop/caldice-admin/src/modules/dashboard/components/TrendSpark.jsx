import React, { useMemo } from "react";

export default function TrendSpark({ data = [], height = 40, className = "" }) {
  const points = useMemo(() => {
    if (!data.length) return "";
    const xs = data.map((_, i) => i);
    const ys = data.map((p) => Number(p.v) || 0);
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const w = Math.max(xs.length - 1, 1);
    return ys
      .map((y, i) => {
        const nx = (i / w) * 100;
        const ny = max === min ? 50 : ((max - y) / (max - min)) * 100;
        return `${nx.toFixed(2)},${ny.toFixed(2)}`;
      })
      .join(" ");
  }, [data]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`w-full ${className}`}
      style={{ height }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.18"
      />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
