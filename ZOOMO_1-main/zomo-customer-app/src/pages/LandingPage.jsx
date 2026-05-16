import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiShoppingCart,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiX,
  FiStar,
  FiClock,
  FiSliders,
  FiArrowRight,
} from "react-icons/fi";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

/* =========================
   Shared loader
========================= */
export function MascotLoader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-4 bg-[#F5F7F6]">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#0F3D2E] to-[#145A43] shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
          <ZoomoMark className="h-10 w-10 text-white" />
        </div>
      </div>
      <p className="text-sm font-medium text-[#145A43]">{text}</p>
    </div>
  );
}

/* =========================
   Tokens / data
========================= */
const QUICK_PICKS = [
  { label: "Burgers", emoji: "🍔" },
  { label: "Pizza", emoji: "🍕" },
  { label: "Healthy", emoji: "🥗" },
  { label: "Coffee", emoji: "☕" },
];

const FILTERS = ["Popular", "Fast delivery", "Top rated"];

const FALLBACK_RESTAURANTS = [
  {
    id: "green-bowl",
    name: "Green Bowl Kitchen",
    cuisine: "Healthy bowls • Salads • Fresh juices",
    rating: "4.8",
    eta: "18 min",
    image:
      "linear-gradient(135deg, #B8E7C3 0%, #8CD9A5 100%)",
  },
  {
    id: "stone-fire",
    name: "Stone Fire Pizza",
    cuisine: "Wood-fired pizza • Italian classics",
    rating: "4.9",
    eta: "22 min",
    image:
      "linear-gradient(135deg, #F3CF99 0%, #F0B36A 100%)",
  },
  {
    id: "midnight-sushi",
    name: "Midnight Sushi",
    cuisine: "Premium rolls • Bento • Late night",
    rating: "4.7",
    eta: "26 min",
    image:
      "linear-gradient(135deg, #D7E0EE 0%, #C6D1E3 100%)",
  },
];

/* =========================
   Brand mark
========================= */
function ZoomoMark({ className = "h-5 w-5 text-white" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.18" />
      <path
        d="M7 8.5H21.2L15.6 14H10.6L7 17.6V8.5Z"
        fill="currentColor"
      />
      <path
        d="M23.8 8.5V18.1L18.4 12.8L23.8 8.5Z"
        fill="currentColor"
      />
      <path
        d="M8 23.5L13.7 17.8H18.1L11.9 23.5H8Z"
        fill="currentColor"
      />
      <path
        d="M15.6 16.9H20.8L24.5 20.7V23.5H13.2L15.6 16.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* =========================
   Address modal
========================= */
function AddressModal({ onConfirm, onSkip }) {
  const [value, setValue] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F0E]/20 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.08)] sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#0F3D2E] to-[#145A43] text-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)]">
            <ZoomoMark className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#145A43]">
              Delivered fast
            </p>
            <h2 className="text-[24px] font-semibold leading-8 text-[#0B0F0E]">
              Set your address
            </h2>
          </div>
        </div>

        <p className="mb-5 text-[16px] leading-6 text-[#6B7280]">
          Enter your delivery area to browse nearby restaurants and faster offers.
        </p>

        <label className="mb-2 block text-[13px] font-medium leading-[18px] text-[#0B0F0E]">
          Delivery location
        </label>

        <div className="relative mb-4">
          <FiMapPin
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
            size={18}
          />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && value.trim() && onConfirm(value.trim())
            }
            placeholder="e.g. Bandra West, Mumbai"
            className="h-[52px] w-full rounded-[20px] border border-[#E5E7EB] bg-white pl-12 pr-4 text-[16px] text-[#0B0F0E] outline-none transition duration-150 ease-out placeholder:text-[#9CA3AF] focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/10"
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => value.trim() && onConfirm(value.trim())}
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#145A43] text-[16px] font-semibold text-white shadow-[0px_10px_30px_rgba(0,0,0,0.08)] transition duration-150 ease-out hover:opacity-95"
          >
            Continue
          </button>

          <button
            onClick={onSkip}
            className="flex h-[52px] w-full items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[16px] font-medium text-[#0B0F0E] transition duration-150 ease-out hover:bg-[#F5F7F6]"
          >
            Add later
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Landing navbar
========================= */
function LandingNavbar({ cartCount, user, navigate }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0F3D2E] text-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)]">
          <ZoomoMark className="h-7 w-7 text-white" />
        </div>
        <div className="leading-none">
          <p className="text-[13px] font-medium text-[#6B7280]">Zoomo</p>
          <p className="text-[24px] font-semibold leading-6 text-[#145A43]">
            Eats
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <button
            onClick={() => navigate("/orders")}
            className="flex h-12 min-w-12 items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#0B0F0E] transition duration-150 ease-out hover:bg-[#F5F7F6]"
          >
            <FiUser size={18} />
            <span className="ml-2 hidden sm:inline">
              {user.name?.split(" ")[0] || "Account"}
            </span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-[16px] font-medium text-[#0B0F0E] transition duration-150 ease-out hover:text-[#145A43]"
          >
            Sign in
          </button>
        )}

        <button
          onClick={() => navigate("/cart")}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#0B0F0E] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] transition duration-150 ease-out hover:bg-[#F5F7F6]"
        >
          <FiShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#145A43] px-1 text-[11px] font-semibold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

