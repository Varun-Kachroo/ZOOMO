import React from "react";
import ImageUpload from "./ImageUpload";

export default function RestaurantForm({ restaurant, onSubmit }) {
  /* ===========================
     FORM STATE
  =========================== */
  const [form, setForm] = React.useState({
    name: restaurant?.name || "",
    description: restaurant?.description || "",
    phone: restaurant?.phone || "",
    email: restaurant?.email || "",
    openingHours: restaurant?.openingHours || "",
    cuisineType: restaurant?.cuisineType || "",
    priceRange: restaurant?.priceRange || "",
    isActive: restaurant?.isActive ?? true,

    // 🔥 STRUCTURED ADDRESS
    shop: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [image, setImage] = React.useState(
    restaurant?.imageUrl ? { preview: restaurant.imageUrl } : null
  );

  /* ===========================
     SUBMIT
  =========================== */
  const submit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.shop ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required address fields");
      return;
    }

    // 🔥 MERGE ADDRESS (GEOCODER-FRIENDLY)
    const mergedAddress = [
      form.shop,
      form.area,
      form.city,
      form.state,
      form.pincode,
      form.country,
    ]
      .filter(Boolean)
      .join(", ");

    onSubmit({
      name: form.name,
      description: form.description,
      address: mergedAddress, // 👈 SINGLE STRING (schema unchanged)
      phone: form.phone,
      email: form.email,
      openingHours: form.openingHours,
      cuisineType: form.cuisineType,
      priceRange: form.priceRange,
      isActive: form.isActive,
      image,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-10">
      {/* ================= IMAGE ================= */}
      <Section title="Restaurant Image">
        <ImageUpload image={image} setImage={setImage} />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This image will be shown to customers
        </p>
      </Section>

      {/* ================= BASIC INFO ================= */}
      <Section title="Basic Information">
        <Field label="Restaurant Name" required>
          <input
            className="input-zoomo"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </Field>

        <Field label="Description">
          <textarea
            className="input-zoomo resize-none"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </Field>
      </Section>

      {/* ================= ADDRESS ================= */}
      <Section title="Restaurant Address">
        <Field label="Shop / Building / Landmark" required>
          <input
            className="input-zoomo"
            value={form.shop}
            onChange={(e) =>
              setForm({ ...form, shop: e.target.value })
            }
          />
        </Field>

        <Field label="Area / Locality">
          <input
            className="input-zoomo"
            value={form.area}
            onChange={(e) =>
              setForm({ ...form, area: e.target.value })
            }
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="City" required>
            <input
              className="input-zoomo"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />
          </Field>

          <Field label="State" required>
            <input
              className="input-zoomo"
              value={form.state}
              onChange={(e) =>
                setForm({ ...form, state: e.target.value })
              }
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Pincode" required>
            <input
              className="input-zoomo"
              value={form.pincode}
              onChange={(e) =>
                setForm({ ...form, pincode: e.target.value })
              }
            />
          </Field>

          <Field label="Country">
            <input
              className="input-zoomo"
              value={form.country}
              onChange={(e) =>
                setForm({ ...form, country: e.target.value })
              }
            />
          </Field>
        </div>
      </Section>

      {/* ================= CONTACT ================= */}
      <Section title="Contact Details">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone Number">
            <input
              className="input-zoomo"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              className="input-zoomo"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </Field>
        </div>
      </Section>

      {/* ================= BUSINESS INFO ================= */}
      <Section title="Business Information">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Opening Hours">
            <input
              className="input-zoomo"
              placeholder="e.g. 10 AM – 11 PM"
              value={form.openingHours}
              onChange={(e) =>
                setForm({ ...form, openingHours: e.target.value })
              }
            />
          </Field>

          <Field label="Cuisine Type">
            <input
              className="input-zoomo"
              placeholder="e.g. Italian, Indian"
              value={form.cuisineType}
              onChange={(e) =>
                setForm({ ...form, cuisineType: e.target.value })
              }
            />
          </Field>
        </div>

        <Field label="Price Range">
          <select
            className="input-zoomo"
            value={form.priceRange}
            onChange={(e) =>
              setForm({ ...form, priceRange: e.target.value })
            }
          >
            <option value="">Select price range</option>
            <option value="$">$ (Budget)</option>
            <option value="$$">$$ (Mid-range)</option>
            <option value="$$$">$$$ (Premium)</option>
            <option value="$$$$">$$$$ (Luxury)</option>
          </select>
        </Field>
      </Section>

      {/* ================= STATUS ================= */}
      <Section title="Restaurant Status">
        <label className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-100 dark:bg-[#1f1f1f]">
          <span className="text-sm font-medium">
            Restaurant is active
          </span>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.checked })
            }
            className="h-5 w-5 accent-emerald-600"
          />
        </label>
      </Section>

      {/* ================= SUBMIT ================= */}
      <button
        type="submit"
        className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
      >
        Save Changes
      </button>
    </form>
  );
}

/* ================= UI HELPERS ================= */

function Section({ title, children }) {
  return (
    <div className="rounded-3xl bg-white/95 dark:bg-[#141414] border border-black/5 dark:border-white/10 p-6 space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-emerald-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
