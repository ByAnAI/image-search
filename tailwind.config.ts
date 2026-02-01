import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* SciWiz-inspired: dark navy/black, white, gold accent */
        primary: {
          50: "#fdf8ed",
          100: "#f9eed4",
          200: "#f2d9a8",
          300: "#e9c071",
          400: "#d4a84b",
          500: "#c9a227",
          600: "#a8821f",
          700: "#87621c",
          800: "#704f1c",
          900: "#5e421b",
          950: "#36220a",
        },
        sciwiz: {
          dark: "#0c0c0f",
          navy: "#111827",
          surface: "#1a1d26",
          muted: "#6b7280",
          light: "#f0f0f0",
          white: "#ffffff",
        },
        surface: {
          DEFAULT: "#f8fafc",
          card: "#ffffff",
          muted: "#f1f5f9",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
