import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { fetchAssignedOrders } from "../services/driverApi";
import { useDriverAuth } from "../context/DriverAuthContext";

export default function Orders() {
  const navigate = useNavigate();
  const { driver } = useDriverAuth();

  const isOnline = Boolean(driver?.isAvailable);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===========================
     BLOCK OFFLINE DRIVERS
  ============================ */
  useEffect(() => {
    if (!isOnline) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await fetchAssignedOrders();
        setOrders(data);
      } catch {
        setError("Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isOnline]);

  /* ===========================
     OFFLINE UI
  ============================ */
  if (!isOnline) {
    return (
      <div className="min-h-screen px-4 pt-14 pb-28 flex flex-col items-center text-center bg-white dark:bg-black">
        <h1 className="text-xl font-semibold mb-2">
          You are offline
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          Go online to start receiving and managing delivery orders.
        </p>

        <button
          className="mt-6 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          onClick={() => navigate("/home")}
        >
          Go to Home
        </button>

        <BottomNav />
      </div>
    );
  }

  /* ===========================
     ONLINE UI
  ============================ */
  return (
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white dark:bg-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Deliveries</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Assigned orders to complete
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">
          Loading orders...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="text-center text-red-500 mt-10">
          {error}
        </p>
      )}

      {/* Orders List */}
      {!loading && !error && (
        <div className="space-y-4">
          {orders.map((order) => {
            const isPickup =
              order.status === "READY_FOR_PICKUP";

            return (
              <div
                key={order.id}
                className="
                  rounded-2xl border border-gray-200 dark:border-white/10
                  p-4 shadow-sm
                "
              >
                {/* Top Row */}
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-lg">
                    {order.restaurant.name}
                  </p>

                  <span
                    className={`
                      text-xs font-semibold px-3 py-1 rounded-full
                      ${
                        isPickup
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }
                    `}
                  >
                    {isPickup ? "Pickup" : "On the way"}
                  </span>
                </div>

                {/* Addresses */}
                <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    <span className="font-medium">
                      Pickup:
                    </span>{" "}
                    {order.restaurant.address}
                  </p>

                  <p>
                    <span className="font-medium">
                      Drop:
                    </span>{" "}
                    {order.address.street},{" "}
                    {order.address.city}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-base font-semibold">
                    ₹{order.total}
                  </span>

                  <button
                    onClick={() =>
                      navigate(`/orders/${order.id}`)
                    }
                    className="
                      px-5 py-2 rounded-xl
                      bg-emerald-600 text-white
                      text-sm font-semibold
                    "
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center text-gray-500 mt-16">
              <p className="text-sm font-medium">
                No deliveries assigned yet
              </p>
              <p className="text-xs mt-1">
                Stay online to receive orders
              </p>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
