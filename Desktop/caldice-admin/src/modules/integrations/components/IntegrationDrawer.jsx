import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";
import { INTEGRATION_PROVIDERS } from "../api/integrations.service.js";

export default function IntegrationDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: "",
    provider: "",
    status: "active",
    apiKey: "",
    scopes: [],
  });
  const [scope, setScope] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        provider: initial?.provider || "",
        status: initial?.status || "active",
        apiKey: "",
        scopes: initial?.scopes || [],
      });
      setScope("");
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function addScope() {
    const t = scope.trim();
    if (!t) return;
    setForm((prev) => ({
      ...prev,
      scopes: [...new Set([...(prev.scopes || []), t])],
    }));
    setScope("");
  }
  function rmScope(i) {
    setForm((prev) => ({
      ...prev,
      scopes: prev.scopes.filter((_, idx) => idx !== i),
    }));
  }
  function submit() {
    if (!form.name.trim() || !form.provider) return;
    onSubmit?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Integration" : "New Integration"}
      width={620}
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
      <div className="grid gap-4">
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
            <span className="text-sm text-muted">Provider</span>
            <select
              className="input mt-1"
              value={form.provider}
              onChange={(e) => setField("provider", e.target.value)}
            >
              <option value="">Select provider</option>
              {INTEGRATION_PROVIDERS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Status</span>
            <select
              className="input mt-1"
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm text-muted">API Key (optional)</span>
            <input
              className="input mt-1"
              value={form.apiKey}
              onChange={(e) => setField("apiKey", e.target.value)}
              placeholder="Paste key to set/rotate"
            />
          </label>
        </div>

        <div className="card p-3">
          <div className="text-sm font-medium mb-2">Scopes</div>
          <div className="flex gap-2 mb-3">
            <input
              className="input flex-1"
              placeholder="e.g., chat, images, charges"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addScope();
                }
              }}
            />
            <button className="btn" type="button" onClick={addScope}>
              Add
            </button>
          </div>
          <div className="grid gap-2">
            {(form.scopes || []).map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-muted/10 rounded-lg px-3 py-2"
              >
                <div className="text-sm font-mono">{s}</div>
                <button className="btn-ghost" onClick={() => rmScope(i)}>
                  Remove
                </button>
              </div>
            ))}
            {(form.scopes || []).length === 0 && (
              <div className="text-sm text-muted">No scopes yet.</div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
