import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiBarChart2,
} from "react-icons/fi";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.startsWith(path);

  const navItem = (path, label, Icon) => {
    const active = isActive(path);

    return (
      <button
        onClick={() => navigate(path)}
        className={`
          flex flex-col items-center justify-center gap-1
          flex-1 py-2
          transition
          ${
            active
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-500 dark:text-gray-400"
          }
        `}
      >
        <Icon size={20} />
        <span
          className={`text-xs ${
            active ? "font-semibold" : ""
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-white/90 dark:bg-black/80
        backdrop-blur
        border-t border-gray-200 dark:border-white/10
        flex
      "
    >
      {navItem("/home", "Home", FiHome)}
      {navItem("/orders", "Orders", FiPackage)}
      {navItem("/dashboard", "Dashboard", FiBarChart2)}
    </div>
  );
}
