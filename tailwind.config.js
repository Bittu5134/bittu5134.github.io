/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,njk,md,js}",
    "./public/assets/js/**/*.js",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Playpen Sans"', 'cursive'],
        mono: ['"Space Mono"', 'monospace'],
        pixel: ['"Space Mono"', 'monospace'],
        display: ['"Playpen Sans"', 'cursive'],
        body: ['"Playpen Sans"', 'cursive'],
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
      },
      boxShadow: {
        'brutal-xs': '2px 2px 0px 0px #000000',
        'brutal-sm': '3px 3px 0px 0px #000000',
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-xl': '8px 8px 0px 0px #000000',
        'brutal-bottom': '0px 4px 0px 0px #000000',
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
      },
      animation: {
        ticker: 'ticker 22s linear infinite',
        spinSlow: 'spin_slow 10s linear infinite',
      },
      colors: {
        // Templates style with arbitrary hex values; this scale is kept for
        // the odd `dark:` variant should a dark theme ever come back.
      },
    },
  },
  corePlugins: {
    preflight: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    blur: false,
    brightness: false,
    contrast: false,
    dropShadow: false,
    grayscale: false,
    hueRotate: false,
    invert: false,
    saturate: false,
    sepia: false,
    touchAction: false,
    scrollSnapType: false,
    scrollSnapAlign: false,
    scrollSnapStop: false,
    fontVariantNumeric: false,
    tableLayout: false,
    borderCollapse: false,
    borderSpacing: false,
  },
  plugins: [],
};
