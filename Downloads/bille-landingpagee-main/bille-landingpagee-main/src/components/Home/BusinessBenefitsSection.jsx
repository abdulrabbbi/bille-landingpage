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
    // full-bleed section to match hero and user benefits styling
    <section
      className="relative w-full mt-12 overflow-hidden text-white"
      aria-label="Business benefits"
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 py-14 sm:py-16 md:py-20">
        <div className="mx-auto w-[99%] md:w-[98%] lg:w-[96%]">
          {/* long rounded lime band behind the heading (subtle) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-24 mx-auto rounded-full"
            style={{
              width: "85%",
              height: 56,
              background:
                "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(180,255,57,0.12) 25%, rgba(180,255,57,0.16) 50%, rgba(180,255,57,0.12) 75%, rgba(0,0,0,0) 100%)",
              filter: "blur(10px)",
            }}
          />

          {/* Heading + copy */}
          <div className="mb-10 text-center md:mb-12">
            <h2 className="mb-3 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-accent">
              Business Benefits
            </h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-[15px]">
              Lorem ipsum dolor sit amet consectetur. Nulla vestibulum pharetra
              ornare nec. In adipiscing etiam faucibus morbi sagittis dolor.
              Neque risus quisque magna vitae nunc tincidunt hendrerit bibendum
              libero. Nibh vestibulum sed non scelerisque accumsan ultricies
              neque. Iaculis sit lacus eu elementum sapien feugiat. Blandit diam
              pretium.
            </p>
          </div>

          {/* Content */}
          <div className="mt-10 grid grid-cols-1 items-start gap-10 md:mt-12 md:grid-cols-2">
            {/* Left: media card with lime band behind */}
            <div className="relative flex w-full items-center justify-center md:justify-start">
              {/* lime angled band */}
              <div
                aria-hidden="true"
                className="absolute -left-10 top-1/2 -translate-y-1/2 h-[120%] w-[120%] -z-10"
                style={{
                  clipPath:
                    "polygon(0% 14%, 68% 0%, 86% 16%, 74% 44%, 86% 76%, 64% 97%, 0% 90%)",
                  background:
                    "linear-gradient(135deg, #b4ff39 0%, #9aef22 40%, #79d300 100%)",
                  filter: "drop-shadow(0 30px 80px rgba(0,0,0,0.6))",
                  borderRadius: "24px",
                }}
              />

              <div className="w-full max-w-[640px] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-black/20">
                <img
                  src={BUSINESS_FRAME_221}
                  alt="People watching a football match"
                  className="h-auto w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Right: vertical timeline */}
            <div className="relative flex w-full flex-col items-center md:items-center">
              {/* lime spine */}
              <div className="pointer-events-none absolute left-8 top-2 bottom-2 w-[6px] rounded-full bg-gradient-to-b from-lime-400 via-lime-500 to-lime-600 md:left-8" />

              <div className="w-full max-w-md space-y-6 md:max-w-[560px]">
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
      </div>
    </section>
  );
};

export default BusinessBenefitsSection;
