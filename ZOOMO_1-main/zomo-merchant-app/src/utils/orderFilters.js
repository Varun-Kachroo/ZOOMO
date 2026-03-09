export const ORDER_FILTERS = {
  ALL: {
    label: "All",
    match: () => true,
  },
  PENDING: {
    label: "Pending",
    match: (order) => order.status === "PENDING",
  },
  ACTIVE: {
    label: "Active",
    match: (order) =>
      order.status === "PREPARING",
  },
  COMPLETED: {
    label: "Completed",
    match: (order) => order.status === "DELIVERED",
  },
  CANCELLED: {
    label: "Cancelled",
    match: (order) => order.status === "CANCELLED",
  },
};
