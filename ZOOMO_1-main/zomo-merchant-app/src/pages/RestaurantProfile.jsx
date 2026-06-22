import { useEffect, useState } from "react";
import RestaurantForm from "../components/RestaurantForm";
import api from "../services/api";

export default function RestaurantProfile() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  // Fetch restaurant profile
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get("/merchant/restaurants/me");
        setRestaurant(res.data);
      } catch (err) {
        setLoadError(
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
    setSaveError("");
    setSaved(false);
    try {
      await api.patch(
        `/merchant/restaurants/${restaurant.id}`,
        data
      );

      setRestaurant((prev) => ({
        ...prev,
        ...data,
      }));
      setSaved(true);
      // Clear the "saved" confirmation after a few seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      // ✅ FIX: this used to set the same `error` state that replaces
      // the entire page with an error box, hiding the form. Now a
      // failed save shows inline above the form instead, so you can
      // see what went wrong and try again without losing your edits.
      setSaveError(
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

  // Only a failed INITIAL LOAD replaces the page — a failed save does not.
  if (loadError) {
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
        <p className="text-red-500">{loadError}</p>
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

      {saveError && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-4 py-3">
          <p className="text-sm text-red-600 dark:text-red-300">{saveError}</p>
        </div>
      )}

      {saved && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-4 py-3">
          <p className="text-sm text-emerald-600 dark:text-emerald-300">
            ✓ Restaurant profile saved successfully
          </p>
        </div>
      )}

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