import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listRecipes,
  approveRecipe,
  rejectRecipe,
  deleteRecipe,
} from "../api/ai.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";
import RecipeDetails from "../components/RecipeDetails.jsx";

export default function RecipesQueue() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 350);

  const [filters, setFilters] = useState({ status: "pending", locale: "" });
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const [selected, setSelected] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listRecipes({ page, pageSize: 10, q: dq, ...filters });
    if (res?.ok) {
      setRows(res.data.rows);
      setMeta({ total: res.data.total, pages: res.data.pages });
    }
    setBusy(false);
  }, [page, dq, filters]);

  useEffect(() => {
    setPage(1);
  }, [dq, filters.status, filters.locale]);

  useEffect(() => {
    load();
  }, [load]);

  const onApprove = useCallback(
    async (id) => {
      const res = await approveRecipe(id);
      if (res?.ok) load();
    },
    [load]
  );

  const onReject = useCallback(
    async (id) => {
      const res = await rejectRecipe(id);
      if (res?.ok) load();
    },
    [load]
  );

  const onConfirmDelete = useCallback(async () => {
    if (!toDelete) return;
    const res = await deleteRecipe(toDelete.id);
    if (res?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }, [toDelete, load]);

  const columns = useMemo(
    () => [
      { header: "Title", key: "title" },
      {
        header: "Locale",
        key: "locale",
        render: (r) => r.locale.toUpperCase(),
      },
      {
        header: "Status",
        key: "status",
        render: (r) => (
          <span
            className="badge"
            style={{
              background:
                r.status === "approved"
                  ? "rgba(16,185,129,.15)"
                  : r.status === "rejected"
                  ? "rgba(244,63,94,.15)"
                  : "rgba(148,163,184,.18)",
              borderColor: "transparent",
            }}
          >
            {r.status}
          </span>
        ),
      },
      {
        header: "Diet/Meal",
        key: "fm",
        render: (r) => {
          const f = r.sourceFilters || {};
          return (
            <span className="text-sm text-muted">
              {f.diet || "—"} / {f.meal || "—"}
            </span>
          );
        },
      },
      {
        header: "Created",
        key: "createdAt",
        render: (r) => new Date(r.createdAt).toLocaleString(),
      },
      {
        header: "Actions",
        key: "a",
        render: (r) => (
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => setSelected(r)}>
              View
            </button>
            {r.status !== "approved" && (
              <button className="btn-ghost" onClick={() => onApprove(r.id)}>
                Approve
              </button>
            )}
            {r.status !== "rejected" && (
              <button className="btn-ghost" onClick={() => onReject(r.id)}>
                Reject
              </button>
            )}
            <button
              className="btn-ghost"
              onClick={() => {
                setToDelete(r);
                setConfirmOpen(true);
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onApprove, onReject]
  );

  function clearFilters() {
    setFilters({ status: "", locale: "" });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">AI · Recipes Queue</h1>
          <div className="text-sm text-muted">
            Moderate generated recipes before publishing
          </div>
        </div>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <SearchBar value={q} onChange={setQ} placeholder="Search title…" />
          </div>

          <select
            className="input w-40"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="input w-[140px]"
            value={filters.locale}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, locale: e.target.value }))
            }
          >
            <option value="">Any</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
          </select>

          <button className="btn-ghost" onClick={clearFilters}>
            Clear
          </button>
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No recipes found."
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

      {selected && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Recipe Preview</div>
            <button className="btn-ghost" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
          <RecipeDetails recipe={selected} />
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete recipe?"
        message={toDelete ? `This will remove "${toDelete.title}".` : ""}
        confirmLabel="Delete"
        onConfirm={onConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
      />
    </div>
  );
}
