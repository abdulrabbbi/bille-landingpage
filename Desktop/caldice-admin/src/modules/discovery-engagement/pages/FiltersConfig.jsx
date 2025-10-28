import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../api/discovery.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import FilterGroupDrawer from "../components/FilterGroupDrawer.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";

export default function FiltersConfig() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 300);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listGroups({ q: dq });
    if (res?.ok) setRows(res.data);
    setBusy(false);
  }, [dq]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const res = await createGroup(form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const res = await updateGroup(editing.id, form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onConfirmDelete() {
    if (!toDelete) return;
    const res = await deleteGroup(toDelete.id);
    if (res?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }

  const columns = useMemo(
    () => [
      { header: "Name", key: "name" },
      { header: "Code", key: "code" },
      {
        header: "Items",
        key: "items",
        render: (r) => (
          <span className="text-sm text-muted">
            {r.items?.map((i) => i.label).join(", ") || "—"}
          </span>
        ),
      },
      {
        header: "Actions",
        key: "a",
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
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Discovery · Smart Filters</h1>
          <div className="text-sm text-muted">
            Groups and items powering the filter UI
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          New Group
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="w-full sm:w-80">
          <SearchBar
            value={q}
            onChange={setQ}
            placeholder="Search by name or code…"
          />
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No groups found."
        />
      </div>

      <FilterGroupDrawer
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
        title="Delete filter group?"
        message={toDelete ? `This will remove "${toDelete.name}".` : ""}
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
