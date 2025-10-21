import React, { useEffect, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import {
  fetchRefunds,
  fetchSessions,
  createRefund,
} from "../api/sales.service.js";

export default function RefundsList() {
  const [rows, setRows] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({
    paymentSessionId: "",
    amount: "",
    type: "partial",
  });

  async function load() {
    const r = await fetchRefunds();
    setRows(r.data);
    const s = await fetchSessions();
    setSessions(s.data.filter((x) => x.status === "succeeded"));
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    const amt = Number(form.amount || 0);
    if (!form.paymentSessionId || !amt) return;
    await createRefund({
      paymentSessionId: form.paymentSessionId,
      amount: amt,
      type: form.type,
    });
    setForm({ paymentSessionId: "", amount: "", type: "partial" });
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Refunds</h1>
          <p className="text-sm text-muted">
            Full, partial and split refunds (mocked UI).
          </p>
        </div>
        <ThemeSwitch />
      </div>

      <form className="card p-3 grid md:grid-cols-4 gap-2" onSubmit={submit}>
        <select
          className="input"
          value={form.paymentSessionId}
          onChange={(e) =>
            setForm((f) => ({ ...f, paymentSessionId: e.target.value }))
          }
        >
          <option value="">Select payment</option>
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} · £{(+s.amount).toFixed(2)}
            </option>
          ))}
        </select>
        <input
          className="input"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
        />
        <select
          className="input"
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="partial">Partial</option>
          <option value="full">Full</option>
          <option value="split">Split</option>
        </select>
        <button className="btn">Create refund</button>
      </form>

      <div className="card p-0 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr>
              <th className="px-3 py-2">Refund</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Type</th>
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
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">{r.paymentSessionId}</td>
                  <td className="px-3 py-2">£{(+r.amount).toFixed(2)}</td>
                  <td className="px-3 py-2 capitalize">{r.type}</td>
                  <td className="px-3 py-2 capitalize">{r.status}</td>
                  <td className="px-3 py-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            {rows && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-muted">
                  No refunds.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
