import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  FiHome,
  FiList,
  FiShoppingBag,
  FiLogOut,
  FiSun,
  FiMoon
} from "react-icons/fi";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-black transition-colors">

      {/* ================= Sidebar ================= */}
      <aside className="relative w-64 flex flex-col
                        bg-white/80 dark:bg-[#0f0f0f]
                        backdrop-blur
                        border-r border-black/10 dark:border-white/10">

        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3">
          <img
            src="/zoomo-logo.png"
            alt="Zoomo Logo"
            className="w-9 h-9 rounded-xl object-cover"
          />
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            ZOOMO <span className="text-emerald-500">Merchant</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          <SidebarLink to="/dashboard" icon={<FiHome />} label="Dashboard" />
          <SidebarLink to="/orders" icon={<FiShoppingBag />} label="Orders" />
          <SidebarLink to="/menu" icon={<FiList />} label="Menu" />
          <SidebarLink to="/restaurant" icon={<FiHome />} label="Restaurant" />
        </nav>

        {/* Bottom section */}
        <div className="px-4 py-4 border-t border-black/10 dark:border-white/10 space-y-3">

          {/* Theme toggle */}
          <button
            onClick={() => setDark(v => !v)}
            className="w-full flex items-center justify-center gap-2
                       px-3 py-2 rounded-xl
                       bg-gray-100 dark:bg-white/10
                       text-gray-800 dark:text-white"
          >
            {dark ? <FiSun /> : <FiMoon />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2
                       px-3 py-2 rounded-xl
                       text-red-500 hover:bg-red-500/10"
          >
            <FiLogOut />
            Logout
          </button>
        </div>

        {/* Mascot (subtle) */}
        <img
          src="/zoomo-mascot.png"
          alt="Zoomo Mascot"
          className="pointer-events-none absolute bottom-3 right-3
                     w-24 opacity-[0.08] dark:opacity-[0.12]"
        />
      </aside>

      {/* ================= Main ================= */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="h-14 px-6 flex items-center justify-between
                           bg-white/80 dark:bg-[#0f0f0f]
                           backdrop-blur
                           border-b border-black/10 dark:border-white/10">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Welcome,{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

/* ---------------- Sidebar Link ---------------- */
function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition
        ${
          isActive
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
