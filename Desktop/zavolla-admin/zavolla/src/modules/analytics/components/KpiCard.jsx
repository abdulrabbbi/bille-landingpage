import React from "react";
import SparkTiny from "./SparkTiny.jsx";

export default function KpiCard({ label, value, suffix = "", spark = [] }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold">
        {value}
        {suffix}
      </div>
      {spark?.length > 0 && (
        <div className="mt-3">
          <SparkTiny data={spark} />
        </div>
      )}
    </div>
  );
}
