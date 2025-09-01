import React from "react";
import NavbarDashboard from "../components/layout/NavbarDashboard";
import berry1 from "../components/png/berry1.png";
import berry2 from "../components/png/berry2.png";

const floatingPNGs = [berry1, berry2, berry1, berry2, berry1, berry2];
const getRandomPosition = () => {
  let top, left;
  do {
    top = Math.random() * 100;
    left = Math.random() * 100;
  } while (top > 40 && top < 60 && left > 30 && left < 70);
  return { top: `${top}%`, left: `${left}%` };
};

const normalChallenges = [
  { id: 1, title: "10k Steps", desc: "Walk 10,000 steps" },
  { id: 2, title: "Drink Water", desc: "Drink 2L water" },
  { id: 3, title: "Meditate", desc: "Meditate 15 min" },
  { id: 4, title: "Healthy Meal", desc: "Eat green veg" },
  { id: 5, title: "Sleep", desc: "8 hours sleep" },
];

const activeChallenges = [
  { id: 101, title: "Morning Run", streak: 5, achieved: 3, notAchieved: 2 },
  { id: 102, title: "Yoga", streak: 10, achieved: 8, notAchieved: 2 },
  { id: 103, title: "HIIT Blast", streak: 4, achieved: 4, notAchieved: 0 },
  { id: 104, title: "Vegan Diet", streak: 7, achieved: 5, notAchieved: 2 },
  { id: 105, title: "Read Book", streak: 2, achieved: 2, notAchieved: 0 },
  { id: 106, title: "Meditation", streak: 12, achieved: 10, notAchieved: 2 },
  { id: 107, title: "Cycle Ride", streak: 8, achieved: 6, notAchieved: 2 },
  { id: 108, title: "Swimming", streak: 6, achieved: 4, notAchieved: 2 },
];

const Dashboard = () => {
  const randomPositions = floatingPNGs.map(() => ({
    ...getRandomPosition(),
    size: 90 + Math.random() * 35,
    duration: Math.random() * 6 + 6,
  }));

  const StreakBar = ({ streak }) => (
    <div className="w-full h-5 rounded bg-white/20 overflow-hidden relative">
      <div
        className="h-full bg-gradient-to-r from-pink-400 to-blue-400 rounded"
        style={{ width: `${Math.min(streak * 8, 100)}%` }}
      />
      <span className="absolute left-2 top-0 text-xs text-white font-semibold">
        {streak} day streak
      </span>
    </div>
  );

  return (
    <>
      <NavbarDashboard />
      <div
        className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] relative overflow-hidden pt-32 px-6 gap-8 flex flex-col"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {floatingPNGs.map((png, i) => (
          <img
            key={i}
            src={png}
            alt={`floating-${i}`}
            className="absolute animate-floatGlow pointer-events-none opacity-60"
            style={{
              ...randomPositions[i],
              width: randomPositions[i].size,
              height: randomPositions[i].size,
              animationDuration: `${randomPositions[i].duration}s`,
              filter: "drop-shadow(0 0 20px rgba(236,72,153,0.6))",
              zIndex: 1,
            }}
          />
        ))}

        {/* Top Row: Normal Challenges + Calendar */}
        <div className="relative z-10 w-full flex flex-row gap-6">
          <div className="flex-1 flex overflow-x-auto gap-4 pb-2">
            {normalChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="min-w-[180px] h-[80px] bg-black/40 border border-white/20 rounded-xl p-3 flex flex-col justify-between shadow-lg backdrop-blur-md cursor-pointer text-white hover:scale-105 transition-transform"
              >
                <div className="font-bold">{challenge.title}</div>
                <div className="text-xs">{challenge.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex-shrink-0 w-[320px] bg-black/40 border border-white/20 rounded-xl h-[120px] flex items-center justify-center shadow-lg backdrop-blur-md text-white">
            <span>Calendar (Coming Soon)</span>
          </div>
        </div>

        {/* Active Challenges Grid + Trending Section */}
        <div className="relative z-10 w-full flex flex-row gap-6">
          {/* Active Challenges Grid 3 per row in flex-1 */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-black/60 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col gap-5 backdrop-blur-lg transition-all hover:scale-105 duration-200 text-white"
              >
                <div className="text-center font-bold text-2xl mb-2">
                  {challenge.title}
                </div>
                <div className="flex flex-row justify-between gap-5">
                  <div className="flex-1 bg-black/40 rounded-xl p-3 text-center border border-white/20 shadow">
                    <div className="font-semibold">Achieved</div>
                    <div>{challenge.achieved}</div>
                  </div>
                  <div className="flex-1 bg-black/40 rounded-xl p-3 text-center border border-white/20 shadow">
                    <div className="font-semibold">Not Achieved</div>
                    <div>{challenge.notAchieved}</div>
                  </div>
                </div>
                <StreakBar streak={challenge.streak} />
                <div className="flex flex-row justify-between mt-2 gap-4">
                  <button className="flex-1 rounded-lg p-2 bg-pink-500/90 font-bold shadow border-none hover:bg-pink-600 transition-all">
                    Edit
                  </button>
                  <button className="flex-1 rounded-lg p-2 bg-red-500/90 font-bold shadow border-none hover:bg-red-600 transition-all">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Trending Placeholder */}
          <div className="flex-shrink-0 w-[320px] bg-black/40 border border-white/20 rounded-xl h-auto min-h-[480px] flex items-center justify-center shadow-lg backdrop-blur-md text-white font-semibold text-xl">
            Trending
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
