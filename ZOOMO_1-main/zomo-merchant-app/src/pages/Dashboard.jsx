// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const restaurantRes = await api.get("/merchant/restaurants/me");
        const restaurantId = restaurantRes?.data?.id;

        // ✅ FIX: a brand-new merchant has no restaurant yet.
        // Instead of crashing on `.id` of an undefined object,
        // send them to onboarding to create one.
        if (!restaurantId) {
          navigate("/onboarding", { replace: true });
          return;
        }

        const ordersRes = await api.get(
          `/merchant/restaurants/${restaurantId}/orders`
        );

        const dishesRes = await api.get("/merchant/dishes");

        const orders = ordersRes.data ?? [];
        const dishes = dishesRes.data ?? [];

        const today = new Date().toDateString();

        const todayOrders = orders.filter(
          (o) =>
            new Date(o.createdAt).toDateString() === today
        );

        const pendingOrders = orders.filter(
          (o) => o.status === "PENDING"
        );

        const revenueToday = todayOrders.reduce(
          (sum, o) => sum + o.total,
          0
        );

        setStats({
          totalOrdersToday: todayOrders.length,
          pendingOrders: pendingOrders.length,
          revenueToday,
          activeDishes: dishes.filter(
            (d) => d.isAvailable
          ).length,
        });

        setRecentOrders(
          orders.slice(0, 5).map((o) => ({
            id: o.id,
            customer: o.user?.name || "Customer",
            total: o.total,
            status: o.status,
          }))
        );
      } catch (err) {
        // ✅ FIX: if the restaurant lookup itself fails (404, network
        // error, etc.) treat it the same way — go to onboarding rather
        // than silently failing into a render crash.
        const status = err?.response?.status;
        if (status === 404) {
          navigate("/onboarding", { replace: true });
          return;
        }
        console.error("Dashboard load failed:", err);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        Loading dashboard...
      </p>
    );
  }

  // ✅ FIX: render a real error state instead of crashing on `stats.x`
  // when stats is null (e.g. an unexpected API failure).
  if (loadError || !stats) {
    return (
      <div className="rounded-3xl bg-white/95 dark:bg-[#141414] border border-black/5 dark:border-white/10 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Couldn't load dashboard
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Something went wrong while fetching your restaurant data.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-emerald-600 font-semibold hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Overview of today’s activity
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Orders Today"
          value={stats.totalOrdersToday}
          onClick={() => navigate("/orders")}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          highlight
          onClick={() => navigate("/orders")}
        />
        <StatCard
          title="Revenue Today"
          value={`₹${stats.revenueToday}`}
        />
        <StatCard
          title="Active Dishes"
          value={stats.activeDishes}
          onClick={() => navigate("/menu")}
        />
      </div>

      {/* ================= RECENT ORDERS ================= */}
      <div
        className="
          rounded-3xl
          bg-white/95 dark:bg-[#141414]
          border border-black/5 dark:border-white/10
          p-6
        "
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <button
            onClick={() => navigate("/orders")}
            className="text-sm text-emerald-600 hover:underline"
          >
            View all
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No orders yet today.
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="
                  flex justify-between text-sm
                  bg-gray-100 dark:bg-[#1f1f1f]
                  rounded-xl px-4 py-3
                "
              >
                <span className="text-gray-800 dark:text-gray-200">
                  {o.customer}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{o.total}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= SHORTCUTS ================= */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Shortcut
          title="Manage Menu"
          desc="Add, edit or disable dishes"
          onClick={() => navigate("/menu")}
        />
        <Shortcut
          title="Restaurant Profile"
          desc="Update restaurant details"
          onClick={() => navigate("/restaurant")}
        />
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, onClick, highlight }) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer
        rounded-3xl
        p-6
        bg-white/95 dark:bg-[#141414]
        border border-black/5 dark:border-white/10
        transition
        hover:shadow-lg
        ${highlight ? "ring-2 ring-emerald-500/40" : ""}
      `}
    >
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {title}
      </p>
      <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function Shortcut({ title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        rounded-3xl
        p-6
        bg-white/95 dark:bg-[#141414]
        border border-black/5 dark:border-white/10
        hover:shadow-lg
        transition
      "
    >
      <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {desc}
      </p>
    </div>
  );
}