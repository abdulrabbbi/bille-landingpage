import React from "react";

export default function Pagination({ page = 1, pages = 1, onPage = () => {} }) {
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(pages, page + 1));

  return (
    <div className="flex items-center gap-2">
      <button className="btn-ghost px-2" onClick={prev} disabled={page <= 1}>
        Prev
      </button>
      <div className="text-sm text-muted">
        Page {page} / {pages}
      </div>
      <button
        className="btn-ghost px-2"
        onClick={next}
        disabled={page >= pages}
      >
        Next
      </button>
    </div>
  );
}
