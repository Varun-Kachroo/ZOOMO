import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogIn, FiUserPlus, FiMapPin } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Inline SVG Z-mark — replaces zoomo-logo.png
function ZLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#0F3D2E" />
      <path d="M8 10H22" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M22 10L10 22" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10 22H24" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const address = localStorage.getItem("ze_address");
  const cartCount = cart?.items?.reduce((t, i) => t + i.quantity, 0) ?? 0;

  return (
    <header className="sticky top-0 z-40 bg-z-gradient backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <ZLogo />
          <span className="text-white font-bold text-lg hidden sm:block">
            Zoomo <span className="text-z-accent">Eats</span>
          </span>
        </Link>

        {/* Address pill */}
        {address && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm min-w-0 flex-1 max-w-xs">
            <FiMapPin className="text-z-accent shrink-0" size={14} />
            <span className="text-gray-300 truncate">{address}</span>
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {user ? (
            <>
              <button
                onClick={() => navigate("/orders")}
                className="p-2 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition flex items-center gap-2 text-sm"
              >
                <FiUser size={15} />
                <span className="hidden sm:block">{user.name?.split(" ")[0]}</span>
              </button>
              <button
                onClick={logout}
                className="hidden sm:block p-2 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:flex items-center gap-1 p-2 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition text-sm">
                <FiLogIn size={14} /> Login
              </Link>
              <Link to="/signup" className="flex items-center gap-1 p-2 px-3 rounded-xl bg-z-primary hover:bg-z-hover text-white transition text-sm">
                <FiUserPlus size={14} /> <span className="hidden sm:block">Sign up</span>
              </Link>
            </>
          )}

          {/* Cart with live count */}
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition"
          >
            <FiShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-z-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}