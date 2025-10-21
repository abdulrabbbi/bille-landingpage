import React, { useEffect, useState } from "react";
import ThemeSwitch from "../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../iam/components/SkeletonRow.jsx";
import Section from "./components/Section.jsx";
import ColorInput from "./components/ColorInput.jsx";
import { getSettings, updateSettings } from "./api/settings.service.js";

const currencies = ["GBP", "EUR", "USD"];

export default function Settings() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("general"); // general | appearance | pos | security | notifications | receipts

  async function load() {
    const res = await getSettings();
    setData(res.data);
  }
  useEffect(() => {
    load();
  }, []);

  async function save(partial) {
    setSaving(true);
    const res = await updateSettings(partial);
    setData(res.data);
    setSaving(false);
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <p className="text-sm text-muted">
              Configure business, POS and notifications
            </p>
          </div>
          <ThemeSwitch />
        </div>
        <div className="card p-4">
          <SkeletonRow cols={2} block />
          <SkeletonRow cols={2} block />
        </div>
        <div className="card p-4">
          <SkeletonRow cols={2} block />
          <SkeletonRow cols={2} block />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted">
            All locations use these defaults (override per location later)
          </p>
        </div>
        <ThemeSwitch />
      </div>

      {/* tabs */}
      <div className="card p-1 overflow-x-auto">
        <div className="flex gap-1">
          {[
            "general",
            "appearance",
            "pos",
            "security",
            "notifications",
            "receipts",
          ].map((k) => (
            <button
              key={k}
              className={`px-3 py-2 rounded-lg text-sm ${
                tab === k ? "bg-[var(--surface-2)] font-medium" : "btn-ghost"
              }`}
              onClick={() => setTab(k)}
            >
              {label(k)}
            </button>
          ))}
        </div>
      </div>

      {tab === "general" && (
        <Section
          title="Business Profile"
          subtitle="Brand identity and contact info"
          actions={
            <button
              className="btn"
              disabled={saving}
              onClick={() => save({ business: data.business })}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          }
        >
          <label className="block">
            <div className="text-sm text-muted">Business name</div>
            <input
              className="input mt-1"
              value={data.business.name}
              onChange={(e) => patch("business", "name", e.target.value)}
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Legal name</div>
            <input
              className="input mt-1"
              value={data.business.legalName}
              onChange={(e) => patch("business", "legalName", e.target.value)}
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Email</div>
            <input
              className="input mt-1"
              type="email"
              value={data.business.email}
              onChange={(e) => patch("business", "email", e.target.value)}
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Phone</div>
            <input
              className="input mt-1"
              value={data.business.phone}
              onChange={(e) => patch("business", "phone", e.target.value)}
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Currency</div>
            <select
              className="input mt-1"
              value={data.business.currency}
              onChange={(e) => patch("business", "currency", e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <div className="text-sm text-muted">Timezone</div>
            <input
              className="input mt-1"
              value={data.business.timezone}
              onChange={(e) => patch("business", "timezone", e.target.value)}
            />
          </label>
        </Section>
      )}

      {tab === "appearance" && (
        <Section
          title="Appearance"
          subtitle="Brand colors and logos (UI & receipts)"
          actions={
            <button
              className="btn"
              disabled={saving}
              onClick={() => save({ appearance: data.appearance })}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          }
        >
          <ColorInput
            label="Brand color (light)"
            value={data.appearance.brandColor}
            onChange={(v) => patch("appearance", "brandColor", v)}
          />
          <ColorInput
            label="Brand color (dark)"
            value={data.appearance.darkBrandColor}
            onChange={(v) => patch("appearance", "darkBrandColor", v)}
          />
          <label className="block">
            <div className="text-sm text-muted">Logo URL</div>
            <input
              className="input mt-1"
              placeholder="https://…"
              value={data.appearance.logoUrl}
              onChange={(e) => patch("appearance", "logoUrl", e.target.value)}
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Receipt logo URL</div>
            <input
              className="input mt-1"
              placeholder="https://…"
              value={data.appearance.receiptLogoUrl}
              onChange={(e) =>
                patch("appearance", "receiptLogoUrl", e.target.value)
              }
            />
          </label>
        </Section>
      )}

      {tab === "pos" && (
        <Section
          title="POS Preferences"
          subtitle="Taxes, service charge, tipping and quick amounts"
          actions={
            <button
              className="btn"
              disabled={saving}
              onClick={() => save({ pos: data.pos })}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          }
        >
          <label className="block">
            <div className="text-sm text-muted">Tax %</div>
            <input
              className="input mt-1"
              type="number"
              step="0.1"
              value={data.pos.taxPercent}
              onChange={(e) => patch("pos", "taxPercent", +e.target.value)}
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Service charge %</div>
            <input
              className="input mt-1"
              type="number"
              step="0.1"
              value={data.pos.serviceChargePercent}
              onChange={(e) =>
                patch("pos", "serviceChargePercent", +e.target.value)
              }
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Tipping enabled</div>
            <div className="mt-1">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={data.pos.tippingEnabled}
                onChange={(e) =>
                  patch("pos", "tippingEnabled", e.target.checked)
                }
              />
            </div>
          </label>
          <label className="block">
            <div className="text-sm text-muted">Quick tip amounts (£)</div>
            <input
              className="input mt-1"
              value={data.pos.quickAmounts.join(", ")}
              onChange={(e) =>
                patch("pos", "quickAmounts", parseNumberList(e.target.value))
              }
              placeholder="5, 10, 15"
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Default location</div>
            <select
              className="input mt-1"
              value={data.pos.defaultLocation}
              onChange={(e) => patch("pos", "defaultLocation", e.target.value)}
            >
              <option value="l1">Soho</option>
              <option value="l2">Shoreditch</option>
            </select>
          </label>
        </Section>
      )}

      {tab === "security" && (
        <Section
          title="Security"
          subtitle="Session limits and passcode behavior (app-level)"
          actions={
            <button
              className="btn"
              disabled={saving}
              onClick={() => save({ security: data.security })}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          }
        >
          <label className="block">
            <div className="text-sm text-muted">
              Require passcode on app open
            </div>
            <div className="mt-1">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={data.security.passcodeRequired}
                onChange={(e) =>
                  patch("security", "passcodeRequired", e.target.checked)
                }
              />
            </div>
          </label>
          <label className="block">
            <div className="text-sm text-muted">Auto-lock after (minutes)</div>
            <input
              className="input mt-1"
              type="number"
              min="1"
              value={data.security.autoLockMinutes}
              onChange={(e) =>
                patch("security", "autoLockMinutes", +e.target.value)
              }
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Two-factor required</div>
            <div className="mt-1">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={data.security.twoFactor}
                onChange={(e) =>
                  patch("security", "twoFactor", e.target.checked)
                }
              />
            </div>
          </label>
          <label className="block">
            <div className="text-sm text-muted">Session duration (hours)</div>
            <input
              className="input mt-1"
              type="number"
              min="1"
              value={data.security.sessionHours}
              onChange={(e) =>
                patch("security", "sessionHours", +e.target.value)
              }
            />
          </label>
        </Section>
      )}

      {tab === "notifications" && (
        <Section
          title="Notifications"
          subtitle="Daily email reports, push and hardware alerts"
          actions={
            <button
              className="btn"
              disabled={saving}
              onClick={() => save({ notifications: data.notifications })}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          }
        >
          <label className="block">
            <div className="text-sm text-muted">Daily report email</div>
            <input
              className="input mt-1"
              type="email"
              value={data.notifications.dailyReportEmail}
              onChange={(e) =>
                patch("notifications", "dailyReportEmail", e.target.value)
              }
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Daily report time (local)</div>
            <input
              className="input mt-1"
              type="time"
              value={data.notifications.dailyReportTime}
              onChange={(e) =>
                patch("notifications", "dailyReportTime", e.target.value)
              }
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Push on new delivery order</div>
            <div className="mt-1">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={data.notifications.pushNewOrder}
                onChange={(e) =>
                  patch("notifications", "pushNewOrder", e.target.checked)
                }
              />
            </div>
          </label>
          <label className="block">
            <div className="text-sm text-muted">Push on hardware alerts</div>
            <div className="mt-1">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={data.notifications.pushHardwareAlerts}
                onChange={(e) =>
                  patch("notifications", "pushHardwareAlerts", e.target.checked)
                }
              />
            </div>
          </label>
        </Section>
      )}

      {tab === "receipts" && (
        <Section
          title="Receipts"
          subtitle="Default receipt header/footer and visibility of rows"
          actions={
            <button
              className="btn"
              disabled={saving}
              onClick={() => save({ receipts: data.receipts })}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          }
        >
          <label className="block sm:col-span-2">
            <div className="text-sm text-muted">Header (top message)</div>
            <input
              className="input mt-1"
              value={data.receipts.header}
              onChange={(e) => patch("receipts", "header", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <div className="text-sm text-muted">Footer (bottom message)</div>
            <input
              className="input mt-1"
              value={data.receipts.footer}
              onChange={(e) => patch("receipts", "footer", e.target.value)}
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Show tax breakdown</div>
            <div className="mt-1">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={data.receipts.showTaxBreakdown}
                onChange={(e) =>
                  patch("receipts", "showTaxBreakdown", e.target.checked)
                }
              />
            </div>
          </label>
          <label className="block">
            <div className="text-sm text-muted">Show service charge</div>
            <div className="mt-1">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={data.receipts.showServiceCharge}
                onChange={(e) =>
                  patch("receipts", "showServiceCharge", e.target.checked)
                }
              />
            </div>
          </label>
          <label className="block">
            <div className="text-sm text-muted">Show QR tip section</div>
            <div className="mt-1">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={data.receipts.showQrTip}
                onChange={(e) =>
                  patch("receipts", "showQrTip", e.target.checked)
                }
              />
            </div>
          </label>
        </Section>
      )}
    </div>
  );

  function patch(scope, key, val) {
    setData((d) => ({ ...d, [scope]: { ...d[scope], [key]: val } }));
  }
}

function label(k) {
  return (
    {
      general: "General",
      appearance: "Appearance",
      pos: "POS",
      security: "Security",
      notifications: "Notifications",
      receipts: "Receipts",
    }[k] || k
  );
}

function parseNumberList(s) {
  return s
    .split(",")
    .map((x) => +x.trim())
    .filter((n) => Number.isFinite(n) && n >= 0);
}
