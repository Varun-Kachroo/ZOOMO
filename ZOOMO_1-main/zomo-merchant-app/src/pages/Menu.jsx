import { useEffect, useState } from "react";
import DishCard from "../components/DishCard";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Menu() {
  const navigate = useNavigate();

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch menu (merchant's own restaurant)
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/merchant/dishes");
        setDishes(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load menu"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Toggle availability
  const toggleAvailability = async (dishId) => {
    try {
      await api.patch(`/merchant/dishes/${dishId}/toggle`);

      setDishes((prev) =>
        prev.map((d) =>
          d.id === dishId
            ? { ...d, isAvailable: !d.isAvailable }
            : d
        )
      );
    } catch {
      alert("Failed to update availability");
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Loading menu...
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Menu
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage dishes visible to customers
          </p>
        </div>

        <button
          onClick={() => navigate("/menu/add")}
          className="
            px-5 py-2.5
            rounded-2xl
            bg-emerald-600 hover:bg-emerald-700
            text-white font-medium
            shadow-sm
            transition
          "
        >
          + Add Dish
        </button>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {dishes.length === 0 ? (
        <div
          className="
            mt-12
            flex flex-col items-center justify-center
            text-center
            rounded-3xl
            bg-white/95 dark:bg-[#141414]
            border border-black/5 dark:border-white/10
            p-10
          "
        >
          <img
            src="/zoomo-mascot.png"
            alt="No dishes"
            className="w-24 opacity-40 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            No dishes yet
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Start building your menu by adding your first dish
          </p>
          <button
            onClick={() => navigate("/menu/add")}
            className="
              px-5 py-2.5
              rounded-2xl
              bg-emerald-600 hover:bg-emerald-700
              text-white font-medium
            "
          >
            Add Your First Dish
          </button>
        </div>
      ) : (
        /* ================= DISH GRID ================= */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onEdit={() =>
                navigate(`/menu/edit/${dish.id}`)
              }
              onToggle={() =>
                toggleAvailability(dish.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
