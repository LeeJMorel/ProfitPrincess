module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightest: "#FFC6E1",
        light: "#FFAAD1",
        primary: "#FF69B4",
        dark: "#E7549F",
        darkest: "#CF3E8A",
      },
    },
    backgroundImage: {
      "gradient-barbie": "linear-gradient(90deg, #FF69B4, #FF1493)",
    },
  },
  plugins: [],
};
