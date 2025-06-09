// 🎨 Centralized Theme Configuration
// Easily customize your entire app's look and feel from this single file

export const themeConfig = {
  // 🎨 Cream Rose Color Palette
  colors: {
    // Primary rose colors
    primary: {
      50: "#fdf2f8", // Very light rose
      100: "#fce7f3", // Light rose
      200: "#fbcfe8", // Soft rose
      300: "#f9a8d4", // Medium rose
      400: "#f472b6", // Rose
      500: "#ec4899", // Deep rose
      600: "#db2777", // Rich rose
      700: "#be185d", // Dark rose
      800: "#9d174d", // Very dark rose
      900: "#831843", // Deepest rose
    },

    // Secondary cream colors
    secondary: {
      50: "#fffbf5", // Cream white
      100: "#fef7ed", // Light cream
      200: "#fed7aa", // Soft cream
      300: "#fdba74", // Medium cream
      400: "#fb923c", // Warm cream
      500: "#f97316", // Orange cream
      600: "#ea580c", // Deep cream
      700: "#c2410c", // Dark cream
      800: "#9a3412", // Very dark cream
      900: "#7c2d12", // Deepest cream
    },

    // Accent sage green (calming complement)
    accent: {
      50: "#f0fdf4", // Very light sage
      100: "#dcfce7", // Light sage
      200: "#bbf7d0", // Soft sage
      300: "#86efac", // Medium sage
      400: "#4ade80", // Sage
      500: "#22c55e", // Deep sage
      600: "#16a34a", // Rich sage
      700: "#15803d", // Dark sage
      800: "#166534", // Very dark sage
      900: "#14532d", // Deepest sage
    },

    // Warm neutral colors
    neutral: {
      50: "#fefefe", // Pure white
      100: "#fefaf8", // Warm white
      200: "#f7f3f0", // Light warm gray
      300: "#e7ddd7", // Soft warm gray
      400: "#c8b8b0", // Medium warm gray
      500: "#a69189", // Warm gray
      600: "#8b7066", // Dark warm gray
      700: "#6b544a", // Very dark warm gray
      800: "#4a3832", // Deep warm gray
      900: "#2d211c", // Deepest warm gray
    },

    // Status colors (softened)
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#8b5cf6",
  },

  // 🎭 Gentle Gradients
  gradients: {
    primary: "bg-gradient-to-r from-rose-400 via-pink-300 to-orange-200",
    primaryHover: "hover:from-rose-500 hover:via-pink-400 hover:to-orange-300",
    background: "bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50",
    backgroundDark:
      "bg-gradient-to-br from-rose-900 via-pink-900 to-orange-900",
    card: "bg-gradient-to-br from-white via-rose-50/30 to-orange-50/20",
    hero: "bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100",
    feature:
      "bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-orange-500/10",
    accent: "bg-gradient-to-r from-emerald-400 to-teal-300",
  },

  // ✍️ Gentle Typography (Yoga-focused fonts)
  typography: {
    fontFamily: {
      sans: ["Nunito", "Inter", "system-ui", "sans-serif"],
      heading: ["Playfair Display", "Georgia", "serif"],
      body: ["Source Sans Pro", "system-ui", "sans-serif"],
      accent: ["Dancing Script", "cursive"],
      mono: ["JetBrains Mono", "monospace"],
    },

    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
      "7xl": "4.5rem", // 72px
    },

    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },

    lineHeight: {
      tight: "1.25",
      normal: "1.6", // More relaxed for readability
      relaxed: "1.8",
    },
  },

  // 🎯 Spacing & Layout
  spacing: {
    section: "py-16 lg:py-24",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    card: "p-8 lg:p-10",
    button: "px-8 py-4",
  },

  // 🎪 Soft Effects & Animations
  effects: {
    shadow: {
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      card: "shadow-2xl shadow-rose-500/10 border-0",
      glow: "shadow-2xl shadow-rose-500/20",
      soft: "shadow-lg shadow-rose-200/50",
    },

    blur: {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
    },

    transition: {
      default: "transition-all duration-300 ease-out",
      slow: "transition-all duration-500 ease-out",
      fast: "transition-all duration-200 ease-out",
    },

    hover: {
      scale: "hover:scale-105",
      lift: "hover:-translate-y-2",
      glow: "hover:shadow-2xl hover:shadow-rose-500/25",
      gentle: "hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-200/50",
    },
  },

  // 🧩 Component Styles
  components: {
    button: {
      primary:
        "bg-gradient-to-r from-rose-400 via-pink-300 to-orange-200 hover:from-rose-500 hover:via-pink-400 hover:to-orange-300 text-white font-medium py-4 px-8 rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 shadow-lg shadow-rose-200/50",
      secondary:
        "bg-white text-rose-600 border-2 border-rose-200 font-medium py-4 px-8 rounded-2xl hover:bg-rose-50 hover:border-rose-300 transition-all duration-300",
      outline:
        "border-2 border-rose-400 text-rose-600 font-medium py-4 px-8 rounded-2xl hover:bg-rose-400 hover:text-white transition-all duration-300",
      ghost:
        "text-rose-600 hover:bg-rose-50 font-medium py-4 px-8 rounded-2xl transition-all duration-300",
    },

    card: {
      default:
        "bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-rose-500/10 border border-rose-100/50 transition-all duration-300",
      hover: "hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/20",
      gradient:
        "bg-gradient-to-br from-white via-rose-50/30 to-orange-50/20 rounded-3xl shadow-lg border border-rose-100/50",
      glass:
        "bg-white/60 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl",
    },

    input: {
      default:
        "w-full px-6 py-4 border-2 border-rose-200 rounded-2xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all duration-300 bg-white/80 backdrop-blur-sm",
      error: "border-red-300 focus:ring-red-300 focus:border-red-400",
    },
  },

  // 📱 Responsive Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// 🎨 CSS Custom Properties Generator
export const generateCSSVariables = () => {
  return `
    :root {
      /* Primary Rose Colors */
      --color-primary-50: #fdf2f8;
      --color-primary-400: #f472b6;
      --color-primary-500: #ec4899;
      --color-primary-600: #db2777;
      
      /* Secondary Cream Colors */
      --color-secondary-50: #fffbf5;
      --color-secondary-200: #fed7aa;
      --color-secondary-400: #fb923c;
      
      /* Typography */
      --font-family-sans: 'Nunito', 'Inter', system-ui, sans-serif;
      --font-family-heading: 'Playfair Display', Georgia, serif;
      --font-family-body: 'Source Sans Pro', system-ui, sans-serif;
      --font-family-accent: 'Dancing Script', cursive;
    }
  `;
};

// 🎯 Utility Functions
export const getGradientClasses = (type = "primary") => {
  return `${themeConfig.gradients[type]} ${
    themeConfig.gradients[type + "Hover"] || ""
  }`;
};

export const getButtonClasses = (variant = "primary", size = "default") => {
  const baseClasses = themeConfig.effects.transition.default;
  const variantClasses =
    themeConfig.components.button[variant] ||
    themeConfig.components.button.primary;

  return `${baseClasses} ${variantClasses}`;
};

export const getCardClasses = (variant = "default", hover = false) => {
  const baseClasses = themeConfig.components.card[variant];
  const hoverClasses = hover ? themeConfig.components.card.hover : "";

  return `${baseClasses} ${hoverClasses}`;
};

export default themeConfig;
