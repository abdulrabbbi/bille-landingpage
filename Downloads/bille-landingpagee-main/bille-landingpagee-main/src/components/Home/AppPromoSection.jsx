import React from "react";
import {
  APP_PHONE_MOCK,
  GOOGLE_PLAY_BADGE,
  APPLE_STORE_BADGE,
} from "../../images";

const AppPromoSection = () => {
  return (
    <section className="relative w-full overflow-hidden py-10 sm:py-14 md:py-16">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8">
        {/* Card */}
        <div className="relative grid grid-cols-1 items-center gap-10 rounded-[36px] bg-[#2f2f2f] px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-2 md:px-12 md:py-14 lg:gap-16 shadow-2xl ring-1 ring-black/20">
          {/* LEFT: phone mockups */}
          <div className="relative mx-auto h-[280px] w-full max-w-[480px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
            {/* soft glow behind phones */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(0,0,0,0.35), rgba(0,0,0,0) 70%)",
                filter: "blur(12px)",
              }}
            />
            {/* left phone */}
            <img
              src={APP_PHONE_MOCK}
              alt="App phone preview"
              className="absolute -left-6 top-[6%] h-[90%] w-auto -rotate-6 drop-shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
              loading="eager"
            />
          </div>

          {/* RIGHT: content */}
          <div className="text-center md:text-left">
            <h3 className="text-accent font-extrabold leading-tight text-[clamp(1.6rem,3.6vw,2.6rem)]">
              Lorem ipsum dolor sit amet <br className="hidden sm:block" />
              consectetur. Non.
            </h3>

            <p className="mt-4 max-w-[640px] text-[13px] sm:text-sm leading-relaxed text-gray-200/90 md:mt-5">
              Lorem ipsum dolor sit amet consectetur. Nunc tempus massa a odio
              blandit volutpat amet. Euismod ante porttitor volutpat non lectus
              nec etiam pellentesque. Vivamus eget cras id massa tempus
              facilisis id porta eu eget. Sit consequat ornare amet nec
              habitasse molestie tellus nunc aliquet malesuada in gravida sit
              aliquam facilisis.
            </p>

            {/* store badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {/* Download App Section */}
              <div className="mt-4 md:mt-0 flex flex-col">
                <p className="text-sm mb-2 font-medium">Download app now</p>
                <div className="flex gap-2">
                  {/* Apple Store */}
                  <div className="px-3 py-2 bg-black text-white flex items-center text-sm gap-2 rounded-md w-fit">
                    <img
                      src={APPLE_STORE_BADGE}
                      alt="App Store"
                      className="h-6 w-6"
                    />
                    <div className="leading-tight">
                      <p className="text-[10px] text-gray-300">
                        Download on the
                      </p>
                      <p className="text-sm font-medium">App Store</p>
                    </div>
                  </div>

                  {/* Google Play */}
                  <div className="px-3 py-2 bg-black text-white flex items-center text-sm gap-2 rounded-md w-fit">
                    <img
                      src={GOOGLE_PLAY_BADGE}
                      alt="Google Play"
                      className="h-6 w-6"
                    />
                    <div className="leading-tight">
                      <p className="text-[10px] text-gray-300">Get it on</p>
                      <p className="text-sm font-medium">Google Play</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* rounded-card vignette */}
          <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-b from-white/[0.03] via-transparent to-black/25" />
        </div>
      </div>
    </section>
  );
};

export default AppPromoSection;
