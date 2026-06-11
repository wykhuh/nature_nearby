import type { GeolocationData } from "../types/app";

export async function getLatLong() {
  if (navigator.geolocation) {
    return new Promise<GeolocationData>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 3000,
      });
    });
  }
}
