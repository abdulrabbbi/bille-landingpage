import React from "react";

export default function Drawer({
  open,
  onClose,
  title = "",
  children,
  width = "w-96",
  footer = null,
}) {
  if (!open) return null;

  const isNumberWidth = typeof width === "number";
  const asideStyle = isNumberWidth ? { width: `${width}px` } : undefined;
  const asideClass = isNumberWidth ? "" : width;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        style={asideStyle}
        className={`relative bg-card border-l border-(--line)] h-full p-4 ${asideClass} ml-auto flex flex-col`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="btn-ghost" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="overflow-auto flex-1">{children}</div>
        {footer && (
          <div className="mt-4 border-t border-(--line)] pt-3">{footer}</div>
        )}
      </aside>
    </div>
  );
}
