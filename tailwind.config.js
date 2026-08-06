/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand primary — electric indigo (replaces default "blue" everywhere in the app)
        blue: {
          50: "#EEF0FF",
          100: "#E0E4FF",
          200: "#C7CDFE",
          300: "#A5AEFC",
          400: "#8B87F8",
          500: "#7462F0",
          600: "#5B3DE8",
          700: "#4A2CCB",
          800: "#3B23A0",
          900: "#2E1C7A",
          950: "#1B1052",
        },
        // Brand secondary — vivid spring green (replaces default "green")
        green: {
          50: "#EAFFF3",
          100: "#CCFEE1",
          200: "#9AFACB",
          300: "#5CEDAD",
          400: "#22DB92",
          500: "#0BC17E",
          600: "#059C68",
          700: "#057B55",
          800: "#0A6146",
          900: "#0A503B",
        },
        // Accent — hot magenta (replaces default "pink" / paired with purple for CTA gradients)
        pink: {
          50: "#FFF0FA",
          100: "#FFDCF3",
          200: "#FFB3E8",
          300: "#FF7ED9",
          400: "#F94CC3",
          500: "#E721A6",
          600: "#C4128A",
          700: "#9E0D6F",
          800: "#7D0F5A",
          900: "#650F4A",
        },
        purple: {
          50: "#FBEAFE",
          100: "#F5D3FD",
          200: "#EAAAFB",
          300: "#DA78F7",
          400: "#C446EF",
          500: "#A926D9",
          600: "#8A18B4",
          700: "#6E1490",
          800: "#591376",
          900: "#481461",
        },
        emerald: {
          50: "#EAFFF3",
          100: "#CCFEE1",
          200: "#9AFACB",
          300: "#5CEDAD",
          400: "#22DB92",
          500: "#0BC17E",
          600: "#059C68",
          700: "#057B55",
          800: "#0A6146",
          900: "#0A503B",
        },
        ink: "#0B0A19",
        canvas: "#FBFAFF",
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
      },
      borderRadius: {
        "4xl": "1.75rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 8px 40px -8px rgba(91,61,232,0.45)",
        "glow-lg": "0 20px 60px -12px rgba(91,61,232,0.5)",
        "glow-pink": "0 8px 40px -8px rgba(231,33,166,0.45)",
        "glow-green": "0 8px 40px -8px rgba(11,193,126,0.45)",
        card: "0 2px 8px rgba(15,10,50,0.04), 0 12px 32px -12px rgba(15,10,50,0.10)",
        "card-hover":
          "0 8px 20px rgba(15,10,50,0.06), 0 30px 60px -20px rgba(91,61,232,0.28)",
      },
      backgroundImage: {
        "mesh-hero":
          "radial-gradient(at 15% 20%, rgba(255,255,255,0.18) 0, transparent 55%), radial-gradient(at 85% 15%, rgba(255,255,255,0.16) 0, transparent 50%), radial-gradient(at 50% 100%, rgba(0,0,0,0.15) 0, transparent 60%), linear-gradient(120deg, #5B3DE8 0%, #8A18B4 45%, #E721A6 100%)",
        "mesh-soft":
          "radial-gradient(at 10% 10%, rgba(91,61,232,0.10) 0, transparent 45%), radial-gradient(at 90% 20%, rgba(231,33,166,0.10) 0, transparent 45%), radial-gradient(at 50% 90%, rgba(11,193,126,0.10) 0, transparent 45%)",
        "grid-pattern":
          "linear-gradient(rgba(91,61,232,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(91,61,232,0.06) 1px, transparent 1px)",
        "cta-mesh":
          "radial-gradient(at 20% 30%, rgba(255,255,255,0.2) 0, transparent 45%), linear-gradient(115deg, #8A18B4 0%, #E721A6 55%, #FF7ED9 100%)",
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
