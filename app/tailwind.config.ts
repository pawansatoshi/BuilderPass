import type { Config } from "tailwindcss";

/**
 * Design tokens for the "Builder Passport" concept: an official-document
 * metaphor (deep ink navy, warm brass "stamp" accent, paper-toned
 * background) rather than a generic dark-mode-crypto or SaaS-dashboard
 * palette. See PassportCard.tsx's corner "stamp" seal for the one
 * deliberately characterful signature element — everything else stays
 * quiet and disciplined around it.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12213B", // primary text, headers, dark card header
        paper: "#FBFAF7", // page background
        brass: "#B08D57", // signature accent — the "stamp" color (decorative use only:
        // borders/dots/underlines, ~2.96:1 against paper — not for body text or focus rings)
        "brass-700": "#7A5D34", // darker brass, ~5.8:1 against paper — use for any brass *text*
        slate: "#5B6472", // secondary/muted text
        success: "#2F7A4F",
        danger: "#B3261E",
        line: "#DDD6C8", // hairline borders on the paper background
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        sm: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
