import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header, LeftSidebar } from "../shell";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "m") setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen flex">
      <LeftSidebar
        open={open}
        onClose={() => setOpen(false)}
        logoSrc="/logoo.png"
      />
      <div className="flex-1 min-w-0">
        <Header
          onMenuClick={() => setOpen(true)}
          onSearch={(q) => q && console.log("search:", q)}
        />
        <main className="page">
          <div
            className="w-full mx-auto px-4 sm:px-6 lg:px-8"
            style={{ maxWidth: 1200 }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
