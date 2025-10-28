const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const delay = (ms = 360) => new Promise((r) => setTimeout(r, ms));

const K_PRESETS = "__spin_presets_v1";
const K_GROUPS = "__filter_groups_v1";
const K_FAVS = "__favorites_v1";
const K_HIST = "__history_v1";
const K_DICE = "__dice_settings_v1";

function seed() {
  if (!localStorage.getItem(K_PRESETS)) {
    const presets = [
      {
        id: "sp1",
        name: "Quick Dinner",
        filters: { meal: "dinner", timeMax: 20, diet: "" },
        weight: 3,
        enabled: true,
        updatedAt: Date.now() - 86400000,
      },
      {
        id: "sp2",
        name: "Healthy Breakfast",
        filters: { meal: "breakfast", timeMax: 10, diet: "vegan" },
        weight: 2,
        enabled: true,
        updatedAt: Date.now() - 640000,
      },
    ];
    localStorage.setItem(K_PRESETS, JSON.stringify(presets));
  }
  if (!localStorage.getItem(K_GROUPS)) {
    const groups = [
      {
        id: "fg1",
        name: "Diet",
        code: "diet",
        items: [
          { code: "vegan", label: "Vegan" },
          { code: "veget", label: "Vegetarian" },
        ],
      },
      {
        id: "fg2",
        name: "Meal Type",
        code: "meal",
        items: [
          { code: "breakfast", label: "Breakfast" },
          { code: "dinner", label: "Dinner" },
        ],
      },
      {
        id: "fg3",
        name: "Difficulty",
        code: "difficulty",
        items: [
          { code: "easy", label: "Easy" },
          { code: "med", label: "Medium" },
        ],
      },
    ];
    localStorage.setItem(K_GROUPS, JSON.stringify(groups));
  }
  if (!localStorage.getItem(K_FAVS)) {
    const favs = Array.from({ length: 18 }).map((_, i) => ({
      id: "fav_" + (1000 + i),
      title: i % 2 ? "Spicy Chickpea Bowl" : "Overnight Oats",
      type: i % 3 ? "ai" : "local",
      locale: i % 2 ? "en" : "de",
      createdAt: Date.now() - i * 3600_000,
      user: {
        id: "usr_" + (i % 7),
        name: ["Alex", "Maria", "Jonas", "Nina", "Omar", "Lea", "Mateo"][i % 7],
      },
    }));
    localStorage.setItem(K_FAVS, JSON.stringify(favs));
  }
  if (!localStorage.getItem(K_HIST)) {
    const hist = Array.from({ length: 28 }).map((_, i) => ({
      id: "h_" + (2000 + i),
      action: i % 2 ? "spin" : "open_recipe",
      meta: {
        diet: i % 2 ? "vegan" : "veget",
        meal: i % 3 ? "dinner" : "breakfast",
      },
      at: Date.now() - i * 1800_000,
      userId: "usr_" + (i % 5),
    }));
    localStorage.setItem(K_HIST, JSON.stringify(hist));
  }
  if (!localStorage.getItem(K_DICE)) {
    const dice = {
      enabled: true,
      vibration: true,
      fairness: "random",
      winningChance: 50,
      confetti: true,
    };
    localStorage.setItem(K_DICE, JSON.stringify(dice));
  }
}
seed();

