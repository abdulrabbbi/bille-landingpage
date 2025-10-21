import React, { useEffect, useState } from "react";
import { fetchInvites, sendInvite, revokeInvite } from "../api/iam.service.js";
import SkeletonRow from "../components/SkeletonRow.jsx";

export default function InvitesList() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Team Member");
  const [loc, setLoc] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetchInvites();
    setRows(res.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    await sendInvite({ email, role, locations: loc ? [loc] : [] });
    setEmail("");
    setLoc("");
    setRole("Team Member");
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Invitations</h1>
          <p className="text-sm text-muted">Send and manage pending invites.</p>
        </div>
        <form className="card p-3 flex gap-2 items-end" onSubmit={submit}>
          <label className="block">
            <div className="text-xs text-muted">Email</div>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="person@company.com"
            />
          </label>
          <label className="block">
            <div className="text-xs text-muted">Role</div>
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Team Member</option>
              <option>Business Admin</option>
              <option>Super Admin</option>
            </select>
          </label>
          <label className="block">
            <div className="text-xs text-muted">Location (optional)</div>
            <input
              className="input"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="Soho"
            />
          </label>
          <button className="btn">Send</button>
        </form>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Locations</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Sent</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <>
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                </>
              )}
              {!loading && rows?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-muted">
                    No invites.
                  </td>
                </tr>
              )}
              {!loading &&
                rows?.map((i) => (
                  <tr
                    key={i.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-3">{i.email}</td>
                    <td className="px-3 py-3">{i.role}</td>
                    <td className="px-3 py-3">
                      {i.locations?.length ? i.locations.join(", ") : "-"}
                    </td>
                    <td className="px-3 py-3">{i.status}</td>
                    <td className="px-3 py-3">
                      {new Date(i.sentAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        className="btn-ghost text-red-500"
                        onClick={() => revokeInvite(i.id).then(load)}
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
