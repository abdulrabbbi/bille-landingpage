import React, { useMemo } from "react";

export default function SparkTiny({ data = [] }) {
  const { linePath, areaPath, lastPoint } = useMemo(() => {
    if (!data || !data.length)
      return { linePath: "", areaPath: "", lastPoint: null };
    const w = 140,
      h = 36;
    const min = Math.min(...data),
      max = Math.max(...data);
    const norm = (v) =>
      max === min ? h / 2 : h - ((v - min) / (max - min)) * h;
    const step = data.length === 1 ? 0 : w / (data.length - 1);
    const points = data.map((v, i) => ({ x: i * step, y: norm(v) }));

    const line = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
    const firstX = points[0].x;
    const last = points[points.length - 1];
    const area = `${line} L ${last.x} ${h} L ${firstX} ${h} Z`;

    return { linePath: line, areaPath: area, lastPoint: last };
  }, [data]);

  return (
    <svg
      width="100%"
      height="36"
      viewBox="0 0 140 36"
      preserveAspectRatio="none"
      role="img"
      aria-label="trend"
      className="block"
    >
      <defs>
        <linearGradient id="sparkGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* subtle gridlines */}
      <g
        stroke="var(--border)"
        strokeWidth="1"
        opacity="0.06"
        fill="none"
        pointerEvents="none"
      >
        <line x1="0" y1="6" x2="140" y2="6" />
        <line x1="0" y1="12" x2="140" y2="12" />
        <line x1="0" y1="18" x2="140" y2="18" />
        <line x1="0" y1="24" x2="140" y2="24" />
      </g>

      {/* filled area under the line */}
      {areaPath && (
        <path d={areaPath} fill="url(#sparkGradient)" stroke="none" />
      )}

      {/* main line */}
      {linePath && (
        <path
          d={linePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* endpoint marker */}
      {lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="3.2"
          fill="var(--primary)"
          stroke="var(--surface)"
          strokeWidth="1.2"
        />
      )}
    </svg>
  );
}
