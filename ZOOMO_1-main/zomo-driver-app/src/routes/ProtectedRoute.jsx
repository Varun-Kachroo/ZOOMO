import { Navigate } from "react-router-dom";
import { useDriverAuth } from "../context/DriverAuthContext";

export default function DriverProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useDriverAuth();

  // ⏳ WAIT until auth state is restored
  if (loading) {
    return null; // or loader
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
