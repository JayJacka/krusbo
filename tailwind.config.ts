import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      textColor: {
        grey: "#94A3B8",
        blue: "#2BB5F3",
        white: "#FFFFFF",
      },
      colors: {
        primary: "#0F1130",
        button: {
          yellow: "#FABD40",
          pink: "#D51F68",
        },
		blue: "#2BB5F3",
		pink: "#D51F68",
		orange: "#F96708",
		green: "#2DDD6A",
		purple: "8E73EF",
        input: "#3A3D67",
      },
    },
  },
  plugins: [],
} satisfies Config;
