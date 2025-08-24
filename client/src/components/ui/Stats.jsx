import React from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import stats from "../../data/stats.json";

const Stats = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // animate only once
    threshold: 0.2, // trigger when 20% visible
  });

  return (
    <div
      ref={ref}
      className="w-full py-20 px-8 bg-gradient-to-br from-[#000000] via-[#0a0a0f] to-[#120018] relative z-10"
    >
      <h2
        className="text-5xl font-bold text-transparent bg-clip-text 
                     bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
                     text-center drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] mb-16"
      >
        Our Impact
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`p-8 rounded-2xl border border-pink-500/40 
                       bg-black/40 backdrop-blur-md shadow-[0_0_15px_#ec4899]/40 
                       flex flex-col items-center text-center 
                       transform transition-all duration-700 ease-in-out
                       ${
                         inView
                           ? i % 2 === 0
                             ? "translate-x-0 opacity-100"
                             : "translate-x-0 opacity-100"
                           : i % 2 === 0
                           ? "translate-x-20 opacity-0"
                           : "-translate-x-20 opacity-0"
                       }`}
          >
            {/* Icon */}
            <div className="text-5xl mb-6 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
              {stat.icon}
            </div>

            {/* Animated Value */}
            <h3
              className="text-4xl font-bold text-transparent bg-clip-text 
                           bg-gradient-to-r from-pink-400 to-blue-400 mb-2"
            >
              {inView && (
                <CountUp end={stat.value} duration={3} separator="," />
              )}
            </h3>

            {/* Label */}
            <p className="text-gray-300 text-lg">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
