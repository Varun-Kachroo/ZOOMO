import { useNavigate } from "react-router-dom";
import { useDriverAuth } from "../context/DriverAuthContext";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { updateAvailability } from "../services/driverApi";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const {
  logout,
  driver,
  updateDriverAvailabilityLocally,
} = useDriverAuth();

const isOnline = Boolean(driver?.isAvailable);

const toggleAvailability = async () => {
  if (!driver) return;


  updateDriverAvailabilityLocally(!isOnline);

  try {
    setLoading(true);
    await updateAvailability(!isOnline);
  } catch {
    
    updateDriverAvailabilityLocally(isOnline);
    alert("Failed to update availability");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen px-4 pt-5 pb-28 bg-white dark:bg-black">
      {/* HEADER */}
      {/* HEADER */}
<div className="flex items-center justify-between mb-8">
  {/* LEFT: LOGO + TEXT */}
  <div className="flex items-center gap-3">
    <img
      src="/zoomo-logo.png"
      alt="Zoomo"
      className="w-10 h-10 rounded-full object-contain"
    />

    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        Welcome
      </p>
      <h1 className="text-xl font-semibold">
        {driver?.name ?? "Driver"}
      </h1>
    </div>
  </div>


        <div className="flex gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-200 dark:border-white/10"
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-full border border-gray-200 dark:border-white/10 text-red-600"
          >
            <FiLogOut />
          </button>
        </div>
      </div>

      {/* MAIN STATUS */}
      <div
        className={`
          rounded-2xl p-6 mb-6
          ${
            isOnline
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 dark:bg-white/5"
          }
        `}
      >
        <p className="text-sm opacity-90 mb-1">
          Status
        </p>

        <h2 className="text-3xl font-bold mb-4">
          {isOnline ? "ONLINE" : "OFFLINE"}
        </h2>

        <button
          onClick={toggleAvailability}
          disabled={loading}
          className={`
            w-full py-4 rounded-xl text-lg font-semibold
            transition
            ${
              isOnline
                ? "bg-white text-emerald-700"
                : "bg-emerald-600 text-white"
            }
            disabled:opacity-60
          `}
        >
          {loading
            ? "Updating..."
            : isOnline
            ? "Go Offline"
            : "Go Online"}
        </button>
      </div>

      {/* CONTEXT */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {isOnline
          ? "You will start receiving delivery requests"
          : "You must be online to receive delivery requests"}
      </p>

      {/* CTA */}
      {isOnline && (
        <button
          onClick={() => navigate("/orders")}
          className="mt-6 w-full py-4 rounded-xl
                     border border-emerald-600
                     text-emerald-600 font-semibold"
        >
          View Assigned Orders
        </button>
      )}

      <BottomNav />
    </div>
  );
}
