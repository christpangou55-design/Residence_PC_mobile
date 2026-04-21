// tailwind.config.js
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#000000",
        primary: "#0056A4",
        primaryDark: "#004586",
        secondary: "#F3F4F6",
      },
    },
  },
  plugins: [],
};
