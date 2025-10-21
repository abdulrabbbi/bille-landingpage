import React from "react";
import { ArrowRight } from "lucide-react";

export default function BlogsPreview() {
  const cards = Array.from({ length: 4 }).map((_, i) => ({
    id: i + 1,
    title: "Lorem ipsum dolor sit amet consectetur.",
    excerpt: "Lorem ipsum dolor sit amet consectetur.",
    image: "/images/Frame 221.png",
  }));

  return (
    <section className="mt-16">
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Decorative lime slashes */}
        <div className="absolute -top-6 left-4 md:left-0 h-3 w-28 bg-lime-400 rounded-md rotate-[-10deg]" />
        <div className="absolute -top-2 left-24 md:left-28 h-3 w-16 bg-lime-400 rounded-md rotate-[-10deg]" />

        <h2 className="text-lime-400 text-3xl md:text-4xl font-semibold">Blogs & News</h2>
        <p className="mt-3 text-gray-300 max-w-2xl">
          Lorem ipsum dolor sit amet consectetur. Sit eleifend id sed pharetra
          vel ullamcorper sed aliquet. Lacus habitant tortor pulvinar
          pellentesque.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <article
              key={c.id}
              className="bg-[#3a3a3a] rounded-2xl overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <img
                src={c.image}
                alt="Blog thumbnail"
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <h3 className="text-white text-sm font-semibold leading-snug">
                  {c.title}
                </h3>
                <p className="text-gray-300 text-xs mt-2">{c.excerpt}</p>
                <a
                  href="#"
                  className="mt-3 inline-flex items-center gap-1 text-lime-400 text-xs font-medium hover:underline"
                >
                  Learn More <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

