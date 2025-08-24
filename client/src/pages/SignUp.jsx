import React from "react";
import berry1 from "../components/png/berry1.png";
import berry2 from "../components/png/berry1.png";
import Navbar from "../components/layout/Navbar";
import { Link } from "react-router-dom";

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

const SignUp = () => {
  const randomPositions = floatingPNGs.map(() => ({
    ...getRandomPosition(),
    size: Math.random() * 60 + 40, // 40px – 100px
    duration: Math.random() * 6 + 6, // 6s – 12s
  }));
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen w-full flex flex-col justify-center items-center font-poppins 
                    bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] 
                    relative overflow-hidden  "
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
        <div className=" px-6  py-5 mt-20 flex gap-9 rounded-2xl shadow-lg bg-gray-400 w-[40vw]  bg-transparent backdrop-blur-2xl flex-col justify-center items-center ">
          <h1
            className=" bg-clip-text text-transparent 
                     bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 
                     hover:scale-110 transition-transform duration-300 ease-in-out
                     drop-shadow-lg text-3xl font-poppins font-bold"
          >
            SignUp
          </h1>

          <div className="flex flex-col gap-12">
            <input
              className="rounded-2xl  bg-transparent border-2 h-8 w-96 p-5 "
              placeholder="Enter Username"
              type="text"
            />
            <input
              className="rounded-2xl bg-transparent border-2 h-8 w-96 p-5"
              placeholder="Enter email"
              type="email"
            />
            <input
              className="rounded-2xl bg-transparent border-2 h-8 w-96 p-5"
              placeholder="Enter password"
              type="password"
            />
          </div>

          <button
            className="bg-clip-text text-transparent 
                     bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 
                     hover:scale-110 transition-transform duration-300 ease-in-out
                     drop-shadow-lg text-xl border-2 border-black/10  font-poppins font-bold"
          >
            Submit
          </button>
          <p className="text-md font-poppins font-bold drop-shadow-lg">
            <span
              className="bg-clip-text text-transparent 
                   bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 
                   transition-transform duration-300 ease-in-out"
            >
              Have previous account?
            </span>
            <Link
              to="/login"
              className="ml-2 inline-block bg-clip-text text-transparent 
               bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 
               transition-transform duration-300 ease-in-out hover:scale-110"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
