import React from "react";
import berry1 from "../png/berry1.png";
import berry2 from "../png/berry2.png";

const floatingPNGs = [berry1, berry2, berry1, berry2, berry1, berry2];

const getRandomPosition = () => {
  let top, left;
  do {
    top = Math.random() * 100;
    left = Math.random() * 100;
  } while (top > 40 && top < 60 && left > 30 && left < 70);

  return { top: `${top}%`, left: `${left}%` };
};

const Hero = () => {
  const randomPositions = floatingPNGs.map(() => ({
    ...getRandomPosition(),
    size: 125, // 40px – 100px
    duration: Math.random() * 6 + 6, // 6s – 12s
  }));

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center font-poppins 
                    bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] 
                    relative overflow-hidden"
    >
      {/* Floating Berries */}
      {floatingPNGs.map((png, i) => (
        <img
          key={i}
          src={png}
          alt={`floating-${i}`}
          className="absolute animate-floatGlow"
          style={{
            top: randomPositions[i].top,
            left: randomPositions[i].left,
            width: randomPositions[i].size,
            height: randomPositions[i].size,
            animationDuration: `${randomPositions[i].duration}s`,
            filter: "drop-shadow(0 0 20px rgba(236,72,153,0.6))",
          }}
        />
      ))}

      {/* Hero Text */}
      <h1
        className="text-7xl font-bold text-transparent bg-clip-text 
                     bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
                     drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] z-10"
      >
        Swasthya
      </h1>

      <h3 className="text-2xl text-gray-200 tracking-wide mt-4 z-10">
        Move. Earn. Evolve.
      </h3>

      {/* Buttons */}
      <div className="w-1/3 mt-10 flex flex-row justify-between items-center gap-6 z-10">
        <button
          className="bg-black border border-pink-500 h-12 w-1/2 rounded-full text-lg font-semibold 
                           text-white shadow-[0_0_15px_#ec4899] hover:shadow-[0_0_25px_#ec4899] 
                           transition-all duration-300"
        >
          Explore
        </button>
        <button
          className="h-12 w-1/2 rounded-full text-lg font-semibold text-white 
                           bg-gradient-to-r from-pink-500 to-blue-500 shadow-[0_0_20px_#3b82f6]
                           hover:shadow-[0_0_35px_#3b82f6] transition-all duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
