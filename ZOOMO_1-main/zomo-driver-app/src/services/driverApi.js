const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function authFetch(url, options = {}) {
  const token = localStorage.getItem("driverToken");

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

/* ===========================
   DRIVER AVAILABILITY
=========================== */
export async function updateAvailability(isAvailable) {
  const token = localStorage.getItem("driverToken");

  const res = await fetch(
    `${API_BASE}/driver/me/availability`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isAvailable }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update availability");
  }

  return res.json();
}

/* ===========================
   ASSIGNED ORDERS
=========================== */
export async function fetchAssignedOrders() {
  const token = localStorage.getItem("driverToken");

  const res = await fetch(
    `${API_BASE}/driver/orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

/* ===========================
   ORDER STATUS UPDATES
=========================== */
export async function markOrderPickedUp(orderId) {
  const token = localStorage.getItem("driverToken");

  const res = await fetch(
    `${API_BASE}/driver/orders/${orderId}/pickup`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to mark picked up");
  }

  return res.json();
}

export async function markOrderDelivered(orderId) {
  const token = localStorage.getItem("driverToken");

  const res = await fetch(
    `${API_BASE}/driver/orders/${orderId}/deliver`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to mark delivered");
  }

  return res.json();
}

export async function driverLogin(email, password) {
  const res = await fetch(
    `${API_BASE}/driver/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
}

/* ===========================
   DRIVER HEARTBEAT
=========================== */
export async function sendHeartbeat() {
  const res = await authFetch(
    `${API_BASE}/driver/heartbeat`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Heartbeat failed");
  }
}

/* ===========================
   DRIVER SESSION SYNC
=========================== */
export async function fetchDriverMe() {
  const res = await authFetch(
    `${API_BASE}/driver/me`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch driver");
  }

  return res.json();
}

export async function sendDriverLocation(lat, lng) {
  const token = localStorage.getItem("driverToken");

  const res = await fetch(
    `${API_BASE}/driver/location`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lat, lng }),
    }
  );

  if (!res.ok) {
    throw new Error("Location update failed");
  }
}

/* ===========================
   DRIVER DASHBOARD
=========================== */
export async function fetchDriverDashboard() {
  const token = localStorage.getItem("driverToken");

  const res = await fetch(
    `${API_BASE}/driver/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load dashboard");
  }

  return res.json();
}

export async function fetchOrderDetails(orderId) {
  const token = localStorage.getItem("driverToken");

  const res = await fetch(
    `${API_BASE}/driver/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load order details");
  }

  return res.json();
}

