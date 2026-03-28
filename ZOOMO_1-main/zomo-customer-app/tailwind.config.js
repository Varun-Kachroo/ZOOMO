/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand greens from design spec
        "z-primary": "#0F3D2E",
        "z-hover": "#145A43",
        "z-accent": "#22C55E",
        // Page / surface backgrounds
        "z-page": "#0B0F0E",
        "z-card": "#111111",
        "z-card2": "#0a1a0f",
      },
      backgroundImage: {
        "z-gradient": "linear-gradient(135deg, #0F3D2E 0%, #145A43 100%)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        wiggle: { "0%,100%": { transform: "rotate(-3deg)" }, "50%": { transform: "rotate(3deg)" } },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        wiggle: "wiggle 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
