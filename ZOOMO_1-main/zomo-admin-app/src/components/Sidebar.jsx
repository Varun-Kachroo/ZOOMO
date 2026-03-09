import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6 text-xl font-bold text-emerald-600">
        ZOOMO ADMIN
      </div>

      <nav className="px-4 space-y-2">
        <SidebarItem to="/admin/orders" label="Orders" />
        <SidebarItem to="/admin/drivers" label="Drivers" />
      </nav>
    </aside>
  );
}

function SidebarItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg text-sm font-medium
        ${
          isActive
            ? "bg-emerald-600 text-white"
            : "text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
