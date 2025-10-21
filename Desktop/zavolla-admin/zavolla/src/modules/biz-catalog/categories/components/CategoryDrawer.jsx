import React, { useEffect, useState } from "react";

export default function CategoryDrawer({
  open,
  initial = null,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [sort, setSort] = useState(1);

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setSort(initial?.sort ?? 1);
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
            {initial ? "Edit Category" : "New Category"}
          </div>
        </div>
        <form
          className="p-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ id: initial?.id, name, sort: Number(sort) });
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
          <label className="block">
            <div className="text-sm text-muted">Sort</div>
            <input
              className="input mt-1"
              type="number"
              min={0}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            />
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
