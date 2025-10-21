import React, { useEffect, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import {
  fetchSessions,
  createSession,
  fetchOrders,
} from "../api/sales.service.js";

export default function PaymentSessions() {
  const [rows, setRows] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ref, setRef] = useState({
    orderId: "",
    amount: "",
    terminal: "WisePad3-01",
  });

  async function load() {
    const s = await fetchSessions();
    setRows(s.data);
    const o = await fetchOrders({ status: "open" });
    setOrders(o.data);
  }
  useEffect(() => {
    load();
  }, []);

  async function send(e) {
    e.preventDefault();
    const amt = Number(ref.amount || 0);
    if (!ref.orderId || !amt) return;
    await createSession({
      orderId: ref.orderId,
      amount: amt,
      terminal: ref.terminal,
    });
    setRef({ orderId: "", amount: "", terminal: "WisePad3-01" });
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Payment Sessions</h1>
          <p className="text-sm text-muted">
            Send payments to terminals and track outcomes.
          </p>
        </div>
        <ThemeSwitch />
      </div>

      <form className="card p-3 grid md:grid-cols-4 gap-2" onSubmit={send}>
        <select
          className="input"
          value={ref.orderId}
          onChange={(e) =>
            setRef((r) => ({
              ...r,
              orderId: e.target.value,
              amount: String(
                orders.find((o) => o.id === e.target.value)?.totals?.grand || ""
              ),
            }))
          }
        >
          <option value="">Choose order</option>
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              {o.number} · £{(o.totals?.grand || 0).toFixed(2)}
            </option>
          ))}
        </select>
        <input
          className="input"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={ref.amount}
          onChange={(e) => setRef((r) => ({ ...r, amount: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Terminal"
          value={ref.terminal}
          onChange={(e) => setRef((r) => ({ ...r, terminal: e.target.value }))}
        />
        <button className="btn">Send to terminal</button>
      </form>

      <div className="card p-0 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr>
              <th className="px-3 py-2">Session</th>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Terminal</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {!rows && (
              <>
                <SkeletonRow cols={6} />
                <SkeletonRow cols={6} />
              </>
            )}
            {rows &&
              rows.map((s) => (
                <tr
                  key={s.id}
                  className="border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-3 py-2">{s.id}</td>
                  <td className="px-3 py-2">{s.orderId}</td>
                  <td className="px-3 py-2">£{(+s.amount).toFixed(2)}</td>
                  <td className="px-3 py-2">{s.terminal}</td>
                  <td className="px-3 py-2 capitalize">{s.status}</td>
                  <td className="px-3 py-2">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            {rows && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-muted">
                  No sessions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
