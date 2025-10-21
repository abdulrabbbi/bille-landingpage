// Mock-first Business & Catalog service.
// Flip to real API by setting VITE_API_URL and VITE_USE_MOCK=0
import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta?.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const id = (p = "id") => p + Math.random().toString(36).slice(2, 10);

/* ---------------- Mock DB ---------------- */
let businesses = [
  {
    id: "b1",
    name: "Demo Bistro",
    currency: "GBP",
    timezone: "Europe/London",
    taxRate: 20,
    logo: null,
    receiptFooter: "Thanks for visiting!",
  },
];
let locations = [
  {
    id: "l1",
    businessId: "b1",
    name: "Soho",
    timezone: "Europe/London",
    currency: "GBP",
    taxes: { vat: 20 },
    delivery: ["Uber Eats"],
    printers: ["Kitchen-1"],
  },
  {
    id: "l2",
    businessId: "b1",
    name: "Shoreditch",
    timezone: "Europe/London",
    currency: "GBP",
    taxes: { vat: 20 },
    delivery: ["Deliveroo"],
    printers: [],
  },
];
let areasByLocation = {
  l1: [
    {
      id: "a1",
      title: "Main",
      tables: [
        { id: "t1", name: "T1", cap: 2, x: 1, y: 1 },
        { id: "t2", name: "T2", cap: 4, x: 3, y: 1 },
      ],
    },
    {
      id: "a2",
      title: "Patio",
      tables: [{ id: "t3", name: "P1", cap: 2, x: 2, y: 3 }],
    },
  ],
  l2: [
    {
      id: "a3",
      title: "Floor",
      tables: [{ id: "t4", name: "F1", cap: 4, x: 1, y: 2 }],
    },
  ],
};
let categories = [
  { id: "c1", businessId: "b1", name: "Starters", sort: 1 },
  { id: "c2", businessId: "b1", name: "Mains", sort: 2 },
  { id: "c3", businessId: "b1", name: "Drinks", sort: 3 },
];
let items = [
  {
    id: "i1",
    businessId: "b1",
    name: "Soup",
    sku: "ST-SOUP",
    price: 4.5,
    taxClass: "vat",
    categoryId: "c1",
    availability: { l1: true, l2: true },
  },
  {
    id: "i2",
    businessId: "b1",
    name: "Burger",
    sku: "MN-BURG",
    price: 9.9,
    taxClass: "vat",
    categoryId: "c2",
    availability: { l1: true, l2: false },
  },
  {
    id: "i3",
    businessId: "b1",
    name: "Cola",
    sku: "DR-COLA",
    price: 2.5,
    taxClass: "vat",
    categoryId: "c3",
    availability: { l1: true, l2: true },
  },
];
let menus = [
  {
    id: "m1",
    businessId: "b1",
    title: "All Day",
    categories: ["c1", "c2", "c3"],
    dayparts: [],
  },
];
let discounts = [
  {
    id: "d1",
    businessId: "b1",
    title: "Happy Hour 10%",
    type: "percent",
    value: 10,
    active: true,
  },
];

/* ---------------- Businesses ---------------- */
export async function fetchBusinesses() {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: businesses };
  }
  const { data } = await api.get("/biz/businesses");
  return data;
}
export async function createBusiness(payload) {
  if (USE_MOCK) {
    await sleep();
    const b = { id: id("b"), ...payload };
    businesses = [b, ...businesses];
    return { ok: true, data: b };
  }
  const { data } = await api.post("/biz/businesses", payload);
  return data;
}
export async function updateBusiness(bizId, payload) {
  if (USE_MOCK) {
    await sleep();
    businesses = businesses.map((b) =>
      b.id === bizId ? { ...b, ...payload } : b
    );
    return { ok: true, data: businesses.find((b) => b.id === bizId) };
  }
  const { data } = await api.patch(`/biz/businesses/${bizId}`, payload);
  return data;
}
export async function deleteBusiness(bizId) {
  if (USE_MOCK) {
    await sleep();
    businesses = businesses.filter((b) => b.id !== bizId);
    locations = locations.filter((l) => l.businessId !== bizId);
    return { ok: true };
  }
  const { data } = await api.delete(`/biz/businesses/${bizId}`);
  return data;
}

/* ---------------- Locations ---------------- */
export async function fetchLocations(bizId) {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: locations.filter((l) => l.businessId === bizId) };
  }
  const { data } = await api.get(`/biz/businesses/${bizId}/locations`);
  return data;
}
export async function createLocation(payload) {
  if (USE_MOCK) {
    await sleep();
    const l = { id: id("l"), ...payload };
    locations = [l, ...locations];
    areasByLocation[l.id] = [];
    return { ok: true, data: l };
  }
  const { data } = await api.post("/biz/locations", payload);
  return data;
}
export async function updateLocation(idLoc, payload) {
  if (USE_MOCK) {
    await sleep();
    locations = locations.map((l) =>
      l.id === idLoc ? { ...l, ...payload } : l
    );
    return { ok: true, data: locations.find((l) => l.id === idLoc) };
  }
  const { data } = await api.patch(`/biz/locations/${idLoc}`, payload);
  return data;
}
export async function deleteLocation(idLoc) {
  if (USE_MOCK) {
    await sleep();
    locations = locations.filter((l) => l.id !== idLoc);
    delete areasByLocation[idLoc];
    return { ok: true };
  }
  const { data } = await api.delete(`/biz/locations/${idLoc}`);
  return data;
}

