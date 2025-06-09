"use client";

import { createContext, useContext } from "react";
import themeConfig from "@/lib/themeConfig";

const ThemeContext = createContext(themeConfig);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={themeConfig}>
      {children}
    </ThemeContext.Provider>
  );
}
