import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070b12",
        foreground: "#f3f4f6",
        card: {
          DEFAULT: "#0f172a",
          hover: "#1e293b",
          border: "#1e293b"
        },
        primary: {
          DEFAULT: "#38bdf8",
          glow: "#0ea5e9",
          dark: "#0284c7"
        },
        accent: {
          purple: "#a855f7",
          emerald: "#10b981",
          amber: "#f59e0b"
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
