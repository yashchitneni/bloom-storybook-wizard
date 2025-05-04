
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors
        persimmon: "#FF6B35",
        darkText: "#1F2937",
        grayText: "#4B5563",
        lightGray: "#F3F4F6",
        cream: "#FFF9EE",
        mint: {
          50: "#edfcf9",
          100: "#d2f5ee",
          200: "#acecdf",
          300: "#75dccc",
          400: "#44c7b6",
          500: "#25ac9c",
          600: "#19887c",
          700: "#176e65",
          800: "#175852",
          900: "#164945",
        },
        peach: {
          50: "#fff4ed",
          100: "#ffe7d4",
          200: "#fec9a8",
          300: "#fda371",
          400: "#fb7037",
          500: "#fb5a19",
          600: "#ea480f",
          700: "#c2370d",
          800: "#9a2d10",
          900: "#7d2910",
        },
        lavender: {
          50: "#f6f4fd", 
          100: "#efe8fa",
          200: "#e0d5f5",
          300: "#c9b6ee",
          400: "#ac8ce3",
          500: "#9769d9",
          600: "#824dca",
          700: "#6e3eb1", 
          800: "#5c3591",
          900: "#4d2e77",
        },
        rose: {
          50: "#fff5f5",
          100: "#ffe7e7",
          200: "#ffd1d1",
          300: "#ffadad",
          400: "#ff7575",
          500: "#ff4949",
          600: "#ff1a1a",
          700: "#e60000",
          800: "#bd0000",
          900: "#9c0000",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        fredoka: ["Fredoka One", "cursive"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
