import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:3000/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Admin JWT automatically
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;

// -------- Named API helpers --------

export function assignDriver(orderId, driverId) {
  return adminApi.patch(`/orders/${orderId}/assign-driver`, {
    driverId,
  });
}

export function getOrders() {
  return adminApi.get("/orders");
}

export function getDrivers() {
  return adminApi.get("/drivers");
}
