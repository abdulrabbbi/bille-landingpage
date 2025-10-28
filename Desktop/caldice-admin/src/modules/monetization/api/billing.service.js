const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));

const K_PLANS = "__billing_plans_v1";
const K_COUPONS = "__billing_coupons_v1";

function seed() {
  if (!localStorage.getItem(K_PLANS)) {
    const plans = [
      {
        id: "p_basic",
        name: "Basic",
        code: "basic",
        price: 0,
        interval: "month",
        features: ["Limited access"],
        status: "active",
        updatedAt: Date.now() - 86400000,
      },
      {
        id: "p_pro",
        name: "Pro",
        code: "pro",
        price: 9.99,
        interval: "month",
        features: ["All features", "Priority support"],
        status: "active",
        updatedAt: Date.now() - 540000,
      },
    ];
    localStorage.setItem(K_PLANS, JSON.stringify(plans));
  }
  if (!localStorage.getItem(K_COUPONS)) {
    const coupons = [
      {
        id: "c10",
        code: "WELCOME10",
        type: "percent",
        value: 10,
        active: true,
        maxRedemptions: 1000,
        used: 128,
        expiresAt: Date.now() + 86_400_000 * 30,
        updatedAt: Date.now() - 7200000,
      },
      {
        id: "c5f",
        code: "FIVEOFF",
        type: "fixed",
        value: 5,
        active: true,
        maxRedemptions: 500,
        used: 87,
        expiresAt: null,
        updatedAt: Date.now() - 960000,
      },
    ];
    localStorage.setItem(K_COUPONS, JSON.stringify(coupons));
  }
}
seed();

function read(k) {
  return JSON.parse(localStorage.getItem(k) || "[]");
}
function write(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

/* Plans */
export async function listPlans({ q = "" } = {}) {
  if (USE_MOCK) {
    await delay();
    const t = q.trim().toLowerCase();
    let rows = read(K_PLANS);
    if (t)
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(t) || p.code.toLowerCase().includes(t)
      );
    return { ok: true, data: rows };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/billing/plans", { params: { q } });
  return { ok: true, data: data?.data ?? data };
}

export async function createPlan(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_PLANS);
    const row = {
      id: "p_" + Math.floor(Math.random() * 1e6),
      updatedAt: Date.now(),
      ...payload,
    };
    all.unshift(row);
    write(K_PLANS, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/billing/plans", payload);
  return { ok: true, data: data?.data ?? data };
}

export async function updatePlan(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_PLANS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i] = { ...all[i], ...patch, updatedAt: Date.now() };
    write(K_PLANS, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/billing/plans/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}

export async function deletePlan(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_PLANS,
      read(K_PLANS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/billing/plans/${id}`);
  return { ok: true };
}

/* Coupons */
export async function listCoupons({ q = "" } = {}) {
  if (USE_MOCK) {
    await delay();
    const t = q.trim().toLowerCase();
    let rows = read(K_COUPONS);
    if (t) rows = rows.filter((c) => c.code.toLowerCase().includes(t));
    return { ok: true, data: rows };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/billing/coupons", { params: { q } });
  return { ok: true, data: data?.data ?? data };
}

export async function createCoupon(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_COUPONS);
    const row = {
      id: "c_" + Math.floor(Math.random() * 1e6),
      updatedAt: Date.now(),
      used: 0,
      ...payload,
    };
    all.unshift(row);
    write(K_COUPONS, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/billing/coupons", payload);
  return { ok: true, data: data?.data ?? data };
}

export async function updateCoupon(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_COUPONS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i] = { ...all[i], ...patch, updatedAt: Date.now() };
    write(K_COUPONS, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/billing/coupons/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}

export async function deleteCoupon(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_COUPONS,
      read(K_COUPONS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/billing/coupons/${id}`);
  return { ok: true };
}
