import React from "react";

export default function SearchBar({
  value = "",
  onChange = () => {},
  placeholder = "Search...",
}) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full input"
      />
    </div>
  );
}
