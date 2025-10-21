import React, { useEffect, useState, useCallback } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import DeleteConfirm from "../../iam/components/DeleteConfirm.jsx";
import {
  fetchTerminals,
  upsertTerminal,
  deleteTerminal,
  assignTerminal,
  pairTerminal,
  pingTerminal,
} from "../api/hardware.service.js";
import TerminalDrawer from "./components/TerminalDrawer.jsx";

const badge = (s) => {
  const m = {
    online:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
    paired:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
    offline: "bg-gray-200 text-gray-700 dark:bg-gray-600/40 dark:text-gray-100",
  };
  return m[s] || m.offline;
};

export default function TerminalsList() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    const res = await fetchTerminals({ q });
    setRows(res.data);
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(payload) {
    await upsertTerminal(payload);
    setOpen(false);
    setEdit(null);
    await load();
  }

  async function doAssign(t, loc) {
    await assignTerminal(t.id, loc || null);
    await load();
  }

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Terminals</h1>
          <p className="text-sm text-muted">
            BLE card readers (WisePad 3). Pair, assign and health-check.
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
            Add Terminal
          </button>
        </div>
      </div>

      {/* controls */}
      <div className="card p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
        <input
          className="input flex-1"
          placeholder="Search alias, serial, location…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-ghost" onClick={load}>
          Search
        </button>
      </div>

      {/* table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[880px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Alias</th>
                <th className="px-3 py-2">Model / Serial</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Battery</th>
                <th className="px-3 py-2">Firmware</th>
                <th className="px-3 py-2">Last seen</th>
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
                    No terminals.
                  </td>
                </tr>
              )}
              {rows &&
                rows.map((t) => (
                  <tr
                    key={t.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-3">{t.alias || "-"}</td>
                    <td className="px-3 py-3">
                      {t.model} · {t.serial}
                    </td>
                    <td className="px-3 py-3">
                      {t.locationId
                        ? t.locationId === "l1"
                          ? "Soho"
                          : "Shoreditch"
                        : "Unassigned"}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${badge(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">{t.battery ?? "-"}%</td>
                    <td className="px-3 py-3">{t.firmware}</td>
                    <td className="px-3 py-3">
                      {new Date(t.lastSeen).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => pairTerminal(t.id).then(load)}
                      >
                        Pair
                      </button>
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => pingTerminal(t.id).then(load)}
                      >
                        Ping
                      </button>
                      <AssignMenu t={t} onAssign={doAssign} />
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => {
                          setEdit(t);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-ghost text-red-500"
                        onClick={() => setToDelete(t)}
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

      <TerminalDrawer
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
        title="Delete terminal"
        message={`Remove ${toDelete?.alias || toDelete?.serial}?`}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          await deleteTerminal(toDelete.id);
          setToDelete(null);
          load();
        }}
      />
    </div>
  );
}

function AssignMenu({ t, onAssign }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button className="btn-ghost mr-1" onClick={() => setOpen((v) => !v)}>
        Assign
      </button>
      {open && (
        <div className="absolute right-0 mt-1 card p-2 w-44 z-10">
          <button
            className="btn-ghost w-full justify-start"
            onClick={() => {
              onAssign(t, "l1");
              setOpen(false);
            }}
          >
            Soho
          </button>
          <button
            className="btn-ghost w-full justify-start"
            onClick={() => {
              onAssign(t, "l2");
              setOpen(false);
            }}
          >
            Shoreditch
          </button>
          <button
            className="btn-ghost w-full justify-start"
            onClick={() => {
              onAssign(t, null);
              setOpen(false);
            }}
          >
            Unassign
          </button>
        </div>
      )}
    </span>
  );
}
