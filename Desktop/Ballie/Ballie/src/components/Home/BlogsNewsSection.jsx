import React from "react";
import { ArrowRight } from "lucide-react";

function BlogCard({ image, title, excerpt, href = "#" }) {
  return (
    <article className="bg-[#3b3b3b] rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h4 className="text-white text-sm font-semibold leading-snug">
          {title}
        </h4>
        <p className="mt-2 text-xs text-gray-300">{excerpt}</p>
        <a
          href={href}
          className="mt-3 inline-flex items-center gap-2 text-lime-400 text-sm"
        >
          Learn More <ArrowRight size={14} />
        </a>
      </div>
    </article>
  );
}

export default function BlogsNewsSection() {
  const items = Array.from({ length: 4 }).map((_, i) => ({
    id: i + 1,
    image: "/images/Frame 221.png",
    title: "Lorem ipsum dolor sit amet consectetur.",
    excerpt: "Lorem ipsum dolor sit amet consectetur.",
  }));

  return (
    <section className="mt-16">
      <div className="relative">
        {/* Decorative lime chevrons */}
        <div className="absolute -top-6 left-0 h-6 w-36 bg-lime-400 rounded-r-xl" />
        <div className="absolute -top-6 left-36 h-6 w-16 bg-lime-400 rounded-r-xl skew-x-[-20deg]" />

        <h3 className="text-lime-400 text-3xl md:text-4xl font-semibold">
          Blogs & News
        </h3>
        <p className="mt-3 text-gray-300 max-w-3xl text-sm md:text-base">
          Lorem ipsum dolor sit amet consectetur. Sit eleifend id sed pharetra vel
          ullamcorper sed aliquet. Lacus habitant tortor pulvinar pellentesque.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <BlogCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}

