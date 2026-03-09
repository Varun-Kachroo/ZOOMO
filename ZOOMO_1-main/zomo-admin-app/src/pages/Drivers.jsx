import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import { FiTruck, FiRefreshCw } from "react-icons/fi";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchDrivers() {
    try {
      setLoading(true);
      const res = await adminApi.get("drivers");
      setDrivers(res.data);
    } catch {
      alert("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchDrivers(); }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Drivers</h2>
          <p className="text-gray-500 text-sm mt-1">{drivers.length} registered drivers</p>
        </div>
        <button
          onClick={fetchDrivers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition text-sm"
        >
          <FiRefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Drivers", value: drivers.length },
          { label: "Online", value: drivers.filter(d => d.isAvailable).length },
          { label: "Offline", value: drivers.filter(d => !d.isAvailable).length },
          { label: "Active Orders", value: drivers.filter(d => d.activeOrderCount > 0).length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-gray-400 font-medium">Driver</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Vehicle</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Active Orders</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Loading drivers...
                  </td>
                </tr>
              )}
              {!loading && drivers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No drivers found
                  </td>
                </tr>
              )}
              {!loading && drivers.map((driver) => (
                <tr key={driver.id} className="border-t border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold text-sm">
                        {driver.user?.name?.[0] || "D"}
                      </div>
                      <span className="text-white font-medium">
                        {driver.user?.name || "Unknown Driver"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {driver.vehicleType || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {driver.isAvailable ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Online
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-500 border border-gray-500/20">
                        Offline
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {driver.activeOrderCount ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
