import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";

export default function PresetDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: "",
    filters: { meal: "", timeMax: 20, diet: "" },
    weight: 1,
    enabled: true,
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        filters: initial?.filters || { meal: "", timeMax: 20, diet: "" },
        weight: initial?.weight ?? 1,
        enabled: initial?.enabled ?? true,
      });
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function setF(k, v) {
    setForm((prev) => ({ ...prev, filters: { ...prev.filters, [k]: v } }));
  }
  function submit() {
    if (!form.name.trim()) return;
    onSubmit?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Spin Preset" : "New Spin Preset"}
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
        <label className="block">
          <span className="text-sm text-muted">Name</span>
          <input
            className="input mt-1"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </label>

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Meal</span>
            <select
              className="input mt-1"
              value={form.filters.meal}
              onChange={(e) => setF("meal", e.target.value)}
            >
              <option value="">Any</option>
              <option value="breakfast">Breakfast</option>
              <option value="dinner">Dinner</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-muted">Max Time (min)</span>
            <input
              className="input mt-1"
              type="number"
              min={1}
              value={form.filters.timeMax}
              onChange={(e) => setF("timeMax", Number(e.target.value || 0))}
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Diet</span>
            <select
              className="input mt-1"
              value={form.filters.diet}
              onChange={(e) => setF("diet", e.target.value)}
            >
              <option value="">Any</option>
              <option value="vegan">Vegan</option>
              <option value="veget">Vegetarian</option>
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Weight</span>
            <input
              className="input mt-1"
              type="number"
              min={1}
              value={form.weight}
              onChange={(e) => setField("weight", Number(e.target.value || 1))}
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
      </div>
    </Drawer>
  );
}
