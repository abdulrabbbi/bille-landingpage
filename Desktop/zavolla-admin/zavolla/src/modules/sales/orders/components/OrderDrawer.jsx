import React, { useEffect, useMemo, useState } from "react";
import OrderItemsTable from "./OrderItemsTable.jsx";

export default function OrderDrawer({
  open,
  initial = null,
  onClose,
  onSubmit,
}) {
  const [items, setItems] = useState([]);
  const [note, setNote] = useState("");
  const [tableId, setTableId] = useState("");

  useEffect(() => {
    if (open) {
      setItems(initial?.items || []);
      setNote(initial?.note || "");
      setTableId(initial?.tableId || "");
    }
  }, [open, initial]);

  const totals = useMemo(() => {
    const sub = items.reduce((s, i) => s + i.qty * i.price, 0);
    const tax = +(sub * 0.2).toFixed(2);
    return { sub: +sub.toFixed(2), tax, grand: +(sub + tax).toFixed(2) };
  }, [items]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-[var(--surface)] border-l"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="font-semibold">
            {initial ? `Edit ${initial.number}` : "New Order"}
          </div>
          <div className="text-xs text-muted">
            Add items, notes and assign a table
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-auto h-[calc(100%-140px)]">
          <label className="block">
            <div className="text-sm text-muted">Table (optional)</div>
            <input
              className="input mt-1"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              placeholder="e.g. T1"
            />
          </label>

          <OrderItemsTable rows={items} onChange={setItems} />

          <label className="block">
            <div className="text-sm text-muted">Kitchen note</div>
            <textarea
              className="input mt-1 h-20"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Special instructions"
            />
          </label>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="card p-3 text-center">
              <div className="text-muted">Subtotal</div>
              <div className="font-semibold">£{totals.sub.toFixed(2)}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-muted">Tax</div>
              <div className="font-semibold">£{totals.tax.toFixed(2)}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-muted">Grand</div>
              <div className="font-semibold">£{totals.grand.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div
          className="p-4 border-t flex gap-2 justify-end"
          style={{ borderColor: "var(--border)" }}
        >
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn"
            onClick={() =>
              onSubmit({
                id: initial?.id,
                tableId: tableId || null,
                items,
                note,
              })
            }
          >
            {initial ? "Save" : "Create"}
          </button>
        </div>
      </aside>
    </div>
  );
}
