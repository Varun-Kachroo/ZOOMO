import { useState } from "react";

export default function DishForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price || "",
    imageUrl: initialData.imageUrl || "",
    ingredients: initialData.ingredients || "",
    calories: initialData.calories || "",
    preparationTime: initialData.preparationTime || "",
    isVegetarian: initialData.isVegetarian || false,
    isVegan: initialData.isVegan || false,
    isGlutenFree: initialData.isGlutenFree || false,
    isAvailable:
      initialData.isAvailable !== undefined
        ? initialData.isAvailable
        : true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // TEMP: public folder strategy (cloud-ready later)
    const imagePath = `/${file.name}`;
    setForm({ ...form, imageUrl: imagePath });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-10">

      {/* ================= BASIC INFO ================= */}
      <Section title="Basic Information">
        <Field label="Dish Name" required>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-zoomo"
            required
          />
        </Field>

        <Field label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="input-zoomo resize-none"
          />
        </Field>
      </Section>

      {/* ================= PRICING & PREP ================= */}
      <Section title="Pricing & Preparation">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Price (₹)" required>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="input-zoomo"
              required
            />
          </Field>

          <Field label="Preparation Time (mins)">
            <input
              name="preparationTime"
              type="number"
              value={form.preparationTime}
              onChange={handleChange}
              className="input-zoomo"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Calories">
            <input
              name="calories"
              type="number"
              value={form.calories}
              onChange={handleChange}
              className="input-zoomo"
            />
          </Field>

          <Field label="Ingredients">
            <input
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              className="input-zoomo"
            />
          </Field>
        </div>
      </Section>

      {/* ================= IMAGE ================= */}
      <Section title="Dish Image">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          
          {/* Preview */}
          <div
            className="
              w-40 h-40
              rounded-3xl
              bg-gray-100 dark:bg-[#1f1f1f]
              border border-dashed border-gray-300 dark:border-white/20
              flex items-center justify-center
              overflow-hidden
            "
          >
            {form.imageUrl ? (
              <img
                src={form.imageUrl}
                alt="Dish preview"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <img
                src="/zoomo-mascot.png"
                alt="Upload dish"
                className="w-20 opacity-30"
              />
            )}
          </div>

          {/* Upload */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              This image will be shown to customers
            </p>
          </div>
        </div>
      </Section>

      {/* ================= DIETARY ================= */}
      <Section title="Dietary Information">
        <div className="grid sm:grid-cols-2 gap-4">
          <Toggle
            label="Vegetarian"
            name="isVegetarian"
            checked={form.isVegetarian}
            onChange={handleChange}
          />
          <Toggle
            label="Vegan"
            name="isVegan"
            checked={form.isVegan}
            onChange={handleChange}
          />
          <Toggle
            label="Gluten Free"
            name="isGlutenFree"
            checked={form.isGlutenFree}
            onChange={handleChange}
          />
          <Toggle
            label="Available"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
        </div>
      </Section>

      {/* ================= SUBMIT ================= */}
      <div className="pt-2">
        <button
          type="submit"
          className="
            w-full py-3 rounded-2xl
            bg-emerald-600 hover:bg-emerald-700
            text-white font-semibold
            shadow-sm transition
          "
        >
          Save Dish
        </button>
      </div>
    </form>
  );
}

/* ================= UI HELPERS ================= */

function Section({ title, children }) {
  return (
    <div
      className="
        rounded-3xl
        bg-white/95 dark:bg-[#141414]
        border border-black/5 dark:border-white/10
        p-6
        space-y-5
      "
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-emerald-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({ label, name, checked, onChange }) {
  return (
    <label
      className="
        flex items-center justify-between
        px-4 py-3 rounded-2xl
        bg-gray-100 dark:bg-[#1f1f1f]
        text-gray-800 dark:text-gray-200
      "
    >
      <span className="text-sm font-medium">{label}</span>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-emerald-600"
      />
    </label>
  );
}
