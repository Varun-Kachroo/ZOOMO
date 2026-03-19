import { createContext } from "react";
const ThemeContext = createContext(true);
export const ThemeProvider = ({ children }) => {
  document.documentElement.classList.add("dark");
  return <ThemeContext.Provider value={true}>{children}</ThemeContext.Provider>;
};
export default ThemeContext;
