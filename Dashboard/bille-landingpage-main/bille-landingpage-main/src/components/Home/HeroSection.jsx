import React from "react";
import { ArrowRight } from "lucide-react";
import { HERO_BG } from "../../images";

// A responsive, production-ready hero with consistent diagonal angles
const HeroSection = () => {
  return (
    <section
      className="relative w-full overflow-hidden bg-black text-white"
      aria-label="Hero"
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8">
        {/* Top visual area */}
        <header className="relative">
          <figure className="relative w-full select-none">
            {/* Aspect controls keep image scaling smooth across breakpoints */}
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9] overflow-hidden rounded-t-[28px]">
              <img
                src={HERO_BG}
                alt="Football player in action"
                className="h-full w-full object-cover object-center md:object-right"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </figure>

          {/* Content overlaps image with generous spacing; no clipping */}
          <div
            className="relative sm:absolute inset-x-0 top-[48%] sm:top-[54%] md:top-[52%] lg:top-[50%] -mt-12 sm:mt-0"
            style={{
              // Single source of truth for angle in both top card and stats
              // Reduced value so the diagonal reads better on narrow screens
              "--hero-cut": "10%",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-6 sm:gap-8 lg:gap-10">
              {/* Text card */}
              <div className="relative order-2 md:order-1">
                <div
                  className="text-center md:text-left rounded-[28px] bg-[#161616]/95 p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl"
                  style={{
                    clipPath:
                      "polygon(0 var(--hero-cut), 86% calc(var(--hero-cut) + 22%), 86% 100%, 0% 100%)",
                  }}
                >
                  <span className="mb-5 inline-block rounded-full bg-accent px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-black">
                    Lorem ipsum
                  </span>

                  <h1 className="mb-3 font-extrabold leading-snug text-accent text-[clamp(1.6rem,3.4vw,3.5rem)]">
                    Lorem ipsum <br className="hidden md:block" />
                    dolor sit amet consectetur.
                  </h1>

                  <p className="max-w-2xl text-gray-300 text-sm sm:text-[15px] md:text-[16px] lg:text-[17px]">
                    Lorem ipsum dolor sit amet consectetur. Mi donec morbi
                    aliquam quam tempor enim porta arcu ipsum. Turpis pharetra
                    mauris a molestie nullam imperdiet feugiat. Ultricies ut
                    pellentesque ac aliquam et morbi.
                  </p>

                  {/* Actions: equal height buttons with hover/focus states */}
                  <div className="mt-6 sm:mt-7 md:mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
                    <button
                      type="button"
                      className="inline-flex h-11 md:h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 md:px-6 text-sm sm:text-base font-medium text-black transition-colors hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                    >
                      Download App <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 md:h-12 items-center justify-center rounded-md border border-accent px-5 md:px-6 text-sm sm:text-base font-medium text-accent transition-colors hover:bg-accent hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>

              {/* Right column used for balance and to avoid text/image overlap */}
              <div className="order-1 md:order-2 min-h-[1px]" />
            </div>
          </div>
        </header>

        {/* Bottom stats - angles match via the shared --hero-cut */}
        <div className="mt-4 sm:mt-6 md:mt-40 md:ml-96 relative z-20 flex flex-wrap items-stretch justify-center md:justify-start gap-4 sm:gap-5 pb-8 sm:pb-10">
          {/* Spacer to visually align under the left text card on md+ */}
          <div className="hidden w-[26%] md:block" />

          {[0, 1].map((i) => (
            <div
              key={i}
              className="basis-[44%] sm:basis-[38%] md:basis-auto rounded-2xl bg-[#111111] px-6 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-7 shadow-lg"
              style={{
                clipPath:
                  "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%, 0% var(--hero-cut))",
              }}
            >
              <h3 className="leading-none font-extrabold text-accent text-[clamp(1.75rem,4.2vw,3rem)] tracking-tight">
                100
              </h3>
              <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-gray-300">
                Lorem ipsum dolor sit
              </p>
            </div>
          ))}
        </div>

        {/* Subtle vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-accent/5"
        />
      </div>
    </section>
  );
};

export default HeroSection;
