export default function StatusBadge({ status }) {
  const styles = {
    PENDING:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
    PREPARING:
      "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
    READY_FOR_PICKUP:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
    OUT_FOR_DELIVERY:
      "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300",
    DELIVERED:
      "bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300",
    CANCELLED:
      "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
  };

  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        rounded-full
        text-xs font-semibold
        tracking-wide
        ${styles[status] || "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"}
      `}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
