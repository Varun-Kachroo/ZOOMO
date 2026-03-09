import { useAdminAuth } from "../context/AdminAuthContext";
import { FiBell, FiLogOut } from "react-icons/fi";

export default function Topbar() {
  const { logout } = useAdminAuth();
  return (
    <header className="h-16 bg-black border-b border-white/10 flex items-center justify-between px-6">
      <div>
        <h1 className="text-white font-semibold text-base">Dashboard</h1>
        <p className="text-gray-500 text-xs">Welcome back, Admin</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400 text-xs font-medium">Live</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition text-sm"
        >
          <FiLogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
}
