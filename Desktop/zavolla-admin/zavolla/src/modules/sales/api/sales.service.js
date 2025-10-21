import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta?.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const id = (p = "id") => p + Math.random().toString(36).slice(2, 10);

/* ---------------- Mock DB ---------------- */
let orders = [
  {
    id: "o1",
    locationId: "l1",
    tableId: "t1",
    number: "#1024",
    status: "open",
    note: "No onions",
    items: [
      { id: "oi1", name: "Burger", qty: 1, price: 9.9 },
      { id: "oi2", name: "Cola", qty: 2, price: 2.5 },
    ],
    totals: { sub: 14.9, disc: 0, tax: 2.98, grand: 17.88 },
    printed: false,
    createdAt: Date.now() - 60_000,
  },
  {
    id: "o2",
    locationId: "l1",
    tableId: "t2",
    number: "#1025",
    status: "parked",
    note: "",
    items: [{ id: "oi3", name: "Soup", qty: 1, price: 4.5 }],
    totals: { sub: 4.5, disc: 0, tax: 0.9, grand: 5.4 },
    printed: false,
    createdAt: Date.now() - 120_000,
  },
  {
    id: "o3",
    locationId: "l1",
    tableId: null,
    number: "#1026",
    status: "paid",
    note: "",
    items: [{ id: "oi4", name: "Cola", qty: 1, price: 2.5 }],
    totals: { sub: 2.5, disc: 0, tax: 0.5, grand: 3.0 },
    printed: true,
    createdAt: Date.now() - 3_600_000,
  },
];
let sessions = [
  {
    id: "ps1",
    orderId: "o3",
    amount: 3.0,
    terminal: "WisePad3-01",
    status: "succeeded",
    createdAt: Date.now() - 3_600_000,
  },
];
let refunds = [
  // { id:"rf1", paymentSessionId:"ps1", amount:1.5, type:"partial", status:"succeeded", createdAt:... }
];

/* ------------- Helpers ------------- */
function computeTotals(items) {
  const sub = items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = +(sub * 0.2).toFixed(2);
  const grand = +(sub + tax).toFixed(2);
  return { sub: +sub.toFixed(2), disc: 0, tax, grand };
}

/* ------------- Orders ------------- */
export async function fetchOrders(params = { q: "", status: "all" }) {
  if (USE_MOCK) {
    await sleep();
    const q = params.q?.toLowerCase?.() || "";
    let data = orders
      .filter(
        (o) =>
          (params.status === "all" ? true : o.status === params.status) &&
          (o.number + o.note + (o.items?.map((i) => i.name).join(" ") || ""))
            .toLowerCase()
            .includes(q)
      )
      .sort((a, b) => b.createdAt - a.createdAt);
    return { ok: true, data };
  }
  const { data } = await api.get("/sales/orders", { params });
  return data;
}

export async function upsertOrder(payload) {
  if (USE_MOCK) {
    await sleep();
    if (payload.id) {
      orders = orders.map((o) =>
        o.id === payload.id
          ? {
              ...o,
              ...payload,
              totals: computeTotals(payload.items || o.items),
            }
          : o
      );
      return { ok: true, data: orders.find((o) => o.id === payload.id) };
    }
    const o = {
      id: id("o"),
      number: `#${1000 + orders.length + 1}`,
      status: "open",
      printed: false,
      createdAt: Date.now(),
      ...payload,
    };
    o.totals = computeTotals(o.items || []);
    orders = [o, ...orders];
    return { ok: true, data: o };
  }
  const { data } = await api.post("/sales/orders", payload);
  return data;
}

export async function parkOrder(idOrder) {
  if (USE_MOCK) {
    await sleep();
    orders = orders.map((o) =>
      o.id === idOrder ? { ...o, status: "parked" } : o
    );
    return { ok: true };
  }
  const { data } = await api.post(`/sales/orders/${idOrder}/park`);
  return data;
}
export async function reopenOrder(idOrder) {
  if (USE_MOCK) {
    await sleep();
    orders = orders.map((o) =>
      o.id === idOrder ? { ...o, status: "open" } : o
    );
    return { ok: true };
  }
  const { data } = await api.post(`/sales/orders/${idOrder}/reopen`);
  return data;
}
export async function completeOrder(idOrder) {
  if (USE_MOCK) {
    await sleep();
    orders = orders.map((o) =>
      o.id === idOrder ? { ...o, status: "paid", printed: true } : o
    );
    return { ok: true };
  }
  const { data } = await api.post(`/sales/orders/${idOrder}/complete`);
  return data;
}
export async function splitOrder(idOrder, itemIds) {
  if (USE_MOCK) {
    await sleep();
    let src = orders.find((o) => o.id === idOrder);
    if (!src) return { ok: false };
    const moving = src.items.filter((i) => itemIds.includes(i.id));
    const keep = src.items.filter((i) => !itemIds.includes(i.id));
    const newOrder = {
      ...src,
      id: id("o"),
      number: `#${1000 + orders.length + 1}`,
      status: "open",
      printed: false,
      createdAt: Date.now(),
      items: moving,
      tableId: src.tableId,
    };
    newOrder.totals = computeTotals(moving);
    src = { ...src, items: keep, totals: computeTotals(keep) };
    orders = orders.map((o) => (o.id === idOrder ? src : o));
    orders = [newOrder, ...orders];
    return { ok: true, data: { source: src, target: newOrder } };
  }
  const { data } = await api.post(`/sales/orders/${idOrder}/split`, {
    itemIds,
  });
  return data;
}
export async function voidOrder(idOrder, reason) {
  if (USE_MOCK) {
    await sleep();
    orders = orders.map((o) =>
      o.id === idOrder ? { ...o, status: "void" } : o
    );
    // append audit entry in a real app
    return { ok: true };
  }
  const { data } = await api.post(`/sales/orders/${idOrder}/void`, { reason });
  return data;
}

/* ------------- Payments ------------- */
export async function fetchSessions(params = {}) {
  if (USE_MOCK) {
    await sleep();
    return {
      ok: true,
      data: sessions.sort((a, b) => b.createdAt - a.createdAt),
    };
  }
  const { data } = await api.get("/sales/sessions", { params });
  return data;
}
export async function createSession({ orderId, amount, terminal }) {
  if (USE_MOCK) {
    await sleep();
    const s = {
      id: id("ps"),
      orderId,
      amount,
      terminal,
      status: "pending",
      createdAt: Date.now(),
    };
    sessions = [s, ...sessions];
    // simulate terminal result
    setTimeout(() => {
      s.status = "succeeded";
    }, 1200);
    return { ok: true, data: s };
  }
  const { data } = await api.post("/sales/sessions", {
    orderId,
    amount,
    terminal,
  });
  return data;
}

/* ------------- Refunds ------------- */
export async function fetchRefunds(params = {}) {
  if (USE_MOCK) {
    await sleep();
    return {
      ok: true,
      data: refunds.sort((a, b) => b.createdAt - a.createdAt),
    };
  }
  const { data } = await api.get("/sales/refunds", { params });
  return data;
}
export async function createRefund({ paymentSessionId, amount, type }) {
  if (USE_MOCK) {
    await sleep();
    const r = {
      id: id("rf"),
      paymentSessionId,
      amount,
      type,
      status: "succeeded",
      createdAt: Date.now(),
    };
    refunds = [r, ...refunds];
    return { ok: true, data: r };
  }
  const { data } = await api.post("/sales/refunds", {
    paymentSessionId,
    amount,
    type,
  });
  return data;
}
