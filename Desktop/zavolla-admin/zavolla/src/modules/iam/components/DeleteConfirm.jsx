import React from "react";

export default function DeleteConfirm({
  open,
  title = "Delete",
  message = "Are you sure?",
  onCancel,
  onConfirm,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="card max-w-sm w-full">
        <div className="text-lg font-semibold">{title}</div>
        <p className="text-sm text-muted mt-1">{message}</p>
        <div className="mt-4 flex gap-2 justify-end">
          <button className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn bg-red-500 text-white hover:opacity-90"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
