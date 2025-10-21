import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";
import "./index.css";

/**
 * Boot theme:
 * - prefers saved `localStorage.theme` ("light" | "dark")
 * - otherwise follows system (`prefers-color-scheme`)
 * - applies BOTH a data attribute and the `dark` class (so either Tailwind strategy works)
 */
function bootTheme() {
  try {
    const saved = localStorage.getItem("theme"); // "light" | "dark" | null
    const systemDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme =
      saved === "light" || saved === "dark"
        ? saved
        : systemDark
        ? "dark"
        : "light";
    const root = document.documentElement;

    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", theme === "dark");
  } catch {
    // noop
  }
}
bootTheme();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
