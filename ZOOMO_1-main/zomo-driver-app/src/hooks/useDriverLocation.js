import { useEffect, useRef, useState } from "react";

/* ===========================
   CONFIG
=========================== */
const MIN_MOVE_METERS = 3;      // ignore GPS jitter
const SMOOTHING_FACTOR = 0.3;   // 0 = frozen, 1 = raw GPS

export function useDriverLocation() {
  const [location, setLocation] = useState(null);
  const lastLocationRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    function getDistanceMeters(a, b) {
      const R = 6371000;
      const toRad = (v) => (v * Math.PI) / 180;

      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);

      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);

      const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLng / 2) ** 2;

      return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    }

    watchIdRef.current =
      navigator.geolocation.watchPosition(
        (pos) => {
          const raw = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          if (!lastLocationRef.current) {
            lastLocationRef.current = raw;
            setLocation(raw);
            return;
          }

          const dist = getDistanceMeters(
            lastLocationRef.current,
            raw
          );

          if (dist < MIN_MOVE_METERS) return;

          const smooth = {
            lat:
              lastLocationRef.current.lat +
              (raw.lat -
                lastLocationRef.current.lat) *
                SMOOTHING_FACTOR,
            lng:
              lastLocationRef.current.lng +
              (raw.lng -
                lastLocationRef.current.lng) *
                SMOOTHING_FACTOR,
          };

          lastLocationRef.current = smooth;
          setLocation(smooth);
        },
        (err) => {
          console.error("GPS error", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
        }
      );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );
      }
    };
  }, []);

  return location;
}
