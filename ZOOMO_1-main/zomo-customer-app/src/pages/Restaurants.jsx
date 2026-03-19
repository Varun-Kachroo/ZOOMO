import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch, FiX, FiStar, FiClock, FiTag } from "react-icons/fi";
import { api } from "../services/api";
import { MascotLoader } from "./LandingPage";

const CATEGORIES = ["All", "Pizza", "Burgers", "Indian", "Chinese", "Biryani", "Desserts", "Beverages", "Healthy"];

export default function Restaurants() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/restaurants");
        const mapped = res.map(r => ({
          id: r.id,
          name: r.name,
          img: r.imageUrl || `https://source.unsplash.com/600x400/?${encodeURIComponent(r.cuisineType || "food")}`,
          cuisine: r.cuisineType || "Various",
          rating: r.rating?.toFixed(1) ?? "4.3",
          eta: "25-40 min",
          cost: 250,
          coupon: r.coupon || null,
        }));
        setRestaurants(mapped);
        setFiltered(mapped);
      } catch {
        setRestaurants([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  if (loading) return <MascotLoader text="Finding restaurants near you..." />;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-5">Restaurants Near You</h1>

        {/* Search */}
        <div className="relative max-w-xl mb-5">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search restaurants or cuisines..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          {query && <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"><FiX size={14} /></button>}
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${category === cat ? "bg-emerald-600 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <img src="/zoomo-mascot.png" alt="" className="w-20 opacity-30 mx-auto mb-4 animate-float" />
            <p className="text-gray-500">No restaurants found</p>
            <button onClick={() => { setQuery(""); setCategory("All"); }} className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm">Clear filters</button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">{filtered.length} restaurants found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(r => (
                <div key={r.id} onClick={() => navigate(`/restaurant/${r.id}`)}
                  className="cursor-pointer rounded-2xl overflow-hidden bg-[#111] border border-white/10 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {r.coupon && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-emerald-400 text-[10px] px-2 py-1 rounded-lg border border-emerald-500/20">
                        <FiTag size={10} /> {r.coupon}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                      <FiStar className="text-yellow-400 fill-yellow-400" size={11} /> {r.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white truncate">{r.name}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{r.cuisine}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FiClock size={11} /> {r.eta}</span>
                      <span>·</span>
                      <span>₹{r.cost} for two</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
