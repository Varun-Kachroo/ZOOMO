import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Joins the live room for one order and returns whatever comes through
 * in real time: the driver's current position, and any status change
 * pushed the moment a merchant or driver updates it — no polling, no
 * manual refresh needed.
 *
 * Returns { liveLocation, liveStatus, connected }. `liveStatus` stays
 * null until an update actually arrives — the page should keep showing
 * the status from its initial REST fetch until then, then prefer
 * liveStatus once it's set.
 */
export function useOrderTracking(orderId) {
  const socketRef = useRef(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [liveStatus, setLiveStatus] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket = io(API_BASE, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("order:join", { orderId });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("order:driverLocation", (data) => {
      if (data.orderId === orderId) {
        setLiveLocation({ lat: data.lat, lng: data.lng });
      }
    });

    socket.on("order:statusChanged", (data) => {
      if (data.orderId === orderId) {
        setLiveStatus(data.status);
      }
    });

    return () => {
      socket.emit("order:leave", { orderId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [orderId]);

  return { liveLocation, liveStatus, connected };
}
