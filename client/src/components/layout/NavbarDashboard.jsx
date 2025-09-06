import React, { useEffect, useState } from "react";
import veryLogo from "../png/veryLogo.png";
import { NavLink } from "react-router-dom";
import { Bell, Flame } from "lucide-react";
import { api } from "../../utils/axios";

const NavbarDashboard = () => {
  const [streak, setStreak] = useState(0);

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

  const navBarOptionsStyle =
    "border border-gray-500 p-2 rounded-lg bg-white/10 text-white " +
    "hover:bg-white/20 bg-gradient-to-r from-white/0 to-white/100 " +
    "bg-[length:0%_100%] bg-left hover:bg-[length:100%_100%] transition-all duration-500";

  return (
    <div className="w-full top-0 backdrop-blur-2xl fixed z-20 flex justify-between items-center p-4 text-gray-600">
      {/* Logo */}
      <div className="VeryLogo">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 hover:scale-110 transition-transform duration-300 ease-in-out drop-shadow-lg"
        >
          <img
            className="h-16 w-24 bg-transparent object-cover object-center"
            src={veryLogo}
            alt="veryLogo"
          />
        </button>
      </div>
      {/* Nav Tabs */}
      <div
        className="sticky top-0 px-6 py-5 flex gap-6 rounded-2xl shadow-lg border border-gray-400"
        style={{
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <NavLink
          className={({ isActive }) =>
            `${navBarOptionsStyle} ${
              isActive ? "bg-white/30 scale-110 transition-all duration-300" : ""
            }`
          }
          to={"/achievements"}
        >
          Achievements
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${navBarOptionsStyle} ${
              isActive ? "bg-white/30 scale-110 transition-all duration-300" : ""
            }`
          }
          to={"/dashboard"}
        >
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${navBarOptionsStyle} ${
              isActive ? "bg-white/30 scale-110 transition-all duration-300" : ""
            }`
          }
          to={"/"}
        >
          Very Chat
        </NavLink>
      </div>
      <div className="flex items-center gap-8 relative">
        <div className="flex flex-row text-2xl justify-center items-center text-white cursor-pointer gap-1">
          <Bell color="#FFA500" size={24} strokeWidth={2} fill="#FFA500" />
          5
        </div>
        <div className="flex flex-row text-2xl justify-center items-center text-white cursor-pointer gap-1">
          <Flame color="#FFA500" size={24} strokeWidth={2} fill="#FFA500" />
          {streak}
        </div>
        <NavLink to="/profile">
          <img
            src="https://i.pravatar.cc/300"
            alt="Profile"
            className="h-10 w-10 rounded-full border-2 border-pink-300 cursor-pointer"
          />
        </NavLink>
      </div>
    </div>
  );
};

export default NavbarDashboard;
