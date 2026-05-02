"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Theme } from "@/lib/theme";
import {
  getThemeFromStorage,
  saveThemeToStorage,
  applyTheme,
  getSystemTheme,
} from "@/lib/theme";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  attribute?: string; // For compatibility
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    saveThemeToStorage(newTheme);
    applyTheme(newTheme);
  }, []);

  // Initialize theme from storage on mount
  useEffect(() => {
    const storedTheme = getThemeFromStorage();
    if (storedTheme) {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    } else {
      applyTheme(defaultTheme);
    }
    setMounted(true);

    // Listen for system theme changes
    if (enableSystem) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const currentTheme = getThemeFromStorage() || defaultTheme;
        if (currentTheme === "system") {
          applyTheme("system");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [defaultTheme, enableSystem]);

  // Apply CSS class transitions
  useEffect(() => {
    if (disableTransitionOnChange) {
      const html = document.documentElement;
      html.style.colorScheme = theme === "system" ? "normal" : theme;
    }
  }, [theme, disableTransitionOnChange]);

  const resolvedTheme = (
    theme === "system" ? getSystemTheme() : theme
  ) as "light" | "dark";

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
  };

  // Prevent hydration mismatch by only rendering context when mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
