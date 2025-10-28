const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));

const K_INTS = "__ints_v1";
const K_HOOKS = "__hooks_v1";

export const INTEGRATION_PROVIDERS = [
  { code: "openai", label: "OpenAI" },
  { code: "notion", label: "Notion" },
  { code: "slack", label: "Slack" },
  { code: "stripe", label: "Stripe" },
];

export const WEBHOOK_EVENTS = [
  { code: "user.created", label: "User Created" },
  { code: "user.updated", label: "User Updated" },
  { code: "payment.succeeded", label: "Payment Succeeded" },
  { code: "payment.refunded", label: "Payment Refunded" },
];

function seed() {
  if (!localStorage.getItem(K_INTS)) {
    const rows = [
      {
        id: "int_1001",
        name: "Primary OpenAI",
        provider: "openai",
        status: "active",
        apiKey: "sk-live-***8f2",
        scopes: ["chat", "images"],
        updatedAt: Date.now() - 8640000,
      },
      {
        id: "int_1002",
        name: "Stripe Prod",
        provider: "stripe",
        status: "active",
        apiKey: "sk_live_***xyz",
        scopes: ["charges", "refunds"],
        updatedAt: Date.now() - 640000,
      },
    ];
    localStorage.setItem(K_INTS, JSON.stringify(rows));
  }
  if (!localStorage.getItem(K_HOOKS)) {
    const hooks = [
      {
        id: "wh_9001",
        url: "https://api.example.com/hooks/callback",
        active: true,
        secret: "whsec_***123",
        events: ["user.created", "payment.succeeded"],
        lastDeliveredAt: Date.now() - 3600_000,
        updatedAt: Date.now() - 720000,
      },
    ];
    localStorage.setItem(K_HOOKS, JSON.stringify(hooks));
  }
}
seed();

function read(k) {
  return JSON.parse(localStorage.getItem(k) || "[]");
}
function write(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

/* Integrations */
export async function listIntegrations({
  q = "",
  provider = "",
  status = "",
} = {}) {
  if (USE_MOCK) {
    await delay();
    const t = q.trim().toLowerCase();
    let rows = read(K_INTS);
    if (t)
      rows = rows.filter(
        (r) => r.name.toLowerCase().includes(t) || r.provider.includes(t)
      );
    if (provider) rows = rows.filter((r) => r.provider === provider);
    if (status) rows = rows.filter((r) => r.status === status);
    return { ok: true, data: rows };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/integrations", {
    params: { q, provider, status },
  });
  return { ok: true, data: data?.data ?? data };
}

export async function createIntegration(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_INTS);
    const row = {
      id: "int_" + Math.floor(Math.random() * 1e6),
      updatedAt: Date.now(),
      ...payload,
      apiKey: payload.apiKey ? maskKey(payload.apiKey) : "sk-***",
    };
    all.unshift(row);
    write(K_INTS, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/integrations", payload);
  return { ok: true, data: data?.data ?? data };
}

export async function updateIntegration(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_INTS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    const merged = { ...all[i], ...patch, updatedAt: Date.now() };
    if (patch.apiKey) merged.apiKey = maskKey(patch.apiKey);
    all[i] = merged;
    write(K_INTS, all);
    return { ok: true, data: merged };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/integrations/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}

export async function rotateIntegrationKey(id) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_INTS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i].apiKey = maskKey(
      "sk-rotated-" + Math.random().toString(36).slice(2, 8)
    );
    all[i].updatedAt = Date.now();
    write(K_INTS, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post(`/integrations/${id}/rotate`);
  return { ok: true, data: data?.data ?? data };
}

export async function deleteIntegration(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_INTS,
      read(K_INTS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/integrations/${id}`);
  return { ok: true };
}

function maskKey(k) {
  if (!k) return "****";
  const tail = k.slice(-3);
  return `${k.slice(0, 2)}***${tail}`;
}

/* Webhooks */
export async function listWebhooks({ q = "", active = "" } = {}) {
  if (USE_MOCK) {
    await delay();
    const t = q.trim().toLowerCase();
    let rows = read(K_HOOKS);
    if (t) rows = rows.filter((h) => h.url.toLowerCase().includes(t));
    if (active)
      rows = rows.filter((h) => (active === "true" ? h.active : !h.active));
    return { ok: true, data: rows };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/webhooks", { params: { q, active } });
  return { ok: true, data: data?.data ?? data };
}

export async function createWebhook(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_HOOKS);
    const row = {
      id: "wh_" + Math.floor(Math.random() * 1e6),
      updatedAt: Date.now(),
      lastDeliveredAt: null,
      ...payload,
      secret: payload.secret ? maskKey(payload.secret) : "whsec_***",
    };
    all.unshift(row);
    write(K_HOOKS, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/webhooks", payload);
  return { ok: true, data: data?.data ?? data };
}

export async function updateWebhook(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_HOOKS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    const merged = { ...all[i], ...patch, updatedAt: Date.now() };
    if (patch.secret) merged.secret = maskKey(patch.secret);
    all[i] = merged;
    write(K_HOOKS, all);
    return { ok: true, data: merged };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/webhooks/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}

export async function deleteWebhook(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_HOOKS,
      read(K_HOOKS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/webhooks/${id}`);
  return { ok: true };
}

export async function sendTestWebhook(id) {
  if (USE_MOCK) {
    await delay(600);
    const all = read(K_HOOKS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i].lastDeliveredAt = Date.now();
    all[i].updatedAt = Date.now();
    write(K_HOOKS, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post(`/webhooks/${id}/test`);
  return { ok: true, data: data?.data ?? data };
}
