import { createContext } from "react";

const ThemeContext = createContext(true);

export const ThemeProvider = ({ children }) => {
  // Force dark mode always — no toggle, no localStorage
  document.documentElement.classList.add("dark");
  document.documentElement.classList.remove("light");
  return (
    <ThemeContext.Provider value={true}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
