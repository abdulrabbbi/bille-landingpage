import React from "react";



const BenefitItem = ({ id, title, description }) => {
  const isPrimary = id === 1;

  return (
    <div className="relative">
      {/* Row with marker + card */}
      <div className="grid grid-cols-[48px,1fr] items-start gap-4">
        {/* Numbered marker */}
        <div className="relative flex items-start justify-center pt-1">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
              isPrimary
                ? "bg-lime-400 text-black ring-4 ring-lime-400/25"
                : "bg-[#1e1e1e] text-lime-400 ring-2 ring-lime-400/70"
            }`}
          >
            {id}
          </div>
        </div>

        {/* Card */}
        <div
          className={`rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.35)] ${
            isPrimary ? "bg-lime-400 text-black" : "bg-[#2a2a2a]/95"
          }`}
        >
          <div className="p-4 md:p-5">
            <h4
              className={`text-sm font-semibold md:text-base ${
                isPrimary ? "text-black" : "text-lime-400"
              }`}
            >
              {title}
            </h4>
            <p
              className={`mt-1 text-xs md:text-sm ${
                isPrimary ? "text-black/70" : "text-gray-300"
              }`}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitItem;
