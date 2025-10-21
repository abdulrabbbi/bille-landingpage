import React, { useEffect, useMemo, useState } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/iam.service.js";
import UsersTable from "./components/UsersTable.jsx";
import UserDrawer from "./components/UserDrawer.jsx";
import SkeletonRow from "../components/SkeletonRow.jsx";
import DeleteConfirm from "../components/DeleteConfirm.jsx";
import ThemeSwitch from "../components/ThemeSwitch.jsx";

export default function UsersList() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetchUsers({ q });
    setRows(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const k = q.trim().toLowerCase();
    if (!k) return rows;
    return rows.filter((r) =>
      (r.name + r.email + r.role).toLowerCase().includes(k)
    );
  }, [rows, q]);

  async function handleSubmit(payload) {
    if (editing) {
      await updateUser(editing.id, payload);
    } else {
      await createUser(payload);
    }
    setOpen(false);
    setEditing(null);
    await load();
  }

  async function handleDelete() {
    if (!toDelete) return;
    await deleteUser(toDelete.id);
    setToDelete(null);
    await load();
  }

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-sm text-muted">
            Invite and manage access across roles and locations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <button
            className="btn"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            New User
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            className="input flex-1"
            placeholder="Search name, email, role…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn-ghost" onClick={load}>
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Locations</th>
                <th className="px-3 py-2">MFA</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <>
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                </>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.length > 0 &&
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-3">{u.name}</td>
                    <td className="px-3 py-3">{u.email}</td>
                    <td className="px-3 py-3">{u.role}</td>
                    <td className="px-3 py-3">
                      {u.locations?.[0] === "*"
                        ? "All"
                        : u.locations?.join(", ") || "-"}
                    </td>
                    <td className="px-3 py-3">{u.mfa ? "On" : "Off"}</td>
                    <td className="px-3 py-3 text-right">
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => {
                          setEditing(u);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-ghost text-red-500"
                        onClick={() => setToDelete(u)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawers & Modals */}
      <UserDrawer
        open={open}
        initial={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
      <DeleteConfirm
        open={!!toDelete}
        title="Delete user"
        message={`Remove ${toDelete?.name}?`}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
