import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listIntegrations,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  rotateIntegrationKey,
  INTEGRATION_PROVIDERS,
} from "../api/integrations.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";
import IntegrationDrawer from "../components/IntegrationDrawer.jsx";

export default function Integrations() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 300);
  const [filters, setFilters] = useState({ provider: "", status: "" });
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [confirmRotate, setConfirmRotate] = useState(false);
  const [toRotate, setToRotate] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listIntegrations({ q: dq, ...filters });
    if (res?.ok) setRows(res.data);
    setBusy(false);
  }, [dq, filters]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const r = await createIntegration(form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const r = await updateIntegration(editing.id, form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onConfirmDelete() {
    if (!toDelete) return;
    const r = await deleteIntegration(toDelete.id);
    if (r?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }
  async function onConfirmRotate() {
    if (!toRotate) return;
    const r = await rotateIntegrationKey(toRotate.id);
    if (r?.ok) {
      setConfirmRotate(false);
      setToRotate(null);
      load();
    }
  }

  const columns = useMemo(
    () => [
      { header: "Name", key: "name" },
      {
        header: "Provider",
        key: "provider",
        render: (r) =>
          INTEGRATION_PROVIDERS.find((p) => p.code === r.provider)?.label ||
          r.provider,
      },
      {
        header: "Status",
        key: "status",
        render: (r) => (
          <span
            className="badge"
            style={{
              background:
                r.status === "active"
                  ? "rgba(16,185,129,.15)"
                  : "rgba(148,163,184,.18)",
              borderColor: "transparent",
            }}
          >
            {r.status}
          </span>
        ),
      },
      {
        header: "API Key",
        key: "apiKey",
        render: (r) => <span className="font-mono text-xs">{r.apiKey}</span>,
      },
      {
        header: "Scopes",
        key: "scopes",
        render: (r) => (
          <span className="text-sm text-muted">
            {(r.scopes || []).join(", ") || "—"}
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
                setToRotate(r);
                setConfirmRotate(true);
              }}
            >
              Rotate Key
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
          <h1 className="text-xl font-semibold">Integrations</h1>
          <div className="text-sm text-muted">
            Manage third-party connections & API keys
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          New Integration
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder="Search by name/provider…"
            />
          </div>
          <select
            className="input w-40"
            value={filters.provider}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, provider: e.target.value }))
            }
          >
            <option value="">All providers</option>
            {INTEGRATION_PROVIDERS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </select>
          <select
            className="input w-[140px]"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">Any status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
          <button
            className="btn-ghost"
            onClick={() => setFilters({ provider: "", status: "" })}
          >
            Clear
          </button>
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No integrations found."
        />
      </div>

      <IntegrationDrawer
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
        title="Delete integration?"
        message={toDelete ? `This will remove "${toDelete.name}".` : ""}
        confirmLabel="Delete"
        onConfirm={onConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
      />

      <ConfirmDialog
        open={confirmRotate}
        title="Rotate API key?"
        message={toRotate ? `Rotate key for "${toRotate.name}" now?` : ""}
        confirmLabel="Rotate"
        onConfirm={onConfirmRotate}
        onCancel={() => {
          setConfirmRotate(false);
          setToRotate(null);
        }}
      />
    </div>
  );
}
