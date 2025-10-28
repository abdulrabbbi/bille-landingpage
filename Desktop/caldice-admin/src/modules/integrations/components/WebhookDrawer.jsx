import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";
import { WEBHOOK_EVENTS } from "../api/integrations.service.js";

export default function WebhookDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    url: "",
    active: true,
    secret: "",
    events: [],
  });

  useEffect(() => {
    if (open) {
      setForm({
        url: initial?.url || "",
        active: initial?.active ?? true,
        secret: "",
        events: initial?.events || [],
      });
    }
  }, [open, initial]);

  function toggleEvent(code) {
    setForm((prev) => {
      const set = new Set(prev.events);
      if (set.has(code)) set.delete(code);
      else set.add(code);
      return { ...prev, events: Array.from(set) };
    });
  }
  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function submit() {
    if (!form.url.trim() || (form.events || []).length === 0) return;
    onSubmit?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Webhook" : "New Webhook"}
      width={640}
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
        <label className="block">
          <span className="text-sm text-muted">Callback URL</span>
          <input
            className="input mt-1"
            value={form.url}
            onChange={(e) => setField("url", e.target.value)}
            placeholder="https://your.app/webhooks"
          />
        </label>

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="inline-flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              className="accent-(--primary)]"
              checked={form.active}
              onChange={(e) => setField("active", e.target.checked)}
            />
            <span className="text-sm">Active</span>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm text-muted">Secret (optional)</span>
            <input
              className="input mt-1"
              value={form.secret}
              onChange={(e) => setField("secret", e.target.value)}
              placeholder="whsec_..."
            />
          </label>
        </div>

        <div className="card p-3">
          <div className="text-sm font-medium mb-2">Events</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {WEBHOOK_EVENTS.map((ev) => (
              <label key={ev.code} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-(--primary)]"
                  checked={form.events.includes(ev.code)}
                  onChange={() => toggleEvent(ev.code)}
                />
                <span className="text-sm">{ev.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
