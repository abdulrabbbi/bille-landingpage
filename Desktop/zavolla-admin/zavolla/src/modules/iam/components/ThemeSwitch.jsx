import React, { useEffect, useState } from "react";

function applyTheme(mode) {
  try {
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : false;
    const active = mode === "system" ? (prefersDark ? "dark" : "light") : mode;

    // Set data-theme attribute (used by our CSS) and the html.dark class (Tailwind/class strategy)
    if (active === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }

    localStorage.setItem("theme", mode);
  } catch (err) {
    // ignore
    console.warn("applyTheme error", err);
  }
}

export default function ThemeSwitch() {
  const [mode, setMode] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "system"
      : "system"
  );

  useEffect(() => {
    applyTheme(mode);

    // If using system mode, listen for changes to the OS-level preference
    if (
      mode === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia
    ) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      if (mq.addEventListener) mq.addEventListener("change", handler);
      else mq.addListener(handler);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener("change", handler);
        else mq.removeListener(handler);
      };
    }
    return undefined;
  }, [mode]);

  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <label className="text-muted">Theme</label>
      <select
        className="input !py-1 !h-8"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
