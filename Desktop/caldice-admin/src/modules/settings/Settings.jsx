import React, { useEffect, useRef, useState } from "react";
import {
  getSettings,
  saveSettings,
  uploadLogo,
  createToken,
  revokeToken,
} from "./api/settings.service.js";
import ConfirmDialog from "../../shared/components/ConfirmDialog.jsx";

export default function Settings() {
  const [busy, setBusy] = useState(true);
  const [data, setData] = useState(null);
  const [toast, setToast] = useState("");
  const [tokName, setTokName] = useState("");
  const [showSecret, setShowSecret] = useState("");
  const [revoke, setRevoke] = useState(null);
  const logoInput = useRef(null);

  async function load() {
    setBusy(true);
    const res = await getSettings();
    if (res?.ok) setData(res.data);
    setBusy(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function onSave(partial) {
    const res = await saveSettings(partial);
    if (res?.ok) {
      setData(res.data);
      note("Saved");
    }
  }

  function note(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1400);
  }

  async function onLogoSelected(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const res = await uploadLogo(f);
    if (res?.ok) {
      setData((prev) => ({
        ...prev,
        branding: { ...prev.branding, logoUrl: res.data.url },
      }));
      note("Logo updated");
    }
  }

  async function onCreateToken(e) {
    e.preventDefault();
    if (!tokName.trim()) return;
    const res = await createToken(tokName.trim());
    if (res?.ok) {
      setTokName("");
      setData((prev) => ({
        ...prev,
        tokens: [{ ...res.data }, ...prev.tokens],
      }));
      setShowSecret(res.secret);
      note("Token created");
    }
  }

  async function onRevoke() {
    if (!revoke) return;
    const res = await revokeToken(revoke.id);
    if (res?.ok) {
      setData((prev) => ({
        ...prev,
        tokens: prev.tokens.filter((t) => t.id !== revoke.id),
      }));
      setRevoke(null);
      note("Token revoked");
    }
  }

  if (busy) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-4 w-32 bg-muted/30 rounded mb-4" />
            <div className="h-10 w-full bg-muted/20 rounded mb-2" />
            <div className="h-10 w-2/3 bg-muted/20 rounded" />
          </div>
        ))}
      </div>
    );
  }
  if (!data) return <div className="card p-6">Failed to load settings.</div>;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed right-4 top-20 z-30 bg-primary text-white text-sm px-3 py-1.5 rounded-lg shadow">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <div className="text-sm text-muted">
          Organization, branding, notifications & tokens
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Organization */}
        <div className="xl:col-span-2 card p-4 space-y-3">
          <div className="font-medium">Organization</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-muted">Organization name</span>
              <input
                className="input mt-1"
                value={data.orgName}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, orgName: e.target.value }))
                }
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted">Contact email</span>
              <input
                className="input mt-1"
                type="email"
                value={data.contactEmail}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, contactEmail: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="block">
              <span className="text-sm text-muted">Locale</span>
              <select
                className="input mt-1"
                value={data.locale}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, locale: e.target.value }))
                }
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="pt">Português</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm text-muted">Timezone</span>
              <input
                className="input mt-1"
                value={data.timezone}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, timezone: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="pt-1">
            <button
              className="btn"
              onClick={() =>
                onSave({
                  orgName: data.orgName,
                  contactEmail: data.contactEmail,
                  locale: data.locale,
                  timezone: data.timezone,
                })
              }
            >
              Save Organization
            </button>
          </div>
        </div>

        {/* Branding */}
        <div className="card p-4 space-y-3">
          <div className="font-medium">Branding</div>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-xl overflow-hidden border border-(--line)] bg-card">
              {data.branding.logoUrl ? (
                <img
                  src={data.branding.logoUrl}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-xs text-muted">
                  Logo
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={logoInput}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onLogoSelected}
              />
              <button
                className="btn-ghost"
                onClick={() => logoInput.current?.click()}
              >
                Upload
              </button>
              {data.branding.logoUrl && (
                <button
                  className="btn-ghost"
                  onClick={() =>
                    onSave({ branding: { ...data.branding, logoUrl: "" } })
                  }
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <label className="block">
            <span className="text-sm text-muted">Primary color</span>
            <input
              className="input mt-1"
              type="color"
              value={data.branding.primaryColor}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  branding: { ...prev.branding, primaryColor: e.target.value },
                }))
              }
            />
          </label>
          <div className="pt-1">
            <button
              className="btn"
              onClick={() => onSave({ branding: data.branding })}
            >
              Save Branding
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Notifications */}
        <div className="card p-4 space-y-3">
          <div className="font-medium">Notifications</div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-(--primary)]"
              checked={data.notifications.emailReports}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    emailReports: e.target.checked,
                  },
                }))
              }
            />
            <span className="text-sm">Email weekly reports</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-(--primary)]"
              checked={data.notifications.dailyDigest}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    dailyDigest: e.target.checked,
                  },
                }))
              }
            />
            <span className="text-sm">Daily digest</span>
          </label>
          <div className="pt-1">
            <button
              className="btn"
              onClick={() => onSave({ notifications: data.notifications })}
            >
              Save Notifications
            </button>
          </div>
        </div>

        {/* API Tokens */}
        <div className="card p-4 space-y-3">
          <div className="font-medium">API Tokens</div>
          <form onSubmit={onCreateToken} className="flex flex-wrap gap-2">
            <input
              className="input flex-1 min-w-[200px]"
              placeholder="Token name (e.g., Server, CLI)"
              value={tokName}
              onChange={(e) => setTokName(e.target.value)}
            />
            <button className="btn" type="submit">
              Create Token
            </button>
          </form>

          {showSecret && (
            <div className="rounded-lg border border-(--line)] bg-muted/10 p-3">
              <div className="text-xs text-muted mb-1">
                Copy your token now. You won’t see it again.
              </div>
              <div className="font-mono text-sm break-all">{showSecret}</div>
              <div className="mt-2">
                <button
                  className="btn-ghost text-xs"
                  onClick={() => setShowSecret("")}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-muted">
                <tr>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Last 4</th>
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.tokens.map((t) => (
                  <tr key={t.id} className="border-t border-(--line)]">
                    <td className="py-2 pr-4">{t.name}</td>
                    <td className="py-2 pr-4 font-mono">{t.last4}</td>
                    <td className="py-2 pr-4">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-2">
                      <button
                        className="btn-ghost"
                        onClick={() => setRevoke(t)}
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
                {data.tokens.length === 0 && (
                  <tr>
                    <td className="py-3 text-muted" colSpan={4}>
                      No tokens yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!revoke}
        title="Revoke token?"
        message={revoke ? `This will immediately revoke "${revoke.name}".` : ""}
        confirmLabel="Revoke"
        onConfirm={onRevoke}
        onCancel={() => setRevoke(null)}
      />
    </div>
  );
}
