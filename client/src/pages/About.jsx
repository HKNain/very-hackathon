import React from "react";
import Navbar from "../components/layout/Navbar.jsx";
import berry1 from "../components/png/berry1.png"
import berry2 from "../components/png/berry2.png"
import { useMemo } from "react";

const floatingPNGs = [
  berry1,
  berry2,
  berry1,
  berry2,
  berry1,
  berry2,
  berry1,
  berry2,
];

const getRandomPosition = () => {
  let top, left;
  do {
    top = Math.random() * 100;
    left = Math.random() * 100;
  } while (top > 40 && top < 60 && left > 30 && left < 70);

  return { top: `${top}%`, left: `${left}%` };
};


const About = () => {
  const randomPositions = useMemo(() => {
    return floatingPNGs.map(() => ({
      ...getRandomPosition(),
      size: Math.random() * 60 + 40,
      duration: Math.random() * 6 + 6,
    }));
  }, []);
  return (
    <>
      <Navbar />
     
      <div
        className="min-h-screen w-full flex flex-col justify-center items-center font-poppins
                    bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] 
                    px-8 py-24 text-center text-gray-300 relative z-10 "
      >
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
        <h1
          className="text-6xl font-bold text-transparent bg-clip-text 
                     bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
                     drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] mb-8 mt-8"
        >
          About Swasthya
        </h1>

        <p className="max-w-4xl z-20 text-lg leading-relaxed mb-10">
          Swasthya is a revolutionary platform dedicated to empowering
          individuals to move, earn, and evolve. We combine cutting-edge
          technology with incentives to keep you motivated on your health
          journey. Whether you're a fitness enthusiast, a casual mover, or just
          starting out, Swasthya tailors the experience to meet your needs.
        </p>

        <p className="max-w-4xl  z-20 text-lg leading-relaxed mb-10">
          Our mission is to make health accessible and rewarding by merging
          community support, personalized insights, and gamified rewards that
          inspire lasting change. Join us to be part of a vibrant movement
          towards wellness.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 max-w-4xl mt-12">
          <div
            className="flex flex-col items-center p-6 rounded-2xl border border-pink-500/40 
                        bg-black/40 backdrop-blur-md shadow-[0_0_15px_#ec4899] max-w-xs"
          >
            <div className="text-4xl mb-4 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
              🌟
            </div>
            <h3
              className="text-2xl font-semibold text-transparent bg-clip-text 
                         bg-gradient-to-r  z-20 from-pink-400 to-blue-400 mb-2"
            >
              Vision
            </h3>
            <p className="text-gray-300  z-20">
              To create a healthier world where everyone is motivated to move
              and thrive.
            </p>
          </div>

          <div
            className="flex flex-col items-center p-6 rounded-2xl border border-pink-500/40 
                        bg-black/40 backdrop-blur-md shadow-[0_0_15px_#ec4899] max-w-xs"
          >
            <div className="text-4xl mb-4 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]  z-20">
              🤝
            </div>
            <h3
              className="text-2xl font-semibold text-transparent bg-clip-text 
                         bg-gradient-to-r from-pink-400 to-blue-400 mb-2  z-20"
            >
              Mission
            </h3>
            <p className="text-gray-300  z-20">
              Empower people by combining technology, community, and rewards for
              lasting wellness.
            </p>
          </div>

          <div
            className="flex flex-col items-center p-6 rounded-2xl border border-pink-500/40 
                        bg-black/40 backdrop-blur-md shadow-[0_0_15px_#ec4899] max-w-xs"
          >
            <div className="text-4xl mb-4 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
              🚀
            </div>
            <h3
              className="text-2xl font-semibold text-transparent bg-clip-text 
                         bg-gradient-to-r from-pink-400 to-blue-400 mb-2"
            >
              Values
            </h3>
            <p className="text-gray-300">
              Innovation, inclusivity, and integrity to build a motivating
              health experience.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
