import React, { useEffect, useMemo, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import {
  fetchTerminals,
  pingTerminal,
  fetchPrinters,
  printTestReceipt,
} from "../api/hardware.service.js";

export default function HardwareHealth() {
  const [terms, setTerms] = useState(null);
  const [prints, setPrints] = useState(null);

  async function load() {
    const [t, p] = await Promise.all([fetchTerminals({}), fetchPrinters({})]);
    setTerms(t.data);
    setPrints(p.data);
  }
  useEffect(() => {
    load();
  }, []);

  // lightweight polling every 10s
  useEffect(() => {
    const id = setInterval(() => load(), 10_000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const tOnline = terms?.filter((x) => x.status === "online").length || 0;
    const tPaired = terms?.filter((x) => x.status === "paired").length || 0;
    const tOffline = terms?.filter((x) => x.status === "offline").length || 0;
    const pOnline = prints?.filter((x) => x.status === "online").length || 0;
    const pOffline = prints?.length ? prints.length - pOnline : 0;
    return { tOnline, tPaired, tOffline, pOnline, pOffline };
  }, [terms, prints]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Hardware Health</h1>
          <p className="text-sm text-muted">
            Quick status for terminals and printers.
          </p>
        </div>
        <ThemeSwitch />
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Kpi label="Terminals Online" value={stats.tOnline} />
        <Kpi label="Terminals Paired" value={stats.tPaired} />
        <Kpi label="Terminals Offline" value={stats.tOffline} />
        <Kpi label="Printers Online" value={stats.pOnline} />
        <Kpi label="Printers Offline" value={stats.pOffline} />
      </div>

      {/* Lists */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-0 overflow-hidden">
          <div
            className="px-3 py-2 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-medium">Terminals</div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted">
                <tr>
                  <th className="px-3 py-2">Alias</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Battery</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!terms && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-muted"
                    >
                      Loading…
                    </td>
                  </tr>
                )}
                {terms &&
                  terms.map((t) => (
                    <tr
                      key={t.id}
                      className="border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-3 py-2">{t.alias || t.serial}</td>
                      <td className="px-3 py-2 capitalize">{t.status}</td>
                      <td className="px-3 py-2">{t.battery ?? "-"}%</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          className="btn-ghost"
                          onClick={() => pingTerminal(t.id).then(load)}
                        >
                          Ping
                        </button>
                      </td>
                    </tr>
                  ))}
                {terms && terms.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-muted"
                    >
                      No terminals.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div
            className="px-3 py-2 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-medium">Printers</div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Interface</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!prints && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-muted"
                    >
                      Loading…
                    </td>
                  </tr>
                )}
                {prints &&
                  prints.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-3 py-2">{p.name}</td>
                      <td className="px-3 py-2 capitalize">{p.status}</td>
                      <td className="px-3 py-2 uppercase">{p.iface}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          className="btn-ghost"
                          onClick={() => printTestReceipt(p.id)}
                        >
                          Print test
                        </button>
                      </td>
                    </tr>
                  ))}
                {prints && prints.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-muted"
                    >
                      No printers.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-muted text-xs">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
