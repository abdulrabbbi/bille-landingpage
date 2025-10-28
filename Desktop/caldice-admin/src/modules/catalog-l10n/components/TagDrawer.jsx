import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";

export default function TagDrawer({ open, onClose, initial = null, onSubmit }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    kind: "diet",
    code: "",
    label: { en: "", de: "" },
  });

  useEffect(() => {
    if (open) {
      setForm({
        kind: initial?.kind || "diet",
        code: initial?.code || "",
        label: initial?.label || { en: "", de: "" },
      });
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function setTL(loc, v) {
    setForm((prev) => ({ ...prev, label: { ...prev.label, [loc]: v } }));
  }

  function submit() {
    if (!form.code.trim() || !form.label.en.trim()) return;
    onSubmit?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Tag" : "Add Tag"}
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
          <span className="text-sm text-muted">Kind</span>
          <select
            className="input mt-1"
            value={form.kind}
            onChange={(e) => setField("kind", e.target.value)}
          >
            <option value="diet">Diet</option>
            <option value="meal">Meal Type</option>
            <option value="diff">Difficulty</option>
            <option value="time">Time</option>
            <option value="cost">Cost</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-muted">Code</span>
          <input
            className="input mt-1"
            value={form.code}
            onChange={(e) => setField("code", e.target.value)}
          />
        </label>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Label (EN)</span>
            <input
              className="input mt-1"
              value={form.label.en}
              onChange={(e) => setTL("en", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Label (DE)</span>
            <input
              className="input mt-1"
              value={form.label.de}
              onChange={(e) => setTL("de", e.target.value)}
            />
          </label>
        </div>
      </div>
    </Drawer>
  );
}