/* ---------------- Areas & Tables ---------------- */
export async function fetchAreas(locationId) {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: areasByLocation[locationId] || [] };
  }
  const { data } = await api.get(`/biz/locations/${locationId}/areas`);
  return data;
}
export async function saveAreas(locationId, nextAreas) {
  if (USE_MOCK) {
    await sleep();
    areasByLocation[locationId] = nextAreas;
    return { ok: true, data: nextAreas };
  }
  const { data } = await api.put(
    `/biz/locations/${locationId}/areas`,
    nextAreas
  );
  return data;
}

/* ---------------- Categories ---------------- */
export async function fetchCategories(bizId) {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: categories.filter((c) => c.businessId === bizId) };
  }
  const { data } = await api.get(`/catalog/${bizId}/categories`);
  return data;
}
export async function upsertCategory(payload) {
  if (USE_MOCK) {
    await sleep();
    if (payload.id) {
      categories = categories.map((c) =>
        c.id === payload.id ? { ...c, ...payload } : c
      );
      return { ok: true, data: payload };
    }
    const c = { id: id("c"), ...payload };
    categories = [...categories, c];
    return { ok: true, data: c };
  }
  const { data } = await api.post(`/catalog/categories`, payload);
  return data;
}
export async function deleteCategory(idCat) {
  if (USE_MOCK) {
    await sleep();
    categories = categories.filter((c) => c.id !== idCat);
    items = items.map((i) =>
      i.categoryId === idCat ? { ...i, categoryId: null } : i
    );
    return { ok: true };
  }
  const { data } = await api.delete(`/catalog/categories/${idCat}`);
  return data;
}

/* ---------------- Items ---------------- */
export async function fetchItems(bizId) {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: items.filter((i) => i.businessId === bizId) };
  }
  const { data } = await api.get(`/catalog/${bizId}/items`);
  return data;
}
export async function upsertItem(payload) {
  if (USE_MOCK) {
    await sleep();
    if (payload.id) {
      items = items.map((i) =>
        i.id === payload.id ? { ...i, ...payload } : i
      );
      return { ok: true, data: payload };
    }
    const it = { id: id("i"), ...payload };
    items = [it, ...items];
    return { ok: true, data: it };
  }
  const { data } = await api.post(`/catalog/items`, payload);
  return data;
}
export async function deleteItem(idItem) {
  if (USE_MOCK) {
    await sleep();
    items = items.filter((i) => i.id !== idItem);
    return { ok: true };
  }
  const { data } = await api.delete(`/catalog/items/${idItem}`);
  return data;
}
export async function toggleAvailability(idItem, locationId, on) {
  if (USE_MOCK) {
    await sleep();
    items = items.map((i) =>
      i.id === idItem
        ? {
            ...i,
            availability: { ...(i.availability || {}), [locationId]: !!on },
          }
        : i
    );
    return { ok: true, data: items.find((i) => i.id === idItem) };
  }
  const { data } = await api.post(`/catalog/items/${idItem}/availability`, {
    locationId,
    on,
  });
  return data;
}

/* ---------------- Menus ---------------- */
export async function fetchMenus(bizId) {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: menus.filter((m) => m.businessId === bizId) };
  }
  const { data } = await api.get(`/catalog/${bizId}/menus`);
  return data;
}
export async function saveMenu(payload) {
  if (USE_MOCK) {
    await sleep();
    if (payload.id) {
      menus = menus.map((m) =>
        m.id === payload.id ? { ...m, ...payload } : m
      );
      return { ok: true, data: payload };
    }
    const m = { id: id("m"), ...payload };
    menus = [m, ...menus];
    return { ok: true, data: m };
  }
  const { data } = await api.post(`/catalog/menus`, payload);
  return data;
}
export async function deleteMenu(idMenu) {
  if (USE_MOCK) {
    await sleep();
    menus = menus.filter((m) => m.id !== idMenu);
    return { ok: true };
  }
  const { data } = await api.delete(`/catalog/menus/${idMenu}`);
  return data;
}

/* ---------------- Discounts ---------------- */
export async function fetchDiscounts(bizId) {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: discounts.filter((d) => d.businessId === bizId) };
  }
  const { data } = await api.get(`/catalog/${bizId}/discounts`);
  return data;
}
export async function upsertDiscount(payload) {
  if (USE_MOCK) {
    await sleep();
    if (payload.id) {
      discounts = discounts.map((d) =>
        d.id === payload.id ? { ...d, ...payload } : d
      );
      return { ok: true, data: payload };
    }
    const d = { id: id("d"), ...payload };
    discounts = [d, ...discounts];
    return { ok: true, data: d };
  }
  const { data } = await api.post(`/catalog/discounts`, payload);
  return data;
}
export async function deleteDiscount(idDisc) {
  if (USE_MOCK) {
    await sleep();
    discounts = discounts.filter((d) => d.id !== idDisc);
    return { ok: true };
  }
  const { data } = await api.delete(`/catalog/discounts/${idDisc}`);
  return data;
}
