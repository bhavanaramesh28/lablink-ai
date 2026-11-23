/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#070B18",
        surface: "#101A35",
        "surface-dark": "#0B1224",
        "surface-light": "#162244",
        cyan: {
          DEFAULT: "#00D9FF",
          glow: "#00D9FF",
        },
        blue: {
          neon: "#287BFF",
        },
        violet: {
          glow: "#8B5CF6",
        },
        purple: {
          DEFAULT: "#8B5CF6",
          glow: "#8B5CF6",
        },
        aqua: {
          DEFAULT: "#43E6CF",
          glow: "#43E6CF",
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-16px) rotate(2deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-24px) rotate(-3deg)" },
        },
        "float-drift": {
          "0%, 100%": { transform: "translate(0px, 0px) rotate(0deg)" },
          "50%": { transform: "translate(12px, -18px) rotate(4deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.08)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        laserScan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delay": "float 7s ease-in-out 1.5s infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "float-drift": "float-drift 8s ease-in-out 1s infinite",
        "pulse-glow": "pulseGlow 5s ease-in-out infinite",
        "spin-slow": "spinSlow 20s linear infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "laser-scan": "laserScan 4s ease-in-out infinite",
      },
      boxShadow: {
        cyan: "0 0 25px rgba(0, 217, 255, 0.45)",
        purple: "0 0 25px rgba(139, 92, 246, 0.45)",
        neon: "0 0 35px rgba(40, 123, 255, 0.45)",
        aqua: "0 0 25px rgba(67, 230, 207, 0.45)",
        hologram: "0 0 40px rgba(0, 217, 255, 0.25), inset 0 0 20px rgba(139, 92, 246, 0.2)",
      },
    },
  },
  plugins: [],
};
