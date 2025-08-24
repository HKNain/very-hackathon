/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        floatGlow: {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            filter: "drop-shadow(0 0 15px rgba(236,72,153,0.6))",
          },
          "50%": {
            transform: "translate(15px, -15px) scale(1.2)",
            filter: "drop-shadow(0 0 35px rgba(59,130,246,0.8))",
          },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        floatGlow: "floatGlow 8s ease-in-out infinite",
        scroll: "scroll 30s linear infinite",
      },
    },
  },
  plugins: [],
};
