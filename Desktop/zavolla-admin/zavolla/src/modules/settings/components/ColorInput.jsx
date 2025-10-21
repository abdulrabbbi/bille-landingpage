import React from "react";

export default function ColorInput({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="text-sm text-muted">{label}</div>
      <div className="flex items-center gap-2 mt-1">
        <input
          className="input flex-1 font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#16a34a"
        />
        <input
          type="color"
          aria-label={`${label} color`}
          className="h-10 w-10 rounded-md border"
          style={{ borderColor: "var(--border)" }}
          value={safeColor(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  );
}
function safeColor(v) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : "#16a34a";
}
