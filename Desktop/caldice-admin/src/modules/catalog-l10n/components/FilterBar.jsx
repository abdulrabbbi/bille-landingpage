import React from "react";

export default function FilterBar({ diet, meal, locale, onChange, onClear }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="input w-40"
        value={diet || ""}
        onChange={(e) => onChange({ diet: e.target.value || undefined })}
      >
        <option value="">All diets</option>
        <option value="vegan">Vegan</option>
        <option value="veget">Vegetarian</option>
      </select>

      <select
        className="input w-40"
        value={meal || ""}
        onChange={(e) => onChange({ meal: e.target.value || undefined })}
      >
        <option value="">All meals</option>
        <option value="breakfast">Breakfast</option>
        <option value="dinner">Dinner</option>
      </select>

      <select
        className="input w-[140px]"
        value={locale || "en"}
        onChange={(e) => onChange({ locale: e.target.value })}
      >
        <option value="en">EN</option>
        <option value="de">DE</option>
      </select>

      <button className="btn-ghost" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
