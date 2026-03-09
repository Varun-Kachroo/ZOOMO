import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import ThemeContext from "../context/ThemeContext";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { dark } = useContext(ThemeContext);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res);
      } catch (err) {
        console.error("Failed to load order:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading)
    return (
      <div className={`p-6 ${dark ? "text-white" : "text-black"}`}>
        Loading order details...
      </div>
    );

  if (!order)
    return (
      <div className={`p-6 ${dark ? "text-white" : "text-black"}`}>
        Order not found.
      </div>
    );

  // Status colors
  const statusColor = {
    PENDING: "bg-yellow-500/20 text-yellow-500",
    CONFIRMED: "bg-blue-500/20 text-blue-500",
    PREPARING: "bg-orange-500/20 text-orange-500",
    ON_THE_WAY: "bg-purple-500/20 text-purple-500",
    DELIVERED: "bg-emerald-500/20 text-emerald-500",
    CANCELLED: "bg-red-500/20 text-red-500",
  };

  return (
    <div
      className={`min-h-screen px-4 py-24 transition-colors ${
        dark ? "bg-black text-white" : "bg-[#f8fffb] text-black"
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <h1 className="text-3xl font-bold">Order Details</h1>

        {/* Order Summary Card */}
        <div
          className={`
            p-6 rounded-2xl backdrop-blur-xl border shadow-lg
            ${dark ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">
              Order #{order.id.slice(0, 6).toUpperCase()}
            </h2>

            <span
              className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                statusColor[order.status]
              }`}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            <strong>Restaurant:</strong> {order.restaurant?.name}
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Ordered on: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Items List */}
        <div
          className={`
            p-6 rounded-2xl backdrop-blur-xl border shadow-lg
            ${dark ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
          `}
        >
          <h2 className="text-xl font-semibold mb-3">Items</h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-3 border-b border-white/10"
              >
                <span>
                  {item.dish.name} × {item.quantity}
                </span>
                <span className="font-semibold">
                  ₹{item.dish.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div
          className={`
            p-6 rounded-2xl backdrop-blur-xl border shadow-lg
            ${dark ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
          `}
        >
          <h2 className="text-xl font-semibold mb-3">Bill Summary</h2>

          <div className="space-y-2">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </p>

            {order.deliveryFee && (
              <p className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee}</span>
              </p>
            )}

            {order.tax && (
              <p className="flex justify-between">
                <span>Tax</span>
                <span>₹{order.tax}</span>
              </p>
            )}

            <div className="border-t border-white/10 my-2" />

            <p className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{order.total}</span>
            </p>
          </div>
        </div>

        {/* Payment */}
        <div
          className={`
            p-6 rounded-2xl backdrop-blur-xl border shadow-lg
            ${dark ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
          `}
        >
          <h2 className="text-xl font-semibold mb-3">Payment</h2>

          {order.payment ? (
            <div className="space-y-1">
              <p>
                <strong>Method:</strong> {order.payment.provider}
              </p>
              <p>
                <strong>Status:</strong> {order.payment.status}
              </p>
              <p>
                <strong>Amount:</strong> ₹{order.payment.amount}
              </p>
            </div>
          ) : (
            <p className="text-orange-500 font-medium">
              Payment Pending (COD)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
