import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listDishes,
  createDish,
  updateDish,
  deleteDish,
} from "../api/catalog.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";
import { downloadCSV } from "../../../shared/utils/csv.js";
import DishDrawer from "../components/DishDrawer.jsx";
import FilterBar from "../components/FilterBar.jsx";

export default function DishesList() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 400);

  const [filters, setFilters] = useState({
    diet: undefined,
    meal: undefined,
    locale: "en",
  });
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(
    async function load() {
      setBusy(true);
      const res = await listDishes({ page, pageSize: 10, q: dq, ...filters });
      if (res?.ok) {
        setRows(res.data.rows);
        setMeta({ total: res.data.total, pages: res.data.pages });
      }
      setBusy(false);
    },
    [page, dq, filters]
  );

  useEffect(() => {
    setPage(1);
  }, [dq, filters.diet, filters.meal, filters.locale]);
  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const res = await createDish(form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const res = await updateDish(editing.id, form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onConfirmDelete() {
    if (!toDelete) return;
    const res = await deleteDish(toDelete.id);
    if (res?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "Title",
        key: "title",
        render: (r) => r.title?.[filters.locale] || r.title?.en || "—",
      },
      { header: "Diet", key: "diet", render: (r) => r.diet || "—" },
      { header: "Meal", key: "meal", render: (r) => r.meal || "—" },
      {
        header: "Time",
        key: "timeMinutes",
        render: (r) => `${r.timeMinutes}m`,
      },
      { header: "Cost", key: "cost", render: (r) => r.cost?.toUpperCase() },
      {
        header: "YouTube",
        key: "youtube",
        render: (r) =>
          r.youtube ? (
            <a
              className="text-muted hover:underline"
              href={r.youtube}
              target="_blank"
              rel="noreferrer"
            >
              Open
            </a>
          ) : (
            "—"
          ),
      },
      {
        header: "Created",
        key: "createdAt",
        render: (r) => new Date(r.createdAt).toLocaleDateString(),
      },
      {
        header: "Actions",
        key: "actions",
        render: (r) => (
          <div className="flex gap-2">
            <button
              className="btn-ghost"
              onClick={() => {
                setEditing(r);
                setDrawerOpen(true);
              }}
            >
              Edit
            </button>
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
    [filters.locale]
  );

  function clearFilters() {
    setFilters({ diet: undefined, meal: undefined, locale: "en" });
  }
  function exportCSV() {
    const cols = [
      { header: "ID", key: "id" },
      { header: "Title EN", render: (r) => r.title?.en },
      { header: "Title DE", render: (r) => r.title?.de },
      { header: "Diet", key: "diet" },
      { header: "Meal", key: "meal" },
      { header: "Time", key: "timeMinutes" },
      { header: "Cost", key: "cost" },
      { header: "YouTube", key: "youtube" },
      { header: "CreatedAt", key: "createdAt" },
    ];
    downloadCSV("dishes", rows, cols);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Catalog · Dishes</h1>
          <div className="text-sm text-muted">
            Localized content (EN/DE), diet & meal filters
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={exportCSV}>
            Export CSV
          </button>
          <button
            className="btn"
            onClick={() => {
              setEditing(null);
              setDrawerOpen(true);
            }}
          >
            Add Dish
          </button>
        </div>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-auto sm:flex-1">
            <SearchBar value={q} onChange={setQ} placeholder="Search title…" />
          </div>
          <FilterBar
            diet={filters.diet}
            meal={filters.meal}
            locale={filters.locale}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
            onClear={clearFilters}
          />
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No dishes found."
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

      <DishDrawer
        open={drawerOpen}
        initial={editing}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        onSubmit={editing ? onUpdate : onCreate}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete dish?"
        message={
          toDelete ? `This will remove "${toDelete.title?.en || "dish"}".` : ""
        }
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
