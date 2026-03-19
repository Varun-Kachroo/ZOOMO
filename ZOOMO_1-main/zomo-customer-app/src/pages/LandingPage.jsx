import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiShoppingCart, FiUser, FiLogIn, FiUserPlus, FiX, FiStar, FiClock, FiTag } from "react-icons/fi";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

/* ── Mascot Loader ── */
export function MascotLoader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <img src="/zoomo-mascot.png" alt="Loading" className="w-24 h-24 animate-float" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-emerald-500/30 rounded-full blur-sm animate-pulse" />
      </div>
      <p className="text-emerald-400 font-medium text-sm animate-pulse">{text}</p>
    </div>
  );
}

/* ── Address Modal ── */
function AddressModal({ onConfirm }) {
  const [val, setVal] = useState("");
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <img src="/zoomo-mascot.png" alt="Zoomo" className="w-20 h-20 animate-wiggle mb-3" />
          <h2 className="text-2xl font-bold text-white">Where should we deliver?</h2>
          <p className="text-gray-400 text-sm mt-1">Enter your delivery address to get started</p>
        </div>
        <div className="relative mb-4">
          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
          <input
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && val.trim() && onConfirm(val.trim())}
            placeholder="e.g. Koramangala, Bengaluru"
            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
        <button
          onClick={() => val.trim() && onConfirm(val.trim())}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition active:scale-95"
        >
          Find Food Near Me 🍔
        </button>
      </div>
    </div>
  );
}

/* ── Navbar ── */
function Navbar({ address, onAddressClick, cartCount, user, onProfileOpen, navigate }) {
  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <img src="/zoomo-logo.png" alt="Zoomo" className="w-8 h-8 rounded-xl" />
          <span className="text-white font-bold text-lg hidden sm:block">
            Zoomo <span className="text-emerald-500">Eats</span>
          </span>
        </div>

        {/* Address pill */}
        <button
          onClick={onAddressClick}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-left hover:bg-white/10 transition min-w-0 flex-1 max-w-xs"
        >
          <FiMapPin className="text-emerald-500 shrink-0" size={14} />
          <span className="text-gray-300 truncate">{address || "Set delivery location"}</span>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <button
              onClick={onProfileOpen}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition flex items-center gap-2"
            >
              <FiUser size={16} />
              <span className="hidden sm:block text-sm">{user.name?.split(" ")[0]}</span>
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="hidden sm:flex items-center gap-1 p-2 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition text-sm">
                <FiLogIn size={14} /> Login
              </button>
              <button onClick={() => navigate("/signup")} className="hidden sm:flex items-center gap-1 p-2 px-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition text-sm">
                <FiUserPlus size={14} /> Sign up
              </button>
            </>
          )}
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition"
          >
            <FiShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── Category Pills ── */
const CATEGORIES = ["All", "Pizza", "Burgers", "Indian", "Chinese", "Biryani", "Desserts", "Beverages", "Healthy", "Street Food"];

/* ── Restaurant Card ── */
function RestaurantCard({ r, navigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => navigate(`/restaurant/${r.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer rounded-2xl overflow-hidden bg-[#111] border border-white/10 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={r.img}
          alt={r.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Coupon badge */}
        {r.coupon && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-emerald-400 text-[10px] font-medium px-2 py-1 rounded-lg border border-emerald-500/20">
            <FiTag size={10} /> {r.coupon}
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
          <FiStar className="text-yellow-400 fill-yellow-400" size={11} /> {r.rating}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-base truncate">{r.name}</h3>
        <p className="text-gray-400 text-xs mt-0.5 truncate">{r.cuisine}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><FiClock size={11} /> {r.eta}</span>
          <span>·</span>
          <span>₹{r.cost} for two</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Landing Page ── */
export default function LandingPage() {
  const { user } = useAuth();
  const { getTotalItemCount } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(() => localStorage.getItem("ze_address") || "");
  const [showAddressModal, setShowAddressModal] = useState(!localStorage.getItem("ze_address") && !user);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);

  // Load restaurants
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/restaurants");
        const mapped = res.map(r => ({
          id: r.id,
          name: r.name,
          img: r.imageUrl || `https://source.unsplash.com/600x400/?${encodeURIComponent(r.cuisineType || "food")}`,
          cuisine: r.cuisineType || "Various",
          area: r.address || "Nearby",
          rating: r.rating?.toFixed(1) ?? "4.3",
          eta: "25-40 min",
          cost: 250,
          coupon: r.coupon || null,
        }));
        setRestaurants(mapped);
        setFiltered(mapped);
      } catch {
        const fallback = [
          { id: "1", name: "The Pizza Place", cuisine: "Italian · Pizza", rating: "4.5", eta: "30-40 min", cost: 300, img: "https://source.unsplash.com/600x400/?pizza", coupon: "PIZZA50" },
          { id: "2", name: "Biryani House", cuisine: "Indian · Biryani", rating: "4.3", eta: "25-35 min", cost: 250, img: "https://source.unsplash.com/600x400/?biryani", coupon: null },
          { id: "3", name: "Burger Barn", cuisine: "American · Burgers", rating: "4.4", eta: "20-30 min", cost: 200, img: "https://source.unsplash.com/600x400/?burger", coupon: "BOGO" },
          { id: "4", name: "Wok & Roll", cuisine: "Chinese · Asian", rating: "4.2", eta: "30-45 min", cost: 280, img: "https://source.unsplash.com/600x400/?chinese-food", coupon: null },
          { id: "5", name: "Green Bowl", cuisine: "Healthy · Salads", rating: "4.6", eta: "15-25 min", cost: 220, img: "https://source.unsplash.com/600x400/?salad", coupon: "HEALTHY20" },
          { id: "6", name: "Dessert Den", cuisine: "Desserts · Sweets", rating: "4.7", eta: "20-30 min", cost: 180, img: "https://source.unsplash.com/600x400/?dessert", coupon: null },
        ];
        setRestaurants(fallback);
        setFiltered(fallback);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter
  useEffect(() => {
    let list = restaurants;
    if (category !== "All") {
      list = list.filter(r => r.cuisine?.toLowerCase().includes(category.toLowerCase()) || r.name?.toLowerCase().includes(category.toLowerCase()));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.cuisine?.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [query, category, restaurants]);

  function handleAddressConfirm(addr) {
    setAddress(addr);
    localStorage.setItem("ze_address", addr);
    setShowAddressModal(false);
  }

  const cartCount = getTotalItemCount?.() ?? 0;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Address Modal */}
      {showAddressModal && <AddressModal onConfirm={handleAddressConfirm} />}

      {/* Navbar */}
      <Navbar
        address={address}
        onAddressClick={() => setShowAddressModal(true)}
        cartCount={cartCount}
        user={user}
        onProfileOpen={() => setProfileOpen(true)}
        navigate={navigate}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero Search */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            What are you <span className="text-emerald-500">craving</span> today?
          </h1>
          <p className="text-gray-500 text-sm mb-5">
            {address ? `Delivering to ${address}` : "Set your location to see nearby restaurants"}
          </p>
          <div className="relative max-w-2xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for restaurants, cuisines, dishes..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${category === cat
                  ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 animate-pulse">
                <div className="h-44 bg-white/10 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <img src="/zoomo-mascot.png" alt="No results" className="w-24 opacity-40 mb-4 animate-float" />
            <p className="text-gray-500 text-lg font-medium">No restaurants found</p>
            <p className="text-gray-600 text-sm mt-1">Try a different search or category</p>
            <button onClick={() => { setQuery(""); setCategory("All"); }} className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-500 transition">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">{filtered.length} restaurants available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(r => <RestaurantCard key={r.id} r={r} navigate={navigate} />)}
            </div>
          </>
        )}
      </main>

      {/* Profile Drawer */}
      {profileOpen && <ProfileDrawer user={user} onClose={() => setProfileOpen(false)} navigate={navigate} />}

      {/* Chat Bot */}
      <ChatWidget />
    </div>
  );
}

