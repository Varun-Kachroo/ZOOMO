import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage } from "react-icons/fi";
import { api } from "../services/api";
import { MascotLoader } from "./LandingPage";

const STATUS_STYLE = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  PREPARING: "text-orange-400 bg-orange-400/10",
  READYFORPICKUP: "text-purple-400 bg-purple-400/10",
  OUTFORDELIVERY: "text-sky-400 bg-sky-400/10",
  DELIVERED: "text-z-accent bg-z-accent/10",
  CANCELLED: "text-red-400 bg-red-400/10",
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/mine")
      .then(res => setOrders(Array.isArray(res) ? res : res?.data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <MascotLoader text="Loading your orders..." />;

  return (
    <div className="min-h-screen bg-z-page text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition">
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <img src="/zoomo-mascot.png" alt="" className="w-24 opacity-30 mx-auto mb-4 animate-float" />
            <h2 className="text-xl font-bold text-white mb-2">No orders yet!</h2>
            <p className="text-gray-500 text-sm mb-5">Start exploring restaurants and place your first order</p>
            <button onClick={() => navigate("/restaurants")} className="px-6 py-3 rounded-2xl bg-z-primary text-white font-semibold hover:bg-z-hover transition">
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="cursor-pointer p-5 rounded-2xl bg-z-card border border-white/10 hover:border-z-accent/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiPackage className="text-z-accent" size={16} />
                    <span className="font-semibold text-white text-sm">Order #{order.id.slice(0, 6).toUpperCase()}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${STATUS_STYLE[order.status] || "text-gray-400 bg-white/10"}`}>
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{order.restaurant?.name || "Restaurant"}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleString()}</span>
                  <span className="text-white font-bold text-sm">₹{order.total ?? order.subtotal}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}