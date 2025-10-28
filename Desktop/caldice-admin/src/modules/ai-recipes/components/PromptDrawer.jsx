import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";

export default function PromptDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: "",
    locale: "en",
    model: "gpt-4o-mini",
    system: "",
    userTemplate: "",
    enabled: true,
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        locale: initial?.locale || "en",
        model: initial?.model || "gpt-4o-mini",
        system: initial?.system || "",
        userTemplate: initial?.userTemplate || "",
        enabled: initial?.enabled ?? true,
      });
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function submit() {
    if (!form.name.trim()) return;
    if (!form.system.trim() || !form.userTemplate.trim()) return;
    onSubmit?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Prompt" : "New Prompt"}
      width={720}
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
            <span className="text-sm text-muted">Locale</span>
            <select
              className="input mt-1"
              value={form.locale}
              onChange={(e) => setField("locale", e.target.value)}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Model</span>
            <input
              className="input mt-1"
              value={form.model}
              onChange={(e) => setField("model", e.target.value)}
            />
          </label>
          <label className="inline-flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              className="accent-(--primary)]"
              checked={form.enabled}
              onChange={(e) => setField("enabled", e.target.checked)}
            />
            <span className="text-sm">Enabled</span>
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-muted">System Prompt</span>
          <textarea
            className="input mt-1"
            rows={4}
            value={form.system}
            onChange={(e) => setField("system", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm text-muted">User Template</span>
          <textarea
            className="input mt-1"
            rows={4}
            value={form.userTemplate}
            onChange={(e) => setField("userTemplate", e.target.value)}
          />
          <div className="text-xs text-muted mt-1">
            Use variables like {"{meal}"} and {"{diet}"}
          </div>
        </label>
      </div>
    </Drawer>
  );
}
