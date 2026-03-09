import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
}
