import React, { useEffect, useState } from "react";

export default function PrinterDrawer({
  open,
  initial = null,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("kitchen");
  const [iface, setIface] = useState("lan");
  const [address, setAddress] = useState("");
  const [width, setWidth] = useState(80);
  const [locationId, setLocationId] = useState("");

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setType(initial?.type || "kitchen");
      setIface(initial?.iface || "lan");
      setAddress(initial?.address || "");
      setWidth(initial?.width ?? 80);
      setLocationId(initial?.locationId || "");
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
            {initial ? "Edit Printer" : "Add Printer"}
          </div>
          <div className="text-xs text-muted">
            Address can be IP (LAN) or MAC (BLE)
          </div>
        </div>

        <form
          className="p-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              id: initial?.id,
              name,
              type,
              iface,
              address,
              width: Number(width),
              locationId: locationId || null,
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
              <div className="text-sm text-muted">Type</div>
              <select
                className="input mt-1"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="kitchen">Kitchen</option>
                <option value="receipt">Receipt</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm text-muted">Interface</div>
              <select
                className="input mt-1"
                value={iface}
                onChange={(e) => setIface(e.target.value)}
              >
                <option value="lan">LAN</option>
                <option value="ble">BLE</option>
                <option value="usb">USB</option>
              </select>
            </label>
          </div>

          <label className="block">
            <div className="text-sm text-muted">Address</div>
            <input
              className="input mt-1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="192.168.1.60 or AA:BB:CC:…"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <div className="text-sm text-muted">Paper width (mm)</div>
              <input
                className="input mt-1"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </label>
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
