/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,njk,md,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        pixel: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'brutal-xs': '2px 2px 0px 0px #000000',
        'brutal-sm': '3px 3px 0px 0px #000000',
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-xl': '8px 8px 0px 0px #000000',
        'brutal-amber': '4px 4px 0px 0px #f49a60',
        'brutal-cyan': '4px 4px 0px 0px #35a7ff',
        'brutal-yellow': '4px 4px 0px 0px #fde047',
        'brutal-mint': '4px 4px 0px 0px #86efac',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        spin_slow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        bounce_subtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        ticker: 'ticker 22s linear infinite',
        tickerFast: 'ticker 14s linear infinite',
        spinSlow: 'spin_slow 10s linear infinite',
        wiggle: 'wiggle 2s ease-in-out infinite',
        bounceSubtle: 'bounce_subtle 2s ease-in-out infinite',
      },
      colors: {
        retro: {
          bg: "#fcf6e8",
          darkBg: "#12151e",
          card: "#fffdf9",
          cardDark: "#1a1e2b",
          ink: "#14161f",
          border: "#14161f",
          yellow: "#fde047",
          amber: "#f59e0b",
          peach: "#fb923c",
          mint: "#86efac",
          cyan: "#38bdf8",
          blue: "#3b82f6",
          lavender: "#c4b5fd",
          pink: "#f472b6",
          red: "#f87171",
          cream: "#fbf3de",
        },
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
        argentinian_blue: {
          DEFAULT: "#35a7ff",
          100: "#00233d",
          200: "#00457a",
          300: "#0068b8",
          400: "#008bf5",
          500: "#35a7ff",
        },
      },
    },
  },
  plugins: [],
};
