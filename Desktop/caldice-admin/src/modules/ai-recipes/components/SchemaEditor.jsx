import React, { useState } from "react";

const DEFAULT_SCHEMA = `{
  "type": "object",
  "properties": {
    "ingredients": { "type": "array", "items": { "type": "string" } },
    "instructions": { "type": "array", "items": { "type": "string" } },
    "time": { "type": "number" },
    "cost": { "type": "string" },
    "servings": { "type": "number" },
    "category": { "type": "string" },
    "difficulty": { "type": "string" },
    "origin": { "type": "string" },
    "avgCalories": { "type": "number" }
  },
  "required": ["ingredients","instructions","time","cost","servings","category","difficulty","avgCalories"]
}`;

export default function SchemaEditor({ value = DEFAULT_SCHEMA, onChange }) {
  const [text, setText] = useState(value || DEFAULT_SCHEMA);
  const [err, setErr] = useState("");

  function onBlur() {
    try {
      const parsed = JSON.parse(text);
      setErr("");
      onChange?.(JSON.stringify(parsed, null, 2));
    } catch {
      setErr("Invalid JSON");
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Output JSON Schema</div>
        {err ? <div className="text-xs text-(--danger)]">{err}</div> : null}
      </div>
      <textarea
        className="input font-mono text-xs h-64"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={onBlur}
      />
    </div>
  );
}
