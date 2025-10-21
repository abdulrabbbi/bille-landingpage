// Mock-first IAM service. Flip to real API by setting VITE_API_URL and VITE_USE_MOCK=0
import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta?.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 450) => new Promise((r) => setTimeout(r, ms));

/* ---------- Mock DB ---------- */
let _users = [
  {
    id: "u1",
    name: "Ava Howard",
    email: "ava@demo.com",
    role: "Business Admin",
    locations: ["London", "Soho"],
    status: "active",
    mfa: true,
  },
  {
    id: "u2",
    name: "Leo Park",
    email: "leo@demo.com",
    role: "Team Member",
    locations: ["London"],
    status: "active",
    mfa: false,
  },
  {
    id: "u3",
    name: "Root Super",
    email: "root@demo.com",
    role: "Super Admin",
    locations: ["*"],
    status: "active",
    mfa: true,
  },
];
let _invites = [
  {
    id: "i1",
    email: "newstaff@demo.com",
    role: "Team Member",
    locations: ["Soho"],
    status: "pending",
    sentAt: Date.now() - 864e5,
  },
];
let _roles = {
  "Super Admin": {
    Businesses: true,
    Locations: true,
    Catalog: true,
    Orders: true,
    Payments: true,
    Refunds: true,
    Hardware: true,
    Delivery: true,
    Reports: true,
    Settings: true,
    Users: true,
  },
  "Business Admin": {
    Businesses: false,
    Locations: true,
    Catalog: true,
    Orders: true,
    Payments: true,
    Refunds: true,
    Hardware: true,
    Delivery: true,
    Reports: true,
    Settings: true,
    Users: true,
  },
  "Team Member": {
    Businesses: false,
    Locations: false,
    Catalog: false,
    Orders: true,
    Payments: true,
    Refunds: false,
    Hardware: true,
    Delivery: false,
    Reports: false,
    Settings: false,
    Users: false,
  },
};
let _policies = { requireMfa: false, passcodeLength: 6, lockTimeoutMins: 5 };

const genId = (p = "id") => p + Math.random().toString(36).slice(2, 9);

/* ---------- Users ---------- */
export async function fetchUsers(params = { q: "" }) {
  if (USE_MOCK) {
    await sleep();
    const q = params.q?.toLowerCase?.() || "";
    const data = _users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
    return { ok: true, data };
  }
  const { data } = await api.get("/iam/users", { params });
  return data;
}
export async function createUser(payload) {
  if (USE_MOCK) {
    await sleep();
    const nu = { id: genId("u"), status: "active", mfa: false, ...payload };
    _users.unshift(nu);
    return { ok: true, data: nu };
  }
  const { data } = await api.post("/iam/users", payload);
  return data;
}
export async function updateUser(id, payload) {
  if (USE_MOCK) {
    await sleep();
    _users = _users.map((u) => (u.id === id ? { ...u, ...payload } : u));
    return { ok: true, data: _users.find((u) => u.id === id) };
  }
  const { data } = await api.patch(`/iam/users/${id}`, payload);
  return data;
}
export async function deleteUser(id) {
  if (USE_MOCK) {
    await sleep();
    _users = _users.filter((u) => u.id !== id);
    return { ok: true };
  }
  const { data } = await api.delete(`/iam/users/${id}`);
  return data;
}

/* ---------- Invites ---------- */
export async function fetchInvites() {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: _invites };
  }
  const { data } = await api.get("/iam/invites");
  return data;
}
export async function sendInvite(payload) {
  if (USE_MOCK) {
    await sleep();
    const inv = {
      id: genId("i"),
      status: "pending",
      sentAt: Date.now(),
      ...payload,
    };
    _invites.unshift(inv);
    return { ok: true, data: inv };
  }
  const { data } = await api.post("/iam/invites", payload);
  return data;
}
export async function revokeInvite(id) {
  if (USE_MOCK) {
    await sleep();
    _invites = _invites.filter((i) => i.id !== id);
    return { ok: true };
  }
  const { data } = await api.delete(`/iam/invites/${id}`);
  return data;
}

/* ---------- Roles & Policies ---------- */
export async function fetchRoles() {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: _roles };
  }
  const { data } = await api.get("/iam/roles");
  return data;
}
export async function updateRole(roleName, matrix) {
  if (USE_MOCK) {
    await sleep();
    _roles = { ..._roles, [roleName]: { ..._roles[roleName], ...matrix } };
    return { ok: true, data: _roles[roleName] };
  }
  const { data } = await api.put(
    `/iam/roles/${encodeURIComponent(roleName)}`,
    matrix
  );
  return data;
}

export async function fetchPolicies() {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: _policies };
  }
  const { data } = await api.get("/iam/policies");
  return data;
}
export async function updatePolicies(next) {
  if (USE_MOCK) {
    await sleep();
    _policies = { ..._policies, ...next };
    return { ok: true, data: _policies };
  }
  const { data } = await api.put("/iam/policies", next);
  return data;
}
