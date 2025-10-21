import React, { useEffect, useMemo, useState, useCallback } from "react";

// Shared UI (already used across modules)
import ThemeSwitch from "../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../iam/components/SkeletonRow.jsx";

// Reuse KPI & tiny sparkline from Analytics
import KpiCard from "../analytics/components/KpiCard.jsx";
import SparkTiny from "../analytics/components/SparkTiny.jsx";

// Data services you already have (mock-first)
import {
  fetchKpis,
  fetchTransactions,
} from "../analytics/api/analytics.service.js";
import { fetchDeliveryOrders } from "../integrations/api/integrations.service.js";
import {
  fetchTerminals,
  fetchPrinters,
} from "../hardware/api/hardware.service.js";

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [trend, setTrend] = useState([]);
  const [orders, setOrders] = useState(null);
  const [txns, setTxns] = useState(null);
  const [hw, setHw] = useState({ terms: null, prints: null });

  const loadAll = useCallback(async () => {
    // Ranges
    const now = Date.now();
    const last14d = { from: now - 14 * 24 * 60 * 60 * 1000, to: now };
    const last24h = { from: now - 24 * 60 * 60 * 1000, to: now };

    const [k, o, t, p, tx] = await Promise.all([
      fetchKpis(last14d),
      fetchDeliveryOrders({ status: "new" }),
      fetchTerminals({}),
      fetchPrinters({}),
      fetchTransactions({
        ...last24h,
        type: "all",
        status: "all",
        method: "all",
      }),
    ]);
    setKpis(k.data);
    setTrend(k.data?.spark || []);
    setOrders(o.data);
    setHw({ terms: t.data, prints: p.data });
    setTxns(tx.data.slice(0, 6)); // last few
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // lightweight polling
  useEffect(() => {
    const id = setInterval(loadAll, 30000);
    return () => clearInterval(id);
  }, [loadAll]);

  const hwStats = useMemo(() => {
    const t = hw.terms || [];
    const p = hw.prints || [];
    return {
      tOnline: t.filter((x) => x.status === "online").length,
      tPaired: t.filter((x) => x.status === "paired").length,
      tOffline: t.filter((x) => x.status === "offline").length,
      pOnline: p.filter((x) => x.status === "online").length,
      pOffline: p.length
        ? p.length - p.filter((x) => x.status === "online").length
        : 0,
    };
  }, [hw]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted">
            At-a-glance: revenue, delivery queue, hardware health
          </p>
        </div>
        <ThemeSwitch />
      </div>

      {/* KPI row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {!kpis ? (
          <>
            <div className="card p-4">
              <SkeletonRow cols={1} block />
            </div>
            <div className="card p-4">
              <SkeletonRow cols={1} />
            </div>
            <div className="card p-4">
              <SkeletonRow cols={1} />
            </div>
            <div className="card p-4">
              <SkeletonRow cols={1} />
            </div>
          </>
        ) : (
          <>
            <KpiCard
              label="Total Sales (14d)"
              value={`£${kpis.totalSales.toFixed(2)}`}
              spark={trend}
            />
            <KpiCard
              label="Avg Ticket"
              value={`£${kpis.avgTicket.toFixed(2)}`}
            />
            <KpiCard label="Refunds" value={`£${kpis.refunds.toFixed(2)}`} />
            <KpiCard label="Success Rate" value={kpis.successRate} suffix="%" />
          </>
        )}
      </div>

      {/* Trend + Hardware */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Sales Trend (14 days)</div>
            <a href="/analytics" className="text-sm text-muted hover:text-text">
              Open Analytics
            </a>
          </div>
          <div className="mt-3">
            {trend?.length ? (
              <SparkTiny data={trend} />
            ) : (
              <div className="mt-6">
                <SkeletonRow cols={2} block />
              </div>
            )}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Hardware Health</div>
            <a
              href="/hardware/health"
              className="text-sm text-muted hover:text-text"
            >
              Manage
            </a>
          </div>
          {!hw.terms && !hw.prints ? (
            <div className="mt-3">
              <SkeletonRow cols={2} block />
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <Kpi label="Terminals Online" value={hwStats.tOnline} />
              <Kpi label="Terminals Paired" value={hwStats.tPaired} />
              <Kpi label="Terminals Offline" value={hwStats.tOffline} />
              <Kpi label="Printers Online" value={hwStats.pOnline} />
              <Kpi label="Printers Offline" value={hwStats.pOffline} />
            </div>
          )}
          {/* Quick list of issues */}
          {!!hw.terms && hw.terms.some((t) => t.status !== "online") && (
            <div className="mt-4">
              <div className="text-xs text-muted mb-1">Needs attention</div>
              <ul className="space-y-1 text-sm">
                {hw.terms
                  .filter((t) => t.status !== "online")
                  .slice(0, 3)
                  .map((t) => (
                    <li key={t.id} className="flex justify-between">
                      <span>{t.alias || t.serial}</span>
                      <span className="capitalize text-muted">{t.status}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Orders + Recent Transactions */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-0 overflow-hidden">
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-semibold">New Delivery Orders</div>
            <a
              href="/integrations/delivery-feed"
              className="text-sm text-muted hover:text-text"
            >
              Open feed
            </a>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="text-left text-muted">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Partner</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">When</th>
                </tr>
              </thead>
              <tbody>
                {!orders ? (
                  <>
                    <SkeletonRow cols={4} />
                    <SkeletonRow cols={4} />
                  </>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-8 text-center text-muted"
                    >
                      No new orders.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 6).map((o) => (
                    <tr
                      key={o.id}
                      className="border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-3 py-2">{o.number}</td>
                      <td className="px-3 py-2 capitalize">{o.partner}</td>
                      <td className="px-3 py-2">{o.customer || "—"}</td>
                      <td className="px-3 py-2">{timeAgo(o.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-semibold">Recent Transactions (24h)</div>
            <a
              href="/analytics/transactions"
              className="text-sm text-muted hover:text-text"
            >
              View all
            </a>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="text-left text-muted">
                <tr>
                  <th className="px-3 py-2">Txn</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Method</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {!txns ? (
                  <>
                    <SkeletonRow cols={5} />
                    <SkeletonRow cols={5} />
                  </>
                ) : txns.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-muted"
                    >
                      No transactions yet.
                    </td>
                  </tr>
                ) : (
                  txns.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                      <td className="px-3 py-2 capitalize">{r.type}</td>
                      <td className="px-3 py-2 capitalize">{r.method}</td>
                      <td
                        className={`px-3 py-2 ${
                          r.amount < 0 ? "text-red-600 dark:text-red-400" : ""
                        }`}
                      >
                        £{r.amount.toFixed(2)}
                      </td>
                      <td className="px-3 py-2">{timeAgo(r.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card p-4">
        <div className="font-semibold mb-2">Quick Links</div>
        <div className="flex flex-wrap gap-2">
          <a className="btn-ghost" href="/integrations/partners">
            Integrations
          </a>
          <a className="btn-ghost" href="/hardware/terminals">
            Terminals
          </a>
          <a className="btn-ghost" href="/hardware/printers">
            Printers
          </a>
          <a className="btn-ghost" href="/settings">
            Settings
          </a>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div
      className="p-3 rounded-lg border"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="text-xs text-muted">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - Number(ts)) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
