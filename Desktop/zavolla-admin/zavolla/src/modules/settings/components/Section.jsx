import React from "react";

export default function Section({ title, subtitle, actions = null, children }) {
  return (
    <section className="card p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div>
          <div className="font-semibold">{title}</div>
          {subtitle && <div className="text-sm text-muted">{subtitle}</div>}
        </div>
        {actions}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">{children}</div>
    </section>
  );
}
