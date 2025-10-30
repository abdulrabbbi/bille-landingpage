import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-lime-400 text-black mt-20 py-10 px-6 rounded-t-2xl">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-black/20 pb-6 gap-6">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              Lorem ipsum dolor sit amet consectetur.
            </h3>
            <p className="text-sm text-black/70 max-w-md">
              Lorem ipsum dolor sit amet consectetur. Ornare faucibus enim
              rhoncus arcu eget tellus consectetur.
            </p>
          </div>

          <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-end gap-4 w-full">
            <div className="w-full md:w-auto flex items-center md:items-stretch bg-transparent">
              <input
                type="email"
                placeholder="Enter email..."
                className="w-full md:w-auto px-3 py-2 rounded-l-md border border-gray-300 text-sm outline-none"
              />
              <button className="mt-2 md:mt-0 md:ml-2 w-full md:w-auto bg-black text-white text-sm px-4 py-2 rounded-md">
                Send
              </button>
            </div>

            {/* Download App Section */}
            <div className="flex-shrink-0 mt-2 md:mt-0">
              <p className="text-sm mb-2 font-medium">Download app now</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="px-3 py-2 bg-black text-white flex items-center text-sm gap-2 rounded-md w-full sm:w-auto">
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

                <div className="px-3 py-2 bg-black text-white flex items-center text-sm gap-2 rounded-md w-full sm:w-auto">
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
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-black/20 pt-4 text-sm gap-4">
          <p className="text-center md:text-left">
            © 2025 BALLIE. All rights reserved.
          </p>
          <div className="flex space-x-3 h-6 items-center">
            <img
              src="/icons/Social icon.png"
              alt="facebook"
              className="h-5 w-auto"
            />
            <img src="/icons/Group.png" alt="twitter" className="h-5 w-auto" />
            <img
              src="/icons/Social icon (1).png"
              alt="linkedin"
              className="h-5 w-auto"
            />
            <img
              src="/icons/Social icon (2).png"
              alt="github"
              className="h-5 w-auto"
            />
            <img
              src="/icons/Social icon (3).png"
              alt="social"
              className="h-5 w-auto"
            />
            <img
              src="/icons/Social icon (4).png"
              alt="social"
              className="h-5 w-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
