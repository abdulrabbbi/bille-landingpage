import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import ThemeSwitch from "../iam/components/ThemeSwitch.jsx"; // adjust if your ThemeSwitch lives elsewhere
import { signIn } from "./api/auth.service.js"; // uses your mock-first service
import { PATHS } from "../../routes/paths.js";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!email || !pw) {
      setErr("Please enter your email and password.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const res = await signIn({ email: email.trim(), password: pw, remember });
      if (res?.ok) {
        nav(PATHS.DASHBOARD || "/");
      } else {
        setErr("Sign-in failed. Check your credentials.");
      }
    } catch (ex) {
      setErr(ex?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Top-right theme toggle */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeSwitch />
      </div>

      {/* Animated background blobs */}
      <Motion.div
        className="pointer-events-none absolute -top-36 -left-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(16,185,129,0.35), transparent 60%)",
        }}
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <Motion.div
        className="pointer-events-none absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 70% 70%, rgba(14,165,233,0.35), transparent 60%)",
        }}
        animate={{ y: [0, -22, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Centered card */}
      <div className="page min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          <Motion.div
            key="login-card"
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <div className="card p-6 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-primary/15 border border-primary/30 text-primary">
                  <MdLock size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted">Welcome back</div>
                  <div className="font-semibold text-lg">
                    Sign in to Zavolla
                  </div>
                </div>
              </div>

              {/* Error */}
              {err && (
                <Motion.div
                  className="mb-4 text-sm bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 rounded-xl p-3"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {err}
                </Motion.div>
              )}

              {/* Form */}
              <form onSubmit={submit} className="space-y-4">
                <label className="block">
                  <span className="text-sm text-muted">Email</span>
                  <input
                    className="input mt-1"
                    type="email"
                    placeholder="you@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-muted">Password</span>
                  <div className="relative mt-1">
                    <input
                      className="input pr-10"
                      type={show ? "text" : "password"}
                      placeholder="Your password"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? (
                        <MdVisibilityOff size={20} />
                      ) : (
                        <MdVisibility size={20} />
                      )}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-[var(--primary)]"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-sm text-muted hover:text-text"
                    onClick={() =>
                      setErr(
                        "If your email exists, reset instructions will be sent."
                      )
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <Motion.button
                  whileTap={{ scale: 0.97 }}
                  className="btn w-full justify-center"
                  disabled={busy}
                >
                  {busy ? "Signing in…" : "Sign In"}
                </Motion.button>
              </form>

              {/* Subtle footer note */}
              <div className="mt-4 text-xs text-muted text-center select-none">
                By continuing, you agree to our Terms & Privacy.
              </div>
            </div>
          </Motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
