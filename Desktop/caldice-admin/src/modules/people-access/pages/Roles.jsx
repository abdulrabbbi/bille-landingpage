import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  listRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../api/iam.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";
import RoleDrawer from "../components/RoleDrawer.jsx";

export default function Roles() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 300);

  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await listRoles({ q: dq });
    if (res?.ok) setRows(res.data);
    setBusy(false);
  }, [dq]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const r = await createRole(form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const r = await updateRole(editing.id, form);
    if (r?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onConfirmDelete() {
    if (!toDelete) return;
    const r = await deleteRole(toDelete.id);
    if (r?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }

  const columns = useMemo(
    () => [
      { header: "Name", key: "name" },
      { header: "Code", key: "code" },
      {
        header: "Permissions",
        key: "permissions",
        render: (r) => (
          <span className="text-sm text-muted">
            {(r.permissions || []).join(", ") || "—"}
          </span>
        ),
      },
      {
        header: "Updated",
        key: "updatedAt",
        render: (r) => new Date(r.updatedAt).toLocaleString(),
      },
      {
        header: "Actions",
        key: "a",
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">People · Roles</h1>
          <div className="text-sm text-muted">
            Role definitions & permissions
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          New Role
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="w-full sm:w-80">
          <SearchBar
            value={q}
            onChange={setQ}
            placeholder="Search name or code…"
          />
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No roles found."
        />
      </div>

      <RoleDrawer
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
        title="Delete role?"
        message={
          toDelete
            ? `This will remove "${toDelete.name}". Users will fall back to Viewer.`
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
