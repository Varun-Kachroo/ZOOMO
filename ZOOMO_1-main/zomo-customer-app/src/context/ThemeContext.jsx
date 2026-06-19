import { createContext } from "react";

const ThemeContext = createContext(false);

export const ThemeProvider = ({ children }) => {
  // Light mode — remove dark class so Tailwind doesn't override
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("light");
  return (
    <ThemeContext.Provider value={false}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;