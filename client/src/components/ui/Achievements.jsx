import React from "react";
import NavbarDashboard from "../layout/NavbarDashboard";
import berry1 from "../png/berry1.png";
import berry2 from "../png/berry2.png";
import goals from "../../data/achievements.json"; // 📥 Import JSON

const floatingPNGs = [berry1, berry2, berry1, berry2, berry1, berry2];

const getRandomPosition = () => {
  let top, left;
  do {
    top = Math.random() * 100;
    left = Math.random() * 100;
  } while (top > 40 && top < 60 && left > 30 && left < 70);

  return { top: `${top}%`, left: `${left}%` };
};

const Achievements = () => {
  const randomPositions = floatingPNGs.map(() => ({
    ...getRandomPosition(),
    size: 120,
    duration: Math.random() * 6 + 6, // 6-12s floating
  }));

  return (
    <>
      <NavbarDashboard />
      <div
        className="min-h-screen w-full flex flex-col justify-center items-center font-poppins 
                    bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] 
                    relative overflow-hidden px-10 py-32"
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

        {/* Page Title */}
        <h1
          className="text-6xl font-bold text-transparent bg-clip-text 
                     bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
                     drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] z-10"
        >
          Achievements
        </h1>
        <h3 className="text-xl text-gray-200 mt-3 mb-10 tracking-wide z-10">
          Track your fitness goals & progress
        </h3>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 z-10 w-full max-w-6xl">
          {goals.map((goal, idx) => (
            <div
              key={idx}
              className="bg-black/50 border border-pink-500 rounded-2xl p-6 shadow-[0_0_20px_#ec4899]
                         hover:shadow-[0_0_35px_#ec4899] transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text 
                             bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 mb-3">
                {goal.title}
              </h2>
              <p className="text-gray-300 text-sm mb-2">{goal.description}</p>
              <p className="text-pink-400 font-bold">Duration: {goal.days} days</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Achievements;
