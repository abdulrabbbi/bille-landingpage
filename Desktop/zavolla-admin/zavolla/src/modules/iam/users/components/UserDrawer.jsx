import React, { useEffect, useState } from "react";

const ROLES = ["Super Admin", "Business Admin", "Team Member"];

export default function UserDrawer({
  open,
  initial = null,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Team Member");
  const [locations, setLocations] = useState([]);
  const [mfa, setMfa] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setEmail(initial?.email || "");
      setRole(initial?.role || "Team Member");
      setLocations(initial?.locations || []);
      setMfa(!!initial?.mfa);
    }
  }, [open, initial]);

  function addLocation(tag) {
    const v = tag.trim();
    if (!v) return;
    setLocations((prev) => (prev.includes(v) ? prev : [...prev, v]));
  }
  function removeLocation(tag) {
    setLocations((prev) => prev.filter((x) => x !== tag));
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
            {initial ? "Edit User" : "New User"}
          </div>
          <div className="text-xs text-muted">Manage access & MFA</div>
        </div>

        <form
          className="p-4 space-y-4 overflow-auto h-[calc(100%-120px)]"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ name, email, role, locations, mfa });
          }}
        >
          <label className="block">
            <span className="text-sm text-muted">Full name</span>
            <input
              className="input mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-muted">Email</span>
            <input
              className="input mt-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-muted">Role</span>
            <select
              className="input mt-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <div>
            <div className="text-sm text-muted">Locations</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {locations.map((loc) => (
                <span
                  key={loc}
                  className="px-2 py-1 rounded bg-[var(--card)] border text-xs"
                  style={{ borderColor: "var(--border)" }}
                >
                  {loc}
                  <button
                    type="button"
                    className="ml-2 text-muted hover:text-red-500"
                    onClick={() => removeLocation(loc)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                className="input flex-1"
                placeholder="Type location & press Add"
                id="locInput"
              />
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const el = document.getElementById("locInput");
                  addLocation(el.value);
                  el.value = "";
                }}
              >
                Add
              </button>
            </div>
            <div className="text-xs text-muted mt-1">
              Use "*" for all locations.
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="accent-[var(--primary)]"
              checked={mfa}
              onChange={(e) => setMfa(e.target.checked)}
            />
            <span className="text-sm">Require 2FA (MFA) for this user</span>
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
            onClick={() => onSubmit({ name, email, role, locations, mfa })}
          >
            {initial ? "Save" : "Create"}
          </button>
        </div>
      </aside>
    </div>
  );
}
