import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  listPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
} from "../api/ai.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import PromptDrawer from "../components/PromptDrawer.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";

export default function Prompts() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 350);
  const [locale, setLocale] = useState("");

  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listPrompts({ q: dq, locale: locale || undefined });
    if (res?.ok) setRows(res.data);
    setBusy(false);
  }, [dq, locale]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const res = await createPrompt(form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const res = await updatePrompt(editing.id, form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onConfirmDelete() {
    if (!toDelete) return;
    const res = await deletePrompt(toDelete.id);
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
        header: "Locale",
        key: "locale",
        render: (r) => r.locale.toUpperCase(),
      },
      { header: "Model", key: "model" },
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
          <h1 className="text-xl font-semibold">AI · Prompt Templates</h1>
          <div className="text-sm text-muted">
            Control model, locale, and templates
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          New Prompt
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder="Search prompt name…"
            />
          </div>
          <select
            className="input w-[140px]"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            <option value="">All</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
          </select>
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No prompts found."
        />
      </div>

      <PromptDrawer
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
        title="Delete prompt?"
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
