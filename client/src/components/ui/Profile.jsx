import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import berry1 from '../png/berry1.png';
import berry2 from '../png/berry2.png';
import NavbarDashboard from '../layout/NavbarDashboard';

const cardData = [
  {
    title: 'Challenges',
    route: '/challenges',
    info: 'Completed 5 out of 10 challenges',
  },
  {
    title: 'Achievements',
    route: '/achievements',
    info: 'Top Performer Badge unlocked',
  },
  {
    title: 'Badges',
    route: '/badges',
    info: 'Badge: Consistency',
  },
];

const floatingPNGs = [berry1, berry2, berry1, berry2, berry1, berry2];

const getRandomPosition = () => {
  let top, left;
  // Avoid central area (40-60% top, 30-70% left)
  do {
    top = Math.random() * 100;
    left = Math.random() * 100;
  } while (top > 40 && top < 60 && left > 30 && left < 70);
  return { top: `${top}%`, left: `${left}%` };
};

const Profile = () => {
  const navigate = useNavigate();
  const randomPositions = floatingPNGs.map(() => ({
    ...getRandomPosition(),
    size: 90 + Math.random() * 35, // 90px – 125px
    duration: Math.random() * 6 + 6, // 6s – 12s
  }));

  return (
    <>
    <NavbarDashboard/>
    <div
      className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] relative overflow-hidden flex flex-row justify-center items-center pt-32
      style={{ fontFamily: 'Poppins, sans-serif' }}"
    >
      {/* Floating Berries, rendered behind everything */}
      {floatingPNGs.map((png, i) => (
        <img
          key={i}
          src={png}
          alt={`floating-${i}`}
          className="absolute animate-floatGlow pointer-events-none"
          style={{
            ...randomPositions[i],
            width: randomPositions[i].size,
            height: randomPositions[i].size,
            animationDuration: `${randomPositions[i].duration}s`,
            filter: 'drop-shadow(0 0 20px rgba(236,72,153,0.6))',
            zIndex: 1
          }}
        />
      ))}

      {/* Sidebar */}
      <div className="min-h-screen w-1/5 flex flex-col justify-between items-center p-4 z-10">
        <div className="w-full flex flex-col items-center mt-8 mb-8 bg-black/70 rounded-xl shadow-lg p-4">
          <div className="h-24 w-24 mb-4 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
            <img
              className="h-full w-full object-cover rounded-lg"
              src="https://i.pravatar.cc/300"
              alt="Profile"
            />
          </div>
          <div className="w-full text-white text-xl font-bold text-center mb-2">
            username
          </div>
          <div className="w-full text-white text-base text-center mb-6">
            email@example.com
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 mb-8 bg-black/70 rounded-xl shadow-lg p-4">
          <button className="bg-pink-600/80 w-full rounded-full py-2 text-white font-semibold shadow-md">
            Delete Account
          </button>
          <button className="bg-pink-600/80 w-full rounded-full py-2 text-white font-semibold shadow-md">
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content area with smaller cards and larger heatmap placeholder */}
      <div className="min-h-screen w-4/5 p-8 grid grid-cols-2 grid-rows-[1fr_1fr_2fr] gap-8 z-10">
        {/* Cards */}
        {cardData.map((card) => (
          <div
            key={card.title}
            className="bg-black/60 border border-white/20 rounded-xl p-4 flex flex-col justify-between shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-white text-xl font-semibold">{card.title}</span>
              <button
                onClick={() => navigate(card.route)}
                className="flex items-center justify-center"
                aria-label={`Go to ${card.title}`}
              >
                <ArrowRight className="text-pink-400 w-6 h-6" />
              </button>
            </div>
            <div className="mt-2 text-white/90 text-md">{card.info}</div>
          </div>
        ))}

        {/* Heatmap placeholder, bigger and flexible */}
        <div className="bg-black/50 border border-white/20 col-span-2 h-full rounded-xl flex flex-col items-center justify-center text-white text-2xl shadow-xl min-h-[300px]">
          Heatmap placeholder
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
