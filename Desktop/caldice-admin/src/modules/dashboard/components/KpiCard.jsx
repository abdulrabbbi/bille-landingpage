import React from "react";
import TrendSpark from "./TrendSpark.jsx";

export default function KpiCard({
  title,
  value,
  delta,
  series,
  format = (v) => v,
}) {
  const up = Number(delta) >= 0;
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="text-sm text-muted">{title}</div>
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-semibold">{format(value)}</div>
        <span
          className={`text-sm ${up ? "text-emerald-600" : "text-rose-600"}`}
        >
          {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
      <TrendSpark data={series} height={44} className="text-primary/70" />
    </div>
  );
}
