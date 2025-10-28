import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listPresets,
  createPreset,
  updatePreset,
  deletePreset,
} from "../api/discovery.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import PresetDrawer from "../components/PresetDrawer.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";

export default function SpinConfig() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 350);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(
    async (query = dq) => {
      setBusy(true);
      const res = await listPresets({ q: query });
      if (res?.ok) setRows(res.data);
      setBusy(false);
    },
    [dq]
  );

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const res = await createPreset(form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const res = await updatePreset(editing.id, form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onConfirmDelete() {
    if (!toDelete) return;
    const res = await deletePreset(toDelete.id);
    if (res?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }

  const columns = useMemo(
    () => [
      { header: "Name", key: "name" },
      {
        header: "Meal/Time/Diet",
        key: "f",
        render: (r) => (
          <span className="text-sm text-muted">
            {r.filters?.meal || "any"} / ≤{r.filters?.timeMax}m /{" "}
            {r.filters?.diet || "any"}
          </span>
        ),
      },
      { header: "Weight", key: "weight" },
      {
        header: "Enabled",
        key: "enabled",
        render: (r) => (
          <span
            className="badge"
            style={{
              background: r.enabled
                ? "rgba(16,185,129,.15)"
                : "rgba(148,163,184,.18)",
              borderColor: "transparent",
            }}
          >
            {r.enabled ? "Yes" : "No"}
          </span>
        ),
      },
      {
        header: "Updated",
        key: "updatedAt",
        render: (r) => new Date(r.updatedAt).toLocaleString(),
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
          <h1 className="text-xl font-semibold">Discovery · Spin Presets</h1>
          <div className="text-sm text-muted">
            Weighted presets that shape the random picker
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          New Preset
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="w-full sm:w-80">
          <SearchBar
            value={q}
            onChange={setQ}
            placeholder="Search preset name…"
          />
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No presets found."
        />
      </div>

      <PresetDrawer
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
        title="Delete preset?"
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
