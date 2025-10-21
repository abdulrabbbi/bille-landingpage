import React, { useEffect, useState } from "react";

export default function LocationDrawer({
  open,
  initial = null,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("Europe/London");
  const [currency, setCurrency] = useState("GBP");
  const [delivery, setDelivery] = useState([]);
  const [printers, setPrinters] = useState([]);

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setTimezone(initial?.timezone || "Europe/London");
      setCurrency(initial?.currency || "GBP");
      setDelivery(initial?.delivery || []);
      setPrinters(initial?.printers || []);
    }
  }, [open, initial]);

  function addTag(v, setter) {
    const val = v.trim();
    if (!val) return;
    setter((prev) => (prev.includes(val) ? prev : [...prev, val]));
  }

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
            {initial ? "Edit Location" : "New Location"}
          </div>
          <div className="text-xs text-muted">Per-store configuration</div>
        </div>

        <form
          className="p-4 space-y-4 overflow-auto h-[calc(100%-120px)]"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ name, timezone, currency, delivery, printers });
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
              <div className="text-sm text-muted">Timezone</div>
              <input
                className="input mt-1"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </label>
            <label className="block">
              <div className="text-sm text-muted">Currency</div>
              <input
                className="input mt-1"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </label>
          </div>

          <div>
            <div className="text-sm text-muted">Delivery partners</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {delivery.map((d) => (
                <span
                  key={d}
                  className="px-2 py-1 rounded bg-[var(--card)] border text-xs"
                  style={{ borderColor: "var(--border)" }}
                >
                  {d}{" "}
                  <button
                    type="button"
                    className="ml-1 text-muted"
                    onClick={() => setDelivery(delivery.filter((x) => x !== d))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                className="input flex-1"
                placeholder="Uber Eats"
                id="delInp"
              />
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const el = document.getElementById("delInp");
                  addTag(el.value, setDelivery);
                  el.value = "";
                }}
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted">Printers</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {printers.map((p) => (
                <span
                  key={p}
                  className="px-2 py-1 rounded bg-[var(--card)] border text-xs"
                  style={{ borderColor: "var(--border)" }}
                >
                  {p}{" "}
                  <button
                    type="button"
                    className="ml-1 text-muted"
                    onClick={() => setPrinters(printers.filter((x) => x !== p))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                className="input flex-1"
                placeholder="Kitchen-1"
                id="prtInp"
              />
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const el = document.getElementById("prtInp");
                  addTag(el.value, setPrinters);
                  el.value = "";
                }}
              >
                Add
              </button>
            </div>
          </div>

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
              onSubmit({ name, timezone, currency, delivery, printers })
            }
          >
            {initial ? "Save" : "Create"}
          </button>
        </div>
      </aside>
    </div>
  );
}
