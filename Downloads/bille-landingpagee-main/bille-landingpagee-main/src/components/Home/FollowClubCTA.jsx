import React from "react";
import { FOLLOW_LEFT_PLAYER, FOLLOW_RIGHT_PLAYER } from "../../images";

const FollowClubCTA = () => {
  return (
    <section className="relative w-full py-10 sm:py-12 md:py-16 overflow-visible">
      <div className="relative mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8">
        {/* Lime banner acts as the anchor for the side players */}
        <div className="relative mx-auto w-[99%] md:w-[98%] lg:w-[96%] rounded-[40px] bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600 px-6 py-9 sm:px-10 sm:py-12 md:px-14 md:py-16 text-center shadow-[0_32px_96px_rgba(0,0,0,0.7)] overflow-visible">
          {/* Players hugging the card edges */}
          <img
            src={FOLLOW_LEFT_PLAYER}
            alt="Player left"
            className="pointer-events-none select-none absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 h-[220px] sm:h-[260px] md:h-[340px] lg:h-[380px] object-contain drop-shadow-[0_36px_100px_rgba(0,0,0,0.8)] z-30"
            aria-hidden="true"
          />
          <img
            src={FOLLOW_RIGHT_PLAYER}
            alt="Player right"
            className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 h-[230px] sm:h-[270px] md:h-[360px] lg:h-[400px] object-contain drop-shadow-[0_36px_100px_rgba(0,0,0,0.8)] z-30"
            aria-hidden="true"
          />

          {/* watermark circle (subtle, like the mock) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[120%] w-[60%] rounded-full opacity-[0.12]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.06), rgba(255,255,255,0) 70%)",
              filter: "blur(12px)",
            }}
          />

          <h3 className="relative z-40 text-black text-[clamp(1.5rem,3.2vw,2.2rem)] font-extrabold">
            Start following you club for
          </h3>
          <h3 className="relative z-40 text-black text-[clamp(1.5rem,3.2vw,2.2rem)] font-extrabold -mt-1">
            current updates
          </h3>

          <p className="relative z-40 mx-auto mt-4 max-w-3xl text-[13px] sm:text-sm leading-relaxed text-black/80">
            Lorem ipsum dolor sit amet consectetur. A nibh aliquet ultricies
            fringilla magna ultricies feugiat eu arcu at nisl. Laoreet lacus
            convallis viverra. Nec risus lacinia ultrices eget cras id massa
            massa turpis. Euismod proin fermentum pellentesque posuere lacus.
            Tellus sed porttitor tellus varius malesuada. Pellentesque mi at.
          </p>

          <button className="relative z-40 mt-6 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/90 shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
            Download App Now
          </button>
        </div>

        {/* Spacer so players don't overlap next section on small screens */}
        <div className="h-24 sm:h-28 md:h-32" />
      </div>
    </section>
  );
};

export default FollowClubCTA;
