import { useEffect, useState } from "react";
import RestaurantForm from "../components/RestaurantForm";
import api from "../services/api";

export default function RestaurantProfile() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch restaurant profile
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get("/merchant/restaurants/me");
        setRestaurant(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load restaurant profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  // Save profile updates
  const saveProfile = async (data) => {
    setError("");
    try {
      await api.patch(
        `/merchant/restaurants/${restaurant.id}`,
        data
      );

      setRestaurant((prev) => ({
        ...prev,
        ...data,
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update restaurant profile"
      );
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Loading restaurant profile...
      </p>
    );
  }

  if (error) {
    return (
      <div
        className="
          max-w-3xl
          rounded-3xl
          bg-white/95 dark:bg-[#141414]
          border border-black/5 dark:border-white/10
          p-6
        "
      >
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Restaurant Profile
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your restaurant’s information visible to customers
        </p>
      </div>

      {/* ================= FORM CARD ================= */}
      <div
        className="
          rounded-3xl
          bg-white/95 dark:bg-[#141414]
          border border-black/5 dark:border-white/10
          p-6
        "
      >
        <RestaurantForm
          restaurant={restaurant}
          onSubmit={saveProfile}
        />
      </div>
    </div>
  );
}
