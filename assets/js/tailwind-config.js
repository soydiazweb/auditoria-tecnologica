tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          primary: "#881386",
          secondary: "#5f0d5e",
          accent: "#b61ab2",
          "background-light": "#fcf8fc",
          "background-soft": "#f8eef8",
          "background-tint": "#f5e6f5",
          "background-dark": "#140814",
          "surface-dark": "#1f0e21",
          "surface-light": "#ffffff",
        },
        fontFamily: {
          display: ["Manrope", "sans-serif"],
          body: ["Inter", "sans-serif"],
        },
        borderRadius: {
          DEFAULT: "0.5rem",
          'xl': '1rem',
          '2xl': '1.5rem',
          '3xl': '2rem',
          '4xl': '2.5rem',
        },
        boxShadow: {
          glow: '0 12px 40px rgba(136, 19, 134, 0.20)',
          soft: '0 18px 45px rgba(64, 24, 69, 0.12)',
        }
      },
    },
  };