/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0D12",
        bone: "#EDE7DB",
        amber: {
          signal: "#FFB347",
        },
        risk: {
          low: "#7FB59A", // sage
          med: "#FFB347", // amber
          high: "#E5484D", // vermilion
        },
        surface: {
          1: "#12151D",
          2: "#181C26",
          3: "#202533",
        },
        hairline: {
          DEFAULT: "rgba(237, 231, 219, 0.08)",
          subtle: "rgba(237, 231, 219, 0.14)",
          strong: "rgba(237, 231, 219, 0.24)",
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
