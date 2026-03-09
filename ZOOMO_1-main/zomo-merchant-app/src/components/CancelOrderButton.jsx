import { canCancelOrder } from "../utils/orderStatus";

export default function CancelOrderButton({ status, onCancel }) {
  if (!canCancelOrder(status)) return null;

  return (
    <button
      onClick={() => {
        const confirmCancel = window.confirm(
          "Are you sure you want to cancel this order?"
        );
        if (confirmCancel) onCancel();
      }}
      className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50"
    >
      Cancel Order
    </button>
  );
}
