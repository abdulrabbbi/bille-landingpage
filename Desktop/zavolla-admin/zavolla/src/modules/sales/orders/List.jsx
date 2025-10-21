import React, { useCallback, useEffect, useMemo, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import DeleteConfirm from "../../iam/components/DeleteConfirm.jsx";
import {
  fetchOrders,
  upsertOrder,
  parkOrder,
  reopenOrder,
  completeOrder,
  splitOrder,
  voidOrder,
  createSession,
} from "../api/sales.service.js";
import OrderDrawer from "./components/OrderDrawer.jsx";

const STATUSES = ["all", "open", "parked", "paid", "void"];

export default function OrdersList() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [splitSel, setSplitSel] = useState(null);
  const [voiding, setVoiding] = useState(null);

  const load = useCallback(async () => {
    const res = await fetchOrders({ q, status });
    setRows(res.data);
  }, [q, status]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => rows || [], [rows]);

  async function saveOrder(payload) {
    await upsertOrder(payload);
    setOpen(false);
    setEditing(null);
    await load();
  }

  async function doSplit(order, itemIds) {
    await splitOrder(order.id, itemIds);
    setSplitSel(null);
    await load();
  }

  async function pay(order) {
    await createSession({
      orderId: order.id,
      amount: order.totals?.grand || 0,
      terminal: "WisePad3-01",
    });
    await completeOrder(order.id);
    await load();
  }

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Orders</h1>
          <p className="text-sm text-muted">
            Open, parked, paid and void orders. Split & pay from here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <button
            className="btn"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            New Order
          </button>
        </div>
      </div>

      {/* filters */}
      <div className="card p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
        <input
          className="input flex-1"
          placeholder="Search #number, item, note…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="input w-full sm:w-44"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <button className="btn-ghost" onClick={load}>
          Apply
        </button>
      </div>

      {/* table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Items</th>
                <th className="px-3 py-2">Note</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows && (
                <>
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                </>
              )}
              {rows && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-muted">
                    No orders.
                  </td>
                </tr>
              )}
              {rows &&
                filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-3">{o.number}</td>
                    <td className="px-3 py-3 capitalize">{o.status}</td>
                    <td className="px-3 py-3">
                      {o.items?.map((i) => `${i.name}×${i.qty}`).join(", ")}
                    </td>
                    <td className="px-3 py-3 truncate max-w-[240px]">
                      {o.note || "-"}
                    </td>
                    <td className="px-3 py-3">
                      £{(o.totals?.grand || 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => {
                          setEditing(o);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      {o.status === "open" && (
                        <>
                          <button
                            className="btn-ghost mr-1"
                            onClick={() => setSplitSel(o)}
                          >
                            Split
                          </button>
                          <button
                            className="btn-ghost mr-1"
                            onClick={() => parkOrder(o.id).then(load)}
                          >
                            Park
                          </button>
                          <button
                            className="btn-ghost mr-1"
                            onClick={() => pay(o)}
                          >
                            Pay
                          </button>
                        </>
                      )}
                      {o.status === "parked" && (
                        <button
                          className="btn-ghost mr-1"
                          onClick={() => reopenOrder(o.id).then(load)}
                        >
                          Reopen
                        </button>
                      )}
                      {o.status !== "void" && (
                        <button
                          className="btn-ghost text-red-500"
                          onClick={() => setVoiding(o)}
                        >
                          Void
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* drawers / modals */}
      <OrderDrawer
        open={open}
        initial={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={saveOrder}
      />
      <SplitPicker
        order={splitSel}
        onClose={() => setSplitSel(null)}
        onConfirm={doSplit}
      />
      <VoidConfirm
        order={voiding}
        onClose={() => setVoiding(null)}
        onConfirm={async (id, reason) => {
          await voidOrder(id, reason);
          setVoiding(null);
          load();
        }}
      />
    </div>
  );
}

/* --- split modal --- */
function SplitPicker({ order, onClose, onConfirm }) {
  const [sel, setSel] = useState({});
  useEffect(() => {
    setSel({});
  }, [order?.id]);
  if (!order) return null;
  const items = order.items || [];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="card max-w-md w-full">
        <div className="font-semibold">Split order {order.number}</div>
        <p className="text-sm text-muted mb-3">
          Select items to move into a new bill.
        </p>
        <div className="space-y-2 max-h-64 overflow-auto">
          {items.map((i) => (
            <label
              key={i.id}
              className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-sm">
                {i.name} × {i.qty}
              </div>
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={!!sel[i.id]}
                onChange={(e) =>
                  setSel((s) => ({ ...s, [i.id]: e.target.checked }))
                }
              />
            </label>
          ))}
          {items.length === 0 && (
            <div className="text-sm text-muted">No items.</div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn"
            onClick={() =>
              onConfirm(
                order,
                Object.entries(sel)
                  .filter(([, v]) => v)
                  .map(([k]) => k)
              )
            }
          >
            Split
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- void reason --- */
function VoidConfirm({ order, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  useEffect(() => {
    setReason("");
  }, [order?.id]);
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="card max-w-sm w-full">
        <div className="font-semibold">Void {order.number}</div>
        <p className="text-sm text-muted">
          Provide a reason. This will be recorded in audit logs.
        </p>
        <textarea
          className="input mt-2 h-24"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. wrong table / duplicate order"
        />
        <div className="mt-3 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn bg-red-500 text-white hover:opacity-90"
            onClick={() => onConfirm(order.id, reason || "Unspecified")}
          >
            Void
          </button>
        </div>
      </div>
    </div>
  );
}
