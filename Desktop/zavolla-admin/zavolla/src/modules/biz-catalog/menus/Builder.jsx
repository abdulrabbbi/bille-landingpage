import React, { useEffect, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import {
  fetchCategories,
  fetchMenus,
  saveMenu,
  deleteMenu,
} from "../api/biz.service.js";
import DeleteConfirm from "../../iam/components/DeleteConfirm.jsx";

const bizId = "b1";

export default function MenusBuilder() {
  const [cats, setCats] = useState([]);
  const [menus, setMenus] = useState([]);
  const [title, setTitle] = useState("New Menu");
  const [selected, setSelected] = useState({});
  const [saving, setSaving] = useState(false);

  async function load() {
    const [c, m] = await Promise.all([
      fetchCategories(bizId),
      fetchMenus(bizId),
    ]);
    setCats(c.data);
    setMenus(m.data);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    setSaving(true);
    const categories = Object.entries(selected)
      .filter(([_, v]) => v)
      .map(([k]) => k);
    await saveMenu({ businessId: bizId, title, categories, dayparts: [] });
    setSaving(false);
    setSelected({});
    setTitle("New Menu");
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Menus</h1>
          <p className="text-sm text-muted">
            Pick categories to compose a menu.
          </p>
        </div>
        <ThemeSwitch />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="font-medium mb-2">Create / Update</div>
          <label className="block mb-3">
            <div className="text-sm text-muted">Title</div>
            <input
              className="input mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-2">
            {cats.map((c) => (
              <label
                key={c.id}
                className="card p-3 flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="accent-[var(--primary)]"
                  checked={!!selected[c.id]}
                  onChange={(e) =>
                    setSelected((s) => ({ ...s, [c.id]: e.target.checked }))
                  }
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 text-right">
            <button className="btn" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save menu"}
            </button>
          </div>
        </div>

        <div className="card p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Categories</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((m) => (
                <tr
                  key={m.id}
                  className="border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-3 py-3">{m.title}</td>
                  <td className="px-3 py-3">
                    {m.categories
                      .map((cid) => cats.find((c) => c.id === cid)?.name || cid)
                      .join(", ")}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <DeleteInline id={m.id} />
                  </td>
                </tr>
              ))}
              {menus.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-10 text-center text-muted">
                    No menus.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DeleteInline({ id }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn-ghost text-red-500" onClick={() => setOpen(true)}>
        Delete
      </button>
      <DeleteConfirm
        open={open}
        title="Delete menu"
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          await deleteMenu(id);
          setOpen(false);
          location.reload();
        }}
      />
    </>
  );
}
