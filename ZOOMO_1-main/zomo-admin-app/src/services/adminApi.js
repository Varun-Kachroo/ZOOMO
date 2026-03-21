import axios from 'axios';

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin`,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default adminApi;

export const assignDriver = (orderId, driverId) =>
  adminApi.patch(`/orders/${orderId}/assign-driver`, { driverId });

export const getOrders = () => adminApi.get('/orders');
export const getDrivers = () => adminApi.get('/drivers');

// ✅ NEW — update order status (used for scheduled order force confirm / cancel)
export const updateOrderStatus = (orderId, status) =>
  adminApi.patch(`/orders/${orderId}/status`, { status });