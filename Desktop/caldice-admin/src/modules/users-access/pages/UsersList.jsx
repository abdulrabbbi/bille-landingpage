import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/users.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import { downloadCSV } from "../../../shared/utils/csv.js";
import useDebounce from "../../../shared/hooks/useDebounce.js";
import UserDrawer from "../components/UserDrawer.jsx";
import FilterBar from "../components/FilterBar.jsx";

export default function UsersList() {
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 400);

  const [filters, setFilters] = useState({
    role: undefined,
    status: undefined,
    subscription: undefined,
  });
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listUsers({
      page,
      pageSize: 10,
      q: debounced,
      ...filters,
    });
    if (res?.ok) {
      setRows(res.data.rows);
      setMeta({ total: res.data.total, pages: res.data.pages });
    }
    setBusy(false);
  }, [page, debounced, filters]);

  useEffect(() => {
    setPage(1);
  }, [debounced, filters.role, filters.status, filters.subscription]);
  useEffect(() => {
    load();
  }, [load]);

  function clearFilters() {
    setFilters({ role: undefined, status: undefined, subscription: undefined });
  }

  async function onCreate(form) {
    const res = await createUser(form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }

  async function onUpdate(form) {
    const res = await updateUser(editing.id, form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }

  async function onConfirmDelete() {
    if (!toDelete) return;
    const res = await deleteUser(toDelete.id);
    if (res?.ok) {
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
        key: "role",
        render: (r) => (
          <span className="badge" style={{ textTransform: "capitalize" }}>
            {r.role}
          </span>
        ),
      },
      {
        header: "Plan",
        key: "subscription",
        render: (r) => (
          <span className="badge" style={{ textTransform: "capitalize" }}>
            {r.subscription}
          </span>
        ),
      },
      {
        header: "Status",
        key: "status",
        render: (r) => (
          <span
            className="badge"
            style={{
              textTransform: "capitalize",
              background:
                r.status === "active"
                  ? "rgba(16,185,129,.15)"
                  : "rgba(244,63,94,.15)",
              borderColor: "transparent",
              color: r.status === "active" ? "#059669" : "#e11d48",
            }}
          >
            {r.status}
          </span>
        ),
      },
      {
        header: "Lang",
        key: "language",
        render: (r) => r.language?.toUpperCase(),
      },
      {
        header: "Created",
        key: "createdAt",
        render: (r) => new Date(r.createdAt).toLocaleDateString(),
      },
      {
        header: "Actions",
        key: "actions",
        render: (r) => (
          <div className="flex gap-2">
            <button
              className="btn-ghost"
              onClick={() => {
                setEditing(r);
                setDrawerOpen(true);
              }}
            >
              Edit
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setToDelete(r);
                setConfirmOpen(true);
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  function exportCSV() {
    const cols = [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Role", key: "role" },
      { header: "Subscription", key: "subscription" },
      { header: "Status", key: "status" },
      { header: "Language", key: "language" },
      { header: "CreatedAt", key: "createdAt" },
    ];
    downloadCSV("users", rows, cols);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Users & Access</h1>
          <div className="text-sm text-muted">
            Manage users, roles, plans, and status
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={exportCSV}>
            Export CSV
          </button>
          <button
            className="btn"
            onClick={() => {
              setEditing(null);
              setDrawerOpen(true);
            }}
          >
            Add User
          </button>
        </div>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-auto sm:flex-1">
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder="Search name or email…"
            />
          </div>
          <FilterBar
            role={filters.role}
            status={filters.status}
            subscription={filters.subscription}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
            onClear={clearFilters}
          />
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
            ? `This will remove ${toDelete.name} (${toDelete.email}).`
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
