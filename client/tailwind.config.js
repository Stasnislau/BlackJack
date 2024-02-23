/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-green": "#104533",
        "light-text": "#FFFFFF",
        "primary-button": "#D4AF37",
        "secondary-button": "#B7950B",
        "accent-silver": "#C0C0C0",
        "alert-red": "#FF0000",
        "success-green": "#28A745",
      },
    },
  },
  plugins: [],
};
