import React from "react";
import RoleBadge from "../../components/RoleBadge.jsx";

export default function UsersTable({ rows, onEdit, onDelete }) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-muted">
          <tr>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Role</th>
            <th className="px-3 py-2">Locations</th>
            <th className="px-3 py-2">MFA</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr
              key={u.id}
              className="border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <td className="px-3 py-3">{u.name}</td>
              <td className="px-3 py-3">{u.email}</td>
              <td className="px-3 py-3">
                <RoleBadge role={u.role} />
              </td>
              <td className="px-3 py-3">
                {u.locations?.[0] === "*"
                  ? "All"
                  : u.locations?.join(", ") || "-"}
              </td>
              <td className="px-3 py-3">{u.mfa ? "On" : "Off"}</td>
              <td className="px-3 py-3 text-right">
                <button className="btn-ghost mr-1" onClick={() => onEdit(u)}>
                  Edit
                </button>
                <button
                  className="btn-ghost text-red-500"
                  onClick={() => onDelete(u)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-6 text-center text-muted">
                No users match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
