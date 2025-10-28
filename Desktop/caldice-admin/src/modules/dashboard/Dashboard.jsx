import React, { useEffect, useState } from "react";
import { getDashboardKpis, getActivityFeed } from "./api/analytics.service.js";
import KpiCard from "./components/KpiCard.jsx";
import ActivityList from "./components/ActivityList.jsx";
import { PATHS } from "../../routes/paths";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [busy, setBusy] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [feed, setFeed] = useState([]);

  async function load() {
    setBusy(true);
    const [a, b] = await Promise.all([getDashboardKpis(), getActivityFeed()]);
    if (a?.ok) setKpis(a.data);
    if (b?.ok) setFeed(b.data);
    setBusy(false);
  }
  useEffect(() => {
    load();
  }, []);

  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState({ type: null, open: false });
  const [orderForm, setOrderForm] = useState({ customer: "", amount: "" });
  const [itemForm, setItemForm] = useState({ name: "", price: "" });

  function note(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

  async function handleSyncMenus() {
    note("Sync started...");
    // mock delay
    await new Promise((r) => setTimeout(r, 900));
    note("Menus synced — 14 items updated");
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="text-sm text-muted">Today at a glance</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {busy &&
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-3 w-24 bg-muted/30 rounded mb-3" />
                <div className="h-7 w-28 bg-muted/30 rounded mb-4" />
                <div className="h-10 w-full bg-muted/20 rounded" />
              </div>
            ))}
          {!busy && kpis && (
            <>
              <KpiCard
                title={kpis.revenue.label}
                value={kpis.revenue.value}
                delta={kpis.revenue.delta}
                series={kpis.revenue.series}
                format={(v) => "$" + v.toLocaleString()}
              />
              <KpiCard
                title={kpis.orders.label}
                value={kpis.orders.value}
                delta={kpis.orders.delta}
                series={kpis.orders.series}
              />
              <KpiCard
                title={kpis.aov.label}
                value={kpis.aov.value}
                delta={kpis.aov.delta}
                series={kpis.aov.series}
                format={(v) => "$" + v.toFixed(2)}
              />
              <KpiCard
                title={kpis.refunds.label}
                value={kpis.refunds.value}
                delta={kpis.refunds.delta}
                series={kpis.refunds.series}
              />
            </>
          )}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2 card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Activity</div>
              <button className="btn-ghost text-sm" onClick={load}>
                Refresh
              </button>
            </div>
            <ActivityList items={feed} />
          </div>

          <div className="card p-4">
            <div className="font-medium mb-3">Quick Actions</div>
            <div className="grid gap-2">
              <button
                className="btn w-full justify-center"
                onClick={() => setModal({ type: "new-order", open: true })}
              >
                New Order
              </button>
              <button
                className="btn-ghost w-full justify-center"
                onClick={() => setModal({ type: "add-item", open: true })}
              >
                Add Item
              </button>
              <button
                className="btn-ghost w-full justify-center"
                onClick={() => navigate(PATHS.PEOPLE.USERS)}
              >
                Invite User
              </button>
              <button
                className="btn-ghost w-full justify-center"
                onClick={handleSyncMenus}
              >
                Sync Menus
              </button>
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed right-4 top-24 z-40 bg-primary text-white text-sm px-3 py-1.5 rounded-lg shadow">
          {toast}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModal({ type: null, open: false })}
          />
          <div className="card p-6 relative w-full max-w-md z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {modal.type === "new-order" ? "Create New Order" : "Add Item"}
              </h3>
              <button
                className="btn-ghost"
                onClick={() => setModal({ type: null, open: false })}
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {modal.type === "new-order" ? (
                <>
                  <input
                    className="input"
                    placeholder="Customer name"
                    value={orderForm.customer}
                    onChange={(e) =>
                      setOrderForm((p) => ({ ...p, customer: e.target.value }))
                    }
                  />
                  <input
                    className="input"
                    placeholder="Amount"
                    value={orderForm.amount}
                    onChange={(e) =>
                      setOrderForm((p) => ({ ...p, amount: e.target.value }))
                    }
                  />
                  <div className="flex justify-end">
                    <button
                      className="btn"
                      onClick={() => {
                        const id = `order-${Date.now()}`;
                        const title = `New order #${id.slice(-5)}`;
                        const meta = `$${parseFloat(
                          orderForm.amount || 0
                        ).toFixed(2)} • ${orderForm.customer || "—"}`;
                        const newItem = {
                          id,
                          type: "order",
                          title,
                          meta,
                          ts: Date.now(),
                        };
                        setFeed((prev) => [newItem, ...prev]);
                        setOrderForm({ customer: "", amount: "" });
                        setModal({ type: null, open: false });
                        note("Order created");
                      }}
                    >
                      Create
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    className="input"
                    placeholder="Item name"
                    value={itemForm.name}
                    onChange={(e) =>
                      setItemForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <input
                    className="input"
                    placeholder="Price"
                    value={itemForm.price}
                    onChange={(e) =>
                      setItemForm((p) => ({ ...p, price: e.target.value }))
                    }
                  />
                  <div className="flex justify-end">
                    <button
                      className="btn"
                      onClick={() => {
                        const id = `item-${Date.now()}`;
                        const title = `Item added: ${
                          itemForm.name || id.slice(-5)
                        }`;
                        const meta = `$${parseFloat(
                          itemForm.price || 0
                        ).toFixed(2)}`;
                        const newItem = {
                          id,
                          type: "item",
                          title,
                          meta,
                          ts: Date.now(),
                        };
                        setFeed((prev) => [newItem, ...prev]);
                        setItemForm({ name: "", price: "" });
                        setModal({ type: null, open: false });
                        note("Item added");
                      }}
                    >
                      Add
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
