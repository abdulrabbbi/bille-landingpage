import React, { useEffect, useState } from "react";
import { fetchPolicies, updatePolicies } from "../api/iam.service.js";

export default function PoliciesPage() {
  const [pol, setPol] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetchPolicies();
      setPol(res.data);
    })();
  }, []);

  async function save() {
    setSaving(true);
    await updatePolicies(pol);
    setSaving(false);
  }

  if (!pol) return <div className="card p-6">Loading policies…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Security Policies</h1>
          <p className="text-sm text-muted">
            MFA enforcement and passcode rules for the operator app.
          </p>
        </div>
        <button className="btn" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="font-medium">Two-Factor Authentication</div>
          <p className="text-sm text-muted">
            Require all users to enable MFA on next sign-in.
          </p>
          <label className="mt-3 inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-[var(--primary)]"
              checked={pol.requireMfa}
              onChange={(e) => setPol({ ...pol, requireMfa: e.target.checked })}
            />
            <span>Enforce MFA platform-wide</span>
          </label>
        </div>

        <div className="card p-4">
          <div className="font-medium">Passcode Policy (iOS app)</div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <label className="block">
              <div className="text-sm text-muted">Passcode length</div>
              <input
                className="input mt-1"
                type="number"
                min={4}
                max={10}
                value={pol.passcodeLength}
                onChange={(e) =>
                  setPol({ ...pol, passcodeLength: Number(e.target.value) })
                }
              />
            </label>
            <label className="block">
              <div className="text-sm text-muted">Auto-lock after (mins)</div>
              <input
                className="input mt-1"
                type="number"
                min={1}
                max={60}
                value={pol.lockTimeoutMins}
                onChange={(e) =>
                  setPol({ ...pol, lockTimeoutMins: Number(e.target.value) })
                }
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
