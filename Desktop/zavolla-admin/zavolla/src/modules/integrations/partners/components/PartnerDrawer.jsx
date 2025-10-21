import React, { useEffect, useState } from "react";

export default function PartnerDrawer({
  open,
  initial = null,
  partners = [],
  onClose,
  onSubmit,
}) {
  const [partner, setPartner] = useState("ubereats");
  const [merchantId, setMerchantId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [locations, setLocations] = useState(["l1"]);
  const [autoPrint, setAutoPrint] = useState(true);

  useEffect(() => {
    if (open) {
      setPartner(initial?.partner || "ubereats");
      setMerchantId(initial?.meta?.merchantId || "");
      setApiKey(initial?.meta?.apiKey || "");
      setLocations(initial?.locations || ["l1"]);
      setAutoPrint(!!initial?.autoPrint);
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
            {initial ? "Edit Integration" : "Add Integration"}
          </div>
          <div className="text-xs text-muted">
            Enter merchant credentials & assign locations
          </div>
        </div>

        <form
          className="p-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              id: initial?.id,
              partner,
              locations,
              autoPrint,
              meta: { merchantId, apiKey },
            });
          }}
        >
          <label className="block">
            <div className="text-sm text-muted">Partner</div>
            <select
              className="input mt-1"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              disabled={!!initial}
            >
              {partners.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-sm text-muted">Merchant ID</div>
            <input
              className="input mt-1"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              placeholder="e.g. UE-12345"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm text-muted">API Key (kept secret)</div>
            <input
              className="input mt-1"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <div>
            <div className="text-sm text-muted">Locations</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["l1", "l2"].map((l) => (
                <label
                  key={l}
                  className="card p-2 flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="accent-[var(--primary)]"
                    checked={locations.includes(l)}
                    onChange={(e) => {
                      const on = e.target.checked;
                      setLocations((prev) =>
                        on
                          ? [...new Set([...prev, l])]
                          : prev.filter((x) => x !== l)
                      );
                    }}
                  />
                  <span>{l === "l1" ? "Soho" : "Shoreditch"}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-[var(--primary)]"
              checked={autoPrint}
              onChange={(e) => setAutoPrint(e.target.checked)}
            />
            <span>Auto-print new delivery orders</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
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
