import React, { useEffect, useState } from "react";

export default function ItemDrawer({
  open,
  initial = null,
  categories = [],
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setSku(initial?.sku || "");
      setPrice(initial?.price ?? 0);
      setCategoryId(initial?.categoryId || categories[0]?.id || "");
    }
  }, [open, initial, categories]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-[var(--surface)] border-l"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="font-semibold">
            {initial ? "Edit Item" : "New Item"}
          </div>
        </div>

        <form
          className="p-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              id: initial?.id,
              name,
              sku,
              price: Number(price),
              categoryId,
            });
          }}
        >
          <label className="block">
            <div className="text-sm text-muted">Name</div>
            <input
              className="input mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <div className="text-sm text-muted">SKU</div>
              <input
                className="input mt-1"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </label>
            <label className="block">
              <div className="text-sm text-muted">Price</div>
              <input
                className="input mt-1"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
          </div>

          <label className="block">
            <div className="text-sm text-muted">Category</div>
            <select
              className="input mt-1"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
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
