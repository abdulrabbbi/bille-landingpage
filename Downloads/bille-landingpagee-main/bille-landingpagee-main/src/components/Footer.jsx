import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-lime-400 text-black mt-20 py-10 px-6 rounded-t-3xl">
      <div className="max-w-6xl mx-auto">
        {/* TOP ROW: Heading (left) and newsletter (right) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6">
          <div className="md:w-2/3">
            <h3 className="text-2xl md:text-3xl font-bold">
              Lorem ipsum dolor sit amet consectetur.
            </h3>
            <p className="mt-3 text-sm text-black/70 max-w-2xl">
              Lorem ipsum dolor sit amet consectetur. Ornare faucibus enim
              rhoncus orci eget tellus consectetur. Elementum amet lorem
              ultrices interdum.
            </p>
          </div>

          <div className="md:w-1/3 w-full flex justify-end">
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter email......"
                className="px-4 py-2 rounded-l-full border border-black/10 text-sm w-52 md:w-64 outline-none bg-white"
              />
              <button className="bg-black text-white px-4 py-2 rounded-full text-sm">
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10" />

        {/* MIDDLE ROW: Logo + text + nav (left) and download badges (right) */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 py-6">
          <div className="md:w-2/3">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-lime-400 p-1 rounded-full">
                <img
                  src="/images/logoTransparent.png"
                  alt="BALLIE logo"
                  className="h-14 w-auto object-contain md:h-14 lg:h-16 transition-all duration-300 block"
                />
              </div>
            </div>
            <p className="text-sm text-black/70 mb-4 max-w-2xl">
              Lorem ipsum dolor sit amet consectetur. Ornare faucibus enim
              rhoncus orci eget tellus consectetur. Elementum amet lorem
              ultrices interdum.
            </p>

            <nav className="flex gap-6 text-sm font-medium">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <Link to="/business-benefits" className="hover:underline">
                Business Benefits
              </Link>
              <Link to="/football-map" className="hover:underline">
                Football Map
              </Link>
              <Link to="/blogs-news" className="hover:underline">
                Blogs & News
              </Link>
            </nav>
          </div>

          <div className="md:w-1/3 w-full flex flex-col items-end">
            <p className="text-sm mb-3 font-medium">Download app now</p>
            <div className="flex flex-col gap-3">
              <a className="px-3 py-2 bg-black text-white flex items-center text-sm gap-2 rounded-md">
                <img
                  src="/icons/Apple logo.png"
                  alt="App Store"
                  className="h-6 w-6"
                />
                <div className="leading-tight text-right">
                  <p className="text-[10px] text-gray-300">Download on the</p>
                  <p className="text-sm font-medium">App Store</p>
                </div>
              </a>

              <a className="px-3 py-2 bg-black text-white flex items-center text-sm gap-2 rounded-md">
                <img
                  src="/icons/Google Play logo.png"
                  alt="Google Play"
                  className="h-6 w-6"
                />
                <div className="leading-tight text-right">
                  <p className="text-[10px] text-gray-300">GET IT ON</p>
                  <p className="text-sm font-medium">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10" />

        {/* BOTTOM ROW: copyright left (with links), social icons right */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex flex-col">
            <p className="text-sm">© 2077 Untitled UI. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <Link to="/advertise" className="hover:underline">
                Advertising sign-up
              </Link>
              <span className="text-black/60">|</span>
              <Link to="/terms" className="hover:underline">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <img src="/icons/Social icon.png" alt="x" className="h-5 w-auto" />
            <img src="/icons/Group.png" alt="linkedin" className="h-5 w-auto" />
            <img
              src="/icons/Social icon (1).png"
              alt="facebook"
              className="h-5 w-auto"
            />
            <img
              src="/icons/Social icon (2).png"
              alt="github"
              className="h-5 w-auto"
            />
            <img
              src="/icons/Social icon (3).png"
              alt="dribbble"
              className="h-5 w-auto"
            />
            <img
              src="/icons/Social icon (4).png"
              alt="other"
              className="h-5 w-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
