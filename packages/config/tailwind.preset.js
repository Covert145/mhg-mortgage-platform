/**
 * Shared Tailwind design tokens for the Mobile Home Guy platform.
 * Both apps/marketing and apps/platform, plus packages/ui, extend this preset
 * so the public site and the CRM/portals render from one token source.
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8f4",
          100: "#d7ede1",
          200: "#b0dbc4",
          300: "#82c3a3",
          400: "#57a880",
          500: "#357f5c", // primary brand green
          600: "#286449",
          700: "#20503b",
          800: "#1a3f30",
          900: "#153327",
        },
        ink: {
          50: "#f5f6f7",
          100: "#e6e8eb",
          200: "#c7ccd3",
          300: "#9fa7b3",
          400: "#6b7684",
          500: "#4a5563",
          600: "#38414d",
          700: "#2a313a",
          800: "#1c2127",
          900: "#0f1216",
        },
        accent: {
          500: "#e08a2b",
          600: "#c06f18",
        },
        success: "#2f9e5c",
        warning: "#d99a1f",
        danger: "#c94a3f",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["Sora", "Inter", "sans-serif"],
      },
      borderRadius: {
        card: "0.75rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
      },
    },
  },
  plugins: [],
};
