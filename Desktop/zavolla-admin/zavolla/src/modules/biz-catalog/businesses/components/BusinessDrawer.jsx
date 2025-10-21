import React, { useEffect, useState } from "react";

export default function BusinessDrawer({
  open,
  initial = null,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("GBP");
  const [timezone, setTimezone] = useState("Europe/London");
  const [taxRate, setTaxRate] = useState(20);
  const [receiptFooter, setReceiptFooter] = useState("");

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setCurrency(initial?.currency || "GBP");
      setTimezone(initial?.timezone || "Europe/London");
      setTaxRate(initial?.taxRate ?? 20);
      setReceiptFooter(initial?.receiptFooter || "");
    }
  }, [open, initial]);

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
            {initial ? "Edit Business" : "New Business"}
          </div>
          <div className="text-xs text-muted">Branding & fiscal defaults</div>
        </div>

        <form
          className="p-4 space-y-4 overflow-auto h-[calc(100%-120px)]"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              name,
              currency,
              timezone,
              taxRate: Number(taxRate),
              receiptFooter,
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
              <div className="text-sm text-muted">Currency</div>
              <input
                className="input mt-1"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </label>
            <label className="block">
              <div className="text-sm text-muted">Tax %</div>
              <input
                className="input mt-1"
                type="number"
                min={0}
                max={100}
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </label>
          </div>

          <label className="block">
            <div className="text-sm text-muted">Timezone</div>
            <input
              className="input mt-1"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            />
          </label>

          <label className="block">
            <div className="text-sm text-muted">Receipt footer</div>
            <textarea
              className="input mt-1 h-24"
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
            />
          </label>

          <div className="h-8" />
        </form>

        <div
          className="p-4 border-t flex gap-2 justify-end"
          style={{ borderColor: "var(--border)" }}
        >
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn"
            onClick={() =>
              onSubmit({
                name,
                currency,
                timezone,
                taxRate: Number(taxRate),
                receiptFooter,
              })
            }
          >
            {initial ? "Save" : "Create"}
          </button>
        </div>
      </aside>
    </div>
  );
}
