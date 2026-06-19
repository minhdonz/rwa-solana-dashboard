import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces — light research-report
        paper: "#ffffff",
        surface: "#f8fafc",
        surface2: "#f1f5f9",
        line: "#e2e8f0",
        "line-strong": "#cbd5e1",
        // Text / brand
        navy: "#0f172a",
        brand: "#1d4ed8",
        "brand-dark": "#1e3a8a",
        // Semantic (muted, print-friendly)
        pos: "#047857",
        caution: "#b45309",
        neg: "#b91c1c",
        neutral: "#64748b",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        label: "0.06em",
      },
    },
  },
  plugins: [],
};

export default config;
