import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";

export default function RoleDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: "",
    code: "",
    permissions: [],
  });
  const [perm, setPerm] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        code: initial?.code || "",
        permissions: initial?.permissions || [],
      });
      setPerm("");
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function addPerm() {
    const t = perm.trim();
    if (!t) return;
    setForm((prev) => ({
      ...prev,
      permissions: [...new Set([...prev.permissions, t])],
    }));
    setPerm("");
  }
  function rmPerm(i) {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.filter((_, idx) => idx !== i),
    }));
  }
  function submit() {
    if (!form.name.trim() || !form.code.trim()) return;
    onSubmit?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Role" : "New Role"}
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
            <span className="text-sm text-muted">Code</span>
            <input
              className="input mt-1"
              value={form.code}
              onChange={(e) => setField("code", e.target.value)}
            />
          </label>
        </div>

        <div className="card p-3">
          <div className="text-sm font-medium mb-2">Permissions</div>
          <div className="flex gap-2 mb-3">
            <input
              className="input flex-1"
              placeholder="e.g., users.read, users.write"
              value={perm}
              onChange={(e) => setPerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPerm();
                }
              }}
            />
            <button className="btn" type="button" onClick={addPerm}>
              Add
            </button>
          </div>

          <div className="grid gap-2">
            {form.permissions.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-muted/10 rounded-lg px-3 py-2"
              >
                <div className="text-sm font-mono">{p}</div>
                <button className="btn-ghost" onClick={() => rmPerm(i)}>
                  Remove
                </button>
              </div>
            ))}
            {form.permissions.length === 0 && (
              <div className="text-sm text-muted">No permissions yet.</div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
