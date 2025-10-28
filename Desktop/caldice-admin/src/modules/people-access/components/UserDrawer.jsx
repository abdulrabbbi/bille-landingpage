import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";
import { listRoles } from "../api/iam.service.js";

export default function UserDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    roleId: "",
    active: true,
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        email: initial?.email || "",
        phone: initial?.phone || "",
        roleId: initial?.roleId || "",
        active: initial?.active ?? true,
      });
      (async () => {
        const res = await listRoles();
        if (res?.ok) setRoles(res.data);
      })();
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function submit() {
    if (!form.name.trim() || !form.email.trim() || !form.roleId) return;
    onSubmit?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit User" : "New User"}
      width={560}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={submit}>
            {isEdit ? "Save" : "Create"}
          </button>
        </>
      }
    >
      <div className="grid gap-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Name</span>
            <input
              className="input mt-1"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Email</span>
            <input
              className="input mt-1"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Phone</span>
            <input
              className="input mt-1"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Role</span>
            <select
              className="input mt-1"
              value={form.roleId}
              onChange={(e) => setField("roleId", e.target.value)}
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-(--primary)]"
            checked={form.active}
            onChange={(e) => setField("active", e.target.checked)}
          />
          <span className="text-sm">Active</span>
        </label>
      </div>
    </Drawer>
  );
}
