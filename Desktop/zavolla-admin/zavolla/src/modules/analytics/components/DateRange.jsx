import React from "react";

const presets = [
  { k: "7d", label: "Last 7d", delta: 7 },
  { k: "14d", label: "Last 14d", delta: 14 },
  { k: "30d", label: "Last 30d", delta: 30 },
];

export default function DateRange({ from, to, onChange }) {
  function setPreset(days) {
    const end = Date.now();
    const start = end - days * 24 * 60 * 60 * 1000;
    onChange({ from: start, to: end });
  }
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p.k}
          type="button"
          className="btn-ghost"
          onClick={() => setPreset(p.delta)}
        >
          {p.label}
        </button>
      ))}
      <div className="flex items-center gap-2">
        <input
          className="input"
          type="date"
          value={from ? new Date(from).toISOString().slice(0, 10) : ""}
          onChange={(e) =>
            onChange({
              from: e.target.value ? new Date(e.target.value).getTime() : null,
              to,
            })
          }
        />
        <span className="text-muted text-sm">to</span>
        <input
          className="input"
          type="date"
          value={to ? new Date(to).toISOString().slice(0, 10) : ""}
          onChange={(e) =>
            onChange({
              from,
              to: e.target.value ? new Date(e.target.value).getTime() : null,
            })
          }
        />
      </div>
    </div>
  );
}
