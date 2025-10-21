import React, { useEffect, useMemo, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import DeleteConfirm from "../../iam/components/DeleteConfirm.jsx";
import {
  fetchItems,
  fetchLocations,
  upsertItem,
  deleteItem,
  toggleAvailability,
  fetchCategories,
} from "../api/biz.service.js";
import ItemDrawer from "./components/ItemDrawer.jsx";

const bizId = "b1";

export default function ItemsList() {
  const [rows, setRows] = useState(null);
  const [locs, setLocs] = useState([]);
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState("");

  async function load() {
    const [i, locations, categories] = await Promise.all([
      fetchItems(bizId),
      fetchLocations("b1"),
      fetchCategories(bizId),
    ]);
    setRows(i.data);
    setLocs(locations.data);
    setCats(categories.data);
  }
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!rows) return null;
    if (!k) return rows;
    return rows.filter((r) => (r.name + r.sku).toLowerCase().includes(k));
  }, [rows, q]);

  async function save(payload) {
    await upsertItem({ businessId: bizId, ...payload });
    setOpen(false);
    setEdit(null);
    await load();
  }

  if (!rows)
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Items</h1>
          <ThemeSwitch />
        </div>
        <div className="card p-0">
          <table className="w-full text-sm">
            <tbody>
              <SkeletonRow cols={6} />
              <SkeletonRow cols={6} />
            </tbody>
          </table>
        </div>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Items</h1>
          <p className="text-sm text-muted">
            Manage prices, categories and availability per location.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <button
            className="btn"
            onClick={() => {
              setEdit(null);
              setOpen(true);
            }}
          >
            New Item
          </button>
        </div>
      </div>

      <div className="card p-3 flex flex-col sm:flex-row gap-2">
        <input
          className="input flex-1"
          placeholder="Search name or SKU…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="card p-0 overflow-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="text-left text-muted">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              {locs.map((l) => (
                <th key={l.id} className="px-3 py-2">
                  Avail: {l.name}
                </th>
              ))}
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.length === 0 && (
              <tr>
                <td
                  colSpan={5 + locs.length}
                  className="px-3 py-10 text-center text-muted"
                >
                  No items.
                </td>
              </tr>
            )}
            {filtered?.map((it) => (
              <tr
                key={it.id}
                className="border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-3 py-3">{it.name}</td>
                <td className="px-3 py-3">{it.sku}</td>
                <td className="px-3 py-3">
                  {cats.find((c) => c.id === it.categoryId)?.name || "-"}
                </td>
                <td className="px-3 py-3">£{it.price.toFixed(2)}</td>
                {locs.map((l) => {
                  const on = !!it.availability?.[l.id];
                  return (
                    <td key={l.id} className="px-3 py-3">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="accent-[var(--primary)]"
                          checked={on}
                          onChange={async (e) => {
                            await toggleAvailability(
                              it.id,
                              l.id,
                              e.target.checked
                            );
                            await load();
                          }}
                        />
                        <span className="text-xs">{on ? "On" : "86"}</span>
                      </label>
                    </td>
                  );
                })}
                <td className="px-3 py-3 text-right">
                  <button
                    className="btn-ghost mr-1"
                    onClick={() => {
                      setEdit(it);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <DeleteInline id={it.id} onDone={load} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ItemDrawer
        open={open}
        initial={edit}
        categories={cats}
        onClose={() => {
          setOpen(false);
          setEdit(null);
        }}
        onSubmit={save}
      />
    </div>
  );
}

function DeleteInline({ id, onDone }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn-ghost text-red-500" onClick={() => setOpen(true)}>
        Delete
      </button>
      <DeleteConfirm
        open={open}
        title="Delete item"
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          await deleteItem(id);
          setOpen(false);
          onDone();
        }}
      />
    </>
  );
}
