import type { ViewSearch } from "../components/ViewSearch/component";
import {
  renderSelectedFiltersList,
  renderSelectedMoreFiltersList,
} from "../components/ViewSearch/render_utils";
import type { AppStoreType } from "../types/app";

import {
  addCurrentPlaceToMapAndStore,
  renderAndFetchLatLong,
} from "./search_current_place";

export async function trackingLocationHandler(
  appStore: AppStoreType,
  componentCtx: ViewSearch,
) {
  if (!componentCtx.trackLocationEl) return;
  if (!navigator.geolocation) {
    return;
  }

  // stop tracking
  if (appStore.geolocation === "tracking") {
    delete appStore.geolocation;
    delete appStore.trackingTimestamp;
    if (appStore.trackingId) {
      navigator.geolocation.clearWatch(appStore.trackingId);
      delete appStore.trackingId;
    }
    componentCtx.trackLocationEl.textContent = "Track location";

    // start tracking
  } else {
    appStore.geolocation = "tracking";
    initGeoTracking(appStore, componentCtx);

    componentCtx.trackLocationEl.textContent = "Stop tracking";
  }
}

export function initGeoTracking(
  appStore: AppStoreType,
  componentCtx: ViewSearch | null,
) {
  appStore.trackingId = navigator.geolocation.watchPosition(
    (data) => geoTrackingSuccess(data, appStore, componentCtx),
    (error) => geoTrackingError(error),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    },
  );
}

export async function geoTrackingSuccess(
  data: GeolocationPosition,
  appStore: AppStoreType,
  componentCtx: ViewSearch | null,
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

  addCurrentPlaceToMapAndStore(appStore);

  // update ui
  renderSelectedFiltersList(appStore);
  renderSelectedMoreFiltersList(appStore);

  //  update ui and app state
  if (componentCtx) {
    await renderAndFetchLatLong(appStore, componentCtx);
  }
}

export function geoTrackingError(error: GeolocationPositionError) {
  console.log(error);
}
