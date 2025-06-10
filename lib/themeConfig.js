// 🎨 SIMPLE THEME CONFIGURATION
// Change ONLY these values to transform your entire app!

export const THEME_SETTINGS = {
  // 🎨 MAIN COLORS (Change these to rebrand everything!)
  colors: {
    primary: "#ec4899", // Main brand color (rose)
    primaryLight: "#f9a8d4", // Lighter version
    primaryDark: "#be185d", // Darker version

    secondary: "#fb923c", // Secondary color (cream/orange)
    secondaryLight: "#fed7aa", // Lighter version
    secondaryDark: "#ea580c", // Darker version

    accent: "#22c55e", // Accent color (sage green)

    // Neutrals (usually don't need to change)
    white: "#ffffff",
    black: "#000000",
    gray: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
  },

  // ✍️ FONTS (Change these to update typography)
  fonts: {
    heading: "Playfair Display", // For titles
    body: "Nunito", // For paragraphs
    accent: "Dancing Script", // For special text
  },

  // 🎯 STYLE PREFERENCES
  style: {
    roundness: "1.5rem", // How rounded corners should be
    shadowIntensity: "lg", // sm, md, lg, xl
    animationSpeed: "300ms", // How fast transitions are
  },
};

// 🚀 AUTO-GENERATED THEME (Don't touch this!)
export const themeConfig = {
  colors: THEME_SETTINGS.colors,

  gradients: {
    primary: `linear-gradient(135deg, ${THEME_SETTINGS.colors.primary}, ${THEME_SETTINGS.colors.primaryLight})`,
    secondary: `linear-gradient(135deg, ${THEME_SETTINGS.colors.secondary}, ${THEME_SETTINGS.colors.secondaryLight})`,
    background: `linear-gradient(135deg, ${THEME_SETTINGS.colors.primaryLight}20, ${THEME_SETTINGS.colors.secondaryLight}20)`,
  },

  fonts: THEME_SETTINGS.fonts,
  style: THEME_SETTINGS.style,
};

export default themeConfig;
