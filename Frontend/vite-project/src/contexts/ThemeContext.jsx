import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const [colorScheme, setColorScheme] = useState(() => {
    const saved = localStorage.getItem("colorScheme");
    return saved || "blue";
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("dark");
    root.style.colorScheme = "light";

    document.body.style.display = "none";
    document.body.offsetHeight;
    document.body.style.display = "";

    localStorage.setItem("theme", "light");
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-color-scheme", colorScheme);

    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      root.setAttribute("data-font-size", parsed.fontSize || "medium");
      root.setAttribute("data-compact-mode", parsed.compactMode || "false");
    } else {
      root.setAttribute("data-font-size", "medium");
      root.setAttribute("data-compact-mode", "false");
    }

    localStorage.setItem("theme", "light");
    localStorage.setItem("colorScheme", colorScheme);
  }, [colorScheme]);

  const setThemeSafe = () => {
    setTheme("light");
    localStorage.setItem("theme", "light");
  };

  const value = {
    theme: "light",
    setTheme: setThemeSafe,
    colorScheme,
    setColorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
