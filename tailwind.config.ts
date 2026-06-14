import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pinkBrand: "#FF4D7D",
        pinkSoft: "#FFD9E3",
        milk: "#FFF7F8",
        graphite: "#1F1F23",
        neutralInk: "#8A8D94"
      },
      fontFamily: {
        display: ["Unbounded", "Arial Black", "Arial", "sans-serif"],
        sans: ["Unbounded", "Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        sticker: "0 22px 55px rgba(255, 77, 125, 0.28)",
        paper: "0 18px 45px rgba(31, 31, 35, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
