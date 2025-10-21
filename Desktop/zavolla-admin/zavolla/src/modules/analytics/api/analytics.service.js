import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta?.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 420) => new Promise((r) => setTimeout(r, ms));

/* ---------------- Mock DB ---------------- */
const today = Date.now();
const day = 86_400_000;
const rnd = (min, max) => +(min + Math.random() * (max - min)).toFixed(2);

let txns = Array.from({ length: 120 }).map((_, i) => ({
  id: `tx_${i + 1}`,
  orderId: i % 5 === 0 ? null : `o_${1000 + i}`,
  userId: i % 4 === 0 ? "u_member" : "u_admin",
  type: i % 7 === 0 ? "refund" : "sale",
  method: ["card", "cash", "wallet"][i % 3],
  status: i % 11 === 0 ? "failed" : "succeeded",
  amount: i % 7 === 0 ? rnd(2, 15) * -1 : rnd(3, 35),
  locationId: i % 2 === 0 ? "l1" : "l2",
  createdAt: today - (i % 30) * day - rnd(0, 20_000_000),
  items: [
    { name: "Burger", qty: 1, price: 9.9 },
    ...(i % 3 ? [{ name: "Cola", qty: 1, price: 2.5 }] : []),
  ],
}));

/* ---------------- Queries ---------------- */
export async function fetchKpis({ from, to, mineOnly = false, userId }) {
  if (USE_MOCK) {
    await sleep();
    const rows = txns.filter(
      (x) =>
        (!from || x.createdAt >= from) &&
        (!to || x.createdAt <= to) &&
        (!mineOnly || x.userId === userId)
    );
    const sales = rows
      .filter((r) => r.type === "sale" && r.status === "succeeded")
      .reduce((s, r) => s + r.amount, 0);
    const refunds = rows
      .filter((r) => r.type === "refund")
      .reduce((s, r) => s + Math.abs(r.amount), 0);
    const tickets =
      rows.filter((r) => r.type === "sale" && r.status === "succeeded")
        .length || 1;
    const success =
      (rows.filter((r) => r.status === "succeeded").length /
        (rows.length || 1)) *
      100;

    // last 14 days spark
    const buckets = Array.from({ length: 14 }).map((_, i) => {
      const start = today - (13 - i) * day;
      const end = start + day;
      const sum = rows
        .filter(
          (r) =>
            r.createdAt >= start &&
            r.createdAt < end &&
            r.type === "sale" &&
            r.status === "succeeded"
        )
        .reduce((s, r) => s + r.amount, 0);
      return +sum.toFixed(2);
    });

    return {
      ok: true,
      data: {
        totalSales: +sales.toFixed(2),
        avgTicket: +(sales / tickets).toFixed(2),
        refunds: +refunds.toFixed(2),
        successRate: +success.toFixed(1),
        spark: buckets,
      },
    };
  }
  const { data } = await api.get("/analytics/kpis", {
    params: { from, to, mineOnly, userId },
  });
  return data;
}

export async function fetchTransactions({
  q = "",
  type = "all",
  status = "all",
  method = "all",
  from,
  to,
  mineOnly = false,
  userId,
  location = "all",
}) {
  if (USE_MOCK) {
    await sleep();
    const str = q.toLowerCase();
    const rows = txns
      .filter(
        (t) =>
          (!from || t.createdAt >= from) &&
          (!to || t.createdAt <= to) &&
          (type === "all" || t.type === type) &&
          (status === "all" || t.status === status) &&
          (method === "all" || t.method === method) &&
          (location === "all" || t.locationId === location) &&
          (!mineOnly || t.userId === userId) &&
          (t.id + (t.orderId || "") + t.method + t.type)
            .toLowerCase()
            .includes(str)
      )
      .sort((a, b) => b.createdAt - a.createdAt);
    return { ok: true, data: rows };
  }
  const { data } = await api.get("/analytics/transactions", {
    params: { q, type, status, method, from, to, mineOnly, userId, location },
  });
  return data;
}

export async function exportTransactionsCsv(params) {
  if (USE_MOCK) {
    const { data } = await fetchTransactions(params);
    const header = [
      "id",
      "orderId",
      "type",
      "method",
      "status",
      "amount",
      "locationId",
      "createdAt",
    ];
    const lines = [header.join(",")].concat(
      data.map((r) =>
        [
          r.id,
          r.orderId || "",
          r.type,
          r.method,
          r.status,
          r.amount,
          r.locationId,
          new Date(r.createdAt).toISOString(),
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
    );
    const csv = lines.join("\n");
    return { ok: true, csv };
  }
  const { data } = await api.get("/analytics/transactions.csv", {
    params,
    responseType: "text",
  });
  return { ok: true, csv: data };
}
