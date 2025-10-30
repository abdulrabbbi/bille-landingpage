import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

const Navbar = () => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Business Benefits", path: "/business-benefits" },
    { name: "Football Map", path: "/football-map" },
    { name: "Blogs & News", path: "/blogs-news" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#231f20] text-white py-4 relative">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex items-center justify-between rounded-xl">
        <Link
          to="/"
          aria-label="Go to home"
          className="flex items-center space-x-2"
        >
          <img
            src="/images/Logo.jpeg"
            alt="BALLIE logo"
            className="h-10 w-auto object-contain md:h-12 lg:h-14 transition-all duration-300"
          />
        </Link>

        {/* Desktop nav + download (hidden on small screens) */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `text-sm hover:text-accent transition ${
                  isActive ? "text-accent font-semibold" : "text-gray-200"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <a
            href="#"
            className="bg-accent text-black font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-accent/90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            Download App <ArrowRight size={16} />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <span className="sr-only">Open main menu</span>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div id="mobile-menu" className="md:hidden mt-3">
          <div className="flex flex-col space-y-2 px-4 pb-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition ${
                    isActive
                      ? "text-accent font-semibold"
                      : "text-gray-200 hover:text-accent"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <a
              href="#"
              className="mt-2 inline-flex items-center justify-center bg-accent text-black font-medium text-sm px-4 py-2 rounded-lg gap-2 hover:bg-accent/90 transition"
            >
              Download App <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
