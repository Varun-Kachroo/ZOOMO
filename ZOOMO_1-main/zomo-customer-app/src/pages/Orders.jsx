import { useEffect, useState, useContext } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dark } = useContext(ThemeContext);

  // Load orders
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/orders/mine");
        setOrders(res || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Styling helpers
  const statusColor = {
    PENDING: "text-yellow-500",
    CONFIRMED: "text-blue-500",
    PREPARING: "text-orange-500",
    ON_THE_WAY: "text-purple-500",
    DELIVERED: "text-emerald-500",
    CANCELLED: "text-red-500",
  };

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString();
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <div
        className={`p-6 text-center ${
          dark ? "text-white" : "text-black"
        }`}
      >
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        className={`p-6 text-center ${
          dark ? "text-white" : "text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-3">No Orders Yet</h2>
        <p className="mb-4">Start exploring and place your first order! 🍕🍔</p>

        <Link
          to="/restaurants"
          className="px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 py-24 transition-colors ${
        dark ? "bg-black text-white" : "bg-[#f8fffb] text-black"
      }`}
    >
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        <div className="space-y-5">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className={`
                block p-6 rounded-2xl backdrop-blur-xl border
                transition shadow-[0_8px_24px_-12px_rgba(0,0,0,0.2)]
                hover:shadow-[0_12px_30px_-10px_rgba(16,185,129,0.4)]
                ${dark ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
              `}
            >
              {/* Top Line */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">
                  Order #{order.id.slice(0, 6).toUpperCase()}
                </h2>

                <span className={`font-semibold ${statusColor[order.status]}`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>

              {/* Restaurant */}
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {order.restaurant?.name || "Restaurant Unavailable"}
              </p>

              {/* Date */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(order.createdAt)}
              </p>

              {/* Total */}
              <p className="text-lg font-semibold mt-3">
                Total: ₹{order.total ?? order.subtotal}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
