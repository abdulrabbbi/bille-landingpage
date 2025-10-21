import React, { useEffect, useState } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import SkeletonRow from "../../iam/components/SkeletonRow.jsx";
import DeleteConfirm from "../../iam/components/DeleteConfirm.jsx";
import {
  fetchBusinesses,
  fetchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../api/biz.service.js";
import LocationDrawer from "./components/LocationDrawer.jsx";
import { Link } from "react-router-dom";

export default function LocationsList() {
  const [biz, setBiz] = useState(null);
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [q, setQ] = useState("");
  const bizId = "b1"; // active business (wire to your context later)

  async function load() {
    const b = await fetchBusinesses();
    setBiz(b.data?.find((x) => x.id === bizId));
    const res = await fetchLocations(bizId);
    setRows(res.data);
  }
  useEffect(() => {
    load();
  }, []);

  const filtered = (rows || []).filter((l) =>
    (l.name + (l.timezone || "")).toLowerCase().includes(q.toLowerCase())
  );

  async function save(payload) {
    if (edit) await updateLocation(edit.id, payload);
    else await createLocation({ businessId: bizId, ...payload });
    setOpen(false);
    setEdit(null);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Locations</h1>
          <p className="text-sm text-muted">
            Per-store configuration for <b>{biz?.name || "…"}</b>.
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
            New Location
          </button>
        </div>
      </div>

      <div className="card p-3 flex flex-col sm:flex-row gap-2">
        <input
          className="input flex-1"
          placeholder="Search location…"
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
                <th className="px-3 py-2">Timezone</th>
                <th className="px-3 py-2">Currency</th>
                <th className="px-3 py-2">Delivery</th>
                <th className="px-3 py-2">Printers</th>
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
                    No locations.
                  </td>
                </tr>
              )}
              {rows &&
                filtered.map((l) => (
                  <tr
                    key={l.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-3">{l.name}</td>
                    <td className="px-3 py-3">{l.timezone}</td>
                    <td className="px-3 py-3">{l.currency}</td>
                    <td className="px-3 py-3">
                      {l.delivery?.join(", ") || "-"}
                    </td>
                    <td className="px-3 py-3">
                      {l.printers?.join(", ") || "-"}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        className="btn-ghost mr-1"
                        to={`/biz/locations/${l.id}/tables`}
                      >
                        Areas & Tables
                      </Link>
                      <button
                        className="btn-ghost mr-1"
                        onClick={() => {
                          setEdit(l);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-ghost text-red-500"
                        onClick={() => setToDelete(l)}
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

      <LocationDrawer
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
        title="Delete location"
        message={`Remove ${toDelete?.name}?`}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          await deleteLocation(toDelete.id);
          setToDelete(null);
          load();
        }}
      />
    </div>
  );
}
