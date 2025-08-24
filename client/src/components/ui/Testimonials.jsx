import React from "react";
import testimonials from "../../data/testimonials.json";

const Testimonials = () => {
  return (
    <div className="w-full py-20 bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-black relative overflow-hidden z-10">
      <h2
        className="text-5xl font-bold text-transparent bg-clip-text 
                     bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
                     text-center drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] mb-12"
      >
        What People Say
      </h2>

      {/* Infinite Scroller */}
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-scroll px-6 hover:[animation-play-state:paused]">
          {/* Duplicate list twice for infinite effect */}
          {Array(2)
            .fill([...testimonials])
            .flat()
            .map((t, i) => (
              <div
                key={i}
                className="min-w-[300px] max-w-[350px] mx-6 p-6 rounded-2xl border border-pink-500/40 
                           bg-black/40 backdrop-blur-md shadow-[0_0_15px_#ec4899]/50 
                           hover:shadow-[0_0_25px_#ec4899] transition-all duration-300 
                           flex flex-col items-center text-center"
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mb-4 border-2 border-pink-500 shadow-[0_0_15px_#ec4899]"
                />
                <p className="text-gray-300 italic text-base mb-4">
                  "{t.feedback}"
                </p>
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                  {t.name}
                </h3>
                <span className="text-sm text-gray-400">{t.role}</span>
              </div>
            ))}
        </div>
      </div>
      <br />
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-scroll px-6 hover:[animation-play-state:paused]">
          {/* Duplicate list twice for infinite effect */}
          {Array(2)
            .fill([...testimonials])
            .flat()
            .map((t, i) => (
              <div
                key={i}
                className="min-w-[300px] max-w-[350px] mx-6 p-6 rounded-2xl border border-pink-500/40 
                           bg-black/40 backdrop-blur-md shadow-[0_0_15px_#ec4899]/50 
                           hover:shadow-[0_0_25px_#ec4899] transition-all duration-300 
                           flex flex-col items-center text-center"
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mb-4 border-2 border-pink-500 shadow-[0_0_15px_#ec4899]"
                />
                <p className="text-gray-300 italic text-base mb-4">
                  "{t.feedback}"
                </p>
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                  {t.name}
                </h3>
                <span className="text-sm text-gray-400">{t.role}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
