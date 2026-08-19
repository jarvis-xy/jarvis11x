/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14110e",
        panel: "#f6f4f0",
        raised: "#ece9e3",
        rule: "#ddd6cb",
        paper: "#cbb892",
        amber: "#c05621",
        cheap: "#2f6f63",
        dear: "#c4471c",
        mute: "#6e675e",
        cream: "#1c1917",
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
