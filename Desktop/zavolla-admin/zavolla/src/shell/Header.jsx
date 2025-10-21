import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdMenu,
  MdSearch,
  MdNotificationsNone,
  MdSettings,
} from "react-icons/md";
import { motion as Motion, AnimatePresence } from "framer-motion";
// If your ThemeSwitch lives elsewhere, update this import:
import ThemeSwitch from "../modules/iam/components/ThemeSwitch.jsx";

export default function Header({
  avatarSrc = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop",
  notifications = 2,
  notificationItems = null,
  onMenuClick,
  onSettingsClick,
  onProfileClick,
  onSearch,
}) {
  const [q, setQ] = useState("");
  const [openNotif, setOpenNotif] = useState(false);
  const notifRef = useRef(null);
  const nav = useNavigate();

  const items = useMemo(() => {
    if (Array.isArray(notificationItems)) return notificationItems;
    const n = Number(notifications) || 0;
    if (!n) return [];
    return Array.from({ length: Math.min(n, 6) }).map((_, i) => ({
      id: `n-${i}`,
      title: `New delivery order #${4500 + i}`,
      time: i ? `${i * 3}m ago` : "Just now",
    }));
  }, [notifications, notificationItems]);

  const unread = items.length;

  useEffect(() => {
    function onDoc(e) {
      if (!openNotif) return;
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpenNotif(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openNotif]);

  function submit(e) {
    e.preventDefault();
    onSearch?.(q.trim());
  }

  return (
    <Motion.header
      className="sticky top-0 z-30 backdrop-blur"
      style={{
        background: "var(--surface)",
        color: "var(--text)",
        borderBottom: "1px solid var(--border)",
      }}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      <div
        className="h-19.5 mx-auto flex items-center gap-3 px-3 sm:px-5"
        style={{ maxWidth: 1100 }}
      >
        {/* Left: burger + brand */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="lg:hidden -ml-1 p-2 rounded-md hover:bg-black/5 active:scale-95 transition"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <MdMenu className="h-5 w-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 shrink-0" />
        </div>

        {/* Center: search */}
        <form onSubmit={submit} className="hidden md:flex items-center flex-1">
          <Motion.div
            whileFocus={{ scale: 1.01 }}
            className="flex items-center w-full max-w-2xl bg-[var(--surface)]"
            style={{
              borderRadius: 999,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <div className="px-3">
              <MdSearch className="h-5 w-5" />
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search orders, transactions, hardware…"
              className="w-full bg-transparent placeholder:text-gray-400 text-sm py-2.5 pr-3 outline-none"
            />
            <button className="px-4 py-2 text-sm rounded-r-full hover:bg-black/5 active:scale-95 transition">
              Search
            </button>
          </Motion.div>
        </form>

        {/* Right: actions */}
        <div className="ml-auto flex items-center gap-1">
          <ThemeSwitch />

          <div className="relative" ref={notifRef}>
            <Motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setOpenNotif((v) => !v)}
              className="relative p-2.5 rounded-full hover:bg-black/5"
              aria-label="Notifications"
              aria-haspopup="menu"
              aria-expanded={openNotif}
            >
              <MdNotificationsNone className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-white text-[10px] px-1">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Motion.button>

            <AnimatePresence>
              {openNotif && (
                <Motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-80 bg-[var(--surface)] border rounded-xl overflow-hidden"
                  style={{
                    borderColor: "var(--border)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div
                    className="px-4 py-3 border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="text-sm font-semibold">Notifications</div>
                    <div className="text-xs text-muted">
                      {items.length
                        ? `You have ${unread} new notification(s)`
                        : "You're all caught up"}
                    </div>
                  </div>
                  <ul className="max-h-80 overflow-auto">
                    {items.length === 0 && (
                      <li className="px-4 py-6 text-sm text-muted">
                        No new notifications
                      </li>
                    )}
                    {items.map((n) => (
                      <li
                        key={n.id}
                        className="px-4 py-3 hover:bg-black/5 transition"
                      >
                        <div className="text-sm">{n.title}</div>
                        {n.time && (
                          <div className="text-xs text-muted">{n.time}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="px-4 py-2 border-t bg-black/5 text-right"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      className="text-xs font-medium text-muted hover:text-text"
                      onClick={() => setOpenNotif(false)}
                    >
                      Close
                    </button>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          <Motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() =>
              onSettingsClick ? onSettingsClick() : nav("/settings")
            }
            className="p-2.5 rounded-full hover:bg-black/5"
            aria-label="Settings"
          >
            <MdSettings className="h-5 w-5" />
          </Motion.button>

          <Motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onProfileClick}
            className="shrink-0 rounded-full overflow-hidden h-9 w-9 border"
            style={{ borderColor: "var(--border)" }}
            aria-label="Profile"
          >
            <img
              src={avatarSrc}
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </Motion.button>
        </div>
      </div>
    </Motion.header>
  );
}
