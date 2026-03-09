export default function OrderStatusActions({ status, onUpdate }) {

  // OUT_FOR_DELIVERY → only driver ends the order
  if (status === "OUT_FOR_DELIVERY") {
    return (
      <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700 font-medium">
        Order is with the driver. Delivery will be confirmed by the driver.
      </div>
    );
  }

  const ACTIONS = {
    PENDING: { label: "Accept Order", next: "PREPARING" },
    PREPARING: { label: "Mark Ready for Pickup", next: "READY_FOR_PICKUP" },
    READY_FOR_PICKUP: { label: "Out for Delivery", next: "OUT_FOR_DELIVERY" },
  };

  const action = ACTIONS[status];

  if (!action) return null;

  return (
    <button
      onClick={() => onUpdate(action.next)}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
    >
      {action.label}
    </button>
  );
}
