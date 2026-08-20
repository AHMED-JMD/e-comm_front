/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./admin.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* Palette taken from the Luma "Meroë" logo: olive, brown, sand, off-white. */

        // Brand primary — Meroë olive (replaces default "blue" everywhere in the app)
        blue: {
          50: "#F4F6EC",
          100: "#E7EBD5",
          200: "#D0D8AE",
          300: "#B4C083",
          400: "#96A65F",
          500: "#849949",
          600: "#788B45",
          700: "#5F6E37",
          800: "#4B572D",
          900: "#3D4726",
          950: "#232916",
        },
        // Deep Nubian brown — the wordmark colour (replaces default "purple")
        purple: {
          50: "#F7F3EE",
          100: "#EDE4D9",
          200: "#DACAB6",
          300: "#C0A98D",
          400: "#A18868",
          500: "#6B563C",
          600: "#4A3B2A",
          700: "#3E3123",
          800: "#33291D",
          900: "#2A2118",
        },
        // Sand / ochre accent — 200 is the logo's sand (replaces default "pink")
        pink: {
          50: "#FCF8F0",
          100: "#F6EDDC",
          200: "#E8DDC8",
          300: "#D9C4A0",
          400: "#C6A574",
          500: "#B08A52",
          600: "#96723F",
          700: "#7A5C33",
          800: "#614A2A",
          900: "#4F3D24",
        },
        // Success — kept cooler than the olive primary so the two never read alike
        green: {
          50: "#EAF6EF",
          100: "#CFEADB",
          200: "#A3D6BB",
          300: "#6FBD97",
          400: "#45A177",
          500: "#2E8760",
          600: "#226B4C",
          700: "#1C543D",
          800: "#184430",
          900: "#143528",
        },
        emerald: {
          50: "#EAF6EF",
          100: "#CFEADB",
          200: "#A3D6BB",
          300: "#6FBD97",
          400: "#45A177",
          500: "#2E8760",
          600: "#226B4C",
          700: "#1C543D",
          800: "#184430",
          900: "#143528",
        },
        // Warning — ochre, straight out of the sand family
        amber: {
          50: "#FDF6E7",
          100: "#F9E9C6",
          200: "#F0D291",
          300: "#E3B75C",
          400: "#D19C3A",
          500: "#B8822C",
          600: "#956724",
          700: "#77521F",
          800: "#60421C",
          900: "#4E371A",
        },
        // Danger — clay red, warm enough to sit beside the brown
        red: {
          50: "#FCEFEC",
          100: "#F8DBD4",
          200: "#EEB6A8",
          300: "#E08B76",
          400: "#CE6449",
          500: "#B7462C",
          600: "#9A3722",
          700: "#7C2C1D",
          800: "#65261B",
          900: "#532118",
        },
        ink: "#4A3B2A",
        canvas: "#FAF8F2",
      },
      fontFamily: {
        sans: [
          "Tajawal",
          "Inter",
          "system-ui",
          "-apple-system",
          "Droid Arabic Kufi",
          "sans-serif",
        ],
        display: [
          "Tajawal",
          "Outfit",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        // Logo lockup only — the faces the Meroë logo was drawn in.
        logo: ["Marcellus", "Georgia", "serif"],
        "logo-ar": ["Amiri", "Tajawal", "serif"],
      },
      borderRadius: {
        "4xl": "1.75rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 8px 40px -8px rgba(120,139,69,0.42)",
        "glow-lg": "0 20px 60px -12px rgba(74,59,42,0.38)",
        "glow-pink": "0 8px 40px -8px rgba(176,138,82,0.42)",
        "glow-green": "0 8px 40px -8px rgba(46,135,96,0.40)",
        card: "0 2px 8px rgba(74,59,42,0.05), 0 12px 32px -12px rgba(74,59,42,0.14)",
        "card-hover":
          "0 8px 20px rgba(74,59,42,0.07), 0 30px 60px -20px rgba(120,139,69,0.28)",
      },
      backgroundImage: {
        "mesh-hero":
          "radial-gradient(at 15% 20%, rgba(255,255,255,0.16) 0, transparent 55%), radial-gradient(at 85% 15%, rgba(232,221,200,0.20) 0, transparent 50%), radial-gradient(at 50% 100%, rgba(0,0,0,0.18) 0, transparent 60%), linear-gradient(120deg, #849949 0%, #5F6E37 45%, #4A3B2A 100%)",
        "mesh-soft":
          "radial-gradient(at 10% 10%, rgba(120,139,69,0.10) 0, transparent 45%), radial-gradient(at 90% 20%, rgba(176,138,82,0.10) 0, transparent 45%), radial-gradient(at 50% 90%, rgba(232,221,200,0.35) 0, transparent 45%)",
        "grid-pattern":
          "linear-gradient(rgba(120,139,69,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(120,139,69,0.07) 1px, transparent 1px)",
        "cta-mesh":
          "radial-gradient(at 20% 30%, rgba(255,255,255,0.18) 0, transparent 45%), linear-gradient(115deg, #4A3B2A 0%, #788B45 55%, #B08A52 100%)",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        /* RTL drawer: slides in from the right edge of the screen. */
        "drawer-in": {
          "0%": { opacity: "0.6", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        blob: "blob 12s infinite ease-in-out",
        float: "float 5s ease-in-out infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.2s ease-out both",
        "drawer-in": "drawer-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 2.5s linear infinite",
      },
      backgroundSize: {
        "gradient-size": "200% 200%",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".rtl": {
          direction: "rtl",
          "text-align": "right",
        },
        ".ltr": {
          direction: "ltr",
          "text-align": "left",
        },
      });
    },
  ],
};
