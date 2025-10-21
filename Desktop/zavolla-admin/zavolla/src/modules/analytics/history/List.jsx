import React, { useCallback, useEffect, useMemo, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import DateRange from "../components/DateRange.jsx";
import TxnDrawer from "./components/TxnDrawer.jsx";
import {
  fetchTransactions,
  exportTransactionsCsv,
} from "../api/analytics.service.js";

const TYPES = ["all", "sale", "refund"];
const STATUS = ["all", "succeeded", "failed"];
const METHODS = ["all", "card", "cash", "wallet"];
const LOCS = ["all", "l1", "l2"];

export default function TransactionsList() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [location, setLocation] = useState("all");
  const [range, setRange] = useState(() => ({
    from: Date.now() - 7 * 24 * 60 * 60 * 1000,
    to: Date.now(),
  }));
  const [mine, setMine] = useState(false);
  const [sel, setSel] = useState(null);

  const load = useCallback(async () => {
    const res = await fetchTransactions({
      q,
      type,
      status,
      method,
      location,
      from: range.from,
      to: range.to,
      mineOnly: mine,
      userId: "u_admin", // wire your auth later
    });
    setRows(res.data);
  }, [q, type, status, method, location, range.from, range.to, mine]);

  useEffect(() => {
    load();
  }, [load]);

  const total = useMemo(
    () => rows?.reduce((s, r) => s + r.amount, 0) ?? 0,
    [rows]
  );

  async function exportCsv() {
    const { csv } = await exportTransactionsCsv({
      q,
      type,
      status,
      method,
      location,
      from: range.from,
      to: range.to,
      mineOnly: mine,
      userId: "u_admin",
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Transactions</h1>
          <p className="text-sm text-muted">History, filters, and CSV export</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <button className="btn-ghost" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="card p-3 grid lg:grid-cols-6 gap-2">
        <input
          className="input"
          placeholder="Search id, order, method…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {TYPES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          className="input"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          {METHODS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {LOCS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-[var(--primary)]"
              checked={mine}
              onChange={(e) => setMine(e.target.checked)}
            />
            Mine only
          </label>
          <button className="btn-ghost ml-auto" onClick={load}>
            Apply
          </button>
        </div>
        <div className="lg:col-span-6">
          <DateRange from={range.from} to={range.to} onChange={setRange} />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[960px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Txn</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Method</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows && (
                <>
                  <SkeletonRow cols={9} />
                  <SkeletonRow cols={9} />
                </>
              )}
              {rows && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-10 text-center text-muted">
                    No transactions.
                  </td>
                </tr>
              )}
              {rows &&
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                    <td className="px-3 py-2">{r.orderId || "—"}</td>
                    <td className="px-3 py-2 capitalize">{r.type}</td>
                    <td className="px-3 py-2 capitalize">{r.method}</td>
                    <td className="px-3 py-2 capitalize">{r.status}</td>
                    <td
                      className={`px-3 py-2 ${
                        r.amount < 0 ? "text-red-600 dark:text-red-400" : ""
                      }`}
                    >
                      £{r.amount.toFixed(2)}
                    </td>
                    <td className="px-3 py-2">{r.locationId}</td>
                    <td className="px-3 py-2">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button className="btn-ghost" onClick={() => setSel(r)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
            {rows && (
              <tfoot>
                <tr
                  className="border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-3 py-2 font-medium" colSpan={5}>
                    Total
                  </td>
                  <td className="px-3 py-2 font-medium">£{total.toFixed(2)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <TxnDrawer open={!!sel} txn={sel} onClose={() => setSel(null)} />
    </div>
  );
}
