import { ORDER_FILTERS } from "../utils/orderFilters";

export default function OrderFilters({ active, onChange }) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {Object.entries(ORDER_FILTERS).map(([key, filter]) => {
        const isActive = active === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              px-4 py-2
              rounded-full
              text-sm font-medium
              transition
              ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-[#1f1f1f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
              }
            `}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
