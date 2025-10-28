const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const K_PROMPTS = "__ai_prompts_v1";
const K_RECIPES = "__ai_recipes_queue_v1";
const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));

function seed() {
  if (!localStorage.getItem(K_PROMPTS)) {
    const prompts = [
      {
        id: "p1",
        name: "Default EN",
        locale: "en",
        model: "gpt-4o-mini",
        system:
          "You are a recipe assistant. Answer with valid JSON matching the schema.",
        userTemplate:
          "Create a recipe for a {meal} that matches {diet} diet. Respond in English.",
        enabled: true,
        updatedAt: Date.now() - 86400000,
      },
      {
        id: "p2",
        name: "Default DE",
        locale: "de",
        model: "gpt-4o-mini",
        system:
          "Du bist ein Rezeptassistent. Antworte mit gültigem JSON entsprechend dem Schema.",
        userTemplate:
          "Erstelle ein Rezept für {meal}, {diet}-freundlich. Antwort auf Deutsch.",
        enabled: true,
        updatedAt: Date.now() - 43200000,
      },
    ];
    localStorage.setItem(K_PROMPTS, JSON.stringify(prompts));
  }
  if (!localStorage.getItem(K_RECIPES)) {
    const recipes = [
      {
        id: "r1",
        title: "Spicy Chickpea Bowl",
        locale: "en",
        status: "pending", // pending | approved | rejected
        sourceFilters: { diet: "vegan", meal: "dinner" },
        payload: {
          ingredients: ["Chickpeas", "Tomato", "Onion", "Spices"],
          instructions: [
            "Saute onions",
            "Add tomato",
            "Add chickpeas",
            "Simmer 10m",
          ],
          time: 25,
          cost: "low",
          servings: 2,
          category: "Dinner",
          difficulty: "easy",
          origin: "Mediterranean",
          avgCalories: 420,
        },
        createdAt: Date.now() - 3600_000,
      },
      {
        id: "r2",
        title: "Haferflocken Deluxe",
        locale: "de",
        status: "approved",
        sourceFilters: { diet: "veget", meal: "breakfast" },
        payload: {
          ingredients: ["Haferflocken", "Milch", "Honig"],
          instructions: ["Alles mischen", "Über Nacht ziehen lassen"],
          time: 5,
          cost: "low",
          servings: 1,
          category: "Breakfast",
          difficulty: "easy",
          origin: "German",
          avgCalories: 320,
        },
        createdAt: Date.now() - 86_400_000 * 2,
      },
    ];
    localStorage.setItem(K_RECIPES, JSON.stringify(recipes));
  }
}
seed();

function read(k) {
  return JSON.parse(localStorage.getItem(k) || "[]");
}
function write(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

/* Prompts CRUD */
export async function listPrompts({ q = "", locale } = {}) {
  if (USE_MOCK) {
    await delay();
    let all = read(K_PROMPTS);
    const t = q.trim().toLowerCase();
    if (t) all = all.filter((p) => p.name.toLowerCase().includes(t));
    if (locale) all = all.filter((p) => p.locale === locale);
    return { ok: true, data: all };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/ai/prompts", { params: { q, locale } });
  return { ok: true, data: data?.data ?? data };
}

export async function createPrompt(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_PROMPTS);
    const row = {
      id: "p" + Math.floor(Math.random() * 1e6),
      updatedAt: Date.now(),
      ...payload,
    };
    all.unshift(row);
    write(K_PROMPTS, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/ai/prompts", payload);
  return { ok: true, data: data?.data ?? data };
}

export async function updatePrompt(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_PROMPTS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i] = { ...all[i], ...patch, updatedAt: Date.now() };
    write(K_PROMPTS, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/ai/prompts/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}

export async function deletePrompt(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_PROMPTS,
      read(K_PROMPTS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/ai/prompts/${id}`);
  return { ok: true };
}

/* Recipes moderation queue */
export async function listRecipes({
  page = 1,
  pageSize = 10,
  q = "",
  status,
  locale,
} = {}) {
  if (USE_MOCK) {
    await delay();
    let all = read(K_RECIPES);
    const t = q.trim().toLowerCase();
    if (t) all = all.filter((r) => r.title.toLowerCase().includes(t));
    if (status) all = all.filter((r) => r.status === status);
    if (locale) all = all.filter((r) => r.locale === locale);

    const total = all.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const rows = all.slice(start, start + pageSize);
    return { ok: true, data: { rows, total, page, pages } };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/ai/recipes", {
    params: { page, pageSize, q, status, locale },
  });
  return { ok: true, data: data?.data ?? data };
}

export async function approveRecipe(id) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_RECIPES);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i].status = "approved";
    write(K_RECIPES, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post(`/ai/recipes/${id}/approve`);
  return { ok: true, data: data?.data ?? data };
}

export async function rejectRecipe(id) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_RECIPES);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i].status = "rejected";
    write(K_RECIPES, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post(`/ai/recipes/${id}/reject`);
  return { ok: true, data: data?.data ?? data };
}

export async function deleteRecipe(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_RECIPES,
      read(K_RECIPES).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/ai/recipes/${id}`);
  return { ok: true };
}
