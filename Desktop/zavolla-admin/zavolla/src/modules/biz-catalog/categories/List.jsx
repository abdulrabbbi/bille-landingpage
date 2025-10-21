import React, { useEffect, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import DeleteConfirm from "../../iam/components/DeleteConfirm.jsx";
import {
  fetchCategories,
  upsertCategory,
  deleteCategory,
} from "../api/biz.service.js";
import CategoryDrawer from "./components/CategoryDrawer.jsx";

const bizId = "b1";

export default function CategoriesList() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);

  async function load() {
    const res = await fetchCategories(bizId);
    setRows(res.data.sort((a, b) => a.sort - b.sort));
  }
  useEffect(() => {
    load();
  }, []);

  async function save(payload) {
    await upsertCategory({ businessId: bizId, ...payload });
    setOpen(false);
    setEdit(null);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <p className="text-sm text-muted">
            Organise items into groups for menus.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <ThemeSwitch />
          <button
            className="btn"
            onClick={() => {
              setEdit(null);
              setOpen(true);
            }}
          >
            New Category
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Sort</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows && (
                <>
                  <SkeletonRow cols={3} />
                  <SkeletonRow cols={3} />
                </>
              )}
              {rows &&
                rows.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-3">{c.name}</td>
                    <td className="px-3 py-3">{c.sort}</td>
                    <td className="px-3 py-3 text-right">
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => {
                          setEdit(c);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <DeleteConfirmTrigger id={c.id} onDone={load} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryDrawer
        open={open}
        initial={edit}
        onClose={() => {
          setOpen(false);
          setEdit(null);
        }}
        onSubmit={save}
      />
    </div>
  );
}

function DeleteConfirmTrigger({ id, onDone }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn-ghost text-red-500" onClick={() => setOpen(true)}>
        Delete
      </button>
      <DeleteConfirm
        open={open}
        title="Delete category"
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          await deleteCategory(id);
          setOpen(false);
          onDone();
        }}
      />
    </>
  );
}
