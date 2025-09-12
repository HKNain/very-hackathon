import React, { useEffect, useState } from "react";
import NavbarDashboard from "../layout/NavbarDashboard";
import berry1 from "../png/berry1.png";
import berry2 from "../png/berry2.png";
import { api } from "../../utils/axios";

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

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const res = await api.get("/dashboard/achievements"); // Adjust API path as needed
        if (res.status === 200) {
          // res.data.userAchievements is an array of strings like ["mediumcrusher", ...]
          setAchievements(res.data.userAchievements || []);
        }
      } catch (error) {
        console.error("Failed to load achievements", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 z-10 w-full max-w-6xl">
          {loading
            ? Array(3)
                .fill({})
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="h-24 bg-gray-700 rounded-2xl animate-pulse"
                  />
                ))
            : achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="bg-black/50 border border-pink-500 rounded-2xl p-6 shadow hover:shadow-lg transition"
                >
                  <h2 className="text-2xl font-semibold text-white text-gradient mb-3 capitalize">
                    {achievement.replace(/([A-Z])/g, " $1")}
                  </h2>
                  <p className="text-gray-300 text-sm mb-2">
                    Achievement unlocked!
                  </p>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default Achievements;
