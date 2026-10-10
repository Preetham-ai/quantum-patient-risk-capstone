/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          bg: "#050814",
          card: "#0b1126",
          border: "#1e293b",
          cyan: "#00f5ff",
          magenta: "#ff007f",
          violet: "#8b5cf6",
          blue: "#3b82f6",
        },
      },
    },
  },
  plugins: [],
};
