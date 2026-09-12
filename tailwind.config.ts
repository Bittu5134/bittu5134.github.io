import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        scrollText: 'scroll 10s linear infinite'
      },
      colors: {
        night: {
          DEFAULT: "#080b12",
          100: "#030508",
          200: "#05080e",
          300: "#080b12",
          400: "#0e1322",
          500: "#151c30",
          600: "#222d4a",
          700: "#3b4b74",
          800: "#6579a8",
          900: "#a8b8db",
        },
        cream: {
          DEFAULT: "#f5ede3",
          muted: "#a69e94",
          faint: "#5c564f",
        },
        amber_glow: {
          DEFAULT: "#f49a60",
          light: "#ffd4a3",
          dark: "#ce784e",
        },
        lavender: {
          DEFAULT: "#9b9fed",
          light: "#b6b8ea",
        },
        white_smoke: {
          DEFAULT: "#f2f4f3",
          100: "#2d3430",
          200: "#596961",
          300: "#899a91",
          400: "#bdc7c2",
          500: "#f2f4f3",
          600: "#f4f6f5",
          700: "#f7f8f7",
          800: "#f9fafa",
          900: "#fcfdfc",
        },
        argentinian_blue: {
          DEFAULT: "#35a7ff",
          100: "#00233d",
          200: "#00457a",
          300: "#0068b8",
          400: "#008bf5",
          500: "#35a7ff",
          600: "#5cb8ff",
          700: "#85caff",
          800: "#addcff",
          900: "#d6edff",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
