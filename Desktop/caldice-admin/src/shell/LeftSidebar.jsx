import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdSecurity,
  MdSettings,
  MdBolt,
  MdExtension,
  MdWebhook,
  MdAttachMoney,
  MdLogout,
} from "react-icons/md";

const NAV = [
  { label: "Dashboard", icon: MdDashboard, path: "/dashboard" },
  {
    label: "People & Access",
    children: [
      { label: "Users", icon: MdPeople, path: "/people/users" },
      { label: "Roles", icon: MdSecurity, path: "/people/roles" },
    ],
  },
  {
    label: "Monetization",
    children: [
      { label: "Plans", icon: MdAttachMoney, path: "/billing/plans" },
      { label: "Coupons", icon: MdAttachMoney, path: "/billing/coupons" },
    ],
  },
  {
    label: "Integrations",
    children: [
      { label: "Providers", icon: MdExtension, path: "/integrations" },
      { label: "Webhooks", icon: MdWebhook, path: "/integrations/webhooks" },
    ],
  },
  { label: "AI Recipes", icon: MdBolt, path: "/ai/recipes" },
  { label: "Settings", icon: MdSettings, path: "/settings" },
];

export default function LeftSidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = (p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p);

  const handleLogout = () => {
    // Clear auth tokens
    localStorage.removeItem("auth.token");
    sessionStorage.removeItem("auth.token");
    // Navigate to login
    navigate("/auth/login");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-linear-to-b from-card via-card to-card/95 border-r border-(--line)] transform transition-all duration-300 ease-out shadow-2xl
        ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col overflow-hidden`}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-4 w-16 h-16 bg-primary rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute bottom-32 right-4 w-12 h-12 bg-primary/70 rounded-full blur-lg animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative h-16 px-4 flex items-center gap-3 border-b border-(--line)] bg-linear-to-r from-primary/5 to-transparent">
          <img
            src="/logo.png"
            alt="Caldice Logo"
            className="h-14 w-14 rounded-lg object-contain shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
          <div
            className="font-bold text-xl"
            style={{ color: "rgb(255, 145, 77)" }}
          >
            Caldice
          </div>
        </div>

        <nav className="relative flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-3">
            {NAV.map((item, idx) => {
              if (item.children) {
                const anyChildActive = item.children.some((ch) =>
                  isActive(ch.path)
                );
                return (
                  <li key={item.label}>
                    <div className="px-4 py-2 text-xs uppercase tracking-wider text-muted font-semibold bg-linera-to-r from-primary/10 to-transparent rounded-lg mb-2">
                      {item.label}
                    </div>
                    <ul className="space-y-1">
                      {item.children.map((ch, cidx) => {
                        const active = isActive(ch.path);
                        const delay = idx * 80 + cidx * 60;
                        return (
                          <li
                            key={ch.path}
                            className="px-2 sidebar-item group"
                            style={{ animationDelay: `${delay}ms` }}
                          >
                            <Link
                              to={ch.path}
                              className={`pill-hover w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 text-sm font-medium relative overflow-hidden ${
                                active
                                  ? "bg-linera-to-r from-primary to-primary/90 shadow-xl scale-105"
                                  : "bg-card/50 hover:bg-card/80 hover:shadow-lg"
                              }`}
                              style={
                                active ? { color: "var(--active-text)" } : {}
                              }
                              aria-current={active ? "page" : undefined}
                              onClick={onClose}
                            >
                              {/* Hover glow effect */}
                              <div className="absolute inset-0 bg-linera-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                              <ch.icon
                                className={`h-5 w-5 relative z-10 transition-all duration-300 ${
                                  active
                                    ? "scale-110"
                                    : "text-muted group-hover:text-primary group-hover:scale-110"
                                }`}
                                style={
                                  active ? { color: "var(--active-text)" } : {}
                                }
                              />
                              <span className="relative z-10">{ch.label}</span>

                              {/* Active indicator */}
                              {active && (
                                <div
                                  className="absolute right-3 w-2 h-2 rounded-full animate-pulse"
                                  style={{
                                    backgroundColor: "var(--active-text)",
                                  }}
                                ></div>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                    {anyChildActive && <div className="h-3" />}
                  </li>
                );
              }
              const active = isActive(item.path);
              const delay = idx * 80;
              return (
                <li
                  key={item.path}
                  className="px-2 sidebar-item group"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  <Link
                    to={item.path}
                    className={`pill-hover w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 text-sm font-medium relative overflow-hidden ${
                      active
                        ? "bg-linear-to-r from-primary to-primary/90 shadow-xl scale-105"
                        : "bg-card/50 hover:bg-card/80 hover:shadow-lg"
                    }`}
                    style={active ? { color: "var(--active-text)" } : {}}
                    aria-current={active ? "page" : undefined}
                    onClick={onClose}
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <item.icon
                      className={`h-5 w-5 relative z-10 transition-all duration-300 ${
                        active
                          ? "scale-110"
                          : "text-muted group-hover:text-primary group-hover:scale-110"
                      }`}
                      style={active ? { color: "var(--active-text)" } : {}}
                    />
                    <span className="relative z-10">{item.label}</span>

                    {/* Active indicator */}
                    {active && (
                      <div
                        className="absolute right-3 w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: "var(--active-text)" }}
                      ></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative mt-auto border-t border-(--line)] bg-linear-to-r from-primary/5 to-transparent">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted hover:text-primary hover:bg-card/50 transition-all duration-200 group"
          >
            <MdLogout className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            <span>Logout</span>
          </button>
          <div className="p-4 text-xs text-muted text-center">
            <div className="font-medium">
              © {new Date().getFullYear()} Caldice
            </div>
            <div className="text-[10px] mt-1 opacity-75">
              Admin Dashboard v2.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
