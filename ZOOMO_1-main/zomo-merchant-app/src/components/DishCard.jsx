export default function DishCard({ dish, onEdit, onToggle }) {
  return (
    <div
      className="
        rounded-3xl
        overflow-hidden
        bg-white/95 dark:bg-[#141414]
        border border-black/5 dark:border-white/10
        transition
        hover:shadow-lg
      "
    >
      {/* ================= IMAGE ================= */}
      <div className="relative h-40 bg-gray-100 dark:bg-[#1f1f1f]">
        <img
          src={dish.imageUrl || "/food-placeholder.png"}
          alt={dish.name}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "/food-placeholder.png")}
        />

        {/* Availability badge */}
        <span
          className={`
            absolute top-3 right-3
            px-3 py-1
            rounded-full
            text-xs font-semibold
            ${
              dish.isAvailable
                ? "bg-emerald-600 text-white"
                : "bg-gray-900/70 text-white"
            }
          `}
        >
          {dish.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {dish.name}
            </h3>
            {dish.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {dish.description}
              </p>
            )}
          </div>

          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            ₹{dish.price}
          </div>
        </div>

        {/* Dietary tags */}
        {(dish.isVegetarian || dish.isVegan || dish.isGlutenFree) && (
          <div className="flex flex-wrap gap-2 text-xs">
            {dish.isVegetarian && (
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                🌱 Veg
              </span>
            )}
            {dish.isVegan && (
              <span className="px-2 py-1 rounded-full bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300">
                🥬 Vegan
              </span>
            )}
            {dish.isGlutenFree && (
              <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300">
                🚫 Gluten Free
              </span>
            )}
          </div>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div
        className="
          px-4 py-3
          border-t border-black/5 dark:border-white/10
          flex gap-3
        "
      >
        <button
          onClick={onEdit}
          className="
            flex-1
            text-sm font-medium
            py-2 rounded-xl
            bg-gray-100 dark:bg-[#1f1f1f]
            text-gray-800 dark:text-gray-200
            hover:bg-gray-200 dark:hover:bg-[#2a2a2a]
          "
        >
          Edit
        </button>

        <button
          onClick={onToggle}
          className={`
            flex-1
            text-sm font-medium
            py-2 rounded-xl
            ${
              dish.isAvailable
                ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
            }
          `}
        >
          {dish.isAvailable ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
}
