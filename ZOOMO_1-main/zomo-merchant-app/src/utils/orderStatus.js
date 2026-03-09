export const STATUS_FLOW = {
  PENDING: { next: "PREPARING", label: "Accept Order" },
  PREPARING: { next: "READY_FOR_PICKUP", label: "Mark as Ready" },
  READY_FOR_PICKUP: { next: "OUT_FOR_DELIVERY", label: "Dispatch Order" },
  OUT_FOR_DELIVERY: { next: "DELIVERED", label: "Mark as Delivered" },
};

export const canCancelOrder = (status) => status === "PENDING";

export const isTerminalStatus = (status) =>
  status === "DELIVERED" || status === "CANCELLED";
