import React, { useEffect, useState } from "react";
import Drawer from "../../../shared/components/Drawer.jsx";

export default function CouponDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    code: "",
    type: "percent", // percent | fixed
    value: 10,
    active: true,
    maxRedemptions: 100,
    expiresAt: null, // timestamp or null
  });

  useEffect(() => {
    if (open) {
      setForm({
        code: initial?.code || "",
        type: initial?.type || "percent",
        value: initial?.value ?? 10,
        active: initial?.active ?? true,
        maxRedemptions: initial?.maxRedemptions ?? 100,
        expiresAt: initial?.expiresAt ?? null,
      });
    }
  }, [open, initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function submit() {
    if (!form.code.trim()) return;
    if (form.type === "percent" && (form.value < 1 || form.value > 100)) return;
    onSubmit?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Coupon" : "New Coupon"}
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
      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Code</span>
            <input
              className="input mt-1 uppercase"
              value={form.code}
              onChange={(e) => setField("code", e.target.value.toUpperCase())}
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Type</span>
            <select
              className="input mt-1"
              value={form.type}
              onChange={(e) => setField("type", e.target.value)}
            >
              <option value="percent">Percent</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm text-muted">Value</span>
            <input
              className="input mt-1"
              type="number"
              min={1}
              max={form.type === "percent" ? 100 : 9999}
              value={form.value}
              onChange={(e) => setField("value", Number(e.target.value || 0))}
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Max Redemptions</span>
            <input
              className="input mt-1"
              type="number"
              min={1}
              value={form.maxRedemptions}
              onChange={(e) =>
                setField("maxRedemptions", Number(e.target.value || 0))
              }
            />
          </label>
          <label className="inline-flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              className="accent-(--primary)]"
              checked={form.active}
              onChange={(e) => setField("active", e.target.checked)}
            />
            <span className="text-sm">Active</span>
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-muted">Expires At</span>
          <input
            className="input mt-1"
            type="datetime-local"
            value={
              form.expiresAt
                ? new Date(form.expiresAt).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setField(
                "expiresAt",
                e.target.value ? new Date(e.target.value).getTime() : null
              )
            }
          />
        </label>
      </div>
    </Drawer>
  );
}
