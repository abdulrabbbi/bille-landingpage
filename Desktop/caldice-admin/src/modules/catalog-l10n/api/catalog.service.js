const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const K_DISHES = "__catalog_dishes_v1";
const K_TAGS = "__catalog_tags_v1";
const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));

function seed() {
  if (!localStorage.getItem(K_TAGS)) {
    const tags = [
      {
        id: "t1",
        kind: "diet",
        code: "vegan",
        label: { en: "Vegan", de: "Vegan" },
      },
      {
        id: "t2",
        kind: "diet",
        code: "veget",
        label: { en: "Vegetarian", de: "Vegetarisch" },
      },
      {
        id: "t3",
        kind: "meal",
        code: "breakfast",
        label: { en: "Breakfast", de: "Frühstück" },
      },
      {
        id: "t4",
        kind: "meal",
        code: "dinner",
        label: { en: "Dinner", de: "Abendessen" },
      },
      {
        id: "t5",
        kind: "diff",
        code: "easy",
        label: { en: "Easy", de: "Einfach" },
      },
    ];
    localStorage.setItem(K_TAGS, JSON.stringify(tags));
  }
  if (!localStorage.getItem(K_DISHES)) {
    const dishes = [
      {
        id: "d1",
        title: { en: "Spaghetti Aglio e Olio", de: "Spaghetti Aglio e Olio" },
        description: { en: "Garlic, oil, chili.", de: "Knoblauch, Öl, Chili." },
        tags: ["dinner", "easy"],
        diet: "veget",
        meal: "dinner",
        timeMinutes: 15,
        cost: "low",
        youtube: "https://www.youtube.com/watch?v=3AAdKl1UYZs",
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        id: "d2",
        title: { en: "Overnight Oats", de: "Overnight Oats" },
        description: {
          en: "Oats with milk or alt milk.",
          de: "Haferflocken mit Milch.",
        },
        tags: ["breakfast", "easy", "vegan"],
        diet: "vegan",
        meal: "breakfast",
        timeMinutes: 5,
        cost: "low",
        youtube: "",
        createdAt: Date.now() - 86400000 * 5,
      },
    ];
    localStorage.setItem(K_DISHES, JSON.stringify(dishes));
  }
}
seed();

function read(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export async function listTags() {
  if (USE_MOCK) {
    await delay();
    return { ok: true, data: read(K_TAGS) };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/tags");
  return { ok: true, data: data?.data ?? data };
}
export async function createTag(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_TAGS);
    const row = { id: "t" + Math.floor(Math.random() * 1e6), ...payload };
    all.unshift(row);
    write(K_TAGS, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/tags", payload);
  return { ok: true, data: data?.data ?? data };
}
export async function updateTag(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_TAGS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i] = { ...all[i], ...patch };
    write(K_TAGS, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/tags/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}
export async function deleteTag(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_TAGS,
      read(K_TAGS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/tags/${id}`);
  return { ok: true };
}

export async function listDishes({
  page = 1,
  pageSize = 10,
  q = "",
  diet,
  meal,
  locale = "en",
} = {}) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_DISHES);
    const term = q.trim().toLowerCase();
    let filtered = all.filter((d) => {
      const t = (d.title?.[locale] || "").toLowerCase();
      return term ? t.includes(term) : true;
    });
    if (diet) filtered = filtered.filter((d) => d.diet === diet);
    if (meal) filtered = filtered.filter((d) => d.meal === meal);

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const rows = filtered.slice(start, start + pageSize);
    return { ok: true, data: { rows, total, page, pages } };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/dishes", {
    params: { page, pageSize, q, diet, meal, locale },
  });
  return { ok: true, data: data?.data ?? data };
}
export async function createDish(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_DISHES);
    const row = {
      id: "d" + Math.floor(Math.random() * 1e6),
      createdAt: Date.now(),
      ...payload,
    };
    all.unshift(row);
    write(K_DISHES, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/dishes", payload);
  return { ok: true, data: data?.data ?? data };
}
export async function updateDish(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_DISHES);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i] = { ...all[i], ...patch };
    write(K_DISHES, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/dishes/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}
export async function deleteDish(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_DISHES,
      read(K_DISHES).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/dishes/${id}`);
  return { ok: true };
}
