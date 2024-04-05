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
        secondary: "#2E3269",
        button: {
          yellow: "#FABD40",
          pink: "#D51F68",
        },

        input: "#3A3D67",
      },
    },
  },
  plugins: [],
} satisfies Config;
