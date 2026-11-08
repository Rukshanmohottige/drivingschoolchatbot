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
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc5fb",
          400: "#36a5f7",
          500: "#0b87ea",
          600: "#026ac8",
          700: "#0355a2",
          800: "#074884",
          900: "#0b3d6e",
          950: "#082749",
        },
        accent: {
          50: "#fdf8ee",
          100: "#fbf0d5",
          200: "#f6deaa",
          300: "#f1c473",
          400: "#eca73e",
          500: "#e48c1b",
          600: "#c76e13",
          700: "#9f5013",
        }
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
