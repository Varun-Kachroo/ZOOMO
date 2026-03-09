import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ onProfileOpen }) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 
      backdrop-blur-lg bg-white/70 dark:bg-black/40
      border-b border-black/5 dark:border-white/10 
      shadow-sm transition-colors">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/zoomo-mascot.png"
            className="w-12 h-12"
            alt="Zoomo Mascot"
          />
          <h1 className="text-2xl font-bold tracking-tight dark:text-white">
            Zoomo Eats
          </h1>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-6 dark:text-white">
          <a href="#features" className="hover:text-emerald-500 transition">Features</a>
          <a href="#restaurants" className="hover:text-emerald-500 transition">Restaurants</a>
          <a href="#contact" className="hover:text-emerald-500 transition">Contact</a>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* If not authenticated */}
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 
                text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white 
                hover:bg-emerald-500 transition shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* If authenticated */}
          {isAuthenticated && (
            <>
              <button
                onClick={onProfileOpen}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-white/10 
                text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition"
              >
                {user?.name || "Hello User"}
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white 
                hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
