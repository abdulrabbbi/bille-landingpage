import React from "react";
export default function RoleBadge({ role }) {
  const map = {
    "Super Admin":
      "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200",
    "Business Admin":
      "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",
    "Team Member":
      "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${
        map[role] ||
        "bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-200"
      }`}
    >
      {role}
    </span>
  );
}
