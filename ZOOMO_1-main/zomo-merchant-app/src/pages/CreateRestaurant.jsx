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
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
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
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          placeholder="Full Address"
          className="w-full border p-2 rounded"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          placeholder="Restaurant Phone"
          className="w-full border p-2 rounded"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Restaurant Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Opening Hours (e.g. 9 AM - 11 PM)"
          className="w-full border p-2 rounded"
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
          className="w-full border p-2 rounded"
          value={form.cuisineType}
          onChange={(e) =>
            setForm({
              ...form,
              cuisineType: e.target.value,
            })
          }
        />

        <select
          className="w-full border p-2 rounded"
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
          className="bg-red-500 text-white w-full py-2 rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Restaurant"}
        </button>
      </form>
    </div>
  );
}
