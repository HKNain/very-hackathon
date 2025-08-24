import { Home } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const navBarOptionsStyle =
    "border border-gray-500 p-2 rounded-lg bg-white/10 text-white " +
    "hover:bg-white/20 bg-gradient-to-r from-white/0 to-white/100 " +
    "bg-[length:0%_100%] bg-left hover:bg-[length:100%_100%] " +
    "transition-all duration-500";

  return (
    <div className="w-full top-0 backdrop-blur-2xl  fixed z-20 flex justify-around items-center p-4 text-gray-600">
      <div className="VeryLogo">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 text-2xl font-extrabold bg-clip-text text-transparent 
                     bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 
                     hover:scale-110 transition-transform duration-300 ease-in-out
                     drop-shadow-lg"
        >
          <Home size={28} className="text-indigo-400 drop-shadow-md" />
          VeryLogo
        </button>
      </div>

      <div
        className="sticky top-0 px-6 py-5 flex gap-6 rounded-2xl shadow-lg  border border-gray-400"
        style={{
          //
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <button className={navBarOptionsStyle}>Swasthya</button>
        <NavLink
          className={({ isActive }) =>
            `${navBarOptionsStyle} ${
              isActive
                ? "bg-white/30 scale-110 transition-all duration-300"
                : ""
            }`
          }
          to={"/"}
        >
          Home{" "}
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${navBarOptionsStyle} ${
              isActive
                ? "bg-white/30 scale-110 transition-all duration-300"
                : ""
            }`
          }
        >
          About
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            `${navBarOptionsStyle} ${
              isActive
                ? "bg-white/30 scale-110 transition-all duration-300"
                : ""
            }`
          }
        >
          Signup
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `${navBarOptionsStyle} ${
              isActive
                ? "bg-white/30 scale-110 transition-all duration-300"
                : ""
            }`
          }
          to={"/login"}
        >
          Login{" "}
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
