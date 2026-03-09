import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import OrderStatusActions from "../components/OrderStatusActions";
import CancelOrderButton from "../components/CancelOrderButton";
import api from "../services/api";

export default function OrderDetails() {
  const { restaurantId, orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(
          `/merchant/restaurants/${restaurantId}/orders/${orderId}`
        );

        const o = res.data;

        setOrder({
          id: o.id,
          customerName: o.user?.name || "Customer",
          status: o.status,
          total: o.total,
          items: o.items.map((i) => ({
            name: i.dish.name,
            qty: i.quantity,
            price: i.price,
          })),
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [restaurantId, orderId]);

  const updateStatus = async (nextStatus) => {
    try {
      await api.patch(
        `/merchant/restaurants/${restaurantId}/orders/${orderId}/status`,
        { status: nextStatus }
      );

      setOrder((prev) => ({
        ...prev,
        status: nextStatus,
      }));
    } catch {
      alert("Failed to update order status");
    }
  };

  const cancelOrder = async () => {
    try {
      await api.patch(
        `/merchant/restaurants/${restaurantId}/orders/${orderId}/cancel`
      );

      setOrder((prev) => ({
        ...prev,
        status: "CANCELLED",
      }));
    } catch {
      alert("Failed to cancel order");
    }
  };

  if (loading)
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Loading order details...
      </p>
    );

  if (error)
    return (
      <p className="text-red-500">{error}</p>
    );

 return (
  <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
    <div className="w-full max-w-3xl space-y-6">

      {/* ================= HEADER ================= */}
      <div
        className="
          rounded-3xl
          bg-white/95 dark:bg-[#141414]
          border border-black/5 dark:border-white/10
          p-6
          flex items-start justify-between gap-4
          shadow-lg
        "
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Order #{order.id.slice(0, 6)}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Customer: {order.customerName}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* ================= ITEMS ================= */}
      <div
        className="
          rounded-3xl
          bg-white/95 dark:bg-[#141414]
          border border-black/5 dark:border-white/10
          p-6 shadow-md
        "
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ordered Items
        </h2>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between
                         text-sm
                         bg-gray-100 dark:bg-[#1f1f1f]
                         rounded-2xl
                         px-4 py-3"
            >
              <span className="text-gray-800 dark:text-gray-200">
                {item.name} × {item.qty}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{item.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div
        className="
          rounded-3xl
          bg-white/95 dark:bg-[#141414]
          border border-black/5 dark:border-white/10
          p-6
          flex flex-col sm:flex-row
          items-start sm:items-center
          justify-between
          gap-4 shadow-lg
        "
      >
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          Total: ₹{order.total}
        </div>

        <div className="flex gap-3">
          <CancelOrderButton status={order.status} onCancel={cancelOrder} />
          <OrderStatusActions status={order.status} onUpdate={updateStatus} />
        </div>
      </div>

    </div>
  </div>
);

}
