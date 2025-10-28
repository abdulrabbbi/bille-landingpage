import React, { useEffect, useMemo, useState, useCallback } from "react";
import { listFavorites, removeFavorite } from "../api/discovery.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";

export default function Favorites() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 350);

  const [filters, setFilters] = useState({ type: "", locale: "" });
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listFavorites({ page, pageSize: 10, q: dq, ...filters });
    if (res?.ok) {
      setRows(res.data.rows);
      setMeta({ total: res.data.total, pages: res.data.pages });
    }
    setBusy(false);
  }, [page, dq, filters]);
  useEffect(() => {
    setPage(1);
  }, [dq, filters.type, filters.locale]);
  useEffect(() => {
    load();
  }, [load]);

  async function onConfirmDelete() {
    if (!toDelete) return;
    const res = await removeFavorite(toDelete.id);
    if (res?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }

  const columns = useMemo(
    () => [
      { header: "Title", key: "title" },
      {
        header: "Type",
        key: "type",
        render: (r) => (
          <span className="badge" style={{ textTransform: "uppercase" }}>
            {r.type}
          </span>
        ),
      },
      {
        header: "Locale",
        key: "locale",
        render: (r) => r.locale.toUpperCase(),
      },
      { header: "User", key: "user", render: (r) => r.user?.name || "—" },
      {
        header: "Added",
        key: "createdAt",
        render: (r) => new Date(r.createdAt).toLocaleString(),
      },
      {
        header: "Actions",
        key: "a",
        render: (r) => (
          <button
            className="btn-ghost"
            onClick={() => {
              setToDelete(r);
              setConfirmOpen(true);
            }}
          >
            Remove
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Engagement · Favorites</h1>
          <div className="text-sm text-muted">Saved recipes across users</div>
        </div>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder="Search title or user…"
            />
          </div>
          <select
            className="input w-[140px]"
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="">Any</option>
            <option value="ai">AI</option>
            <option value="local">LOCAL</option>
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
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No favorites found."
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

      <ConfirmDialog
        open={confirmOpen}
        title="Remove favorite?"
        message={
          toDelete ? `This will remove "${toDelete.title}" from favorites.` : ""
        }
        confirmLabel="Remove"
        onConfirm={onConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
      />
    </div>
  );
}
