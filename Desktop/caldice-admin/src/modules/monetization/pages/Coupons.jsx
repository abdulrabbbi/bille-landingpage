import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../api/billing.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import CouponDrawer from "../components/CouponDrawer.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";

function fmtDate(ts) {
  return ts ? new Date(ts).toLocaleString() : "—";
}

export default function Coupons() {
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
    const res = await listCoupons({ q: dq });
    if (res?.ok) setRows(res.data);
    setBusy(false);
  }, [dq]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const r = await createCoupon(form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const r = await updateCoupon(editing.id, form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onConfirmDelete() {
    if (!toDelete) return;
    const r = await deleteCoupon(toDelete.id);
    if (r?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }

  const columns = useMemo(
    () => [
      { header: "Code", key: "code" },
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
        header: "Value",
        key: "value",
        render: (r) =>
          r.type === "percent" ? `${r.value}%` : `$${r.value.toFixed(2)}`,
      },
      {
        header: "Redemptions",
        key: "red",
        render: (r) => `${r.used ?? 0}/${r.maxRedemptions ?? "∞"}`,
      },
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
        header: "Expires",
        key: "expiresAt",
        render: (r) => fmtDate(r.expiresAt),
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
          <h1 className="text-xl font-semibold">Monetization · Coupons</h1>
          <div className="text-sm text-muted">
            Percent or fixed-amount discounts
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          New Coupon
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="w-full sm:w-80">
          <SearchBar value={q} onChange={setQ} placeholder="Search code…" />
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No coupons found."
        />
      </div>

      <CouponDrawer
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
        title="Delete coupon?"
        message={toDelete ? `This will remove "${toDelete.code}".` : ""}
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
