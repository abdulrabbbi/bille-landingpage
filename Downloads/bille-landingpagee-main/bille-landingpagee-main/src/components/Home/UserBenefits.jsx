import React from "react";
import { Wifi, MessageSquare, Presentation, Rss } from "lucide-react";
import { USER_BENEFITS_PLAYERS } from "../../images";

const UserBenefits = () => {
  const benefits = [
    {
      icon: <Wifi size={34} strokeWidth={1.6} />,
      title: "A Community in Your Hands",
      desc: "Lorem ipsum dolor sit amet consectetur. Eu ac congue risus sit a ipsum consectetur pretium. Libero.",
    },
    {
      icon: <MessageSquare size={34} strokeWidth={1.6} />,
      title: "A Community in Your Hands",
      desc: "Lorem ipsum dolor sit amet consectetur. Eu ac congue risus sit a ipsum consectetur pretium. Libero.",
    },
    {
      icon: <Presentation size={34} strokeWidth={1.6} />,
      title: "A Community in Your Hands",
      desc: "Lorem ipsum dolor sit amet consectetur. Eu ac congue risus sit a ipsum consectetur pretium. Libero.",
    },
    {
      icon: <Rss size={34} strokeWidth={1.6} />,
      title: "A Community in Your Hands",
      desc: "Lorem ipsum dolor sit amet consectetur. Eu ac congue risus sit a ipsum consectetur pretium. Libero.",
    },
  ];

  return (
    // full-bleed section (matches Hero full width behavior)
    <section
      className="relative w-full mt-16 overflow-hidden text-white"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #000000 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        {/* top-right lime stripes removed per design request */}

        {/* content */}
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
          {/* LEFT: players with lime background shape behind */}
          <div className="relative flex items-end justify-center md:justify-start">
            {/* lime angled band ONLY behind the players */}
            <div
              aria-hidden="true"
              className="absolute -left-8 sm:-left-12 md:-left-16 top-1/2 -translate-y-1/2 h-[120%] w-[115%] -z-10"
              style={{
                // triangular rounded band behind players (neutral, no green)
                clipPath:
                  "polygon(0% 12%, 72% 0%, 92% 18%, 78% 48%, 92% 78%, 66% 100%, 0% 92%)",
                background: "linear-gradient(135deg, #0b0b0b 0%, #070707 100%)",
                filter: "drop-shadow(0 30px 80px rgba(0,0,0,0.6))",
                borderRadius: "28px",
              }}
            />
            {/* rounded lime cap to mimic the curved tip */}
            <div
              aria-hidden="true"
              className="absolute left-[60%] top-[42%] h-24 w-24 sm:h-28 sm:w-28 -z-10"
              style={{
                borderRadius: "9999px",
                background:
                  "radial-gradient(closest-side, rgba(255,255,255,0.02) 70%, transparent)",
                transform: "rotate(-18deg)",
                filter: "blur(1px)",
              }}
            />
            {/* soft lime glow under feet */}
            <div
              aria-hidden="true"
              className="absolute left-[10%] bottom-6 h-36 w-56 -z-10"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 60%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.0) 70%)",
                filter: "blur(2px)",
              }}
            />

            <img
              src={USER_BENEFITS_PLAYERS}
              alt="Football players"
              className="w-[86%] sm:w-[78%] md:w-[92%] lg:w-[88%] max-w-[760px] h-auto object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
              loading="eager"
            />
          </div>

          {/* RIGHT: heading, paragraph, cards (right-aligned on md+) */}
          <div className="flex flex-col items-center md:items-end">
            <div className="w-full md:max-w-[520px] lg:max-w-[560px] text-center md:text-right">
              <h2 className="mb-3 text-accent font-extrabold leading-tight text-[clamp(1.75rem,3.6vw,2.8rem)]">
                User Benefits
              </h2>
              <p className="mx-auto md:mx-0 text-gray-300 text-sm sm:text-[15px] md:text-[15.5px]">
                Lorem ipsum dolor sit amet consectetur. Sit eleifend id sed
                pharetra vel ullamcorper sed aliquet. Lacus habitant tortor
                pulvinar pellentesque. Donec sed scelerisque nisi ut urna
                sagittis turpis posuere. Iaculis elementum netus duis
                ullamcorper eu semper egestas augue. Pretium dictumst donec
                morbi velit risus.
              </p>
            </div>

            <div className="mt-8 grid w-full grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 md:max-w-[560px]">
              {benefits.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#222222]/85 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.5)] hover:bg-[#2b2b2b]/90 transition relative overflow-hidden h-[170px]"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-10 -left-10 h-28 w-28 rounded-full bg-white/5 blur-xl"
                  />
                  <div className="text-accent mb-3 flex items-center justify-center md:justify-end">
                    {React.cloneElement(item.icon, {
                      size: 38,
                      strokeWidth: 1.8,
                    })}
                  </div>
                  <h3 className="text-accent text-sm sm:text-base font-semibold mb-2 text-center md:text-right">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-[13px] leading-relaxed text-center md:text-right">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* depth vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
    </section>
  );
};

export default UserBenefits;
