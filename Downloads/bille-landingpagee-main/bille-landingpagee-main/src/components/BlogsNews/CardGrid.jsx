import React from "react";
import Card from "./Card";

export default function CardGrid() {
  const cards = [
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      title: "Lorem ipsum dolor sit amet consectetur.",
      description: "Lorem ipsum dolor sit amet consectetur.",
      link: "#",
    },
  ];

  return (
    <section className="flex justify-center items-center bg-black min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            image={card.image}
            title={card.title}
            description={card.description}
            link={card.link}
          />
        ))}
      </div>
    </section>
  );
}
