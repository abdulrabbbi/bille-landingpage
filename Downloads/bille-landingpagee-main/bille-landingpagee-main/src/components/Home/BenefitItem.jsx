import React from "react";

const BenefitItem = ({ id, title, description, isLast = false }) => {
  const isPrimary = id === 1;

  return (
    <div className="relative w-full">
      {/* vertical connector centered under marker (hidden for last) */}
      {!isLast && (
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-10 bottom-0 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-lime-400 via-lime-500 to-lime-600 opacity-90"
        />
      )}

      <div className="relative w-full">
        {/* centered marker */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
              isPrimary
                ? "bg-lime-400 text-black ring-4 ring-lime-400/25"
                : "bg-[#111827] text-lime-400 ring-2 ring-lime-400/70"
            }`}
          >
            {id}
          </div>
        </div>

        {/* Card placed below the marker */}
        <div
          className={`mt-6 rounded-[20px] shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition-colors w-full ${
            isPrimary ? "bg-lime-400 text-black" : "bg-[#0b0b0b]/80"
          }`}
        >
          <div className="p-5 md:p-6 min-h-[120px]">
            <h4
              className={`text-sm font-semibold md:text-base ${
                isPrimary ? "text-black" : "text-lime-400"
              }`}
            >
              {title}
            </h4>
            <p
              className={`mt-2 text-xs md:text-sm ${
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
