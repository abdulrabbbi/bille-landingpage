import React, { useCallback, useEffect, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import DeleteConfirm from "../../iam/components/DeleteConfirm.jsx";
import {
  fetchPartners,
  upsertPartner,
  deletePartner,
  testPartner,
  pausePartner,
  toggleAutoPrint,
  partnerLabel,
  partners,
} from "../api/integrations.service.js";
import PartnerDrawer from "./components/PartnerDrawer.jsx";

export default function PartnersList() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    const res = await fetchPartners("b1", { q });
    setRows(res.data);
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(payload) {
    await upsertPartner(payload);
    setOpen(false);
    setEdit(null);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Integrations</h1>
          <p className="text-sm text-muted">
            Connect delivery partners, map menus, and control auto-print.
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
            Add Integration
          </button>
        </div>
      </div>

      <div className="card p-3 flex flex-col sm:flex-row gap-2">
        <input
          className="input flex-1"
          placeholder="Search partner, merchant, location…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-ghost" onClick={load}>
          Search
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Partner</th>
                <th className="px-3 py-2">Merchant / Meta</th>
                <th className="px-3 py-2">Locations</th>
                <th className="px-3 py-2">Auto-print</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Last sync</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows && (
                <>
                  <SkeletonRow cols={7} />
                  <SkeletonRow cols={7} />
                </>
              )}
              {rows && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-muted">
                    No integrations
                  </td>
                </tr>
              )}
              {rows &&
                rows.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-3 font-medium">
                      {partnerLabel(c.partner)}
                    </td>
                    <td className="px-3 py-3">{c.meta?.merchantId || "-"}</td>
                    <td className="px-3 py-3">
                      {c.locations?.length ? c.locations.join(", ") : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="accent-[var(--primary)]"
                          checked={!!c.autoPrint}
                          onChange={(e) =>
                            toggleAutoPrint(c.id, e.target.checked)
                          }
                        />
                        <span className="text-xs">
                          {c.autoPrint ? "On" : "Off"}
                        </span>
                      </label>
                    </td>
                    <td className="px-3 py-3 capitalize">{c.status}</td>
                    <td className="px-3 py-3">
                      {new Date(c.lastSync).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => testPartner(c.id).then(load)}
                      >
                        Test
                      </button>
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => {
                          setEdit(c);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-ghost mr-1"
                        onClick={() =>
                          pausePartner(c.id, c.status !== "paused").then(load)
                        }
                      >
                        {c.status === "paused" ? "Resume" : "Pause"}
                      </button>
                      <button
                        className="btn-ghost text-red-500"
                        onClick={() => setToDelete(c)}
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

      <PartnerDrawer
        open={open}
        initial={edit}
        partners={partners()}
        onClose={() => {
          setOpen(false);
          setEdit(null);
        }}
        onSubmit={save}
      />
      <DeleteConfirm
        open={!!toDelete}
        title="Remove integration"
        message={`Disconnect ${partnerLabel(toDelete?.partner)}?`}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          await deletePartner(toDelete.id);
          setToDelete(null);
          load();
        }}
      />
    </div>
  );
}
