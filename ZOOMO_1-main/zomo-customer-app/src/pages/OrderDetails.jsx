import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { api } from "../services/api";
import { MascotLoader } from "./LandingPage";

const STATUS_STYLE = {
  PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  PREPARING: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  DELIVERED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MascotLoader text="Loading order details..." />;
  if (!order) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-gray-500">Order not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/orders")} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition">
            <FiArrowLeft />
          </button>
          <h1 className="text-xl font-bold">Order #{order.id.slice(0, 6).toUpperCase()}</h1>
          <span className={`ml-auto text-xs px-3 py-1 rounded-xl border font-medium ${STATUS_STYLE[order.status] || "text-gray-400 bg-white/10 border-white/10"}`}>
            {order.status}
          </span>
        </div>

        <div className="space-y-4">
          {/* Restaurant */}
          <Card title="Restaurant">
            <p className="text-white font-medium">{order.restaurant?.name}</p>
            <p className="text-gray-400 text-xs mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
          </Card>

          {/* Items */}
          <Card title="Items Ordered">
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.dish.name} × {item.quantity}</span>
                  <span className="text-white font-medium">₹{item.dish.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Bill */}
          <Card title="Bill Summary">
            <div className="space-y-2 text-sm text-gray-400">
              {order.subtotal && <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>}
              {order.deliveryFee && <div className="flex justify-between"><span>Delivery</span><span>₹{order.deliveryFee}</span></div>}
              {order.tax && <div className="flex justify-between"><span>Tax</span><span>₹{order.tax}</span></div>}
              <div className="flex justify-between text-white font-bold text-base border-t border-white/10 pt-2">
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>
          </Card>

          {/* Payment */}
          {order.payment && (
            <Card title="Payment">
              <div className="text-sm space-y-1 text-gray-300">
                <div className="flex justify-between"><span>Method</span><span className="text-white">{order.payment.provider}</span></div>
                <div className="flex justify-between"><span>Status</span><span className="text-emerald-400">{order.payment.status}</span></div>
                <div className="flex justify-between"><span>Amount</span><span className="text-white">₹{order.payment.amount}</span></div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="p-5 rounded-2xl bg-[#111] border border-white/10">
      <h3 className="font-semibold text-white mb-3 text-sm">{title}</h3>
      {children}
    </div>
  );
}
