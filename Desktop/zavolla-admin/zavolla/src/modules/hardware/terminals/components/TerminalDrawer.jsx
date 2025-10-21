import React, { useEffect, useState } from "react";

export default function TerminalDrawer({
  open,
  initial = null,
  onClose,
  onSubmit,
}) {
  const [alias, setAlias] = useState("");
  const [serial, setSerial] = useState("");
  const [locationId, setLocationId] = useState("");
  const [firmware, setFirmware] = useState("2.7.1");

  useEffect(() => {
    if (open) {
      setAlias(initial?.alias || "");
      setSerial(initial?.serial || "");
      setLocationId(initial?.locationId || "");
      setFirmware(initial?.firmware || "2.7.1");
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
            {initial ? "Edit Terminal" : "Add Terminal"}
          </div>
          <div className="text-xs text-muted">
            BLE card reader configuration
          </div>
        </div>

        <form
          className="p-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              id: initial?.id,
              alias,
              serial,
              locationId: locationId || null,
              firmware,
            });
          }}
        >
          <label className="block">
            <div className="text-sm text-muted">Alias</div>
            <input
              className="input mt-1"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Front Desk"
              required
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Serial</div>
            <input
              className="input mt-1"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              placeholder="WP3-XXXX"
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <div className="text-sm text-muted">Location</div>
              <select
                className="input mt-1"
                value={locationId || ""}
                onChange={(e) => setLocationId(e.target.value)}
              >
                <option value="">Unassigned</option>
                <option value="l1">Soho</option>
                <option value="l2">Shoreditch</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm text-muted">Firmware</div>
              <input
                className="input mt-1"
                value={firmware}
                onChange={(e) => setFirmware(e.target.value)}
              />
            </label>
          </div>

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
