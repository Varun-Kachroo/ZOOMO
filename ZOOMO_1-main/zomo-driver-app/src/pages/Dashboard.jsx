import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { fetchDriverDashboard } from "../services/driverApi";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon, FiTrendingUp, FiPackage } from "react-icons/fi";

export default function Dashboard() {
  const { isDark, toggleTheme } = useTheme();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDriverDashboard()
      .then(setStats)
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Today’s Performance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your delivery summary for today
          </p>
        </div>

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full border
                     border-gray-300 dark:border-white/20
                     hover:opacity-80 transition"
          aria-label="Toggle theme"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* ORDERS */}
        <div
          className="rounded-2xl p-4 border
                     bg-white dark:bg-black
                     border-gray-200 dark:border-white/10"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center
                         bg-emerald-100 dark:bg-emerald-500/10"
            >
              <FiPackage className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Orders Delivered
              </p>
              <p className="text-2xl font-semibold">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        {/* EARNINGS */}
        <div
          className="rounded-2xl p-4 border
                     bg-white dark:bg-black
                     border-gray-200 dark:border-white/10"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center
                         bg-emerald-100 dark:bg-emerald-500/10"
            >
              <FiTrendingUp className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Earnings
              </p>
              <p className="text-2xl font-semibold">
                ₹{stats.totalEarnings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LAST DELIVERY */}
      {stats.lastDeliveryAt && (
        <div
          className="rounded-xl p-4 border text-center
                     bg-gray-50 dark:bg-white/5
                     border-gray-200 dark:border-white/10"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last delivery completed at
          </p>
          <p className="mt-1 font-medium">
            {new Date(stats.lastDeliveryAt).toLocaleTimeString()}
          </p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
