import React, { useEffect, useState, useCallback } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import DeleteConfirm from "../../iam/components/DeleteConfirm.jsx";
import {
  fetchPrinters,
  upsertPrinter,
  deletePrinter,
  printTestReceipt,
} from "../api/hardware.service.js";
import PrinterDrawer from "./components/PrinterDrawer.jsx";

export default function PrintersList() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    const res = await fetchPrinters({ q });
    setRows(res.data);
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(payload) {
    await upsertPrinter(payload);
    setOpen(false);
    setEdit(null);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Printers</h1>
          <p className="text-sm text-muted">
            Kitchen & receipt printers (LAN / BLE / USB).
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
            Add Printer
          </button>
        </div>
      </div>

      <div className="card p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
        <input
          className="input flex-1"
          placeholder="Search name, address, location…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-ghost" onClick={load}>
          Search
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Interface</th>
                <th className="px-3 py-2">Address</th>
                <th className="px-3 py-2">Paper</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows && (
                <>
                  <SkeletonRow cols={8} />
                  <SkeletonRow cols={8} />
                </>
              )}
              {rows && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-muted">
                    No printers.
                  </td>
                </tr>
              )}
              {rows &&
                rows.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-3">{p.name}</td>
                    <td className="px-3 py-3 capitalize">{p.type}</td>
                    <td className="px-3 py-3 uppercase">{p.iface}</td>
                    <td className="px-3 py-3 font-mono text-xs">{p.address}</td>
                    <td className="px-3 py-3">{p.width}mm</td>
                    <td className="px-3 py-3">
                      {p.locationId
                        ? p.locationId === "l1"
                          ? "Soho"
                          : "Shoreditch"
                        : "Unassigned"}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          p.status === "online"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
                            : "bg-gray-200 text-gray-700 dark:bg-gray-600/40 dark:text-gray-100"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => printTestReceipt(p.id)}
                      >
                        Print test
                      </button>
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => {
                          setEdit(p);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-ghost text-red-500"
                        onClick={() => setToDelete(p)}
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

      <PrinterDrawer
        open={open}
        initial={edit}
        onClose={() => {
          setEdit(null);
          setOpen(false);
        }}
        onSubmit={save}
      />
      <DeleteConfirm
        open={!!toDelete}
        title="Delete printer"
        message={`Remove ${toDelete?.name}?`}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          await deletePrinter(toDelete.id);
          setToDelete(null);
          load();
        }}
      />
    </div>
  );
}
