import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listUsers,
  listRoles,
  createUser,
  updateUser,
  toggleUser,
  deleteUser,
} from "../api/iam.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";
import UserDrawer from "../components/UserDrawer.jsx";

export default function Users() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 350);
  const [filters, setFilters] = useState({ roleId: "", status: "" });
  const [roles, setRoles] = useState([]);

  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await listRoles();
      if (r?.ok) setRoles(r.data);
    })();
  }, []);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listUsers({ page, pageSize: 10, q: dq, ...filters });
    if (res?.ok) {
      setRows(res.data.rows);
      setMeta({ total: res.data.total, pages: res.data.pages });
    }
    setBusy(false);
  }, [page, dq, filters]);

  useEffect(() => {
    setPage(1);
  }, [dq, filters.roleId, filters.status]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const r = await createUser(form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const r = await updateUser(editing.id, form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  const onToggle = useCallback(
    async (u) => {
      const r = await toggleUser(u.id, !u.active);
      if (r?.ok) load();
    },
    [load]
  );
  async function onConfirmDelete() {
    if (!toDelete) return;
    const r = await deleteUser(toDelete.id);
    if (r?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }

  const columns = useMemo(
    () => [
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
      {
        header: "Role",
        key: "roleId",
        render: (u) => roles.find((r) => r.id === u.roleId)?.name || "—",
      },
      {
        header: "Status",
        key: "active",
        render: (u) => (
          <span
            className="badge"
            style={{
              background: u.active
                ? "rgba(16,185,129,.15)"
                : "rgba(244,63,94,.15)",
              borderColor: "transparent",
            }}
          >
            {u.active ? "Active" : "Disabled"}
          </span>
        ),
      },
      {
        header: "Created",
        key: "createdAt",
        render: (u) => new Date(u.createdAt).toLocaleString(),
      },
      {
        header: "Actions",
        key: "a",
        render: (u) => (
          <div className="flex gap-2">
            <button
              className="btn-ghost"
              onClick={() => {
                setEditing(u);
                setDrawerOpen(true);
              }}
            >
              Edit
            </button>
            <button className="btn-ghost" onClick={() => onToggle(u)}>
              {u.active ? "Disable" : "Enable"}
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setToDelete(u);
                setConfirmOpen(true);
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [roles, onToggle]
  );

  function clearFilters() {
    setFilters({ roleId: "", status: "" });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">People · Users</h1>
          <div className="text-sm text-muted">
            Manage team accounts & access
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          New User
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder="Search name or email…"
            />
          </div>
          <select
            className="input w-40"
            value={filters.roleId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, roleId: e.target.value }))
            }
          >
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <select
            className="input w-40"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">Any status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
          <button className="btn-ghost" onClick={clearFilters}>
            Clear
          </button>
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No users found."
          footer={
            <div className="w-full flex items-center justify-between">
              <div className="text-xs">
                Total: {meta.total.toLocaleString()}
              </div>
              <Pagination page={page} pages={meta.pages} onPage={setPage} />
            </div>
          }
        />
      </div>

      <UserDrawer
        open={drawerOpen}
        initial={editing}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        onSubmit={editing ? onUpdate : onCreate}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete user?"
        message={
          toDelete
            ? `This will remove "${toDelete.name}" (${toDelete.email}).`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={onConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
      />
    </div>
  );
}
