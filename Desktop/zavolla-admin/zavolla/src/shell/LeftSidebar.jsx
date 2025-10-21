import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdBolt,
  MdPrint,
  MdPayments,
  MdMemory,
  MdLink,
  MdSyncAlt,
  MdLocalShipping,
  MdReceiptLong,
  MdSettings,
} from "react-icons/md";
import { motion as Motion, AnimatePresence } from "framer-motion";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ icon: MdDashboard, label: "Dashboard", path: "/" }],
  },
  {
    title: "Sales",
    items: [
      {
        icon: MdLocalShipping,
        label: "Delivery Feed",
        path: "/integrations/delivery-feed",
      },
    ],
  },
  {
    title: "Hardware",
    items: [
      { icon: MdMemory, label: "Health", path: "/hardware/health" },
      { icon: MdPayments, label: "Terminals", path: "/hardware/terminals" },
      { icon: MdPrint, label: "Printers", path: "/hardware/printers" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { icon: MdLink, label: "Partners", path: "/integrations/partners" },
      { icon: MdSyncAlt, label: "Menu Sync", path: "/integrations/menu-sync" },
      { icon: MdBolt, label: "Webhooks", path: "/integrations/webhooks" },
    ],
  },
  {
    title: "System",
    items: [{ icon: MdSettings, label: "Settings", path: "/settings" }],
  },
];

export default function LeftSidebar({
  open = false,
  onClose,
  logoSrc = "/zavolla-logo.png",
}) {
  const { pathname } = useLocation();
  const [isLarge, setIsLarge] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width:1024px)").matches
      : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width:1024px)");
    const handler = (e) => setIsLarge(e.matches);
    // matchMedia supports addEventListener in modern browsers, fallback to addListener
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    // cleanup
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <Motion.div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Rail */}
      <Motion.aside
        className="fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[var(--surface)] border-r flex flex-col"
        style={{ borderColor: "var(--border)" }}
        initial={false}
        animate={{ x: isLarge ? 0 : open ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {/* Brand row */}
        <div
          className="h-20 px-4 flex items-center gap-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <img
            src={logoSrc}
            alt="Zavolla"
            className="h-8 w-23.5 rounded-md object-cover"
            style={{ objectPosition: "left" }}
          />
          <div className="font-semibold text-base">Zavolla Admin</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {NAV_SECTIONS.map((sec) => (
            <div key={sec.title} className="mb-3">
              <div className="px-2 mb-1 text-[11px] uppercase tracking-wide text-muted">
                {sec.title}
              </div>
              <ul className="space-y-1">
                {sec.items.map((item) => {
                  const active = isActive(pathname, item.path);
                  return (
                    <li key={item.path} className="relative">
                      <NavLink
                        to={item.path}
                        className="group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-black/5"
                        aria-current={active ? "page" : undefined}
                      >
                        {/* Active pill animation */}
                        <AnimatePresence>
                          {active && (
                            <Motion.span
                              layoutId="activePill"
                              className="absolute inset-0 rounded-xl"
                              style={{
                                background:
                                  "var(--brand-ghost, rgba(16,185,129,0.15))",
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 40,
                              }}
                            />
                          )}
                        </AnimatePresence>

                        <item.icon
                          className={`h-5 w-5 ${
                            active
                              ? "text-[var(--primary)]"
                              : "text-gray-500 group-hover:text-gray-700"
                          }`}
                        />
                        <span
                          className={`relative ${active ? "font-medium" : ""}`}
                        >
                          {item.label}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer / version */}
        <div
          className="px-4 py-3 border-t text-xs text-muted"
          style={{ borderColor: "var(--border)" }}
        >
          v1.0.0 • © Zavolla
        </div>
      </Motion.aside>
    </>
  );
}

function isActive(pathname, path) {
  if (path === "/") return pathname === "/";
  return pathname.startsWith(path);
}