/* =========================
   Helpers
========================= */
function PromoCard({ onClick }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0F3D2E] to-[#145A43] p-6 text-white shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white/70">
            Today&apos;s offer
          </p>
          <h2 className="max-w-[260px] text-[32px] font-bold leading-[40px] tracking-[-0.02em]">
            Free delivery on your first order.
          </h2>
        </div>

        <div className="flex h-20 w-20 items-center justify-center rounded-[20px] border border-white/10 bg-white/10">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#0F3D2E] text-white">
            <ZoomoMark className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <button
        onClick={onClick}
        className="flex h-[52px] items-center justify-center rounded-full bg-white px-7 text-[16px] font-semibold text-[#0F3D2E] transition duration-150 ease-out hover:bg-[#F5F7F6]"
      >
        Order now
      </button>
    </div>
  );
}

function QuickPickCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="min-w-[140px] rounded-[20px] border border-[#E5E7EB] bg-white p-4 text-left shadow-[0px_1px_2px_rgba(0,0,0,0.04)] transition duration-150 ease-out hover:-translate-y-[1px] hover:shadow-[0px_4px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[16px] bg-[#F5F7F6] text-[30px]">
        {item.emoji}
      </div>
      <p className="text-[24px] font-semibold leading-8 text-[#0B0F0E]">
        {item.label}
      </p>
    </button>
  );
}

function FilterChip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "h-[52px] rounded-full px-7 text-[16px] font-semibold transition duration-150 ease-out",
        active
          ? "bg-[#0F3D2E] text-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)]"
          : "border border-[#E5E7EB] bg-white text-[#0B0F0E] hover:bg-[#F5F7F6]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function RestaurantCard({ restaurant, onClick }) {
  return (
    <article
      onClick={onClick}
      className="cursor-pointer overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] transition duration-180 ease-out hover:-translate-y-[2px] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]"
    >
      <div
        className="relative h-56 w-full"
        style={{
          background:
            restaurant.imageStyle ||
            `url(${restaurant.img}) center/cover no-repeat`,
        }}
      >
        <div className="absolute left-5 top-5 flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0B0F0E] shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
          <span>{restaurant.rating}</span>
          <FiStar className="fill-current" size={14} />
        </div>

        <div className="absolute right-5 top-5 rounded-full bg-[#0B0F0E] px-4 py-2 text-sm font-semibold text-white">
          {restaurant.eta}
        </div>
      </div>

      <div className="flex items-center gap-4 p-5">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[32px] font-bold leading-10 tracking-[-0.02em] text-[#0B0F0E]">
            {restaurant.name}
          </h3>
          <p className="mt-1 truncate text-[16px] leading-6 text-[#6B7280]">
            {restaurant.cuisine}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0F2F1] text-[#145A43] transition duration-150 ease-out hover:bg-[#E5E7EB]"
        >
          <FiArrowRight size={20} />
        </button>
      </div>
    </article>
  );
}

