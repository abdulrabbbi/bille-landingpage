const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const STORAGE_KEY = "__users_access_seed_v1";
const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));

function seedOnce() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);

  const roles = ["admin", "moderator", "user"];
  const subs = ["free", "premium"];
  const statuses = ["active", "suspended"];

  const names = [
    "Alex Rivera",
    "María Gómez",
    "Daniel Klein",
    "Sara Ahmed",
    "Lucas Weber",
    "Nina Rossi",
    "Omar Ali",
    "Anna Schmidt",
    "Diego Torres",
    "Clara Müller",
    "Elena Petrova",
    "Jonah Ford",
    "Eva Novak",
    "Mateo Diaz",
    "Sofia Silva",
    "Noah Brown",
    "Lea Bauer",
    "Hugo Martin",
  ];

  const users = Array.from({ length: 36 }).map((_, i) => {
    const name = names[i % names.length];
    const email = `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
    const role = roles[i % roles.length];
    const subscription = subs[(i + 1) % subs.length];
    const status = statuses[i % statuses.length];
    const lang = i % 3 === 0 ? "en" : "de";
    const createdAt = Date.now() - i * 1000 * 60 * 60 * 12;
    return {
      id: "usr_" + (1000 + i),
      name,
      email,
      role,
      subscription,
      status,
      language: lang,
      createdAt,
    };
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return users;
}

function readAll() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function listUsers({
  page = 1,
  pageSize = 10,
  q = "",
  role,
  status,
  subscription,
} = {}) {
  if (USE_MOCK) {
    await delay();
    const all = seedOnce();

    const term = q.trim().toLowerCase();
    let filtered = all.filter((u) =>
      term
        ? u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
        : true
    );

    if (role) filtered = filtered.filter((u) => u.role === role);
    if (status) filtered = filtered.filter((u) => u.status === status);
    if (subscription)
      filtered = filtered.filter((u) => u.subscription === subscription);

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const rows = filtered.slice(start, start + pageSize);

    return { ok: true, data: { rows, total, page, pages } };
  }

  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/users", {
    params: { page, pageSize, q, role, status, subscription },
  });
  return { ok: true, data: data?.data ?? data };
}

export async function getUser(id) {
  if (USE_MOCK) {
    await delay();
    const all = readAll();
    const item = all.find((u) => u.id === id);
    return { ok: !!item, data: item };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get(`/users/${id}`);
  return { ok: true, data: data?.data ?? data };
}

export async function createUser(payload) {
  if (USE_MOCK) {
    await delay();
    const all = readAll();
    const id = "usr_" + Math.floor(Math.random() * 1e6);
    const now = Date.now();
    const row = {
      id,
      name: payload.name,
      email: payload.email,
      role: payload.role || "user",
      subscription: payload.subscription || "free",
      status: payload.status || "active",
      language: payload.language || "en",
      createdAt: now,
    };
    all.unshift(row);
    writeAll(all);
    return { ok: true, data: row };
  }

  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/users", payload);
  return { ok: true, data: data?.data ?? data };
}

export async function updateUser(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = readAll();
    const idx = all.findIndex((u) => u.id === id);
    if (idx === -1) return { ok: false };
    all[idx] = { ...all[idx], ...patch };
    writeAll(all);
    return { ok: true, data: all[idx] };
  }

  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/users/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}

export async function deleteUser(id) {
  if (USE_MOCK) {
    await delay();
    const all = readAll();
    const next = all.filter((u) => u.id !== id);
    writeAll(next);
    return { ok: true };
  }

  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/users/${id}`);
  return { ok: true };
}
