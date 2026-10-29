import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10172a",
        blue: "#2563eb",
        cyan: "#22d3ee",
        paper: "#f4f7fb",
        cream: "#fbfdff",
      },
      boxShadow: {
        soft: "0 24px 70px rgba(15, 23, 42, .12)",
      },
    },
  },
  plugins: [],
};
export default config;
