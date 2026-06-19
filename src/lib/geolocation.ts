import type { GeolocationData } from "../types/app";

export async function getLatLong() {
  if (import.meta.env?.VITE_CACHE_GEO === "true") {
    return { coords: { latitude: 34.136555, longitude: -118.294197 } };
  }

  if (navigator.geolocation) {
    return new Promise<GeolocationData>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 3000,
      });
    });
  }
}
