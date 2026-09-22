import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const EMIT_INTERVAL_MS = 3000; // don't flood the server on every GPS tick

/**
 * Opens one socket connection for the currently active delivery and
 * emits the driver's live location on it. Reuses whatever GPS position
 * the page already has (from useDriverLocation()) rather than watching
 * GPS a second time — this hook only owns the socket, not the GPS.
 *
 * Only emits while status is READY_FOR_PICKUP or OUT_FOR_DELIVERY —
 * no reason to be broadcasting position before or after an active
 * delivery.
 */
export function useOrderSocket(orderId, location, status) {
  const socketRef = useRef(null);
  const lastEmitRef = useRef(0);

  // Open/close the connection whenever the active order changes
  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem("driverToken");
    if (!token) return;

    const socket = io(API_BASE, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [orderId]);

  // Emit location, throttled, only during an active delivery phase
  useEffect(() => {
    if (!location || !orderId) return;
    if (status !== "READY_FOR_PICKUP" && status !== "OUT_FOR_DELIVERY") return;

    const now = Date.now();
    if (now - lastEmitRef.current < EMIT_INTERVAL_MS) return;
    lastEmitRef.current = now;

    socketRef.current?.emit("driver:location", {
      orderId,
      lat: location.lat,
      lng: location.lng,
    });
  }, [location, orderId, status]);
}
