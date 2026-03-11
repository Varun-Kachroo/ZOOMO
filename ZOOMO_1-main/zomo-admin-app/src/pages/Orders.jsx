import { useEffect, useState } from "react";
import AssignDriverModal from "../components/AssignDriverModal";
import { getOrders } from "../services/adminApi";
import { FiRefreshCw, FiTruck } from "react-icons/fi";

const STATUS_COLORS = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  PREPARING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  READY_FOR_PICKUP: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  OUT_FOR_DELIVERY: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Orders</h2>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition text-sm"
        >
          <FiRefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-gray-400 font-medium">Order ID</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Restaurant</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Customer</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Address</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Driver</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              )}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
              {!loading && orders.map((order) => (
                <tr key={order.id} className="border-t border-white/5 hover:bg-white/5 transition">

                  {/* Order ID */}
                  <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                    #{order.id?.slice(0, 8)}
                  </td>

                  {/* ✅ FIXED: was order.restaurantName */}
                  <td className="px-6 py-4 text-white font-medium">
                    {order.restaurant?.name || "—"}
                  </td>

                  {/* ✅ FIXED: customer name from nested user object */}
                  <td className="px-6 py-4 text-gray-400">
                    {order.user?.name || "—"}
                  </td>

                  {/* ✅ FIXED: was order.customerAddress */}
                  <td className="px-6 py-4 text-gray-400">
                    {order.address
                      ? `${order.address.street}, ${order.address.city}`
                      : "—"}
                  </td>

                  {/* Status badge */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[order.status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* Driver */}
                  <td className="px-6 py-4">
                    {order.driverId ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                        <FiTruck size={13} /> {order.driver?.user?.name || "Assigned"}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">Unassigned</span>
                    )}
                  </td>

                  {/* ✅ FIXED: only enable for READY_FOR_PICKUP unassigned orders */}
                  <td className="px-6 py-4">
                    <button
                      disabled={!!order.driverId || order.status !== "READY_FOR_PICKUP"}
                      onClick={() => setSelectedOrder(order)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${!order.driverId && order.status === "READY_FOR_PICKUP"
                          ? "bg-emerald-600 text-white hover:bg-emerald-500"
                          : "bg-white/5 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                      {order.driverId ? "Assigned" : "Assign Driver"}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <AssignDriverModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAssigned={() => { setSelectedOrder(null); fetchOrders(); }}
        />
      )}
    </div>
  );
}

