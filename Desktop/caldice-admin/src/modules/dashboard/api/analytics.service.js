const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));
const KPI_KEY = "__dashboard_kpis_v1";
const FEED_KEY = "__dashboard_feed_v1";

function rand(n = 100) {
  return Math.round(Math.random() * n);
}
function seed() {
  if (!localStorage.getItem(KPI_KEY)) {
    const today = Date.now();
    const series = Array.from({ length: 24 }, (_, i) => ({
      t: today - (23 - i) * 3600_000,
      v: 50 + Math.round(Math.sin(i / 2) * 20) + rand(10),
    }));
    const base = {
      revenue: { label: "Revenue", value: 48250, delta: 12.4, series },
      orders: {
        label: "Orders",
        value: 1267,
        delta: -2.1,
        series: series.map((s) => ({ t: s.t, v: s.v * 0.4 + rand(6) })),
      },
      aov: {
        label: "Avg. Order Value",
        value: 38.1,
        delta: 3.2,
        series: series.map((s) => ({ t: s.t, v: s.v * 0.12 + rand(3) })),
      },
      refunds: {
        label: "Refunds",
        value: 23,
        delta: 1.0,
        series: series.map((s) => ({ t: s.t, v: s.v * 0.05 + rand(2) })),
      },
    };
    localStorage.setItem(KPI_KEY, JSON.stringify(base));
  }
  if (!localStorage.getItem(FEED_KEY)) {
    const feed = [
      {
        id: "f1",
        type: "order",
        title: "New order #10483",
        meta: "$54.00 • Main St",
        ts: Date.now() - 9 * 60_000,
      },
      {
        id: "f2",
        type: "refund",
        title: "Refund issued #10431",
        meta: "$12.00 • Visa",
        ts: Date.now() - 45 * 60_000,
      },
      {
        id: "f3",
        type: "printer",
        title: "Kitchen printer reconnected",
        meta: "Kitchen-1",
        ts: Date.now() - 2 * 3600_000,
      },
      {
        id: "f4",
        type: "integration",
        title: "Uber Eats menu sync complete",
        meta: "14 items updated",
        ts: Date.now() - 6 * 3600_000,
      },
    ];
    localStorage.setItem(FEED_KEY, JSON.stringify(feed));
  }
}
seed();

export async function getDashboardKpis() {
  if (USE_MOCK) {
    await delay();
    const data = JSON.parse(localStorage.getItem(KPI_KEY));
    return { ok: true, data };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/analytics/kpis");
  return { ok: true, data: data?.data ?? data };
}

export async function getActivityFeed() {
  if (USE_MOCK) {
    await delay();
    const data = JSON.parse(localStorage.getItem(FEED_KEY) || "[]");
    return { ok: true, data };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/activity/feed");
  return { ok: true, data: data?.data ?? data };
}
