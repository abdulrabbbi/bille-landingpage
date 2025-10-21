import React from "react";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-black text-white overflow-hidden rounded-3xl mx-auto mt-10 max-w-7xl">
      {/* Green angled background */}
      <div className="absolute right-0 top-0 w-[65%] h-full bg-lime-400 rounded-bl-[100px] transform -skew-x-[18deg] origin-bottom-left z-0"></div>

      {/* Content */}
      <div className="relative z-10 grid md:grid-cols-2 items-center gap-8 px-8 py-16">
        {/* Left Content */}
        <div className="space-y-6 max-w-md">
          <span className="bg-lime-400 text-black text-xs font-semibold px-3 py-1 rounded-full inline-block">
            Lorem ipsum
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-snug text-lime-400">
            Lorem ipsum <br /> dolor sit amet consectetur.
          </h1>

          <p className="text-gray-300 text-sm md:text-base">
            Lorem ipsum dolor sit amet consectetur. Mi donec morbi aliquam quam
            tempor enim porta arcu ipsum. Turpis pharetra mauris a molestie
            nullam imperdiet feugiat. Ultricies ut pellentesque ac aliquam et
            morbi.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-lime-400 text-black font-medium px-5 py-2 rounded-md flex items-center gap-2 hover:bg-lime-500 transition">
              Download App <ArrowRight size={16} />
            </button>
            <button className="border border-lime-400 text-lime-400 font-medium px-5 py-2 rounded-md hover:bg-lime-400 hover:text-black transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Player Image */}
        <div className="relative flex justify-center md:justify-end">
          <img
            src={"public/images/Frame 190.png"}
            alt="Football player"
            className="relative z-10 w-[90%] md:w-[100%] object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Bottom Stats Cards */}
      <div className="relative z-20 flex flex-wrap justify-start gap-6 px-8 pb-8">
        <div className="bg-[#1a1a1a] rounded-2xl py-6 px-8 w-40 text-center shadow-lg">
          <h3 className="text-lime-400 text-4xl font-bold">100</h3>
          <p className="text-xs text-gray-300 mt-2">Lorem ipsum dolor sit</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl py-6 px-8 w-40 text-center shadow-lg">
          <h3 className="text-lime-400 text-4xl font-bold">100</h3>
          <p className="text-xs text-gray-300 mt-2">Lorem ipsum dolor sit</p>
        </div>
      </div>

      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-lime-400/10 pointer-events-none rounded-3xl"></div>
    </section>
  );
};

export default HeroSection;
