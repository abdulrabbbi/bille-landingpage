import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { MdMenu, MdSearch, MdNotificationsNone } from "react-icons/md";
import ThemeSwitch from "../shared/components/ThemeSwitch.jsx";

export default function Header({
  avatarSrc = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop",
  onMenuClick,
  onSearch,
}) {
  const [q, setQ] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [items, setItems] = useState([]);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  function submit(e) {
    e.preventDefault();
    onSearch?.(q.trim());
  }

  // load/store notifications from localStorage (simple mock)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("caldice_notifications");
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        const seed = [
          {
            id: 1,
            title: "New user registered",
            body: "John Doe joined your platform",
            time: "2m",
            read: false,
          },
          {
            id: 2,
            title: "Payment received",
            body: "$299.00 from Premium Plan",
            time: "15m",
            read: false,
          },
          {
            id: 3,
            title: "System update",
            body: "New features available",
            time: "1h",
            read: true,
          },
        ];
        setItems(seed);
        localStorage.setItem("caldice_notifications", JSON.stringify(seed));
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (
        showNotifications &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showNotifications]);

  const unread = useMemo(() => items.filter((i) => !i.read).length, [items]);

  function toggleNotifications() {
    setShowNotifications((s) => !s);
  }

  function markAllRead() {
    const updated = items.map((it) => ({ ...it, read: true }));
    setItems(updated);
    try {
      localStorage.setItem("caldice_notifications", JSON.stringify(updated));
    } catch {
      // ignore localStorage errors
    }
  }

  function handleItemClick(id) {
    const updated = items.map((it) =>
      it.id === id ? { ...it, read: true } : it
    );
    setItems(updated);
    try {
      localStorage.setItem("caldice_notifications", JSON.stringify(updated));
    } catch {
      // ignore storage write errors
    }
    // placeholder: you might navigate to related page here
  }

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-xl border-b border-(--line)] shadow-lg"
      style={{ backgroundColor: "var(--header-bg)" }}
    >
      <div
        className="h-16 mx-auto flex items-center gap-3 px-3 sm:px-5 relative overflow-hidden"
        style={{ maxWidth: "1600px" }}
      >
        <button
          className="lg:hidden -ml-1 p-3 rounded-xl hover:bg-primary/10 hover:scale-105 transition-all duration-200 flex items-center justify-center group"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <MdMenu className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Logo/title area removed per request */}
        <div
          className="hidden sm:block header-fade"
          style={{ width: 160, animationDelay: "80ms" }}
        />

        <form
          onSubmit={submit}
          className="hidden sm:flex items-center flex-1 pl-2 header-fade"
          style={{ animationDelay: "160ms" }}
        >
          <div className="flex items-center w-full max-w-4xl bg-card/50 backdrop-blur-sm rounded-2xl border border-(--line)] shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="px-4 text-muted group">
              <MdSearch className="h-6 w-6 group-hover:text-primary transition-colors duration-200" />
            </div>
            <input
              className="w-full bg-transparent placeholder:text-muted text-base py-4 px-2 pr-3 outline-none focus:placeholder:text-primary/50 transition-colors duration-200"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search anything..."
              autoComplete="off"
            />
            <button
              type="submit"
              className="ml-2 mr-3 btn rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl px-6 py-3"
            >
              Search
            </button>
          </div>
        </form>

        <div
          className="ml-auto flex items-center gap-2 header-fade"
          style={{ animationDelay: "240ms" }}
        >
          <div className="relative">
            <ThemeSwitch />
          </div>

          <div className="relative">
            <button
              ref={btnRef}
              type="button"
              className="relative p-3 rounded-xl hover:bg-primary/10 hover:scale-110 transition-all duration-200 group"
              aria-label="Notifications"
              onClick={toggleNotifications}
            >
              <MdNotificationsNone className="h-5 w-5 text-muted group-hover:text-primary transition-colors duration-200" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white text-xs px-1.5 shadow-lg">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {showNotifications &&
              typeof document !== "undefined" &&
              createPortal(
                <div
                  ref={dropdownRef}
                  className="fixed bg-card border border-(--line)] rounded-xl shadow-2xl z-60 w-80"
                  style={{
                    top:
                      btnRef.current?.getBoundingClientRect().bottom + 8 || 80,
                    right: Math.max(
                      12,
                      window.innerWidth -
                        (btnRef.current?.getBoundingClientRect().right || 200)
                    ),
                  }}
                >
                  <div className="p-4 border-b border-(--line)]">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <button
                        className="text-xs text-muted"
                        onClick={markAllRead}
                      >
                        Mark all as read
                      </button>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      You have {unread} unread
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {items.length > 0 ? (
                      <div className="p-2 space-y-2">
                        {items.map((it) => (
                          <div
                            key={it.id}
                            onClick={() => handleItemClick(it.id)}
                            className={`flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer ${
                              it.read ? "opacity-60" : ""
                            }`}
                          >
                            <div
                              className={`w-2 h-2 ${
                                it.read ? "bg-muted" : "bg-primary"
                              } rounded-full mt-2 shrink-0`}
                            ></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{it.title}</p>
                              <p className="text-xs text-muted">{it.body}</p>
                              <p className="text-xs text-muted mt-1">
                                {it.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <MdNotificationsNone className="h-12 w-12 text-muted mx-auto mb-3" />
                        <p className="text-sm text-muted">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>,
                document.body
              )}
          </div>

          <div className="relative group">
            <img
              src={avatarSrc}
              alt="avatar"
              className="h-10 w-10 rounded-xl border-2 border-primary/20 object-cover shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card shadow-sm"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
