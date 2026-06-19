import type { AppStoreType } from "../types/app";
import { addDefaultTaxaRecordToMap } from "./data_utils";
import { addCurrentPlaceToMapAndStore } from "./search_current_place";
import { updateTilesForSelectedTaxa } from "./search_utils";

export function initGeoTracking(appStore: AppStoreType) {
  appStore.geolocation = "tracking";
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

export async function geoTrackingHandler(
  data: GeolocationPosition,
  appStore: AppStoreType,
) {
  let map = appStore.map.map;
  if (!map) {
    return;
  }
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

  addCurrentPlaceToMapAndStore(appStore);

  if (appStore.selectedTaxa.length === 1 && appStore.selectedTaxa[0].id === 0) {
    // load default Taxa map tiles
    await addDefaultTaxaRecordToMap(appStore);
  } else {
    // update taxa tiles for selected taxa
    await updateTilesForSelectedTaxa(appStore);
  }

  window.dispatchEvent(new Event("updateHeaderCount"));
}

export function geoTrackingError(error: GeolocationPositionError) {
  console.log(error);
}
