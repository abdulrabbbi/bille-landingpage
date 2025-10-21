import React, { useEffect, useMemo, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import {
  fetchPartners,
  fetchMenuMap,
  saveMenuMap,
  partnerLabel,
} from "../api/integrations.service.js";
import { fetchCategories } from "../../biz-catalog/api/biz.service.js";

export default function MenuSync() {
  const [cons, setCons] = useState([]);
  const [cats, setCats] = useState([]);
  const [sel, setSel] = useState("");
  const [map, setMap] = useState({});
  const [saving, setSaving] = useState(false);

  async function load() {
    const [c1, c2] = await Promise.all([
      fetchPartners("b1"),
      fetchCategories("b1"),
    ]);
    setCons(c1.data);
    setCats(c2.data);
    if (c1.data[0]) {
      setSel(c1.data[0].id);
      const m = await fetchMenuMap(c1.data[0].id);
      setMap(m.data);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function choose(id) {
    setSel(id);
    const m = await fetchMenuMap(id);
    setMap(m.data || {});
  }

  async function save() {
    if (!sel) return;
    setSaving(true);
    await saveMenuMap(sel, map);
    setSaving(false);
  }

  const selectedPartner = useMemo(
    () => cons.find((c) => c.id === sel),
    [cons, sel]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Menu Sync</h1>
          <p className="text-sm text-muted">
            Choose categories to publish per partner.
          </p>
        </div>
        <ThemeSwitch />
      </div>

      <div className="card p-3 grid md:grid-cols-2 gap-3">
        <select
          className="input"
          value={sel}
          onChange={(e) => choose(e.target.value)}
        >
          {cons.map((c) => (
            <option key={c.id} value={c.id}>
              {partnerLabel(c.partner)} · {c.meta?.merchantId}
            </option>
          ))}
        </select>
        <div className="text-sm text-muted self-center">
          {selectedPartner
            ? `Last sync: ${new Date(
                selectedPartner.lastSync
              ).toLocaleString()}`
            : "—"}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="font-medium mb-2">Categories</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {cats.map((c) => (
              <label
                key={c.id}
                className="card p-3 flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="accent-[var(--primary)]"
                  checked={!!map[c.id]}
                  onChange={(e) =>
                    setMap((m) => ({ ...m, [c.id]: e.target.checked }))
                  }
                />
                <span>{c.name}</span>
              </label>
            ))}
            {cats.length === 0 && (
              <div className="text-sm text-muted">No categories.</div>
            )}
          </div>
          <div className="mt-4 text-right">
            <button className="btn" disabled={!sel || saving} onClick={save}>
              {saving ? "Syncing…" : "Sync now"}
            </button>
          </div>
        </div>

        <div className="card p-4">
          <div className="font-medium mb-2">Preview</div>
          <ul className="space-y-2 text-sm">
            {Object.entries(map)
              .filter(([, v]) => v)
              .map(([id]) => {
                const cat = cats.find((c) => c.id === id);
                return (
                  <li
                    key={id}
                    className="border rounded-lg p-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {cat?.name}
                  </li>
                );
              })}
            {Object.values(map).filter(Boolean).length === 0 && (
              <div className="text-sm text-muted">
                Pick categories to publish.
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
