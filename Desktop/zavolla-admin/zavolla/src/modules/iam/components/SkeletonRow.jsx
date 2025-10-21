import React from "react";

export default function SkeletonRow({ cols = 5, block = false }) {
  // Explicit: if `block` is true, render stacked div skeletons suitable for
  // non-table contexts. Otherwise render a table row (<tr>) intended for use
  // inside <tbody>.
  if (block) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-[var(--border)]/40" />
        ))}
      </div>
    );
  }

  const cells = Array.from({ length: cols }).map((_, i) => (
    <td key={i} className="px-3 py-3">
      <div className="h-4 w-full rounded bg-[var(--border)]/40" />
    </td>
  ));

  return <tr className="animate-pulse">{cells}</tr>;
}
