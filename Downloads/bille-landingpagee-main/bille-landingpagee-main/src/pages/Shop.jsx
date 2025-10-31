import React from "react";
import { Link } from "react-router-dom";

// Reuse any images from src/images; fallback to a placeholder
import { BUSINESS_FRAME_221 } from "../images";

const ProductCard = ({ image = BUSINESS_FRAME_221 }) => {
  return (
    <div className="rounded-[18px] overflow-hidden bg-transparent">
      <div className="h-40 w-full overflow-hidden">
        <img src={image} alt="product" className="h-full w-full object-cover" />
      </div>
      <div className="bg-[#0c0c0c] px-4 py-4 rounded-b-[18px] shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
        <h4 className="text-sm font-semibold text-white">
          Lorem ipsum dolor sit amet consectetur.
        </h4>
        <p className="mt-2 text-xs text-gray-300">
          Lorem ipsum dolor sit amet consectetur.
        </p>
        <div className="mt-3">
          <Link
            to="#"
            className="text-[13px] text-lime-400 font-medium inline-flex items-center gap-2"
          >
            Learn More <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const cards = Array.from({ length: 12 }).map((_, i) => ({ id: i + 1 }));

  return (
    <main className="w-full min-h-screen bg-black text-white py-12">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8">
        {/* Hero */}
        <section className="mx-auto w-[96%] md:w-[92%] lg:w-[88%] rounded-[24px] px-8 py-12 text-center mb-12">
          <h1 className="mb-3 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-accent">
            Shop
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-[15px]">
            Browse our products and offers — curated for fans and businesses.
          </p>
        </section>

        {/* Grid */}
        <section className="mx-auto w-[96%] md:w-[92%] lg:w-[88%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.map((c) => (
              <ProductCard key={c.id} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Shop;
