import React, { useEffect, useState, useCallback } from "react";
import { fetchAreas, saveAreas } from "../api/biz.service.js";
import { useParams } from "react-router-dom";

export default function AreasTablesEditor() {
  const { id: locationId } = useParams(); // route: /biz/locations/:id/tables
  const [areas, setAreas] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetchAreas(locationId);
    setAreas(res.data);
  }, [locationId]);

  useEffect(() => {
    load();
  }, [load]);

  function addArea() {
    setAreas((a) => [
      ...a,
      {
        id: crypto.randomUUID?.() || String(Date.now()),
        title: "New Area",
        tables: [],
      },
    ]);
  }
  function addTable(ai) {
    setAreas((a) =>
      a.map((ar, idx) =>
        idx === ai
          ? {
              ...ar,
              tables: [
                ...ar.tables,
                {
                  id: crypto.randomUUID?.() || String(Date.now()),
                  name: `T${ar.tables.length + 1}`,
                  cap: 2,
                  x: 1,
                  y: 1,
                },
              ],
            }
          : ar
      )
    );
  }
  function removeTable(ai, tid) {
    setAreas((a) =>
      a.map((ar, idx) =>
        idx === ai
          ? { ...ar, tables: ar.tables.filter((t) => t.id !== tid) }
          : ar
      )
    );
  }
  function renameArea(ai, v) {
    setAreas((a) =>
      a.map((ar, idx) => (idx === ai ? { ...ar, title: v } : ar))
    );
  }
  function updateTable(ai, ti, patch) {
    setAreas((a) =>
      a.map((ar, idx) =>
        idx === ai
          ? {
              ...ar,
              tables: ar.tables.map((t, i) =>
                i === ti ? { ...t, ...patch } : t
              ),
            }
          : ar
      )
    );
  }

  async function save() {
    setSaving(true);
    await saveAreas(locationId, areas);
    setSaving(false);
  }

  if (!areas) return <div className="card p-6">Loading areas…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Areas & Tables</h1>
          <p className="text-sm text-muted">
            Up to five areas per location. Quick editor (name/capacity/coords).
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={addArea}>
            Add Area
          </button>
          <button className="btn" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {areas.map((ar, ai) => (
          <div key={ar.id} className="card p-4">
            <div className="flex items-center justify-between gap-2">
              <input
                className="input !h-9"
                value={ar.title}
                onChange={(e) => renameArea(ai, e.target.value)}
              />
              <button className="btn-ghost" onClick={() => addTable(ai)}>
                Add Table
              </button>
            </div>

            <div className="mt-3 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted">
                  <tr>
                    <th className="px-2 py-2">Name</th>
                    <th className="px-2 py-2">Cap</th>
                    <th className="px-2 py-2">X</th>
                    <th className="px-2 py-2">Y</th>
                    <th className="px-2 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ar.tables.map((t, ti) => (
                    <tr
                      key={t.id}
                      className="border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-2 py-2">
                        <input
                          className="input !h-8"
                          value={t.name}
                          onChange={(e) =>
                            updateTable(ai, ti, { name: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          className="input !h-8"
                          type="number"
                          min={1}
                          value={t.cap}
                          onChange={(e) =>
                            updateTable(ai, ti, { cap: Number(e.target.value) })
                          }
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          className="input !h-8"
                          type="number"
                          min={1}
                          value={t.x}
                          onChange={(e) =>
                            updateTable(ai, ti, { x: Number(e.target.value) })
                          }
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          className="input !h-8"
                          type="number"
                          min={1}
                          value={t.y}
                          onChange={(e) =>
                            updateTable(ai, ti, { y: Number(e.target.value) })
                          }
                        />
                      </td>
                      <td className="px-2 py-2 text-right">
                        <button
                          className="btn-ghost text-red-500"
                          onClick={() => removeTable(ai, t.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ar.tables.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-2 py-6 text-center text-muted"
                      >
                        No tables.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
