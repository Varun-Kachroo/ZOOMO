import StatusBadge from "./StatusBadge";

export default function OrderCard({ order, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        rounded-2xl
        bg-white/90 dark:bg-[#141414]
        border border-black/5 dark:border-white/10
        p-4
        transition
        hover:shadow-lg
        hover:-translate-y-0.5
      "
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Order #{order.id.slice(0, 6)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {order.customerName}
          </p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-black/5 dark:bg-white/10" />

      {/* Bottom row */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">
          {order.items.length} item{order.items.length > 1 ? "s" : ""}
        </span>

        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          ₹{order.total}
        </span>
      </div>
    </div>
  );
}
