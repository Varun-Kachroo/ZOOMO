import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Particle Background
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

// Icons
import {
  FiSun,
  FiMoon,
  FiMapPin,
  FiSearch,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiStar,
  FiZap,
  FiShield
} from "react-icons/fi";

// NEW API
import { api } from "../services/api";

// Auth
import { useAuth } from "../context/AuthContext";

/* ----------------------------- tiny helpers ----------------------------- */
const prefersReduced = () => {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
};
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

/* ============================== Landing ================================= */
export default function ZoomoEatsLanding() {
 const { user } = useAuth();

  const [dark, setDark] = useLocalStorage("ze_theme_dark", true);
  const [mode, setMode] = useState("Delivery");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [tickerIndex, setTickerIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoverXY, setHoverXY] = useState({ x: 0, y: 0 });

  const [restaurants, setRestaurants] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const particlesInit = async (engine) => await loadSlim(engine);

  // Headlines
  const headlines = [
    "Pickup, Dine-In, or Delivery.",
    "Your cravings, delivered.",
    "Zoom It. Eat It. Love It.",
    "Fresh deals. Fresh vibes."
  ];

  const ticker = [
    "25% off on first 3 orders",
    "Wallet is live — 1-tap pay",
    "Invite friends, get ₹150 credits",
    "Free delivery above ₹199",
    "Now serving in 45+ cities",
  ];

  const categories = [
    "Popular", "Pizza", "Burgers", "Indian", "Street Food", "Beverages",
    "Cafe", "Desserts", "Rolls", "Breakfast", "Healthy", "South Indian"
  ];

  // Fetch restaurants from backend
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/restaurants");

        const mapped = res.map((r) => ({
          id: r.id,
          name: r.name,
          img: r.imageUrl || "https://source.unsplash.com/800x600/?food",
          cuisine: r.cuisineType || "Various",
          area: r.address || "Nearby",
          rating: r.rating ?? 4.3,
          eta: "25-40 min",
          cost: 250,
        }));

        setRestaurants(mapped);
      } catch (e) {
        console.error("Backend error, loading fallback:", e);
        setRestaurants([
          { id: "1", name: "Fallback Pizza", cuisine: "Italian", rating: 4.5, eta: "30-45 min", img: "https://source.unsplash.com/800x600/?pizza", area: "City Center", cost: 250 },
        ]);
      }

      setOffers([
        { id: "o1", title: "Flat 50% Off", desc: "On top partners", code: "ZOOMO50", img: "https://source.unsplash.com/800x450/?food-offer" },
        { id: "o2", title: "Buy 1 Get 1", desc: "Pizza & rolls", code: "BOGO", img: "https://source.unsplash.com/800x450/?pizza" },
        { id: "o3", title: "Free Delivery", desc: "Above ₹199", code: "FREESHIP", img: "https://source.unsplash.com/800x450/?delivery" },
      ]);

      setLoading(false);
    }
    load();
  }, []);

  // Ticker auto-rotate
  useEffect(() => {
    const id = setInterval(() => setTickerIndex((i) => (i + 1) % ticker.length), 2400);
    return () => clearInterval(id);
  }, []);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Search handler
  function onSearch() {
    const params = [];
    if (mode) params.push(`mode=${mode.toLowerCase()}`);
    if (query) params.push(`q=${encodeURIComponent(query)}`);
    if (location) params.push(`loc=${encodeURIComponent(location)}`);
    navigate(`/restaurants?${params.join("&")}`);
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-black transition-colors">

      {/* BG Particles */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Particles
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            fpsLimit: 60,
            background: { color: dark ? "#000" : "#fff" },
            particles: {
              number: { value: 90, density: { enable: true, area: 800 } },
              color: { value: dark ? "#22c55e" : "#0ea5e9" },
              size: { value: { min: 1, max: 3 } },
              links: { enable: true, color: dark ? "#22c55e" : "#0ea5e9", opacity: 0.2 },
              move: { enable: true, speed: 0.6 },
            },
          }}
        />
      </div>
      {/* ----------------------------- UI SECTIONS ----------------------------- */}
      {/* ----------------------- Announcement ---- */}
      <AnnouncementBar text={ticker[tickerIndex]} />

      {/* Navbar */}
      <Navbar
        dark={dark}
        setDark={setDark}
        mode={mode}
        setMode={setMode}
        onProfileOpen={() => setProfileOpen(true)}
        user={user}
      />

      {/* Hero section */}
      <Hero
        headlines={headlines}
        mode={mode}
        query={query}
        setQuery={setQuery}
        location={location}
        setLocation={setLocation}
        onSearch={onSearch}
        hoverXY={hoverXY}
        setHoverXY={setHoverXY}
      />

      {/* Category Chips */}
      <CategoryChips categories={categories} />

      {/* Featured Restaurants Carousel */}
      <Section title="Top Restaurants Near You" subtitle="Based on your location">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 rounded-3xl bg-gray-100 dark:bg-white/10" />
            ))}
          </div>
        ) : (
          <FeaturedCarousel items={restaurants} mode={mode} />
        )}
      </Section>

      {/* Special Offers Grid */}
      <Section title="Delicious Offers" subtitle="Tasty discounts just for you">
        <OfferGrid offers={offers} />
      </Section>

      {/* Testimonials */}
      <Section title="What our customers say" subtitle="Honest reviews from real users">
        <Testimonials />
      </Section>

      {/* Why Us - Features */}
      <Section title="Why Choose Zoomo Eats?" subtitle="We deliver more than just food">
        <WhyUs />
      </Section>

      {/* Footer */}
      <Footer />

      {/* Profile Drawer (hidden by default) */}
      <ProfileDrawer open={profileOpen} setOpen={setProfileOpen} />

      {/* Chat Widget */}
      <ChatWidget open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}

