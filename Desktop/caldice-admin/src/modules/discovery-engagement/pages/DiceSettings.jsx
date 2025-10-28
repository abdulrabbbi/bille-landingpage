import React, { useEffect, useState } from "react";
import { getDiceSettings, saveDiceSettings } from "../api/discovery.service.js";

export default function DiceSettings() {
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [s, setS] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setBusy(true);
      const res = await getDiceSettings();
      if (active && res?.ok) setS(res.data);
      setBusy(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  async function onSave() {
    setSaving(true);
    const res = await saveDiceSettings(s);
    setSaving(false);
    if (res?.ok) {
      /* optional toast */
    }
  }

  if (busy || !s) {
    return (
      <div className="card p-5 space-y-3">
        <div className="skel h-4 w-40" />
        <div className="skel h-10 w-full" />
        <div className="skel h-10 w-3/4" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Engagement · Dice Game</h1>
          <div className="text-sm text-muted">
            Control animations, fairness, and win chance
          </div>
        </div>
        <button className="btn" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="card p-4 grid gap-4 sm:grid-cols-2">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-(--primary)]"
            checked={!!s.enabled}
            onChange={(e) =>
              setS((prev) => ({ ...prev, enabled: e.target.checked }))
            }
          />
          <span className="text-sm">Enabled</span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-(--primary)]"
            checked={!!s.vibration}
            onChange={(e) =>
              setS((prev) => ({ ...prev, vibration: e.target.checked }))
            }
          />
          <span className="text-sm">Haptics/Vibration</span>
        </label>

        <label className="block">
          <span className="text-sm text-muted">Fairness</span>
          <select
            className="input mt-1"
            value={s.fairness}
            onChange={(e) =>
              setS((prev) => ({ ...prev, fairness: e.target.value }))
            }
          >
            <option value="random">Random</option>
            <option value="weighted">Weighted</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-muted">Winning Chance (%)</span>
          <input
            className="input mt-1"
            type="number"
            min={0}
            max={100}
            value={s.winningChance}
            onChange={(e) =>
              setS((prev) => ({
                ...prev,
                winningChance: Number(e.target.value || 0),
              }))
            }
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-(--primary)]"
            checked={!!s.confetti}
            onChange={(e) =>
              setS((prev) => ({ ...prev, confetti: e.target.checked }))
            }
          />
          <span className="text-sm">Confetti on Win</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button className="btn" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
