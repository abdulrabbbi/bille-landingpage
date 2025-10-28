import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../api/billing.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import PlanDrawer from "../components/PlanDrawer.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";

export default function Plans() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 350);

  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listPlans({ q: dq });
    if (res?.ok) setRows(res.data);
    setBusy(false);
  }, [dq]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const r = await createPlan(form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const r = await updatePlan(editing.id, form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onConfirmDelete() {
    if (!toDelete) return;
    const r = await deletePlan(toDelete.id);
    if (r?.ok) {
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
        header: "Price",
        key: "price",
        render: (r) =>
          r.price === 0 ? "Free" : `$${r.price.toFixed(2)}/${r.interval}`,
      },
      {
        header: "Features",
        key: "features",
        render: (r) => (
          <span className="text-sm text-muted">
            {(r.features || []).join(", ") || "—"}
          </span>
        ),
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
          <h1 className="text-xl font-semibold">Monetization · Plans</h1>
          <div className="text-sm text-muted">Plan tiers & pricing</div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          New Plan
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
          empty="No plans found."
        />
      </div>

      <PlanDrawer
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
        title="Delete plan?"
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
