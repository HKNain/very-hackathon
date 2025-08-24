import React from "react";
import features from "../../data/features.json";

const Features = () => {
  return (
    <div className="w-full py-20 px-8 bg-gradient-to-br from-[#000000] via-[#0a0a0f] to-[#120018] relative z-10">
      <h2
        className="text-5xl font-bold text-transparent bg-clip-text 
                     bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
                     text-center drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] mb-16"
      >
        Features
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl border border-pink-500/40 
                       bg-black/40 backdrop-blur-md shadow-[0_0_15px_#ec4899] 
                       hover:shadow-[0_0_25px_#ec4899] 
                       transition-all duration-300 flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div className="text-5xl mb-6 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
              {feature.icon}
            </div>

            {/* Title */}
            <h3
              className="text-2xl font-semibold text-transparent bg-clip-text 
                           bg-gradient-to-r from-pink-400 to-blue-400 mb-3"
            >
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
