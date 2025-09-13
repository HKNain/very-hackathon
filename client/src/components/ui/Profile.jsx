import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import berry1 from "../png/berry1.png";
import berry2 from "../png/berry2.png";
import NavbarDashboard from "../layout/NavbarDashboard";
import { api } from "../../utils/axios";
import toast from "react-hot-toast";
import useLoginDates from "../../hooks/Heatmap";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const cardData = [
  { title: "Challenges", route: "/dashboard", info: "See all your challenges" },
  { title: "Achievements", route: "/achievements", info: "See all your achievements" },
];

const floatingPNGs = [berry1, berry2, berry1, berry2, berry1, berry2];

const getRandomPosition = () => {
  let top, left;
  do {
    top = Math.random() * 100;
    left = Math.random() * 100;
  } while (top > 40 && top < 60 && left > 30 && left < 70);
  return { top: `${top}%`, left: `${left}%` };
};

const Profile = () => {
  const navigate = useNavigate();
const [username, setUsername] = useState("");
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [profileURL, setProfileURL] = useState("");

  const randomPositions = floatingPNGs.map(() => ({
    ...getRandomPosition(),
    size: 90 + Math.random() * 35,
    duration: Math.random() * 6 + 6,
  }));

useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/dashboard/profile");
        if (res.status === 200) {
          setUsername(res.data.userName);
          setPoints(res.data.totalCoins ?? 0);
          setStreak(res.data.regularlyComingToWebsiteDays ?? 0);
          setProfileURL(res.data.userprofileURL);
        }
      } catch (err) {
        console.error("Profile fetch error", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/api/auth/accountdelete");
      toast.success("Account Deleted Successfully");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const loginDates = useLoginDates();
  const heatmapData = loginDates.map((date) => ({ date, count: 1 }));

  useEffect(() => {
    api
      .get("/dashboard/streak", { withCredentials: true })
      .then((res) => setStreak(res.data.regularlyComingToWebsiteDays))
      .catch(() => setStreak(0));
  }, []);

  return (
    <>
      <NavbarDashboard />
      <div
        className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] relative overflow-hidden flex flex-row pt-32"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* Floating Berries */}
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

        {/* Left Sidebar */}
        <div className="w-1/5 min-h-screen flex flex-col justify-between items-center p-4 z-10">
          {/* Top: Profile Info */}
          <div className="w-full flex flex-col items-center bg-black/70 rounded-xl shadow-lg p-4">
            <div className="h-24 w-24 mb-4 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
              <img
                className="h-full w-full object-cover rounded-lg"
                src={profileURL}
                alt="Profile"
              />
            </div>
            <div className="text-white text-xl font-bold text-center mb-2">
              {username}
            </div>
            <div className="text-white">Points: {points}</div>
            <div className="text-white mt-1">Streak: {streak}</div>
          </div>

          {/* Bottom: Buttons */}
          <div className="w-full flex flex-col gap-4 bg-black/70 rounded-xl shadow-lg p-4 mt-8">
            <button
              className="bg-pink-600/80 w-full rounded-full py-2 text-white font-semibold shadow-md"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
            <button
              className="bg-pink-600/80 w-full rounded-full py-2 text-white font-semibold shadow-md"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="w-4/5 min-h-screen flex flex-col p-8 gap-8 z-10">
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          </div>

          {/* Heatmap */}
          <div className="flex-1 bg-black/50 border border-white/20 rounded-xl p-6 shadow-xl">
            <CalendarHeatmap
              startDate={new Date(new Date().getFullYear(), 0, 1)}
              endDate={new Date(new Date().getFullYear(), 11, 31)}
              values={heatmapData}
              classForValue={(value) =>
                !value
                  ? "color-empty"
                  : value.count === 1
                  ? "color-visited"
                  : "color-empty"
              }
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
