import React from "react";

export default function DataTable({
  loading,
  columns = [],
  rows = [],
  empty = "No data.",
  footer = null,
}) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i} className="text-left text-xs text-muted py-2 px-3">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={Math.max(1, columns.length)}
                  className="p-6 text-center text-sm text-muted"
                >
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={Math.max(1, columns.length)}
                  className="p-6 text-center text-sm text-muted"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.id || idx} className="border-t">
                  {columns.map((c, ci) => (
                    <td key={ci} className="py-2 px-3 align-top text-sm">
                      {c.render ? c.render(r) : r[c.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}
