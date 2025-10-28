import React, { useEffect, useMemo, useState, useCallback } from "react";
import { listHistory, clearHistory } from "../api/discovery.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";

export default function History() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({ action: "" });
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listHistory({ page, pageSize: 12, q, ...filters });
    if (res?.ok) {
      setRows(res.data.rows);
      setMeta({ total: res.data.total, pages: res.data.pages });
    }
    setBusy(false);
  }, [page, q, filters]);

  useEffect(() => {
    setPage(1);
  }, [q, filters.action]);

  useEffect(() => {
    load();
  }, [load]);

  async function wipe() {
    const yes = confirm("Clear all history?");
    if (!yes) return;
    const res = await clearHistory();
    if (res?.ok) load();
  }

  const columns = useMemo(
    () => [
      { header: "Action", key: "action" },
      {
        header: "Meta",
        key: "m",
        render: (r) => (
          <span className="text-xs text-muted">
            {Object.entries(r.meta || {})
              .map(([k, v]) => `${k}:${v}`)
              .join(" • ") || "—"}
          </span>
        ),
      },
      { header: "User", key: "userId" },
      {
        header: "Time",
        key: "at",
        render: (r) => new Date(r.at).toLocaleString(),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Engagement · History</h1>
          <div className="text-sm text-muted">
            Recent spins and recipe opens
          </div>
        </div>
        <button className="btn-ghost" onClick={wipe}>
          Clear All
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder="Search action/meal…"
            />
          </div>
          <select
            className="input w-40"
            value={filters.action}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, action: e.target.value }))
            }
          >
            <option value="">Any action</option>
            <option value="spin">spin</option>
            <option value="open_recipe">open_recipe</option>
          </select>
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No history yet."
          footer={
            <div className="w-full flex items-center justify-between">
              <div className="text-xs">
                Total: {meta.total.toLocaleString()}
              </div>
              <Pagination page={page} pages={meta.pages} onPage={setPage} />
            </div>
          }
        />
      </div>
    </div>
  );
}
