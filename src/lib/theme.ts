export type Theme = "light" | "dark" | "system";

export const STORAGE_KEY = "theme-preference";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getThemeFromStorage(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Theme) || null;
  } catch {
    return null;
  }
}

export function saveThemeToStorage(theme: Theme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;

  const resolvedTheme = resolveTheme(theme);
  const html = document.documentElement;

  if (resolvedTheme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}
