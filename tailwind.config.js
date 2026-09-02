import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        "scale-bounce": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.01)" },
        },
        "scale-down-bounce": {
          "0%": { transform: "scale(1.01)" },
          "50%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(0.95)" },
        },
      },
      animation: {
        "scale-bounce": "scale-bounce 220ms ease-out",
        "scale-down-bounce": "scale-down-bounce 200ms ease-out",
      },
    },
  },
  plugins: [typography],
};
