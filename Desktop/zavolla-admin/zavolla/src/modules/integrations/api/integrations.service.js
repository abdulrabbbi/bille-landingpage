import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta?.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 420) => new Promise((r) => setTimeout(r, ms));
const uid = (p = "id") => p + Math.random().toString(36).slice(2, 10);

/* ---------------- Mock DB ---------------- */
const PARTNERS = ["ubereats", "deliveroo", "justeat", "storekit"];
let connectors = [
  {
    id: "cx1",
    businessId: "b1",
    partner: "ubereats",
    status: "connected",
    locations: ["l1"],
    autoPrint: true,
    lastSync: Date.now() - 60_000,
    meta: { merchantId: "UE-12345" },
  },
  {
    id: "cx2",
    businessId: "b1",
    partner: "deliveroo",
    status: "paused",
    locations: ["l1", "l2"],
    autoPrint: false,
    lastSync: Date.now() - 86_000_00,
    meta: { merchantId: "DO-888" },
  },
];
let menuMaps = {
  // partnerId -> { categoryId:boolean }
  cx1: { c1: true, c2: true, c3: true },
  cx2: { c1: true, c2: true },
};
let dOrders = [
  {
    id: "do1",
    partner: "ubereats",
    locationId: "l1",
    number: "#UE-4501",
    customer: "Alex P.",
    items: [
      { name: "Burger", qty: 1 },
      { name: "Cola", qty: 2 },
    ],
    note: "Leave at door",
    status: "new",
    autoPrinted: false,
    createdAt: Date.now() - 120_000,
  },
  {
    id: "do2",
    partner: "deliveroo",
    locationId: "l1",
    number: "#DO-7762",
    customer: "Mia K.",
    items: [{ name: "Soup", qty: 1 }],
    note: "",
    status: "ready",
    autoPrinted: true,
    createdAt: Date.now() - 3_600_000,
  },
];
let webhookLogs = [
  {
    id: "wh1",
    partner: "ubereats",
    event: "order.created",
    status: "200",
    ts: Date.now() - 130_000,
    body: { orderId: "do1" },
  },
  {
    id: "wh2",
    partner: "deliveroo",
    event: "menu.pull",
    status: "200",
    ts: Date.now() - 86_000_00,
    body: { categories: 12 },
  },
];

/* ---------------- Partners ---------------- */
export async function fetchPartners(businessId = "b1", { q = "" } = {}) {
  if (USE_MOCK) {
    await sleep();
    const data = connectors
      .filter((c) => c.businessId === businessId)
      .filter((c) =>
        (c.partner + (c.meta?.merchantId || "") + c.locations.join(","))
          ?.toLowerCase()
          .includes(q.toLowerCase())
      )
      .sort((a, b) => b.lastSync - a.lastSync);
    return { ok: true, data };
  }
  const { data } = await api.get(`/integrations/${businessId}/connectors`, {
    params: { q },
  });
  return data;
}

export async function upsertPartner(payload) {
  if (USE_MOCK) {
    await sleep();
    if (payload.id) {
      connectors = connectors.map((c) =>
        c.id === payload.id ? { ...c, ...payload } : c
      );
      return { ok: true, data: connectors.find((c) => c.id === payload.id) };
    }
    const c = {
      id: uid("cx"),
      businessId: "b1",
      status: "connected",
      lastSync: Date.now(),
      autoPrint: false,
      ...payload,
    };
    connectors = [c, ...connectors];
    return { ok: true, data: c };
  }
  const { data } = await api.post(`/integrations/connectors`, payload);
  return data;
}

export async function deletePartner(connectorId) {
  if (USE_MOCK) {
    await sleep();
    connectors = connectors.filter((c) => c.id !== connectorId);
    delete menuMaps[connectorId];
    return { ok: true };
  }
  const { data } = await api.delete(`/integrations/connectors/${connectorId}`);
  return data;
}

export async function testPartner(connectorId) {
  if (USE_MOCK) {
    await sleep(600);
    const ok = Math.random() > 0.1;
    connectors = connectors.map((c) =>
      c.id === connectorId ? { ...c, status: ok ? "connected" : "error" } : c
    );
    return { ok, message: ok ? "OK" : "Auth failed" };
  }
  const { data } = await api.post(
    `/integrations/connectors/${connectorId}/test`
  );
  return data;
}

export async function toggleAutoPrint(connectorId, on) {
  if (USE_MOCK) {
    await sleep();
    connectors = connectors.map((c) =>
      c.id === connectorId ? { ...c, autoPrint: !!on } : c
    );
    return { ok: true };
  }
  const { data } = await api.post(
    `/integrations/connectors/${connectorId}/auto-print`,
    { on }
  );
  return data;
}

export async function pausePartner(connectorId, paused) {
  if (USE_MOCK) {
    await sleep();
    connectors = connectors.map((c) =>
      c.id === connectorId
        ? { ...c, status: paused ? "paused" : "connected" }
        : c
    );
    return { ok: true };
  }
  const { data } = await api.post(
    `/integrations/connectors/${connectorId}/pause`,
    { paused }
  );
  return data;
}

/* ---------------- Menu Sync ---------------- */
export async function fetchMenuMap(connectorId) {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: menuMaps[connectorId] || {} };
  }
  const { data } = await api.get(
    `/integrations/connectors/${connectorId}/menu-map`
  );
  return data;
}

export async function saveMenuMap(connectorId, mapping) {
  if (USE_MOCK) {
    await sleep(600);
    menuMaps[connectorId] = mapping;
    connectors = connectors.map((c) =>
      c.id === connectorId ? { ...c, lastSync: Date.now() } : c
    );
    return { ok: true };
  }
  const { data } = await api.put(
    `/integrations/connectors/${connectorId}/menu-map`,
    mapping
  );
  return data;
}

/* ---------------- Delivery Orders ---------------- */
export async function fetchDeliveryOrders({ q = "", status = "all" } = {}) {
  if (USE_MOCK) {
    await sleep();
    const data = dOrders
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) =>
        (
          o.number +
          o.customer +
          o.partner +
          o.items.map((i) => i.name).join(" ")
        )
          .toLowerCase()
          .includes(q.toLowerCase())
      )
      .sort((a, b) => b.createdAt - a.createdAt);
    return { ok: true, data };
  }
  const { data } = await api.get(`/integrations/orders`, {
    params: { q, status },
  });
  return data;
}

export async function updateDeliveryOrder(id, patch) {
  if (USE_MOCK) {
    await sleep();
    dOrders = dOrders.map((o) => (o.id === id ? { ...o, ...patch } : o));
    return { ok: true };
  }
  const { data } = await api.patch(`/integrations/orders/${id}`, patch);
  return data;
}

/* ---------------- Webhooks ---------------- */
export async function fetchWebhookLogs({ partner = "all" } = {}) {
  if (USE_MOCK) {
    await sleep();
    const data = webhookLogs
      .filter((w) => partner === "all" || w.partner === partner)
      .sort((a, b) => b.ts - a.ts);
    return { ok: true, data };
  }
  const { data } = await api.get(`/integrations/webhooks`, {
    params: { partner },
  });
  return data;
}

/* ---------------- Helpers ---------------- */
export function partnerLabel(k) {
  const m = {
    ubereats: "Uber Eats",
    deliveroo: "Deliveroo",
    justeat: "Just Eat",
    storekit: "Storekit",
  };
  return m[k] || k;
}
export function partners() {
  return PARTNERS;
}