/* =========================
   Page
========================= */
export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useCart();

  const [address, setAddress] = useState(
    () => localStorage.getItem("ze_address") || ""
  );
  const [showAddressModal, setShowAddressModal] = useState(
    !localStorage.getItem("ze_address") && !user
  );
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Popular");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchRef = useRef(null);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const res = await api.get("/restaurants");
        const list = Array.isArray(res) ? res : res?.data || [];

        const mapped = list.map((r, index) => ({
          id: r.id,
          name: r.name,
          cuisine:
            r.cuisineType
              ? `${r.cuisineType} • Premium delivery`
              : "Curated menu • Fast delivery",
          rating: r.rating?.toFixed(1) || ["4.8", "4.9", "4.7"][index % 3],
          eta: ["18 min", "22 min", "26 min", "20 min"][index % 4],
          img: r.imageUrl,
          imageStyle: null,
        }));

        setRestaurants(mapped.length ? mapped : FALLBACK_RESTAURANTS);
      } catch {
        setRestaurants(FALLBACK_RESTAURANTS);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  function handleAddressConfirm(value) {
    setAddress(value);
    localStorage.setItem("ze_address", value);
    setShowAddressModal(false);
  }

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const visibleRestaurants = useMemo(() => {
    let list = [...restaurants];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.cuisine?.toLowerCase().includes(q)
      );
    }

    if (activeFilter === "Fast delivery") {
      list = [...list].sort((a, b) => parseInt(a.eta) - parseInt(b.eta));
    }

    if (activeFilter === "Top rated") {
      list = [...list].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    return list;
  }, [restaurants, query, activeFilter]);

  if (loading) {
    return <MascotLoader text="Preparing your feed..." />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#0B0F0E]">
      {showAddressModal && (
        <AddressModal
          onConfirm={handleAddressConfirm}
          onSkip={() => setShowAddressModal(false)}
        />
      )}

      <main className="mx-auto max-w-[760px] px-4 py-5 sm:px-6 sm:py-8">
        <div className="rounded-[28px] border border-[#E5E7EB] bg-[#F5F7F6] p-5 sm:p-6">
          <LandingNavbar cartCount={cartCount} user={user} navigate={navigate} />

          <section className="mb-8">
            <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.18em] text-[#145A43]">
              Delivered fast
            </p>

            <h1 className="max-w-[540px] text-[44px] font-bold leading-[52px] tracking-[-0.03em] text-[#0B0F0E]">
              What are you{" "}
              <span className="text-[#145A43]">craving today?</span>
            </h1>

            <p className="mt-4 max-w-[520px] text-[16px] leading-6 text-[#6B7280]">
              Premium food delivery with a cleaner interface and faster checkout.
              {address ? ` Delivering to ${address}.` : ""}
            </p>

            <div className="relative mt-8">
              <FiSearch
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#145A43]"
                size={18}
              />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants, dishes, cuisine"
                className="h-[52px] w-full rounded-full border border-[#E5E7EB] bg-white pl-14 pr-20 text-[16px] text-[#0B0F0E] outline-none transition duration-150 ease-out placeholder:text-[#9CA3AF] focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/10"
              />

              {query ? (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F0F2F1] text-[#145A43] transition duration-150 ease-out hover:bg-[#E5E7EB]"
                >
                  <FiX size={16} />
                </button>
              ) : (
                <button
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F0F2F1] text-[#145A43] transition duration-150 ease-out hover:bg-[#E5E7EB]"
                >
                  <FiSliders size={16} />
                </button>
              )}
            </div>
          </section>

          <section className="mb-8">
            <PromoCard onClick={() => navigate("/restaurants")} />
          </section>

          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="text-[24px] font-semibold leading-8 text-[#0B0F0E]">
                Quick picks
              </h2>
              <span className="text-[16px] leading-6 text-[#6B7280]">For you</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {QUICK_PICKS.map((item) => (
                <QuickPickCard
                  key={item.label}
                  item={item}
                  onClick={() => {
                    setQuery(item.label);
                    searchRef.current?.focus();
                  }}
                />
              ))}
            </div>
          </section>

          <section className="mb-8">
            <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {FILTERS.map((filter) => (
                <FilterChip
                  key={filter}
                  active={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </FilterChip>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            {visibleRestaurants.map((restaurant, index) => (
              <RestaurantCard
                key={restaurant.id || index}
                restaurant={{
                  ...restaurant,
                  imageStyle:
                    restaurant.imageStyle ||
                    (restaurant.img
                      ? null
                      : FALLBACK_RESTAURANTS[index % FALLBACK_RESTAURANTS.length]
                        .image),
                }}
                onClick={() =>
                  navigate(
                    restaurant.id && restaurant.id !== "green-bowl" && restaurant.id !== "stone-fire" && restaurant.id !== "midnight-sushi"
                      ? `/restaurant/${restaurant.id}`
                      : "/restaurants"
                  )
                }
              />
            ))}

            {!visibleRestaurants.length && (
              <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-8 text-center shadow-[0px_4px_12px_rgba(0,0,0,0.06)]">
                <p className="text-[24px] font-semibold leading-8 text-[#0B0F0E]">
                  No matches found
                </p>
                <p className="mt-2 text-[16px] leading-6 text-[#6B7280]">
                  Try another cuisine, restaurant name, or a broader search term.
                </p>
              </div>
            )}
          </section>

          <section className="mt-8 rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#F0F2F1] text-[#145A43]">
                <FiClock size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#6B7280]">
                  Faster checkout
                </p>
                <h3 className="mt-1 text-[24px] font-semibold leading-8 text-[#0B0F0E]">
                  Save time on every order
                </h3>
                <p className="mt-2 text-[12px] leading-4 text-[#6B7280]">
                  Sign in to save addresses, track orders, and reorder in one tap.
                </p>
              </div>
            </div>

            {!user && (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/signup")}
                  className="flex h-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#145A43] px-6 text-[16px] font-semibold text-white shadow-[0px_4px_12px_rgba(0,0,0,0.06)] transition duration-150 ease-out hover:opacity-95"
                >
                  <FiUserPlus className="mr-2" size={16} />
                  Create account
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="flex h-[52px] items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-6 text-[16px] font-semibold text-[#0B0F0E] transition duration-150 ease-out hover:bg-[#F5F7F6]"
                >
                  <FiLogIn className="mr-2" size={16} />
                  Sign in
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}