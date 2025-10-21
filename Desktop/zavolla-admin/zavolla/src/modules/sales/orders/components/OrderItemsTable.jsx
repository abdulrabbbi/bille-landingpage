import React, { useState } from "react";

export default function OrderItemsTable({ rows = [], onChange }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);

  function add() {
    const nm = name.trim();
    if (!nm) return;
    const it = {
      id: crypto.randomUUID?.() || String(Date.now()),
      name: nm,
      qty: Number(qty) || 1,
      price: Number(price) || 0,
    };
    onChange([...rows, it]);
    setName("");
    setQty(1);
    setPrice(0);
  }
  function upd(i, patch) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function del(i) {
    onChange(rows.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="text-sm text-muted mb-1">Items</div>
      <div
        className="border rounded-lg overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                className="border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-3 py-2">
                  <input
                    className="input !h-8"
                    value={r.name}
                    onChange={(e) => upd(i, { name: e.target.value })}
                  />
                </td>
                <td className="px-3 py-2 w-24">
                  <input
                    className="input !h-8"
                    type="number"
                    min={1}
                    value={r.qty}
                    onChange={(e) => upd(i, { qty: Number(e.target.value) })}
                  />
                </td>
                <td className="px-3 py-2 w-28">
                  <input
                    className="input !h-8"
                    type="number"
                    step="0.01"
                    value={r.price}
                    onChange={(e) => upd(i, { price: Number(e.target.value) })}
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    className="btn-ghost text-red-500"
                    onClick={() => del(i)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-muted">
                  No items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <input
          className="input"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            className="input flex-1"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
          <button className="btn" onClick={add}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
