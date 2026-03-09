import axios from "axios";

const MAPBOX_TOKEN = process.env.VITE_MAPBOX_TOKEN;
const MAPBOX_GEOCODE_URL =
  "https://api.mapbox.com/geocoding/v5/mapbox.places";

/* ===========================
   MAPBOX GEOCODER
=========================== */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    if (!address || address.length < 5) return null;
    if (!MAPBOX_TOKEN) {
      console.error("❌ Missing Mapbox access token");
      return null;
    }

    // 🧹 Normalize address
    const normalized = address
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const url = `${MAPBOX_GEOCODE_URL}/${encodeURIComponent(
      normalized
    )}.json`;

    const res = await axios.get(url, {
      params: {
        access_token: MAPBOX_TOKEN,
        limit: 1,
        country: "IN", // 🇮🇳 improves India accuracy
      },
    });

    const feature = res.data?.features?.[0];
    if (!feature || !feature.center) {
      console.warn("❌ Mapbox geocoding failed for:", address);
      return null;
    }

    return {
      lng: feature.center[0],
      lat: feature.center[1],
    };
  } catch (err) {
    console.error("❌ Mapbox geocoding error:", err);
    return null;
  }
}