/* ── Profile Drawer ── */
function ProfileDrawer({ user, onClose, navigate }) {
  const { logout } = useAuth();
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-full max-w-sm ml-auto h-full bg-[#111] border-l border-white/10 flex flex-col">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <span className="font-semibold text-white">Profile</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-xl font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="font-semibold text-white">{user?.name}</div>
              <div className="text-xs text-gray-400">{user?.email}</div>
            </div>
          </div>
          {[
            { label: "My Orders", path: "/orders" },
            { label: "My Cart", path: "/cart" },
            { label: "Restaurants", path: "/restaurants" },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); onClose(); }}
              className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition text-sm"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full px-4 py-3 rounded-xl text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 bg-black/50" onClick={onClose} />
    </div>
  );
}

/* ── Chat Widget ── */
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey! I'm Zoomo 🍔 What can I help you with?" }
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages, typing]);

  function send(msg = text) {
    const val = msg.trim();
    if (!val) return;
    setMessages(m => [...m, { role: "user", text: val }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      const s = val.toLowerCase();
      let reply = "Hmm, I didn't get that! Try asking about deals, orders, or restaurants.";
      if (s.includes("deal") || s.includes("offer")) reply = "🔥 Use ZOOMO50 for 50% off, BOGO for Buy 1 Get 1, or FREESHIP for free delivery above ₹199!";
      else if (s.includes("track") || s.includes("order")) reply = "Go to Menu → My Orders to track your order!";
      else if (s.includes("deliver")) reply = "We deliver to 45+ cities! Set your location on the home screen.";
      else if (s.includes("pay")) reply = "We support UPI, Cards, Wallets, Net Banking & Cash on Delivery!";
      setMessages(m => [...m, { role: "bot", text: reply }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full overflow-hidden shadow-xl hover:scale-110 transition border-2 border-emerald-500/50"
    >
      <img src="/zoomo-mascot.png" alt="Chat" className="w-full h-full object-cover animate-float" />
    </button>
  );

  return (
    <div className="fixed bottom-5 right-5 z-50 w-80 rounded-3xl overflow-hidden bg-[#0f0f0f] border border-white/10 shadow-2xl">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-[#111]">
        <div className="flex items-center gap-2">
          <img src="/zoomo-mascot.png" className="w-7 h-7 rounded-full animate-wiggle" alt="" />
          <span className="font-semibold text-white text-sm">Zoomo Assist</span>
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><FiX size={16} /></button>
      </div>

      <div ref={ref} className="h-64 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.role === "user" ? "bg-emerald-600 text-white" : "bg-white/10 text-gray-200"
              }`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-1 pl-2">
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 p-3 border-t border-white/10">
        {["Deals", "Track order", "Payment"].map(q => (
          <button key={q} onClick={() => send(q)} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition">{q}</button>
        ))}
      </div>

      <div className="p-3 pt-0 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask something..."
          className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none text-sm"
        />
        <button onClick={() => send()} className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition text-sm">
          Send
        </button>
      </div>
    </div>
  );
}
