const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));
const K = "__app_settings_v1";

function seed() {
  if (!localStorage.getItem(K)) {
    const now = Date.now();
    const data = {
      orgName: "Caldice Inc.",
      contactEmail: "admin@caldice.io",
      locale: "en",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      branding: {
        logoUrl: "",
        primaryColor: "#2563eb",
      },
      notifications: {
        emailReports: true,
        dailyDigest: true,
      },
      tokens: [
        {
          id: "tok_1001",
          name: "Admin API",
          last4: "A1B2",
          createdAt: now - 86_400_000,
        },
      ],
      updatedAt: now,
    };
    localStorage.setItem(K, JSON.stringify(data));
  }
}
seed();

function read() {
  return JSON.parse(localStorage.getItem(K) || "{}");
}
function write(v) {
  localStorage.setItem(K, JSON.stringify(v));
}

export async function getSettings() {
  if (USE_MOCK) {
    await delay(300);
    return { ok: true, data: read() };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/settings");
  return { ok: true, data: data?.data ?? data };
}

export async function saveSettings(patch) {
  if (USE_MOCK) {
    await delay(350);
    const cur = read();
    const data = { ...cur, ...patch, updatedAt: Date.now() };
    write(data);
    return { ok: true, data };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put("/settings", patch);
  return { ok: true, data: data?.data ?? data };
}

export async function uploadLogo(file) {
  if (USE_MOCK) {
    await delay(400);
    const url = URL.createObjectURL(file);
    const cur = read();
    cur.branding.logoUrl = url;
    cur.updatedAt = Date.now();
    write(cur);
    return { ok: true, data: { url } };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await client.post("/settings/logo", fd);
  return { ok: true, data: data?.data ?? data };
}

export async function createToken(name) {
  if (USE_MOCK) {
    await delay(350);
    const cur = read();
    const raw = Math.random().toString(36).slice(2, 10).toUpperCase();
    const last4 = raw.slice(-4);
    const tok = {
      id: "tok_" + Math.floor(Math.random() * 1e6),
      name,
      last4,
      createdAt: Date.now(),
    };
    cur.tokens.unshift(tok);
    cur.updatedAt = Date.now();
    write(cur);
    return { ok: true, data: tok, secret: `sk-live-${raw}` };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/settings/tokens", { name });
  return { ok: true, data: data?.data ?? data };
}

export async function revokeToken(id) {
  if (USE_MOCK) {
    await delay(300);
    const cur = read();
    cur.tokens = cur.tokens.filter((t) => t.id !== id);
    cur.updatedAt = Date.now();
    write(cur);
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/settings/tokens/${id}`);
  return { ok: true };
}
