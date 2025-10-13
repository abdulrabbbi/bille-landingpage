import React from "react";
import {
  APP_PHONE_MOCK,
  GOOGLE_PLAY_BADGE,
  APPLE_STORE_BADGE,
} from "../../images";

const AppPromoSection = () => {
  return (
    <section className="w-full bg-black py-10 sm:py-14 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Card */}
        <div className="relative grid grid-cols-1 items-center gap-10 rounded-[28px] bg-[#3a3a3a] px-5 py-8 sm:px-8 sm:py-10 md:grid-cols-2 md:px-10 md:py-12 lg:gap-14 shadow-[0_18px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
          {/* LEFT: phone mockups */}
          <div className="relative mx-auto h-[260px] w-full max-w-[440px] sm:h-[300px] md:h-[330px] lg:h-[360px]">
            {/* soft glow behind phones */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(0,0,0,0.25), rgba(0,0,0,0) 70%)",
                filter: "blur(6px)",
              }}
            />
            {/* left phone */}
            <img
              src={APP_PHONE_MOCK}
              alt="App phone preview"
              className="absolute right-[8%] top-[12%] h-[82%] w-auto rotate-[10deg] drop-shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
              loading="eager"
            />
          </div>

          {/* RIGHT: content */}
          <div className="text-center md:text-left">
            <h3 className="text-lime-400 font-extrabold leading-tight text-[clamp(1.4rem,3.2vw,2.2rem)]">
              Lorem ipsum dolor sit amet <br className="hidden sm:block" />
              consectetur. Non.
            </h3>

            <p className="mt-3 max-w-[580px] text-[13px] sm:text-sm leading-relaxed text-gray-200/90 md:mt-4">
              Lorem ipsum dolor sit amet consectetur. Nunc tempus massa a odio
              blandit volutpat amet. Euismod ante porttitor volutpat non lectus
              nec etiam pellentesque. Vivamus eget cras id massa tempus
              facilisis id porta eu eget. Sit consequat ornare amet nec
              habitasse molestie tellus nunc aliquet malesuada in gravida sit
              aliquam facilisis.
            </p>

            {/* store badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
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
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.04] via-transparent to-black/20" />
        </div>
      </div>
    </section>
  );
};

export default AppPromoSection;