/* ----------------------------- UI COMPONENTS ----------------------------- */
/* ----------------------- Announcement ---- */
function AnnouncementBar({ text }) {
  return (
    <div className="w-full bg-emerald-600/90 dark:bg-emerald-500/90 text-white text-xs sm:text-sm py-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
        <span className="animate-pulse">●</span>
        <span className="truncate">{text}</span>
      </div>
    </div>
  );
}

/* ----------------------- Navbar --------------------- */
function Navbar({ dark, setDark, mode, setMode, onProfileOpen, user }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Left: Logo + Delivery Modes */}
        <div className="flex items-center gap-3">
          <img
            loading="lazy"
            src="/zoomo-logo.png"
            alt="Zoomo Eats Logo"
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-emerald-400/30"
          />
          
          <div className="text-lg font-semibold dark:text-white">
            Zoomo <span className="text-emerald-500">Eats</span>
          </div>

          {/* Mode Selector */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-white/10 rounded-xl p-1 ml-2">
            {["Pickup", "Dine-In", "Delivery"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs transition ${
                  mode === m
                    ? "bg-white dark:bg-black shadow text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Buttons */}
        <div className="hidden md:flex items-center gap-2">

          {/* Theme toggle */}
          <button
            onClick={() => setDark((v) => !v)}
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white text-gray-800 hover:scale-[1.02] active:scale-[.98] transition flex items-center gap-2"
            aria-label="Toggle theme"
          >
            {dark ? <FiSun /> : <FiMoon />} {dark ? "Light" : "Dark"}
          </button>

          {/* Auth Buttons */}
          {user ? (
            <button
              onClick={onProfileOpen}
              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white flex items-center gap-2"
            >
              <FiUser /> {user?.name || "Profile"}
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white flex items-center gap-2"
              >
                <FiLogIn /> Login
              </Link>

              <Link
                to="/signup"
                className="px-3 py-2 rounded-xl bg-emerald-600 text-white flex items-center gap-2"
              >
                <FiUserPlus /> Sign up
              </Link>
            </>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white"
          >
            <FiShoppingCart />
          </Link>
        </div>

        {/* Mobile icons */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setDark((v) => !v)}
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white"
          >
            {dark ? <FiSun /> : <FiMoon />}
          </button>

          <Link
            to="/cart"
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white"
          >
            <FiShoppingCart />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero({ headlines, mode, query, setQuery, location, setLocation, onSearch, hoverXY, setHoverXY }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % headlines.length), 2200);
    return () => clearInterval(id);
  }, [headlines.length]);

  const onMouse = (e) => {
    if (prefersReduced()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setHoverXY({ x, y });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-14 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left side text */}
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
              {headlines[index]}
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xl">
              Order from top restaurants near you. Switch between {mode.toLowerCase()} anytime.
              Smart recommendations, live tracking, and one-tap reorder.
            </p>

            {/* Search */}
            <div className="mt-6 space-y-3">
              <div className="relative">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter delivery location"
                  className="w-full px-4 py-3 pl-11 rounded-2xl bg-white/95 dark:bg-white/5 
                  border border-black/10 dark:border-white/10 focus:outline-none 
                  focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white 
                  placeholder-gray-500"
                />
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search dishes, restaurants, cuisines"
                    className="w-full px-4 py-3 pl-11 rounded-2xl bg-white/95 dark:bg-white/5 
                    border border-black/10 dark:border-white/10 focus:outline-none 
                    focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white 
                    placeholder-gray-500"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
                </div>

                {/* Search Button */}
                <Magnetic onClick={onSearch} className="bg-emerald-600 text-white">
                  Search
                </Magnetic>

                {/* Order Now -> NEW ROUTE */}
                <Magnetic
                  onClick={() => navigate("/restaurants")}
                  className="bg-white dark:bg-emerald-500 text-gray-900 dark:text-black"
                >
                  Order Now
                </Magnetic>
              </div>

              {/* Features */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
                <Chip icon={<FiZap />}>Live tracking</Chip>
                <Chip>Contactless</Chip>
                <Chip icon={<FiShield />}>Secure payments</Chip>
              </div>
            </div>
          </div>

          {/* Right side tilt mascot visual */}
          <div
            className="relative will-change-transform"
            onMouseMove={onMouse}
            onMouseLeave={() => setHoverXY({ x: 0, y: 0 })}
            style={{
              transform: `perspective(900px) rotateX(${hoverXY.y * -6}deg) rotateY(${hoverXY.x * 8}deg)`,
              transition: prefersReduced() ? "none" : "transform 200ms ease",
            }}
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/30 relative bg-gradient-to-br from-emerald-50 to-white dark:from-[#0c0c0c] dark:to-[#040404]">
              <div className="absolute inset-0 rounded-3xl ring-2 ring-emerald-500/20 pointer-events-none" />
              <img
                loading="lazy"
                src="/zoomo-mascot.png"
                alt="Zoomo mascot"
                className="w-full h-full object-contain p-6 select-none"
                draggable="false"
              />
            </div>

            <div className="absolute -bottom-6 left-6 bg-white/90 dark:bg-black rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white grid place-content-center text-lg font-bold">
                Z
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Fast delivery</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Avg 25–35 mins</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
/* ----------------------------- Chip ----------------------------- */
function Chip({ children, icon }) {
  return (
    <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/10 inline-flex items-center gap-1">
      {icon}{children}
    </span>
  );
}

/* ----------------------------- Magnetic Button ----------------------------- */
function Magnetic({ children, className = "", onClick }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    const enter = () => {
      el.animate(
        { transform: ["translateY(0)", "translateY(-2px)"] },
        { duration: 120, fill: "forwards" }
      );
    };

    const leave = () => {
      el.animate(
        { transform: ["translateY(-2px)", "translateY(0)"] },
        { duration: 120, fill: "forwards" }
      );
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl hover:brightness-110 active:brightness-95 transition ${className}`}
    >
      {children}
    </button>
  );
}

/* ----------------------------- Category Chips ----------------------------- */
function CategoryChips({ categories }) {
  return (
    <div className="sticky top-[64px] z-30 border-y border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto">
        {categories.map((c, i) => (
          <button
            key={c}
            className="px-3 py-1.5 rounded-xl whitespace-nowrap bg-gray-100 dark:bg-white/10 
            text-gray-800 dark:text-gray-200 hover:scale-[1.02] transition"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}


/* ----------------------------- Section ----------------------------- */
function Section({ title, subtitle, children }) {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white">
              View all
            </button>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

/* ----------------------------- Featured Carousel ----------------------------- */
function FeaturedCarousel({ items, mode }) {
  const ref = useRef(null);
  const scrollBy = (dx) =>
    ref.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div className="relative">
      <div
        ref={ref}
        className="grid auto-cols-[minmax(260px,1fr)] grid-flow-col gap-4 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {items.map((r) => (
          <RestCard key={r.id} r={r} mode={mode} />
        ))}
      </div>

      <button
        onClick={() => scrollBy(-320)}
        aria-label="Previous restaurant"
        className="hidden md:grid place-content-center absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-white/10 ring-1 ring-black/10"
      >
        <FiChevronLeft />
      </button>

      <button
        onClick={() => scrollBy(320)}
        aria-label="Next restaurant"
        className="hidden md:grid place-content-center absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-white/10 ring-1 ring-black/10"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

/* ----------------------------- Restaurant Card ----------------------------- */
function RestCard({ r, mode }) {
  return (
    <Link
      to={`/restaurant/${r.id}?mode=${(mode || "delivery").toLowerCase()}`}
      className="rounded-3xl overflow-hidden ring-1 ring-white/10 bg-white/80 dark:bg-[#0e0e0e] 
                 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.35)] 
                 transition block"
    >
      <div className="aspect-[4/3] relative">
        <img
          loading="lazy"
          src={r.img}
          alt={`${r.name} restaurant`}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
          <FiStar className="text-yellow-500" /> {r.rating}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="font-semibold text-gray-900 dark:text-white leading-tight pr-2">
            {r.name}
          </div>

          <div className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200">
            {r.eta} mins
          </div>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-300">
          {r.cuisine} · {r.area} · ₹{r.cost} for two
        </div>
      </div>
    </Link>
  );
}


function OfferGrid({ offers }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {offers.map((o) => (
        <div key={o.id} className="group overflow-hidden rounded-3xl ring-1 ring-white/10 bg-white/80 dark:bg-[#0f0f0f]">
          <div className="aspect-[16/9] overflow-hidden">
            <img loading="lazy" src={o.img} alt={`${o.title} offer`} className="w-full h-full object-cover group-hover:scale-105 transition" />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{o.title}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{o.desc}</div>
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs">{o.code}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Testimonials() {
  const testimonials = [
    { name: "Alex J.", quote: "Zoomo Eats is a game-changer! Super fast delivery and amazing deals.", rating: 5 },
    { name: "Sarah K.", quote: "Love the variety and easy switching between pickup and delivery.", rating: 4.8 },
    { name: "Mike L.", quote: "The chat support is quick and helpful. Highly recommend!", rating: 5 },
    { name: "Emma R.", quote: "Best food app I've used. The mascot is cute too!", rating: 4.9 },
  ];
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {testimonials.map((t, i) => (
        <div key={i} className="rounded-3xl ring-1 ring-white/10 bg-white/80 dark:bg-[#0f0f0f] p-5">
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, j) => (
              <FiStar key={j} className={`text-yellow-500 ${j < Math.floor(t.rating) ? "fill-current" : ""}`} />
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">"{t.quote}"</div>
          <div className="font-semibold text-gray-900 dark:text-white">- {t.name}</div>
        </div>
      ))}
    </div>
  );
}

function WhyUs() {
  const items = [
    { t: "Lightning Fast", d: "Optimized routes, real-time ETAs & batching" },
    { t: "All Modes", d: "Pickup, Dine-In & Delivery in one flow" },
    { t: "Secure Payments", d: "UPI, Cards, Wallet & COD" },
    { t: "Reliable Support", d: "24×7 help via chat & callback" },
    { t: "Curated Choices", d: "Handpicked restaurants with checks" },
    { t: "Rewards", d: "Earn & redeem points on every order" },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((x, i) => (
        <div key={i} className="rounded-3xl ring-1 ring-white/10 bg-white/80 dark:bg-[#0f0f0f] p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white grid place-content-center mb-3">✓</div>
          <div className="font-semibold text-gray-900 dark:text-white">{x.t}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{x.d}</div>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  return (
    <footer className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
        
        {/* Logo + Tagline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img
              loading="lazy"
              src="/zoomo-logo.png"
              alt="Zoomo Eats Logo"
              className="w-9 h-9 rounded-xl object-cover"
            />
            <div className="text-lg font-semibold dark:text-white">
              Zoomo Eats
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Zoom It. Eat It. Love It.
          </div>
        </div>

        {/* Company Section */}
        <div>
          <div className="font-semibold mb-3 dark:text-white">Company</div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <button type="button">About</button>
            <button type="button">Careers</button>
            <button type="button">Contact</button>
            <button type="button">Blog</button>
          </div>
        </div>

        {/* Help Section */}
        <div>
          <div className="font-semibold mb-3 dark:text-white">Help</div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <button type="button">Support</button>
            <button type="button">FAQs</button>
            <button type="button">Partner with us</button>
            <button type="button">Privacy</button>
          </div>
        </div>

        {/* App + Newsletter */}
        <div>
          <div className="font-semibold mb-3 dark:text-white">Get the app</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-4 py-2 rounded-xl bg-black text-white text-sm">
              App Store
            </div>
            <div className="px-4 py-2 rounded-xl bg-black text-white text-sm">
              Google Play
            </div>
          </div>

          <div className="font-semibold mb-3 dark:text-white">Newsletter</div>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 
                         text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-emerald-600 text-white"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 
                        flex items-center justify-between 
                        text-xs text-gray-600 dark:text-gray-300">
          <div>© {new Date().getFullYear()} Zoomo Eats</div>
          <div className="flex items-center gap-3">
            <button type="button">Terms</button>
            <button type="button">Privacy</button>
            <button type="button">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}


export function ProfileDrawer({ open, setOpen }) {
  const { user, isAuthenticated } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (open && isAuthenticated) {
      const load = async () => {
        try {
          const res = await api.get("/orders/mine");
          const orders = res?.data || [];
          setRecentOrders(orders.slice(0, 3));
        } catch (err) {
          console.error("Error loading orders:", err);
        }
      };
      load();
    }
  }, [open, isAuthenticated]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Drawer Panel */}
      <div className="w-full max-w-md ml-auto h-full bg-white dark:bg-black dark:text-white ring-1 ring-white/10 flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-semibold flex items-center gap-2">
            <FiUser /> Profile
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close profile">
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">

          {/* User Info */}
          <div className="flex items-center gap-4">
            <img
              loading="lazy"
              src={user?.avatar || "/avatar.png"}
              alt="User avatar"
              className="w-14 h-14 rounded-2xl bg-gray-200 object-cover"
            />
            <div>
              <div className="text-lg font-semibold">
                {user?.name || "Guest"}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                {user?.email || "Not signed in"}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-center"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-center"
                >
                  Sign up
                </Link>
              </>
            )}

            <Link
              to="/orders"
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-center col-span-2"
            >
              My Orders
            </Link>

            <Link
              to="/cart"
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-center col-span-2"
            >
              My Cart
            </Link>

            <Link
              to="/restaurants"
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-center col-span-2"
            >
              Explore Restaurants
            </Link>
          </div>

          {/* Recent Orders */}
          {isAuthenticated && (
            <div>
              <div className="font-semibold mb-2">Recent Orders</div>
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-2xl ring-1 ring-white/10 flex items-center justify-between bg-white/70 dark:bg-[#0f0f0f]"
                  >
                    <div>
                      <div className="font-semibold">
                        Order #{order.id.slice(0, 6)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        {order.status} • ₹{order.total || order.subtotal}
                      </div>
                    </div>
                    <button className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10">
                      Reorder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background Overlay */}
      <div
        className="flex-1 bg-black/40"
        onClick={() => setOpen(false)}
      />
    </div>
  );
}

/* ---------------------------- Chat Widget --------------------------- */
function ChatWidget({ open, setOpen }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm Zoomo Assist, powered by our friendly mascot! How can I help you today?" },
    { role: "bot", text: "You can ask about orders, deals, restaurants, or anything else!" },
  ]);

  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const quick = ["Current deals", "Track my order", "Delivery areas", "Payment options", "Contact support", "Recommend a restaurant"];
  const chatRef = useRef(null);

  function send(content = text) {
    const val = content.trim();
    if (!val) return;

    const userMsg = { role: "user", text: val };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setIsTyping(true);

    setTimeout(() => {
      const replyText = routeIntent(val);
      const botMsg = { role: "bot", text: replyText };
      setMessages((m) => [...m, botMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  }

  function routeIntent(t) {
    const s = t.toLowerCase();

    if (s.includes("deal") || s.includes("offer") || s.includes("promo"))
      return "Today's hot deals: ZOOMO50 for 50% off on select partners, BOGO for Buy 1 Get 1, and FREESHIP for free delivery above ₹199!";

    if (s.includes("track") || s.includes("order") || s.includes("status"))
      return "To track your order, go to Menu → Orders. Or share your order number here!";

    if (s.includes("deliver") || s.includes("area") || s.includes("city") || s.includes("location"))
      return "We are serving 45+ cities! Enter your pincode or area on homepage to check availability.";

    if (s.includes("pay") || s.includes("payment") || s.includes("upi") || s.includes("card"))
      return "We accept UPI, Cards, Wallet, Net Banking, and Cash on Delivery. Secure & fast!";

    if (s.includes("support") || s.includes("help") || s.includes("agent"))
      return "I'm connecting you to our support team. Expect a callback in 5–10 minutes.";

    if (s.includes("recommend") || s.includes("restaurant") || s.includes("suggest"))
      return "Popular picks: I Love Pizza, Taste of Punjab, Sharma Fast Food. What cuisine do you like?";

    if (s.includes("menu") || s.includes("dish"))
      return "Tell me the dish or restaurant name — I'll help you find it!";

    return "Hmm, I didn't get that. Could you rephrase? Or choose any quick reply below!";
  }

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full shadow-xl w-16 h-16 overflow-hidden hover:scale-105 transition animate-pulse"
        >
          <img
            src="/zoomo-mascot.png"
            alt="Zoomo Mascot"
            className="w-full h-full object-cover"
          />
        </button>
      )}

      {open && (
        <div className="w-96 rounded-3xl overflow-hidden ring-1 ring-white/10 bg-white/95 dark:bg-[#0b0f0c] dark:text-white shadow-2xl">
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/zoomo-mascot.png" className="w-8 h-8 rounded-full animate-wiggle" />
              <div className="font-semibold">Zoomo Assist</div>
            </div>
            <button onClick={() => setOpen(false)}>
              <FiX />
            </button>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`flex items-start gap-2 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  
                  {m.role === "bot" && (
                    <img src="/zoomo-mascot.png" className="w-8 h-8 rounded-full flex-shrink-0" />
                  )}

                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white grid place-content-center flex-shrink-0">
                      U
                    </div>
                  )}

                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      m.role === "user"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <img src="/zoomo-mascot.png" className="w-8 h-8 rounded-full" />
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="px-3 pb-2 flex flex-wrap gap-2">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 flex items-center gap-2 border-t border-white/10">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={() => send()}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:brightness-110 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

