import React, { useEffect, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import DeleteConfirm from "../../iam/components/DeleteConfirm.jsx";
import {
  fetchBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "../api/biz.service.js";
import BusinessDrawer from "./components/BusinessDrawer.jsx";

export default function BusinessesList() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [q, setQ] = useState("");

  async function load() {
    const res = await fetchBusinesses();
    setRows(res.data);
  }
  useEffect(() => {
    load();
  }, []);

  const filtered = (rows || []).filter((b) =>
    (b.name + String(b.currency) + String(b.timezone))
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  async function save(payload) {
    if (edit) await updateBusiness(edit.id, payload);
    else await createBusiness(payload);
    setOpen(false);
    setEdit(null);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Businesses</h1>
          <p className="text-sm text-muted">
            Multi-business control for Super Admins.
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
            New Business
          </button>
        </div>
      </div>

      <div className="card p-3 flex flex-col sm:flex-row gap-2">
        <input
          className="input flex-1"
          placeholder="Search business…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Currency</th>
                <th className="px-3 py-2">Timezone</th>
                <th className="px-3 py-2">Tax</th>
                <th className="px-3 py-2">Receipt Footer</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows && (
                <>
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                </>
              )}
              {rows && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-muted">
                    No businesses.
                  </td>
                </tr>
              )}
              {rows &&
                filtered.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-3">{b.name}</td>
                    <td className="px-3 py-3">{b.currency}</td>
                    <td className="px-3 py-3">{b.timezone}</td>
                    <td className="px-3 py-3">{b.taxRate ?? "-"}%</td>
                    <td className="px-3 py-3 truncate max-w-[280px]">
                      {b.receiptFooter || "-"}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => {
                          setEdit(b);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-ghost text-red-500"
                        onClick={() => setToDelete(b)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <BusinessDrawer
        open={open}
        initial={edit}
        onClose={() => {
          setOpen(false);
          setEdit(null);
        }}
        onSubmit={save}
      />
      <DeleteConfirm
        open={!!toDelete}
        title="Delete business"
        message={`Remove ${toDelete?.name}?`}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          await deleteBusiness(toDelete.id);
          setToDelete(null);
          load();
        }}
      />
    </div>
  );
}
