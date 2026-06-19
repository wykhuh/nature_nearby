import type { AppStoreType } from "../types/app";
import { addDefaultTaxaRecordToMap, clearMapLayers } from "./data_utils";
import { addCurrentPlaceToMapAndStore } from "./search_current_place";
import { updateTilesForSelectedTaxa } from "./search_utils";
import { updateAppUrl } from "./url_utils";

export function initGeoTracking(appStore: AppStoreType) {
  appStore.trackingId = navigator.geolocation.watchPosition(
    (data) => geoTrackingSuccess(data),
    (error) => geoTrackingError(error),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    },
  );
}

export function geoTrackingSuccess(data: GeolocationPosition) {
  window.dispatchEvent(
    new CustomEvent("geoTrackingSuccess", {
      detail: data,
    }),
  );
}

export async function geoTrackingSuccessHandler(
  data: GeolocationPosition,
  appStore: AppStoreType,
) {
  if (import.meta.env?.VITE_CACHE_GEO === "true") {
    data = {
      coords: { latitude: 34.136555, longitude: -118.294197 },
      timestamp: Date.now(),
    } as GeolocationPosition;
  }

  let map = appStore.map.map;
  if (!map) {
    return;
  }
  appStore.geolocation = "tracking";

  // don't update if previous location update is very recent
  if (appStore.trackingTimestamp) {
    let diff = data.timestamp - appStore.trackingTimestamp;
    if (diff < 200) {
      console.log("calibrating", diff);
      return;
    } else if (diff < 1000 * 10) {
      console.log("too recent", diff);
      return;
    }
  }

  let latitude = data.coords.latitude;
  let longitude = data.coords.longitude;
  console.log("tracking", latitude, longitude, data.timestamp);

  appStore.observationsApiParams.lat = latitude;
  appStore.observationsApiParams.lng = longitude;
  appStore.trackingTimestamp = data.timestamp;
  if (appStore.observationsApiParams.radius === undefined) {
    appStore.observationsApiParams.radius = appStore.radius;
  }

  // remove map layers
  clearMapLayers(appStore.taxaMapLayers, appStore.map.layerControl);
  // add marker and circle
  addCurrentPlaceToMapAndStore(appStore);

  if (appStore.selectedTaxa.length === 1 && appStore.selectedTaxa[0].id === 0) {
    // load default Taxa map tiles
    await addDefaultTaxaRecordToMap(appStore);
  } else {
    // update taxa tiles for selected taxa
    await updateTilesForSelectedTaxa(appStore);
  }

  updateAppUrl(window.location, appStore);
  window.dispatchEvent(new Event("updateHeaderCount"));
}

export function geoTrackingError(error: GeolocationPositionError) {
  console.log(error);
}
