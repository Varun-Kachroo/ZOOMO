import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Login";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoutes";
import { AdminAuthProvider } from "./context/AdminAuthContext";

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />} />

          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminRoutes />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
