import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";

export default function PlanDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: "",
    code: "",
    price: 0,
    interval: "month",
    features: [],
    status: "active",
  });
  const [feat, setFeat] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        code: initial?.code || "",
        price: initial?.price ?? 0,
        interval: initial?.interval || "month",
        features: initial?.features || [],
        status: initial?.status || "active",
      });
      setFeat("");
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function addFeature() {
    const t = feat.trim();
    if (!t) return;
    setForm((prev) => ({ ...prev, features: [...prev.features, t] }));
    setFeat("");
  }
  function rmFeature(i) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== i),
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
      title={isEdit ? "Edit Plan" : "New Plan"}
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

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Price</span>
            <input
              className="input mt-1"
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setField("price", Number(e.target.value || 0))}
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Interval</span>
            <select
              className="input mt-1"
              value={form.interval}
              onChange={(e) => setField("interval", e.target.value)}
            >
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-muted">Status</span>
            <select
              className="input mt-1"
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="card p-3">
          <div className="text-sm font-medium mb-2">Features</div>
          <div className="flex gap-2 mb-3">
            <input
              className="input flex-1"
              placeholder="Add a feature"
              value={feat}
              onChange={(e) => setFeat(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <button className="btn" type="button" onClick={addFeature}>
              Add
            </button>
          </div>
          <div className="grid gap-2">
            {form.features.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-muted/10 rounded-lg px-3 py-2"
              >
                <div className="text-sm">{f}</div>
                <button className="btn-ghost" onClick={() => rmFeature(i)}>
                  Remove
                </button>
              </div>
            ))}
            {form.features.length === 0 && (
              <div className="text-sm text-muted">No features yet.</div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
