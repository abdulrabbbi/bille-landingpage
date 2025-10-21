import React, { useEffect, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import { fetchAreas } from "../../biz-catalog/api/biz.service.js";
import { fetchOrders, upsertOrder } from "../api/sales.service.js";

export default function TablesBoard() {
  const locationId = "l1"; // wire via context/select later
  const [areas, setAreas] = useState(null);
  const [openOrders, setOpenOrders] = useState([]);

  async function load() {
    const a = await fetchAreas(locationId);
    setAreas(a.data);
    const o = await fetchOrders({ status: "open" });
    setOpenOrders(o.data);
  }
  useEffect(() => {
    load();
  }, []);

  async function newForTable(t) {
    await upsertOrder({ locationId, tableId: t.id, items: [], note: "" });
    await load();
  }

  if (!areas) return <div className="card p-6">Loading tables…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Table Board</h1>
          <p className="text-sm text-muted">
            Quick view of areas and table occupancy.
          </p>
        </div>
        <ThemeSwitch />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {areas.map((ar) => (
          <div key={ar.id} className="card p-4">
            <div className="font-medium mb-3">{ar.title}</div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {ar.tables.map((t) => {
                const occupied = openOrders.some((o) => o.tableId === t.id);
                const label = occupied ? "Occupied" : "Free";
                return (
                  <button
                    key={t.id}
                    className={`rounded-xl border p-3 text-center text-sm ${
                      occupied
                        ? "bg-amber-100 dark:bg-amber-500/20 border-amber-300"
                        : "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300"
                    }`}
                    title={`${t.name} (${t.cap})`}
                    onClick={() => !occupied && newForTable(t)}
                  >
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs">{label}</div>
                  </button>
                );
              })}
              {ar.tables.length === 0 && (
                <div className="text-muted">No tables</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
