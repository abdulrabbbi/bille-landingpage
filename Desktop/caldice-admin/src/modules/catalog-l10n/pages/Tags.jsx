import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  listTags,
  createTag,
  updateTag,
  deleteTag,
} from "../api/catalog.service.js";
import DataTable from "../../../shared/components/DataTable.jsx";
import Pagination from "../../../shared/components/Pagination.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import useDebounce from "../../../shared/hooks/useDebounce.js";
import TagDrawer from "../components/TagDrawer.jsx";

export default function TagsList() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 350);

  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(
    async function () {
      setBusy(true);
      const res = await listTags();
      if (res?.ok) {
        const all = res.data.filter((t) =>
          dq
            ? t.code.toLowerCase().includes(dq) ||
              t.label.en.toLowerCase().includes(dq)
            : true
        );
        const total = all.length;
        const size = 12;
        const pages = Math.max(1, Math.ceil(total / size));
        const start = (page - 1) * size;
        setRows(all.slice(start, start + size));
        setMeta({ total, pages });
      }
      setBusy(false);
    },
    [dq, page]
  );
  useEffect(() => {
    setPage(1);
  }, [dq]);
  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(form) {
    const res = await createTag(form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onUpdate(form) {
    const res = await updateTag(editing.id, form);
    if (res?.ok) {
      setDrawerOpen(false);
      setEditing(null);
      load();
    }
  }
  async function onConfirmDelete() {
    if (!toDelete) return;
    const res = await deleteTag(toDelete.id);
    if (res?.ok) {
      setConfirmOpen(false);
      setToDelete(null);
      load();
    }
  }

  const columns = useMemo(
    () => [
      { header: "Kind", key: "kind" },
      { header: "Code", key: "code" },
      { header: "Label EN", render: (r) => r.label?.en || "—" },
      { header: "Label DE", render: (r) => r.label?.de || "—" },
      {
        header: "Actions",
        key: "a",
        render: (r) => (
          <div className="flex gap-2">
            <button
              className="btn-ghost"
              onClick={() => {
                setEditing(r);
                setDrawerOpen(true);
              }}
            >
              Edit
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setToDelete(r);
                setConfirmOpen(true);
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Catalog · Tags</h1>
          <div className="text-sm text-muted">
            Taxonomy for diet, meal type, difficulty, cost, time
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          Add Tag
        </button>
      </div>

      <div className="card p-3 flex flex-col gap-3">
        <div className="w-full sm:w-80">
          <SearchBar
            value={q}
            onChange={setQ}
            placeholder="Search code or label…"
          />
        </div>

        <DataTable
          loading={busy && rows.length === 0}
          columns={columns}
          rows={rows}
          empty="No tags found."
          footer={
            <div className="w-full flex items-center justify-between">
              <div className="text-xs">
                Total: {meta.total.toLocaleString()}
              </div>
              <Pagination page={page} pages={meta.pages} onPage={setPage} />
            </div>
          }
        />
      </div>

      <TagDrawer
        open={drawerOpen}
        initial={editing}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        onSubmit={editing ? onUpdate : onCreate}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete tag?"
        message={toDelete ? `This will remove tag "${toDelete.code}".` : ""}
        confirmLabel="Delete"
        onConfirm={onConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
      />
    </div>
  );
}
