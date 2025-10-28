const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));

const K_USERS = "__iam_users_v1";
const K_ROLES = "__iam_roles_v1";

function seed() {
  if (!localStorage.getItem(K_ROLES)) {
    const roles = [
      {
        id: "r_admin",
        name: "Admin",
        code: "admin",
        permissions: ["*"],
        updatedAt: Date.now() - 86400000,
      },
      {
        id: "r_editor",
        name: "Editor",
        code: "editor",
        permissions: ["users.read", "users.write", "content.write"],
        updatedAt: Date.now() - 640000,
      },
      {
        id: "r_viewer",
        name: "Viewer",
        code: "viewer",
        permissions: ["users.read", "content.read"],
        updatedAt: Date.now() - 320000,
      },
    ];
    localStorage.setItem(K_ROLES, JSON.stringify(roles));
  }
  if (!localStorage.getItem(K_USERS)) {
    const users = [
      {
        id: "u_1001",
        name: "Alex Carter",
        email: "alex@example.com",
        roleId: "r_admin",
        active: true,
        phone: "+1 415 555 1200",
        createdAt: Date.now() - 86_400_000 * 12,
      },
      {
        id: "u_1002",
        name: "Maria Lopez",
        email: "maria@example.com",
        roleId: "r_editor",
        active: true,
        phone: "+1 917 555 2233",
        createdAt: Date.now() - 86_400_000 * 7,
      },
      {
        id: "u_1003",
        name: "Jonas Meyer",
        email: "jonas@example.com",
        roleId: "r_viewer",
        active: false,
        phone: "+49 30 555 8899",
        createdAt: Date.now() - 86_400_000 * 2,
      },
    ];
    localStorage.setItem(K_USERS, JSON.stringify(users));
  }
}
seed();

function read(k) {
  return JSON.parse(localStorage.getItem(k) || "[]");
}
function write(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

export async function listRoles({ q = "" } = {}) {
  if (USE_MOCK) {
    await delay();
    const t = q.trim().toLowerCase();
    let rows = read(K_ROLES);
    if (t)
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(t) || r.code.toLowerCase().includes(t)
      );
    return { ok: true, data: rows };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/iam/roles", { params: { q } });
  return { ok: true, data: data?.data ?? data };
}

export async function createRole(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_ROLES);
    const row = {
      id: "r_" + Math.floor(Math.random() * 1e6),
      updatedAt: Date.now(),
      ...payload,
    };
    all.unshift(row);
    write(K_ROLES, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/iam/roles", payload);
  return { ok: true, data: data?.data ?? data };
}

export async function updateRole(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_ROLES);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i] = { ...all[i], ...patch, updatedAt: Date.now() };
    write(K_ROLES, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/iam/roles/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}

export async function deleteRole(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_ROLES,
      read(K_ROLES).filter((x) => x.id !== id)
    );
    const users = read(K_USERS).map((u) =>
      u.roleId === id ? { ...u, roleId: "r_viewer" } : u
    );
    write(K_USERS, users);
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/iam/roles/${id}`);
  return { ok: true };
}

export async function listUsers({
  page = 1,
  pageSize = 10,
  q = "",
  roleId = "",
  status = "",
} = {}) {
  if (USE_MOCK) {
    await delay();
    let all = read(K_USERS);
    const t = q.trim().toLowerCase();
    if (t)
      all = all.filter(
        (u) =>
          u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t)
      );
    if (roleId) all = all.filter((u) => u.roleId === roleId);
    if (status)
      all = all.filter((u) => (status === "active" ? u.active : !u.active));
    const total = all.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const rows = all.slice(start, start + pageSize);
    return { ok: true, data: { rows, total, page, pages } };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/iam/users", {
    params: { page, pageSize, q, roleId, status },
  });
  return { ok: true, data: data?.data ?? data };
}

export async function createUser(payload) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_USERS);
    const row = {
      id: "u_" + Math.floor(Math.random() * 1e6),
      createdAt: Date.now(),
      active: true,
      ...payload,
    };
    all.unshift(row);
    write(K_USERS, all);
    return { ok: true, data: row };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post("/iam/users", payload);
  return { ok: true, data: data?.data ?? data };
}

export async function updateUser(id, patch) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_USERS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i] = { ...all[i], ...patch };
    write(K_USERS, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put(`/iam/users/${id}`, patch);
  return { ok: true, data: data?.data ?? data };
}

export async function toggleUser(id, active) {
  if (USE_MOCK) {
    await delay();
    const all = read(K_USERS);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false };
    all[i].active = !!active;
    write(K_USERS, all);
    return { ok: true, data: all[i] };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.post(
    `/iam/users/${id}/${active ? "activate" : "deactivate"}`
  );
  return { ok: true, data: data?.data ?? data };
}

export async function deleteUser(id) {
  if (USE_MOCK) {
    await delay();
    write(
      K_USERS,
      read(K_USERS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  await client.delete(`/iam/users/${id}`);
  return { ok: true };
}
