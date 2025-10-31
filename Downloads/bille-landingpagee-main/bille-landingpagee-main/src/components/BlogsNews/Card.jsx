import React from "react";
import { ArrowRight } from "lucide-react";

export default function Card({ image, title, description, link }) {
  return (
    <div className="bg-[#1d1d1d] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all w-[250px]">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4 space-y-2">
        <h3 className="text-white font-medium text-sm">{title}</h3>
        <p className="text-gray-400 text-xs">{description}</p>
        <a
          href={link}
          className="flex items-center gap-1 text-accent text-xs font-medium hover:text-accent/90 transition-all"
        >
          Learn More <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
