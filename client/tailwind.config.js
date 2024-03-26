/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#f5c610",
        "secondary": "#ffffff",
        "text-primary": "#f6ffff",
        "text-secondary": "#061007",
        "background-primary": "#020106",
        "background-secondary": "#aaa8a9",
        "button-secondary": "#1E2329",
        "gold-700": "#fbbb00",
        "gold-200": "#fff918",
        "gold-100": "#fffae0",
        "casino-green": "#16FF00",
      },
    },
  },
  plugins: [],
};
