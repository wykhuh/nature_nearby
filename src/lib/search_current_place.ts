import type { ViewSearch } from "../components/ViewSearch/component";
import { currentLocationPlaceRecord } from "../data/inat_data";
import type { AppStoreType } from "../types/app";
import { getLatLong } from "./geolocation";
import {
  convertCircleToBBox,
  fitBoundsPlaces,
  renderCircle,
  renderMarker,
} from "./map_utils";

export async function currentLocationHandler(
  appStore: AppStoreType,
  componentCtx: ViewSearch,
) {
  let map = appStore.map.map;
  if (!map) return;

  let data = await getLatLong();
  if (!data) {
    return;
  }

  appStore.observationsApiParams.lat = data.coords.latitude;
  appStore.observationsApiParams.lng = data.coords.longitude;
  appStore.observationsApiParams.radius = appStore.radius;

  addCurrentPlaceToMapAndStore(appStore);
  await updateSearchForm(appStore, componentCtx);
}

export function addCurrentPlaceToMapAndStore(appStore: AppStoreType) {
  if (!appStore.observationsApiParams.lat) return;
  if (!appStore.observationsApiParams.lng) return;
  if (!appStore.map.map) return;

  let locationData = createCurrentLocationCircle(appStore);
  if (!locationData) return;

  // update store
  appStore.selectedPlaces = appStore.selectedPlaces.filter((p) => p.id !== -1);
  appStore.selectedPlaces.push(locationData.place);

  // update map
  appStore.placesMarkers.forEach((m) => m.remove());
  appStore.placesMarkers = [locationData.marker];
  let marker = renderMarker(
    {
      latitude: appStore.observationsApiParams.lat,
      longitude: appStore.observationsApiParams.lng,
    },
    appStore.map.map,
  );
  appStore.placesMarkers.push(marker);

  fitBoundsPlaces(appStore);
}

async function updateSearchForm(
  appStore: AppStoreType,
  componentCtx: ViewSearch,
) {
  if (!componentCtx.latitudeEl) return;
  if (!componentCtx.longitudeEl) return;
  if (!componentCtx.radiusEl) return;

  let latitude = appStore.observationsApiParams.lat;
  let longitude = appStore.observationsApiParams.lng;
  let radius = appStore.observationsApiParams.radius;
  if (!latitude) return;
  if (!longitude) return;
  if (!radius) return;

  // update form
  componentCtx.latitudeEl.value = latitude.toString();
  componentCtx.longitudeEl.value = longitude.toString();
  componentCtx.radiusEl.value = radius.toString();

  await componentCtx.formChangeHandlerDebounced(componentCtx.formEl);
}

export function createCurrentLocationCircle(appStore: AppStoreType) {
  if (!appStore.map.map) return;

  // need to add circle to map first, before we can get bounds for circle
  let circle = renderCircle(appStore);
  if (!circle) return;

  circle.addTo(appStore.map.map);
  let coors = convertCircleToBBox(circle);
  let place = currentLocationPlaceRecord(coors);

  return { marker: circle, place };
}