function read(k) {
  return JSON.parse(localStorage.getItem(k) || "[]");
}
function write(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

/* Spin Presets CRUD */
export async function listPresets({ q = "" } = {}) {
  if (USE_MOCK) {
    await delay();
    const t = q.trim().toLowerCase();
    let rows = read(K_PRESETS);
    if (t) rows = rows.filter((x) => x.name.toLowerCase().includes(t));
    return { ok: true, data: rows };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/discovery/presets", { params: { q } });
  return { ok: true, data: data?.data ?? data };
}
export async function createPreset(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_PRESETS);
    const row = {
      id: "sp" + Math.floor(Math.random() * 1e6),
      updatedAt: Date.now(),
      ...payload,
    };
    all.unshift(row);
    write(K_PRESETS, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/discovery/presets", payload);
  return { ok: true, data: data?.data ?? data };
}
export async function updatePreset(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_PRESETS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i] = { ...all[i], ...patch, updatedAt: Date.now() };
    write(K_PRESETS, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/discovery/presets/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}
export async function deletePreset(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_PRESETS,
      read(K_PRESETS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/discovery/presets/${id}`);
  return { ok: true };
}

/* Filter Groups CRUD */
export async function listGroups({ q = "" } = {}) {
  if (USE_MOCK) {
    await delay();
    let rows = read(K_GROUPS);
    const t = q.trim().toLowerCase();
    if (t)
      rows = rows.filter(
        (g) =>
          g.name.toLowerCase().includes(t) || g.code.toLowerCase().includes(t)
      );
    return { ok: true, data: rows };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/discovery/groups", { params: { q } });
  return { ok: true, data: data?.data ?? data };
}
export async function createGroup(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_GROUPS);
    const row = { id: "fg" + Math.floor(Math.random() * 1e6), ...payload };
    all.unshift(row);
    write(K_GROUPS, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/discovery/groups", payload);
  return { ok: true, data: data?.data ?? data };
}
export async function updateGroup(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_GROUPS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i] = { ...all[i], ...patch };
    write(K_GROUPS, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/discovery/groups/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}
export async function deleteGroup(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_GROUPS,
      read(K_GROUPS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/discovery/groups/${id}`);
  return { ok: true };
}

/* Favorites & History */
export async function listFavorites({
  page = 1,
  pageSize = 10,
  q = "",
  type,
  locale,
} = {}) {
  if (USE_MOCK) {
    await delay();
    let all = read(K_FAVS);
    const t = q.trim().toLowerCase();
    if (t)
      all = all.filter(
        (f) =>
          f.title.toLowerCase().includes(t) ||
          f.user.name.toLowerCase().includes(t)
      );
    if (type) all = all.filter((f) => f.type === type);
    if (locale) all = all.filter((f) => f.locale === locale);
    const total = all.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const rows = all.slice(start, start + pageSize);
    return { ok: true, data: { rows, total, page, pages } };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/engagement/favorites", {
    params: { page, pageSize, q, type, locale },
  });
  return { ok: true, data: data?.data ?? data };
}
export async function removeFavorite(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_FAVS,
      read(K_FAVS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/engagement/favorites/${id}`);
  return { ok: true };
}

export async function listHistory({
  page = 1,
  pageSize = 12,
  q = "",
  action,
} = {}) {
  if (USE_MOCK) {
    await delay();
    let all = read(K_HIST);
    const t = q.trim().toLowerCase();
    if (t)
      all = all.filter(
        (h) =>
          h.action.toLowerCase().includes(t) || (h.meta?.meal || "").includes(t)
      );
    if (action) all = all.filter((h) => h.action === action);
    const total = all.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const rows = all.slice(start, start + pageSize);
    return { ok: true, data: { rows, total, page, pages } };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/engagement/history", {
    params: { page, pageSize, q, action },
  });
  return { ok: true, data: data?.data ?? data };
}
export async function clearHistory() {
  if (USE_MOCK) {
    await delay();
    write(K_HIST, []);
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete("/engagement/history");
  return { ok: true };
}

/* Dice settings */
export async function getDiceSettings() {
  if (USE_MOCK) {
    await delay();
    return { ok: true, data: JSON.parse(localStorage.getItem(K_DICE) || "{}") };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/engagement/dice-settings");
  return { ok: true, data: data?.data ?? data };
}
export async function saveDiceSettings(patch) {
  if (USE_MOCK) {
    await delay();
    const cur = JSON.parse(localStorage.getItem(K_DICE) || "{}");
    const next = { ...cur, ...patch };
    localStorage.setItem(K_DICE, JSON.stringify(next));
    return { ok: true, data: next };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put("/engagement/dice-settings", patch);
  return { ok: true, data: data?.data ?? data };
}
