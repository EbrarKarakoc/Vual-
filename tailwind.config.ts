import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Studio palette (prototype tokens)
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        "bg-deep": "var(--bg-deep)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-muted": "var(--ink-muted)",
        line: "var(--line)",
        green: "var(--green)",
        "green-deep": "var(--green-deep)",
        wine: "var(--wine)",
        "wine-deep": "var(--wine-deep)",
        cream: "var(--cream)",

        // Legacy aliases (existing components)
        emerald: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "var(--green)",
          800: "var(--green-deep)",
          900: "#064E3B",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "0.875rem",
        "2xl": "1.25rem",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.04)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        kenBurnsA: {
          "0%": { transform: "scale(1.08) translate(-1%, -1%)" },
          "100%": { transform: "scale(1.18) translate(1%, 1%)" },
        },
        kenBurnsB: {
          "0%": { transform: "scale(1.15) translate(1%, 0%)" },
          "100%": { transform: "scale(1.05) translate(-1%, -1%)" },
        },
        kenBurnsC: {
          "0%": { transform: "scale(1.1) translate(0%, 1%)" },
          "100%": { transform: "scale(1.2) translate(-1%, -1%)" },
        },
        spin: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        fadeUp: "fadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
        fadeIn: "fadeIn 800ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
