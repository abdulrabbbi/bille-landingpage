import React from "react";

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message = "",
  confirmLabel = "OK",
  onConfirm = () => {},
  onCancel = () => {},
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-card rounded-md shadow-lg w-full max-w-md p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="text-sm text-muted mb-4">{message}</div>
        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn bg-danger text-white"
            onClick={() => {
              onConfirm();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
