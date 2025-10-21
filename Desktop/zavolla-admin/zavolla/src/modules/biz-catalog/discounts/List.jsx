import React, { useEffect, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import DeleteConfirm from "../../iam/components/DeleteConfirm.jsx";
import {
  fetchDiscounts,
  upsertDiscount,
  deleteDiscount,
} from "../api/biz.service.js";
import DiscountDrawer from "./components/DiscountDrawer.jsx";

const bizId = "b1";

export default function DiscountsList() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);

  async function load() {
    const res = await fetchDiscounts(bizId);
    setRows(res.data);
  }
  useEffect(() => {
    load();
  }, []);

  async function save(payload) {
    await upsertDiscount({ businessId: bizId, ...payload });
    setOpen(false);
    setEdit(null);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Discounts</h1>
          <p className="text-sm text-muted">Percentage promos supported.</p>
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
            New Discount
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Value</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!rows && (
              <>
                <SkeletonRow cols={5} />
                <SkeletonRow cols={5} />
              </>
            )}
            {rows &&
              rows.map((d) => (
                <tr
                  key={d.id}
                  className="border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-3 py-3">{d.title}</td>
                  <td className="px-3 py-3">{d.type}</td>
                  <td className="px-3 py-3">
                    {d.value}
                    {d.type === "percent" ? "%" : ""}
                  </td>
                  <td className="px-3 py-3">{d.active ? "Yes" : "No"}</td>
                  <td className="px-3 py-3 text-right">
                    <button
                      className="btn-ghost mr-1"
                      onClick={() => {
                        setEdit(d);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <DeleteInline id={d.id} onDone={load} />
                  </td>
                </tr>
              ))}
            {rows && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-muted">
                  No discounts.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DiscountDrawer
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

function DeleteInline({ id, onDone }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn-ghost text-red-500" onClick={() => setOpen(true)}>
        Delete
      </button>
      <DeleteConfirm
        open={open}
        title="Delete discount"
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          await deleteDiscount(id);
          setOpen(false);
          onDone();
        }}
      />
    </>
  );
}
