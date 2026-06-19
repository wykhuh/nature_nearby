import { currentLocationPlaceRecord } from "../data/inat_data";
import type { AppStoreType } from "../types/app";
import { getLatLong } from "./geolocation";
import {
  convertCircleToBBox,
  fitBoundsPlaces,
  renderCircle,
  renderMarker,
  renderWalkingMarker,
} from "./map_utils";

export async function initGeoCurrent(appStore: AppStoreType) {
  let data;
  // get location
  try {
    data = await getLatLong();
  } catch (error) {
    console.log(error);
    return;
  }

  if (!data) {
    return;
  }

  appStore.geolocation = "current";
  appStore.observationsApiParams.lat = data.coords.latitude;
  appStore.observationsApiParams.lng = data.coords.longitude;
  if (appStore.observationsApiParams.radius === undefined) {
    appStore.observationsApiParams.radius = appStore.radius;
  }
}

export function addCurrentPlaceToMapAndStore(appStore: AppStoreType) {
  if (!appStore.observationsApiParams.lat) return;
  if (!appStore.observationsApiParams.lng) return;
  if (!appStore.map.map) return;

  let circle = renderCircle(appStore);
  if (!circle) return;

  circle.addTo(appStore.map.map);
  let coors = convertCircleToBBox(circle);
  let place = currentLocationPlaceRecord(coors);

  // update store
  appStore.selectedPlaces = appStore.selectedPlaces.filter((p) => p.id !== -1);
  appStore.selectedPlaces.push(place);

  // update map
  appStore.placesMarkers.forEach((m) => m.remove());
  appStore.placesMarkers = [circle];

  let marker;
  if (appStore.geolocation === "tracking") {
    marker = renderWalkingMarker(
      {
        latitude: appStore.observationsApiParams.lat,
        longitude: appStore.observationsApiParams.lng,
      },
      appStore.map.map,
    );
  } else {
    marker = renderMarker(
      {
        latitude: appStore.observationsApiParams.lat,
        longitude: appStore.observationsApiParams.lng,
      },
      appStore.map.map,
    );
  }
  appStore.placesMarkers.push(marker);

  fitBoundsPlaces(appStore);
}
