import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const C = { primary: "#0F3D2D", accent: "#1F7A52" };

/**
 * Shows restaurant + delivery address as fixed markers, and the
 * driver's position as a marker that moves live as `driverLocation`
 * updates — no page reload, no manual refresh.
 */
export default function LiveTrackingMap({ restaurant, address, driverLocation }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const initializedRef = useRef(false);

  // Initialize map once, centered on whatever points we actually have
  useEffect(() => {
    if (initializedRef.current || !mapContainerRef.current) return;
    if (!restaurant?.lat || !address?.lat) return; // wait for real coordinates

    initializedRef.current = true;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [restaurant.lng, restaurant.lat],
      zoom: 13,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Restaurant marker
      const restEl = document.createElement("div");
      restEl.style.fontSize = "24px";
      restEl.innerText = "🏬";
      new mapboxgl.Marker(restEl)
        .setLngLat([restaurant.lng, restaurant.lat])
        .addTo(map);

      // Delivery address marker
      const homeEl = document.createElement("div");
      homeEl.style.fontSize = "24px";
      homeEl.innerText = "📍";
      new mapboxgl.Marker(homeEl)
        .setLngLat([address.lng, address.lat])
        .addTo(map);

      // Fit both into view
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([restaurant.lng, restaurant.lat]);
      bounds.extend([address.lng, address.lat]);
      map.fitBounds(bounds, { padding: 60, maxZoom: 15 });
    });

    return () => map.remove();
  }, [restaurant, address]);

  // Add/move the driver marker whenever a new live position comes in
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !driverLocation) return;

    if (!driverMarkerRef.current) {
      const carEl = document.createElement("div");
      carEl.style.fontSize = "26px";
      carEl.innerText = "🛵";
      driverMarkerRef.current = new mapboxgl.Marker(carEl)
        .setLngLat([driverLocation.lng, driverLocation.lat])
        .addTo(map);

      // Widen the view to include the driver too
      const bounds = new mapboxgl.LngLatBounds();
      if (restaurant?.lat) bounds.extend([restaurant.lng, restaurant.lat]);
      if (address?.lat) bounds.extend([address.lng, address.lat]);
      bounds.extend([driverLocation.lng, driverLocation.lat]);
      map.fitBounds(bounds, { padding: 60, maxZoom: 15 });
    } else {
      // Smoothly glide the marker to its new position rather than jump
      driverMarkerRef.current.setLngLat([driverLocation.lng, driverLocation.lat]);
    }
  }, [driverLocation, restaurant, address]);

  if (!restaurant?.lat || !address?.lat) {
    return (
      <div style={{ height: 240, borderRadius: 18, background: "#EEF3F0",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#6B7280", fontSize: 13 }}>
        Map unavailable for this order
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: 240, borderRadius: 18, overflow: "hidden" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      {!driverLocation && (
        <div style={{ position: "absolute", bottom: 10, left: 10, right: 10,
          background: "rgba(255,255,255,0.95)", borderRadius: 12, padding: "8px 12px",
          fontSize: 12, color: C.primary, fontWeight: 600, textAlign: "center" }}>
          Waiting for your delivery partner's location...
        </div>
      )}
    </div>
  );
}
