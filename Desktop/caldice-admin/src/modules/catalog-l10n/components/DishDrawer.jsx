import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";

export default function DishDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    title: { en: "", de: "" },
    description: { en: "", de: "" },
    diet: "",
    meal: "",
    timeMinutes: 15,
    cost: "low",
    youtube: "",
    tags: [],
  });

  useEffect(() => {
    if (open) {
      setForm({
        title: initial?.title || { en: "", de: "" },
        description: initial?.description || { en: "", de: "" },
        diet: initial?.diet || "",
        meal: initial?.meal || "",
        timeMinutes: initial?.timeMinutes ?? 15,
        cost: initial?.cost || "low",
        youtube: initial?.youtube || "",
        tags: initial?.tags || [],
      });
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function setTL(k, loc, v) {
    setForm((prev) => ({ ...prev, [k]: { ...prev[k], [loc]: v } }));
  }

  function submit() {
    if (!form.title.en.trim()) return;
    onSubmit?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Dish" : "Add Dish"}
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
      width={640}
    >
      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Title (EN)</span>
            <input
              className="input mt-1"
              value={form.title.en}
              onChange={(e) => setTL("title", "en", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Title (DE)</span>
            <input
              className="input mt-1"
              value={form.title.de}
              onChange={(e) => setTL("title", "de", e.target.value)}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Description (EN)</span>
            <textarea
              className="input mt-1"
              rows={4}
              value={form.description.en}
              onChange={(e) => setTL("description", "en", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Description (DE)</span>
            <textarea
              className="input mt-1"
              rows={4}
              value={form.description.de}
              onChange={(e) => setTL("description", "de", e.target.value)}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Diet</span>
            <select
              className="input mt-1"
              value={form.diet}
              onChange={(e) => setField("diet", e.target.value)}
            >
              <option value="">Select…</option>
              <option value="vegan">Vegan</option>
              <option value="veget">Vegetarian</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-muted">Meal</span>
            <select
              className="input mt-1"
              value={form.meal}
              onChange={(e) => setField("meal", e.target.value)}
            >
              <option value="">Select…</option>
              <option value="breakfast">Breakfast</option>
              <option value="dinner">Dinner</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-muted">Time (min)</span>
            <input
              className="input mt-1"
              type="number"
              min={1}
              value={form.timeMinutes}
              onChange={(e) =>
                setField("timeMinutes", Number(e.target.value || 0))
              }
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Cost</span>
            <select
              className="input mt-1"
              value={form.cost}
              onChange={(e) => setField("cost", e.target.value)}
            >
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-muted">YouTube URL</span>
            <input
              className="input mt-1"
              placeholder="https://…"
              value={form.youtube}
              onChange={(e) => setField("youtube", e.target.value)}
            />
          </label>
        </div>
      </div>
    </Drawer>
  );
}
