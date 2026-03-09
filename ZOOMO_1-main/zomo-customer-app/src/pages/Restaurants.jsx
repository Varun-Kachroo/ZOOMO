import { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ThemeContext from "../context/ThemeContext";

export default function Restaurants() {
  const { dark } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/restaurants");
        setRestaurants(res);
        setFiltered(res);
      } catch (err) {
        console.error("Failed to load restaurants:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter restaurants
  useEffect(() => {
    if (!query.trim()) {
      setFiltered(restaurants);
    } else {
      const q = query.toLowerCase();
      setFiltered(
        restaurants.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.cuisineType?.toLowerCase().includes(q) ||
            r.address?.toLowerCase().includes(q)
        )
      );
    }
  }, [query, restaurants]);

  if (loading)
    return (
      <div className="p-6 text-center text-xl">
        Loading restaurants...
      </div>
    );

  return (
    <div
      className={`min-h-screen transition-colors ${
        dark ? "bg-black text-white" : "bg-[#f7fff9] text-black"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Restaurants Near You
        </h1>

        {/* Search Bar */}
        <div className="flex items-center mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, cuisine…"
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-white/10
                       border border-black/10 dark:border-white/10
                       text-gray-900 dark:text-white
                       placeholder-gray-500 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* No Results */}
        {filtered.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-gray-600 dark:text-gray-300">
              No restaurants found.
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <Link
              key={res.id}
              to={`/restaurant/${res.id}`}
              className="rounded-3xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10
                         bg-white/90 dark:bg-[#0f0f0f]/80 backdrop-blur-xl
                         shadow-md hover:shadow-xl hover:-translate-y-1 transition block"
            >
              <div className="relative h-44">
                <img
                  src={
                    res.imageUrl ||
                    "https://source.unsplash.com/600x400/?restaurant,food"
                  }
                  className="w-full h-full object-cover"
                  alt={res.name}
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 
                                text-xs px-2 py-1 rounded-lg text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  ⭐ {res.rating?.toFixed(1) || "4.2"}
                </div>
              </div>

              <div className="p-4">
                <div className="font-semibold text-gray-900 dark:text-white text-lg">
                  {res.name}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {res.cuisineType || "Various cuisines"}
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {res.address || "Near you"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
