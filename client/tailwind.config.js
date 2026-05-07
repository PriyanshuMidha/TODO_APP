/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        card: "#111111",
        border: "#262626",
        textPrimary: "#F5F5F5",
        textSecondary: "#A3A3A3",
        accent: "#8B5CF6",
        danger: "#EF4444",
        warning: "#F59E0B"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(0, 0, 0, 0.35)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      fontFamily: {
        sans: ["'Manrope'", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
