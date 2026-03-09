import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/Home";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import ProtectedRoute from "./ProtectedRoute";
import DeliveryComplete from "../pages/DeliveryComplete";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
  path="/delivery-complete"
  element={
    <ProtectedRoute>
      <DeliveryComplete />
    </ProtectedRoute>
  }
/>
    <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>



        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
