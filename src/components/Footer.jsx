import React from "react";

import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-lime-400 text-black mt-20 py-10 px-6 rounded-t-2xl">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-black/20 pb-6">
          <div>
            <h3 className="font-semibold text-lg mb-1">
              Lorem ipsum dolor sit amet consectetur.
            </h3>
            <p className="text-sm text-black/70 max-w-md">
              Lorem ipsum dolor sit amet consectetur. Ornare faucibus enim
              rhoncus arcu eget tellus consectetur.
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <input
              type="email"
              placeholder="Enter email..."
              className="px-3 py-2 rounded-l-md border border-gray-300 text-sm outline-none"
            />
            <button className="bg-black text-white text-sm px-4 py-2 rounded-r-md">
              Send
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-3 bg-lime-400 px-6 py-4 rounded-xl">
              <div className="shadow-xl shadow-accent p-1 rounded-md flex items-center justify-center">
                <img
                  src="/images/logoTransparent.png"
                  alt="BALLIE logo"
                  className="h-10 w-auto object-contain md:h-12 lg:h-14 transition-all duration-300"
                />
              </div>
      
            </div>

            <span className="font-semibold text-lg">BALLIE</span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0">
            <a href="#" className="text-sm hover:underline">
              Home
            </a>
            <a href="#" className="text-sm hover:underline">
              Football Map
            </a>
            <a href="#" className="text-sm hover:underline">
              Blogs & News
            </a>
          </div>

          {/* Download App Section */}
          <div className="mt-4 md:mt-0 flex flex-col">
            <p className="text-sm mb-2 font-medium">Download app now</p>
            <div className="flex flex-col gap-2">
              {/* Apple Store */}
              <div className="px-3 py-2 bg-black text-white flex items-center text-sm gap-2 rounded-md w-fit">
                <img
                  src="/icons/Apple logo.png"
                  alt="App Store"
                  className="h-6 w-6"
                />
                <div className="leading-tight">
                  <p className="text-[10px] text-gray-300">Download on the</p>
                  <p className="text-sm font-medium">App Store</p>
                </div>
              </div>

              {/* Google Play */}
              <div className="px-3 py-2 bg-black text-white flex items-center text-sm gap-2 rounded-md w-fit">
                <img
                  src="/icons/Google Play logo.png"
                  alt="Google Play"
                  className="h-6 w-6"
                />
                <div className="leading-tight">
                  <p className="text-[10px] text-gray-300">Get it on</p>
                  <p className="text-sm font-medium">Google Play</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-black/20 pt-4 text-sm">
          <p>© 2025 BALLIE. All rights reserved.</p>
          <div className="flex space-x-4 h-5">
            <img src="public\icons\Social icon.png" alt="" />
            <img src="public\icons\Group.png" alt="" />
            <img src="public\icons\Social icon (1).png" alt="" />
            <img src="public\icons\Social icon (2).png" alt="" />
            <img src="public\icons\Social icon (3).png" alt="" />
            <img src="public\icons\Social icon (4).png" alt="" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
