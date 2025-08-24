import { Youtube, Linkedin, Instagram } from "lucide-react";
import React from "react";

const Footer = () => {
  const XIcon = ({ size = 24, className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26L22.5 21.75h-6.41l-4.82-6.412-5.51 6.412H2.452l7.73-8.995L1.5 2.25h6.59l4.356 5.827 5.798-5.827z" />
    </svg>
  );
  return (
    <div className="w-full bg-black  border-t-[1px]  border-gray-400 flex justify-around items-center py-12 ">
      <h1
        className="text-center text-xl font-bold 
             bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
             bg-clip-text text-transparent 
             drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:scale-105 duration-300 transition-transform"
      >
        © Copyright 2025 Swasthya
      </h1>

      <div className="flex flex-col items-center justify-center gap-5">
        <h1
          className="text-center text-xl font-bold 
             bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
             bg-clip-text text-transparent 
             drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:scale-105 duration-300 transition-transform"
        >
          Connect with us
        </h1>

        <div className="flex gap-5 text-white">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube
              size={24}
              className="hover:text-red-500 transition-colors duration-200"
            />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin
              size={24}
              className="hover:text-blue-500 transition-colors duration-200"
            />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            <XIcon
              size={24}
              className="hover:text-black transition-colors duration-200"
            />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram
              size={24}
              className="hover:text-pink-500 transition-colors duration-200"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
