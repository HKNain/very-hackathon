import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import berry1 from "../png/berry1.png";
import berry2 from "../png/berry2.png";
import NavbarDashboard from "../layout/NavbarDashboard";
import { api } from "../../utils/axios";
import toast from "react-hot-toast"
import useLoginDates from "../../hooks/Heatmap";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";


const cardData = [
  {
    title: "Challenges",
    route: "/dashboard",
    info: "See all your challenges",
  },
  {
    title: "Achievements",
    route: "/achievements",
    info: "See all your achievements",
  },
  {
    title: "Badges",
    route: "/badges",
    info: "See all your badges",
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
  const [achievements, setAchievements] = useState([]);
  const [taskHistory, setTaskHistory] = useState([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  const randomPositions = floatingPNGs.map(() => ({
    ...getRandomPosition(),
    size: 90 + Math.random() * 35, // 90px – 125px
    duration: Math.random() * 6 + 6, // 6s – 12s
  }));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const achRes = await api
          .get("/dashboard/achievements")
          .catch(() => ({}));
        // controller may respond in different shapes — try common fields
        const userAchievements =
          achRes?.data?.userAchievements ||
          achRes?.data?.Achievements ||
          achRes?.data?.achievements ||
          [];
        const userHistory =
          achRes?.data?.userHistoryTask || achRes?.data?.taskHistory || [];
        setAchievements(
          Array.isArray(userAchievements) ? userAchievements : []
        );
        setTaskHistory(Array.isArray(userHistory) ? userHistory : []);

        // totalCoins might be available inside achievements response or need a dedicated endpoint.
        // try common fields
        const coins =
          achRes?.data?.totalCoins || achRes?.data?.user?.totalCoins || 0;
        setTotalCoins(coins);
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout"); 
      // Optionally clear local storage/session if needed
      navigate("/login"); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const loginDates = useLoginDates();

  const heatmapData = loginDates.map((date) => ({
    date,
    count: 1,
  }));

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/api/auth/accountdelete");
      toast.success("Account Deleted Successfully");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
      // Fetch the user's streak from the backend
      api
        .get("/dashboard/streak", { withCredentials: true }) 
        .then((res) => {
          setStreak(res.data.regularlyComingToWebsiteDays || 0);
        })
        .catch(() => {
          setStreak(0);
        });
    }, []);

  return (
    <>
      <NavbarDashboard />
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
              filter: "drop-shadow(0 0 20px rgba(236,72,153,0.6))",
              zIndex: 1,
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
            <div className="text-white">Coins: {totalCoins}</div>
            <div className="text-white mt-1">Streak: {streak}</div>
          </div>
          <div className="w-full flex flex-col gap-4 mb-8 bg-black/70 rounded-xl shadow-lg p-4">
            <button className="bg-pink-600/80 w-full rounded-full py-2 text-white font-semibold shadow-md" onClick={handleDeleteAccount}>
              Delete Account
            </button>
            <button className="bg-pink-600/80 w-full rounded-full py-2 text-white font-semibold shadow-md" onClick={handleLogout}>
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
                <span className="text-white text-xl font-semibold">
                  {card.title}
                </span>
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
          <div className="bg-black/50 border border-white/20 col-span-2 h-full rounded-xl flex flex-col items-start justify-start text-white p-6 shadow-xl min-h-[300px]">
            <CalendarHeatmap
              startDate={new Date(new Date().getFullYear(), 0, 1)}
              endDate={new Date(new Date().getFullYear(), 11, 31)}
              values={heatmapData}
              classForValue={(value) => {
                if (!value) return "color-empty";
                return value.count === 1 ? "color-visited" : "color-empty";
              }}
            />
            <style>{`
              .color-empty { fill: #e0e0e0; }
              .color-visited { fill: #22c55e; }
            `}</style>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
