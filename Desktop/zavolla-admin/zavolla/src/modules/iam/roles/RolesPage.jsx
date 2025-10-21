import React, { useEffect, useState } from "react";
import { fetchRoles, updateRole } from "../api/iam.service.js";

const PERMS = [
  "Businesses",
  "Locations",
  "Catalog",
  "Orders",
  "Payments",
  "Refunds",
  "Hardware",
  "Delivery",
  "Reports",
  "Settings",
  "Users",
];

export default function RolesPage() {
  const [roles, setRoles] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetchRoles();
    setRoles(res.data);
  }
  useEffect(() => {
    load();
  }, []);

  async function toggle(role, perm) {
    setRoles((r) => ({ ...r, [role]: { ...r[role], [perm]: !r[role][perm] } }));
  }

  async function save() {
    setSaving(true);
    const entries = Object.entries(roles || {});
    for (const [role, matrix] of entries) {
      await updateRole(role, matrix);
    }
    setSaving(false);
  }

  if (!roles) return <div className="card p-6">Loading roles…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Roles & Permissions</h1>
          <p className="text-sm text-muted">Toggle capabilities per role.</p>
        </div>
        <button className="btn" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="card p-0 overflow-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left">Permission</th>
              {Object.keys(roles).map((r) => (
                <th key={r} className="px-3 py-2">
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMS.map((p) => (
              <tr
                key={p}
                className="border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-3 py-2 font-medium">{p}</td>
                {Object.entries(roles).map(([role, matrix]) => (
                  <td key={role} className="px-3 py-2 text-center">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-[var(--primary)]"
                        checked={!!matrix[p]}
                        onChange={() => toggle(role, p)}
                      />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
