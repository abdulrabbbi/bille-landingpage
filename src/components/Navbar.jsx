import React from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Football Map", path: "/football-map" },
    { name: "Blogs & News", path: "/blogs-news" },
  ];

  return (
    <nav className="bg-[#231f20] text-white py-4 px-6 flex items-center justify-between rounded-xl max-w-screen-xl mx-auto">
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
        <span className="text-lg font-semibold">BALLIE</span>
      </Link>

      <div className="flex space-x-6">
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
      </div>

      <a
        href="#"
        className="bg-accent text-black font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-accent/90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        Download App <ArrowRight size={16} />
      </a>
    </nav>
  );
};

export default Navbar;
