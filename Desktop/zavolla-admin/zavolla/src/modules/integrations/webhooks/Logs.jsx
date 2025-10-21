import React, { useEffect, useState, useCallback } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import {
  fetchWebhookLogs,
  partners,
  partnerLabel,
} from "../api/integrations.service.js";

export default function WebhookLogs() {
  const [rows, setRows] = useState(null);
  const [p, setP] = useState("all");

  const load = useCallback(async () => {
    const res = await fetchWebhookLogs({ partner: p });
    setRows(res.data);
  }, [p]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Webhook Logs</h1>
          <p className="text-sm text-muted">
            Inbound events from delivery partners.
          </p>
        </div>
        <ThemeSwitch />
      </div>

      <div className="card p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
        <select
          className="input w-full sm:w-60"
          value={p}
          onChange={(e) => setP(e.target.value)}
        >
          <option value="all">All partners</option>
          {partners().map((x) => (
            <option key={x} value={x}>
              {partnerLabel(x)}
            </option>
          ))}
        </select>
        <button className="btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Partner</th>
                <th className="px-3 py-2">Event</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Payload</th>
              </tr>
            </thead>
            <tbody>
              {!rows && (
                <>
                  <SkeletonRow cols={5} />
                  <SkeletonRow cols={5} />
                </>
              )}
              {rows && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-muted">
                    No logs.
                  </td>
                </tr>
              )}
              {rows &&
                rows.map((w) => (
                  <tr
                    key={w.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2">
                      {new Date(w.ts).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{partnerLabel(w.partner)}</td>
                    <td className="px-3 py-2">{w.event}</td>
                    <td className="px-3 py-2">{w.status}</td>
                    <td className="px-3 py-2 font-mono text-xs truncate max-w-[420px]">
                      {JSON.stringify(w.body)}
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
