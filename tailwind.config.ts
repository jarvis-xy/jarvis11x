/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14110e",
        panel: "#1e1a16",
        raised: "#2a241c",
        rule: "#6e5e48",
        paper: "#cbb892",
        amber: "#e4b060",
        cheap: "#3d8b7a",
        dear: "#d25a21",
        mute: "#8d8274",
        cream: "#f0e6d2",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
