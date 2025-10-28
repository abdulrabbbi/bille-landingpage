import React from "react";

export default function RecipeDetails({ recipe }) {
  if (!recipe) return null;
  const p = recipe.payload || {};
  return (
    <div className="grid gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="card p-3">
          <div className="text-sm text-muted">Title</div>
          <div className="font-medium">{recipe.title}</div>
        </div>
        <div className="card p-3">
          <div className="text-sm text-muted">Locale</div>
          <div className="font-medium">{recipe.locale.toUpperCase()}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <Stat label="Time" value={`${p.time ?? "—"}m`} />
        <Stat label="Cost" value={p.cost ?? "—"} />
        <Stat label="Servings" value={p.servings ?? "—"} />
        <Stat label="Calories" value={p.avgCalories ?? "—"} />
      </div>

      <div className="card p-3">
        <div className="text-sm font-semibold mb-2">Ingredients</div>
        <ul className="list-disc pl-6 text-sm">
          {(p.ingredients || []).map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>

      <div className="card p-3">
        <div className="text-sm font-semibold mb-2">Instructions</div>
        <ol className="list-decimal pl-6 text-sm space-y-1">
          {(p.instructions || []).map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
