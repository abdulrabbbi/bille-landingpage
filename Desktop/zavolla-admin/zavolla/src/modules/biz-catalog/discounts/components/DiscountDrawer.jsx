import React, { useEffect, useState } from "react";

export default function DiscountDrawer({
  open,
  initial = null,
  onClose,
  onSubmit,
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState(10);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || "");
      setType(initial?.type || "percent");
      setValue(initial?.value ?? 10);
      setActive(initial?.active ?? true);
    }
  }, [open, initial]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-full sm:w-[380px] bg-[var(--surface)] border-l"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="font-semibold">
            {initial ? "Edit Discount" : "New Discount"}
          </div>
        </div>
        <form
          className="p-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              id: initial?.id,
              title,
              type,
              value: Number(value),
              active,
            });
          }}
        >
          <label className="block">
            <div className="text-sm text-muted">Title</div>
            <input
              className="input mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <div className="text-sm text-muted">Type</div>
              <select
                className="input mt-1"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="percent">Percent</option>
                <option value="amount">Amount</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm text-muted">Value</div>
              <input
                className="input mt-1"
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </label>
          </div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-[var(--primary)]"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span>Active</span>
          </label>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn">{initial ? "Save" : "Create"}</button>
          </div>
        </form>
      </aside>
    </div>
  );
}
