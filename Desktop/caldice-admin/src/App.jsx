import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";
import "./index.css";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}
