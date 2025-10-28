import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "user", label: "User" },
];
const SUBS = [
  { value: "free", label: "Free" },
  { value: "premium", label: "Premium" },
];
const STATUSES = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

export default function UserDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    subscription: "free",
    status: "active",
    language: "en",
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        email: initial?.email || "",
        role: initial?.role || "user",
        subscription: initial?.subscription || "free",
        status: initial?.status || "active",
        language: initial?.language || "en",
      });
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function submit() {
    if (!form.name.trim() || !form.email.trim()) return;
    onSubmit?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit User" : "Add User"}
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
      width={520}
    >
      <div className="grid gap-3">
        <label className="block">
          <span className="text-sm text-muted">Full Name</span>
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

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Role</span>
            <select
              className="input mt-1"
              value={form.role}
              onChange={(e) => setField("role", e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-muted">Subscription</span>
            <select
              className="input mt-1"
              value={form.subscription}
              onChange={(e) => setField("subscription", e.target.value)}
            >
              {SUBS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Status</span>
            <select
              className="input mt-1"
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-muted">Language</span>
            <select
              className="input mt-1"
              value={form.language}
              onChange={(e) => setField("language", e.target.value)}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </label>
        </div>
      </div>
    </Drawer>
  );
}
