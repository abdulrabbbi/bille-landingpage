import React, { useEffect, useState, useCallback } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import {
  fetchDeliveryOrders,
  updateDeliveryOrder,
  partnerLabel,
} from "../api/integrations.service.js";

const STATUSES = ["all", "new", "accepted", "printing", "ready", "rejected"];

export default function DeliveryFeed() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const load = useCallback(async () => {
    const res = await fetchDeliveryOrders({ q, status });
    setRows(res.data);
  }, [q, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(order, patch) {
    await updateDeliveryOrder(order.id, patch);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Delivery Orders</h1>
          <p className="text-sm text-muted">
            Live feed from partners. Accept, reject, mark printed.
          </p>
        </div>
        <ThemeSwitch />
      </div>

      <div className="card p-3 grid sm:grid-cols-3 gap-2">
        <input
          className="input"
          placeholder="Search #number, customer, item…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="input"
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

      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[920px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Partner</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Items</th>
                <th className="px-3 py-2">Note</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows && (
                <>
                  <SkeletonRow cols={8} />
                  <SkeletonRow cols={8} />
                </>
              )}
              {rows && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-muted">
                    No delivery orders.
                  </td>
                </tr>
              )}
              {rows &&
                rows.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-3">{o.number}</td>
                    <td className="px-3 py-3">{partnerLabel(o.partner)}</td>
                    <td className="px-3 py-3">{o.customer || "-"}</td>
                    <td className="px-3 py-3">
                      {o.items?.map((i) => `${i.name}×${i.qty}`).join(", ")}
                    </td>
                    <td className="px-3 py-3 truncate max-w-[220px]">
                      {o.note || "-"}
                    </td>
                    <td className="px-3 py-3 capitalize">{o.status}</td>
                    <td className="px-3 py-3">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {o.status === "new" && (
                        <>
                          <button
                            className="btn-ghost mr-1"
                            onClick={() => act(o, { status: "accepted" })}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-ghost text-red-500 mr-1"
                            onClick={() => act(o, { status: "rejected" })}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {o.status === "accepted" && (
                        <button
                          className="btn-ghost mr-1"
                          onClick={() => act(o, { status: "printing" })}
                        >
                          Print
                        </button>
                      )}
                      {o.status === "printing" && (
                        <button
                          className="btn-ghost mr-1"
                          onClick={() =>
                            act(o, { status: "ready", autoPrinted: true })
                          }
                        >
                          Ready
                        </button>
                      )}
                      <button
                        className="btn-ghost"
                        onClick={() => act(o, { autoPrinted: true })}
                      >
                        Mark Printed
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
