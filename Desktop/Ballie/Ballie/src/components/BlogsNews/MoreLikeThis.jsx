import React from "react";
import Card from "./Card";

export default function MoreLikeThis() {
  const items = Array.from({ length: 4 }).map((_, i) => ({
    image: "/images/Frame 221.png",
    title: "Lorem ipsum dolor sit amet consectetur.",
    description: "Lorem ipsum dolor sit amet consectetur.",
    link: `/blogs-news/${i + 1}`,
  }));

  return (
    <section className="mt-12 text-left">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-lime-400 text-2xl md:text-3xl font-semibold">
          More like this
        </h3>
        <p className="mt-2 text-gray-300 max-w-2xl">
          Lorem ipsum dolor sit amet consectetur. Sit eleifend id sed pharetra vel
          ullamcorper sed aliquet. Lacus habitant tortor pulvinar pellentesque.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <Card key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

