/** @type {import('tailwindcss').Config} */
export default {
  content: ["./frontend/**/*.{js,jsx,ts,tsx,html}", "./frontend/index.html"],
  theme: {
    extend: {
      colors: {
        "brand-bg": "#0f0f0f",
        "brand-surface": "#1a1a1a",
        "brand-surface-2": "#262626",
        "brand-text": "#ffffff",
        "brand-text-dim": "#a0a0a0",
        "brand-primary": "#e50914",
        "brand-primary-hover": "#f40612",
      },
    },
  },
  plugins: [],
};
