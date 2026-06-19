import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import OrderCard from "../components/OrderCard";
import OrderFilters from "../components/OrderFilters";
import { ORDER_FILTERS } from "../utils/orderFilters";
import api from "../services/api";

/* ── Scheduled order card with countdown ── */
function ScheduledOrderCard({ order, onAccept }) {
  const scheduledTime = new Date(order.scheduledFor);
  const minutesLeft = Math.round((scheduledTime - new Date()) / 60000);
  const isUrgent = minutesLeft <= 30 && minutesLeft > 0;
  const isPast = minutesLeft <= 0;

  return (
    <div className={`p-4 rounded-2xl border transition ${
      isPast    ? "border-red-500/50 bg-red-500/10" :
      isUrgent  ? "border-orange-500/50 bg-orange-500/10 animate-pulse" :
                  "border-blue-500/30 bg-blue-500/10"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isPast || isUrgent
            ? <FiAlertCircle className={isPast ? "text-red-400" : "text-orange-400"} size={16} />
            : <FiClock className="text-blue-400" size={16} />
          }
          <span className="font-semibold text-white text-sm">
            Order #{order.id.slice(0, 6).toUpperCase()}
          </span>
          <span className="text-xs text-gray-400">· {order.customerName}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
          isPast   ? "bg-red-500/20 text-red-400" :
          isUrgent ? "bg-orange-500/20 text-orange-400" :
                     "bg-blue-500/20 text-blue-400"
        }`}>
          {isPast ? "⚠ Overdue!" : isUrgent ? `⏰ ${minutesLeft} min` : `🕐 ${minutesLeft} min away`}
        </span>
      </div>

      <p className="text-gray-400 text-xs mb-1">
        📅 {scheduledTime.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
      </p>
      <p className="text-gray-400 text-xs mb-3">
        {order.items?.length} item(s) · ₹{order.total}
      </p>

      {/* Only show accept button when within 30 min or overdue */}
      {(isUrgent || isPast) && (
        <button
          onClick={() => onAccept(order.id)}
          className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition"
        >
          Accept & Start Preparing
        </button>
      )}
    </div>
  );
}

export default function Orders() {
  const navigate = useNavigate();

  const [restaurantId, setRestaurantId]   = useState(null);
  const [activeFilter, setActiveFilter]   = useState("ALL");
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const restaurantRes = await api.get("/merchant/restaurants/me");
      const restId = restaurantRes.data.id;
      setRestaurantId(restId);

      const ordersRes = await api.get(`/merchant/restaurants/${restId}/orders`);
      const normalized = ordersRes.data.map((order) => ({
        id: order.id,
        customerName: order.user?.name || "Customer",
        status: order.status,
        total: order.total,
        items: order.items,
        createdAt: order.createdAt,
        scheduledFor: order.scheduledFor ?? null,   // ✅ NEW
      }));
      setOrders(normalized);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  /* ── Accept scheduled order → move to PENDING ── */
  async function handleAcceptScheduled(orderId) {
    try {
      await api.patch(`/merchant/orders/${orderId}/status`, { status: "PENDING" });
      fetchOrders();
    } catch {
      alert("Failed to accept order");
    }
  }

  const scheduledOrders = orders.filter(o => o.status === "SCHEDULED");
  const filteredOrders  = orders
    .filter(o => o.status !== "SCHEDULED") // exclude from main list
    .filter(o => ORDER_FILTERS[activeFilter]?.match(o) ?? true);

  if (loading) return <p className="text-gray-500">Loading orders...</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition text-sm"
        >
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Scheduled Orders Panel ── */}
      {scheduledOrders.length > 0 && (
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <FiClock className="text-blue-400" size={15} />
            <h2 className="text-white font-semibold text-sm">
              Scheduled Orders
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
              {scheduledOrders.length}
            </span>
          </div>
          {scheduledOrders.map(order => (
            <ScheduledOrderCard
              key={order.id}
              order={order}
              onAccept={handleAcceptScheduled}
            />
          ))}
        </div>
      )}

      {/* ── Regular Orders ── */}
      <OrderFilters active={activeFilter} onChange={setActiveFilter} />

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">No orders in this category.</p>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => navigate(`/orders/${restaurantId}/${order.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}