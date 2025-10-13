import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <header className="px-4 py-3">
        <Navbar />
      </header>

      <main className="flex-1 px-6">
        <Outlet />
      </main>

      <footer className="px-4 py-3">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
