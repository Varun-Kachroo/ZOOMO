import AppRoutes from "./routes/AppRoutes";
import { DriverAuthProvider } from "./context/DriverAuthContext";
import { ThemeProvider } from "./context/ThemeContext";
export default function App() {
  return (
    <ThemeProvider>
      <DriverAuthProvider>
        <AppRoutes />
      </DriverAuthProvider>
    </ThemeProvider>
  );
}
