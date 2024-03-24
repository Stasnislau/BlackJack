/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#e9c85d",
        "secondary": "#ffffff",
        "text-primary": "#f6ffff",
        "text-secondary": "#061007",
        "background-primary": "#000000",
        "background-secondary": "#aaa8a9",
      },
    },
  },
  plugins: [],
};
