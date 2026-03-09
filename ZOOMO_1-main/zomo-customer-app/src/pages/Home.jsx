import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch top restaurants
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/restaurants"); // backend returns array
        setRestaurants(res);
      } catch (err) {
        console.error("Failed to load restaurants:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-4">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">Zoomo Eats</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for restaurants or dishes"
          className="w-full p-3 border rounded-zoomo shadow-zoomo"
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate("/restaurants");
          }}
        />
      </div>

      {/* Categories */}
      <h2 className="text-xl font-bold mb-2">Popular Categories</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
        {["Pizza", "Biryani", "Burger", "Chinese", "Desserts", "Healthy"].map(
          (cat) => (
            <div
              key={cat}
              className="bg-white px-4 py-2 rounded-full shadow-zoomo cursor-pointer whitespace-nowrap"
            >
              {cat}
            </div>
          )
        )}
      </div>

      {/* Featured Restaurants */}
      <h2 className="text-xl font-bold mb-3">Featured Restaurants</h2>

      {loading && <p>Loading restaurants...</p>}

      {!loading && restaurants.length === 0 && (
        <p className="text-gray-600">No restaurants available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restaurants.slice(0, 4).map((res) => (
          <Link
            to={`/restaurant/${res.id}`}
            key={res.id}
            className="block bg-white p-4 rounded-zoomo shadow-zoomo hover:shadow-lg transition"
          >
            <img
              src={res.imageUrl || "https://via.placeholder.com/400x200"}
              alt={res.name}
              className="w-full h-40 object-cover rounded-zoomo mb-3"
            />

            <h3 className="text-lg font-semibold">{res.name}</h3>
            <p className="text-gray-600 text-sm">{res.cuisineType}</p>

            <p className="text-gray-800 font-semibold mt-2">
              ⭐ {res.rating ?? 4.2}
            </p>
          </Link>
        ))}
      </div>

      {/* Browse Button */}
      <div className="text-center mt-6">
        <Link
          to="/restaurants"
          className="inline-block px-5 py-3 bg-black text-white rounded-zoomo text-lg"
        >
          Browse All Restaurants →
        </Link>
      </div>
    </div>
  );
}
