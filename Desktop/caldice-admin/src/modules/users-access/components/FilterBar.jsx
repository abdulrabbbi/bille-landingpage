import React from "react";

export default function FilterBar({
  role,
  status,
  subscription,
  onChange,
  onClear,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="input w-40"
        value={role || ""}
        onChange={(e) => onChange({ role: e.target.value || undefined })}
      >
        <option value="">All roles</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="user">User</option>
      </select>

      <select
        className="input w-40"
        value={status || ""}
        onChange={(e) => onChange({ status: e.target.value || undefined })}
      >
        <option value="">All status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>

      <select
        className="input w-40"
        value={subscription || ""}
        onChange={(e) =>
          onChange({ subscription: e.target.value || undefined })
        }
      >
        <option value="">All plans</option>
        <option value="free">Free</option>
        <option value="premium">Premium</option>
      </select>

      <button className="btn-ghost" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
