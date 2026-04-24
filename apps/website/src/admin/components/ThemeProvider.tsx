import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";
export type ColorPalette = "indigo" | "emerald" | "rose" | "amber";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColor?: ColorPalette;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  color: ColorPalette;
  setTheme: (theme: Theme) => void;
  setColor: (color: ColorPalette) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  color: "indigo",
  setTheme: () => null,
  setColor: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  defaultColor = "indigo",
  storageKey = "balance-church-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(`${storageKey}-mode`) as Theme) || defaultTheme
  );
  
  const [color, setColor] = useState<ColorPalette>(
    () => (localStorage.getItem(`${storageKey}-color`) as ColorPalette) || defaultColor
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, color]);

  const value = {
    theme,
    color,
    setTheme: (theme: Theme) => {
      localStorage.setItem(`${storageKey}-mode`, theme);
      setTheme(theme);
    },
    setColor: (color: ColorPalette) => {
      localStorage.setItem(`${storageKey}-color`, color);
      setColor(color);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
