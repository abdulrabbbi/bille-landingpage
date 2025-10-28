import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";

export default function FilterGroupDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: "",
    code: "",
    items: [{ code: "", label: "" }],
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        code: initial?.code || "",
        items: initial?.items?.length
          ? initial.items
          : [{ code: "", label: "" }],
      });
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function setItem(i, key, v) {
    setForm((prev) => {
      const next = [...prev.items];
      next[i] = { ...next[i], [key]: v };
      return { ...prev, items: next };
    });
  }
  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { code: "", label: "" }],
    }));
  }
  function rmItem(i) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== i),
    }));
  }
  function submit() {
    if (!form.name.trim() || !form.code.trim()) return;
    const items = form.items.filter((x) => x.code.trim() && x.label.trim());
    onSubmit?.({ ...form, items });
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Filter Group" : "New Filter Group"}
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
      <div className="grid gap-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Group Name</span>
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
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Items</div>
            <button className="btn-ghost" onClick={addItem}>
              Add
            </button>
          </div>
          <div className="grid gap-2">
            {form.items.map((it, i) => (
              <div key={i} className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  className="input"
                  placeholder="code"
                  value={it.code}
                  onChange={(e) => setItem(i, "code", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="label"
                  value={it.label}
                  onChange={(e) => setItem(i, "label", e.target.value)}
                />
                <button className="btn-ghost" onClick={() => rmItem(i)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
