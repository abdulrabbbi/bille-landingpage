import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  sendTestWebhook,
} from "../api/integrations.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";
import WebhookDrawer from "../components/WebhookDrawer.jsx";

function fmt(ts) {
  return ts ? new Date(ts).toLocaleString() : "—";
}

export default function Webhooks() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 300);
  const [filters, setFilters] = useState({ active: "" });
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [testing, setTesting] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listWebhooks({ q: dq, ...filters });
    if (res?.ok) setRows(res.data);
    setBusy(false);
  }, [dq, filters]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const r = await createWebhook(form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const r = await updateWebhook(editing.id, form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onConfirmDelete() {
    if (!toDelete) return;
    const r = await deleteWebhook(toDelete.id);
    if (r?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }
  const onTest = useCallback(
    async (row) => {
      setTesting(row.id);
      const r = await sendTestWebhook(row.id);
      setTesting(null);
      if (r?.ok) load();
    },
    [load]
  );

  const columns = useMemo(
    () => [
      { header: "URL", key: "url" },
      {
        header: "Active",
        key: "active",
        render: (r) => (
          <span
            className="badge"
            style={{
              background: r.active
                ? "rgba(16,185,129,.15)"
                : "rgba(148,163,184,.18)",
              borderColor: "transparent",
            }}
          >
            {r.active ? "Yes" : "No"}
          </span>
        ),
      },
      {
        header: "Events",
        key: "events",
        render: (r) => (
          <span className="text-sm text-muted">
            {(r.events || []).join(", ") || "—"}
          </span>
        ),
      },
      {
        header: "Last Delivery",
        key: "lastDeliveredAt",
        render: (r) => fmt(r.lastDeliveredAt),
      },
      { header: "Updated", key: "updatedAt", render: (r) => fmt(r.updatedAt) },
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
              onClick={() => onTest(r)}
              disabled={testing === r.id}
            >
              {testing === r.id ? "Testing…" : "Send Test"}
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
    [testing, onTest]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Webhooks</h1>
          <div className="text-sm text-muted">Outgoing event deliveries</div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          New Webhook
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <SearchBar value={q} onChange={setQ} placeholder="Search by URL…" />
          </div>
          <select
            className="input w-[140px]"
            value={filters.active}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, active: e.target.value }))
            }
          >
            <option value="">Any state</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button
            className="btn-ghost"
            onClick={() => setFilters({ active: "" })}
          >
            Clear
          </button>
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No webhooks found."
        />
      </div>

      <WebhookDrawer
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
        title="Delete webhook?"
        message={toDelete ? `This will remove "${toDelete.url}".` : ""}
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
