import React from "react";

export default function TxnDrawer({ open, txn, onClose }) {
  if (!open || !txn) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-[var(--surface)] border-l"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="font-semibold">Transaction {txn.id}</div>
          <div className="text-xs text-muted">
            {new Date(txn.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-auto h-[calc(100%-120px)]">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Order" value={txn.orderId || "—"} />
            <Field label="Location" value={txn.locationId} />
            <Field label="Type" value={txn.type} />
            <Field label="Method" value={txn.method} />
            <Field label="Status" value={txn.status} />
            <Field label="Amount" value={`£${txn.amount.toFixed(2)}`} />
          </div>

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
                  </tr>
                </thead>
                <tbody>
                  {(txn.items || []).map((i, idx) => (
                    <tr
                      key={idx}
                      className="border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-3 py-2">{i.name}</td>
                      <td className="px-3 py-2">{i.qty}</td>
                      <td className="px-3 py-2">£{i.price.toFixed(2)}</td>
                    </tr>
                  ))}
                  {(!txn.items || txn.items.length === 0) && (
                    <tr>
                      <td className="px-3 py-4 text-muted" colSpan={3}>
                        No line items.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          className="p-4 border-t flex justify-end"
          style={{ borderColor: "var(--border)" }}
        >
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="card p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="font-medium truncate">{value}</div>
    </div>
  );
}
