import React from "react";
import { useNavigate } from "react-router-dom";

const typeBadge = (t) => {
  const map = {
    order: "bg-emerald-500/15 text-emerald-700",
    refund: "bg-rose-500/15 text-rose-700",
    printer: "bg-amber-500/15 text-amber-700",
    integration: "bg-sky-500/15 text-sky-700",
    item: "bg-indigo-500/15 text-indigo-700",
  };
  return map[t] || "bg-slate-500/15 text-slate-700";
};

export default function ActivityList({ items = [], onItemClick }) {
  const navigate = useNavigate();

  function handleAction(it) {
    if (typeof onItemClick === "function") return onItemClick(it);
    if (it.href) {
      try {
        if (it.href.startsWith("/")) navigate(it.href);
        else window.open(it.href, "_blank");
      } catch {
        // fallback
        window.location.href = it.href;
      }
    }
  }

  return (
    <ul className="divide-y divide-(--line) rounded-xl overflow-hidden border border-(--line) bg-card">
      {items.map((it) => (
        <li
          key={it.id}
          className="p-3 sm:p-4 flex items-start gap-3 cursor-pointer hover:bg-card/60 transition-colors duration-150"
          role="button"
          tabIndex={0}
          onClick={() => handleAction(it)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleAction(it);
          }}
        >
          <span
            className={`px-2 py-0.5 rounded-md text-xs ${typeBadge(it.type)}`}
          >
            {it.type}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium">{it.title}</div>
            <div className="text-xs text-muted">{it.meta}</div>
          </div>
          <div className="ml-auto text-xs text-muted whitespace-nowrap">
            {new Date(it.ts).toLocaleTimeString()}
          </div>
        </li>
      ))}
      {items.length === 0 && (
        <li className="p-4 text-sm text-muted">No recent activity.</li>
      )}
    </ul>
  );
}
