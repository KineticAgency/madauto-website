import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eef2f7",
          100: "#d7e0ea",
          200: "#aebdd3",
          300: "#8397b8",
          400: "#5b7297",
          500: "#3d5478",
          600: "#2a3f60",
          700: "#1f2f4a",
          800: "#16223a",
          900: "#0f172a",
          DEFAULT: "#16223a",
          dark: "#0f172a",
        },
        accent: {
          50: "#fef2f2",
          100: "#fee2e2",
          300: "#fca5a5",
          400: "#f87171",
          500: "#dc2626",
          600: "#b91c1c",
          700: "#991b1b",
          DEFAULT: "#dc2626",
        },
      },
    },
  },
  plugins: [],
};

export default config;
