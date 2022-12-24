/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        "half-screen": "50vh",
        "screen-75": "75vh",
        "screen-25": "25vh",
      },
      width: {
        "half-screen": "50vw",
        "screen-75": "75vw",
        "screen-25": "25vw",
      },
    },
  },
  plugins: [],
};
