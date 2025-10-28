import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdMail, MdLock } from "react-icons/md";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }
    setBusy(true);
    // Fake auth delay
    await new Promise((r) => setTimeout(r, 700));

    // Very small mock auth: accept any email/password
    try {
      const token = `mock-${Math.random().toString(36).slice(2, 9)}`;
      if (remember) localStorage.setItem("auth.token", token);
      sessionStorage.setItem("auth.token", token);
      nav("/dashboard");
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center mb-3">
              <img
                src="/logo.png"
                alt="Caldice"
                className="h-16 w-16 rounded-lg object-contain shadow-lg"
              />
            </div>
            <h2 className="text-xl font-bold">Welcome back</h2>
            <div className="text-sm text-muted">
              Sign in to continue to Caldice
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && <div className="text-sm text-rose-400">{error}</div>}

            <label className="block">
              <div className="flex items-center text-sm text-muted mb-1">
                <MdMail className="mr-2" /> Email
              </div>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <div className="flex items-center text-sm text-muted mb-1">
                <MdLock className="mr-2" /> Password
              </div>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your secure password"
                autoComplete="current-password"
              />
            </label>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-(--primary)]"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <a className="text-sm text-muted hover:underline" href="#">
                Forgot?
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button className="btn flex-1" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </button>
              <button
                type="button"
                className="btn-ghost px-3 py-2"
                onClick={() => {
                  setEmail("demo@caldice.com");
                  setPassword("demo123");
                }}
              >
                Demo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
