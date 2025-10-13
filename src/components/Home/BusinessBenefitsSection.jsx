import React from "react";
import BenefitItem from "./BenefitItem";
import { BUSINESS_FRAME_221 } from "../../images";

const benefitsData = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet consectetur. Curabitur praesent tincidunt commodo et facilisis lobortis libero pretium accumsan.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet consectetur. Curabitur praesent tincidunt commodo et facilisis lobortis libero pretium accumsan.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet consectetur. Curabitur praesent tincidunt commodo et facilisis lobortis libero pretium accumsan.",
  },
];

const BusinessBenefitsSection = () => {
  return (
    <section className="relative bg-black text-white px-4 py-14 sm:px-6 md:px-8 md:py-16">
      {/* top subtle lime glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-40 w-[70%] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(180,255,57,0.18), rgba(180,255,57,0) 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Heading + copy */}
        <div className="mb-10 text-center md:mb-12">
          <h2 className="mb-3 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-lime-400">
            Business Benefits
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-[15px]">
            Lorem ipsum dolor sit amet consectetur. Nulla vestibulum pharetra
            ornare nec. In adipiscing etiam faucibus morbi sagittis dolor. Neque
            risus quisque magna vitae nunc tincidunt hendrerit bibendum libero.
            Nibh vestibulum sed non scelerisque accumsan ultricies neque. Iaculis
            sit lacus eu elementum sapien feugiat. Blandit diam pretium.
          </p>
        </div>

        {/* Content */}
        <div className="mt-10 grid grid-cols-1 items-start gap-10 md:mt-12 md:grid-cols-2">
          {/* Left: media card */}
          <div className="flex w-full items-center justify-center md:justify-start">
            <div className="w-full max-w-[560px] overflow-hidden rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
              <img
                src={BUSINESS_FRAME_221}
                alt="People watching a football match"
                className="h-auto w-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          {/* Right: vertical timeline */}
          <div className="relative flex w-full flex-col items-center md:items-start">
            {/* lime spine */}
            <div className="pointer-events-none absolute left-6 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-lime-400 via-lime-500 to-lime-600 md:left-6" />

            <div className="w-full max-w-md space-y-6 md:max-w-[520px]">
              {benefitsData.map((b, i) => (
                <BenefitItem
                  key={b.id}
                  id={b.id}
                  title={b.title}
                  description={b.description}
                  isLast={i === benefitsData.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessBenefitsSection;
