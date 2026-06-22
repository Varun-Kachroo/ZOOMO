import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateRestaurant() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    openingHours: "",
    cuisineType: "",
    priceRange: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.address) {
      setError("Restaurant name and address are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/merchant/restaurants", form);

      // ✅ Restaurant created → dashboard will redirect correctly
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create restaurant"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-[#141414] p-6 rounded-3xl shadow border border-black/5 dark:border-white/10">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Create Your Restaurant
      </h1>

      {error && (
        <p className="text-red-500 text-sm mb-3">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="space-y-3">
        <input
          placeholder="Restaurant Name"
          className="input-zoomo"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          placeholder="Full Address"
          className="input-zoomo resize-none"
          rows={3}
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          placeholder="Restaurant Phone"
          className="input-zoomo"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Restaurant Email"
          className="input-zoomo"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Opening Hours (e.g. 9 AM - 11 PM)"
          className="input-zoomo"
          value={form.openingHours}
          onChange={(e) =>
            setForm({
              ...form,
              openingHours: e.target.value,
            })
          }
        />

        <input
          placeholder="Cuisine Type (e.g. Italian)"
          className="input-zoomo"
          value={form.cuisineType}
          onChange={(e) =>
            setForm({
              ...form,
              cuisineType: e.target.value,
            })
          }
        />

        <select
          className="input-zoomo"
          value={form.priceRange}
          onChange={(e) =>
            setForm({
              ...form,
              priceRange: e.target.value,
            })
          }
        >
          <option value="">Price Range</option>
          <option value="$">$</option>
          <option value="$$">$$</option>
          <option value="$$$">$$$</option>
          <option value="$$$$">$$$$</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="btn-zoomo w-full disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Restaurant"}
        </button>
      </form>
    </div>
  );
}