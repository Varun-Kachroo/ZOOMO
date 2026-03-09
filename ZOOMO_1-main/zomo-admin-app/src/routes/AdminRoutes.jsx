import { Routes, Route, Navigate } from "react-router-dom";
import Orders from "../pages/Orders";
import Drivers from "../pages/Drivers";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="orders" />} />
      <Route path="orders" element={<Orders />} />
      <Route path="drivers" element={<Drivers />} />
    </Routes>
  );
}
