import type { ViewSearch } from "../components/ViewSearch/component";
import { currentLocationPlaceRecord } from "../data/inat_data";
import type { AppStoreType } from "../types/app";
import { getLatLong } from "./geolocation";
import { fitBoundsPlaces, renderMarker } from "./map_utils";

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

  let latitude = data.coords.latitude;
  let longitude = data.coords.longitude;

  // update map
  appStore.placesMarkers.forEach((m) => m.remove());
  let marker = renderMarker({ latitude: latitude, longitude: longitude }, map);

  // update store
  appStore.placesMarkers = [marker];
  appStore.selectedPlaces = appStore.selectedPlaces.filter((p) => p.id !== -1);
  appStore.selectedPlaces.push(
    currentLocationPlaceRecord([longitude, latitude]),
  );
  appStore.observationsApiParams.lat = latitude;
  appStore.observationsApiParams.lng = longitude;

  renderCurrentLocation(appStore, componentCtx);
}

export async function renderCurrentLocation(
  appStore: AppStoreType,
  componentCtx: ViewSearch,
) {
  let map = appStore.map.map;
  if (!componentCtx.latitudeEl) return;
  if (!componentCtx.longitudeEl) return;
  if (!map) return;

  let latitude = appStore.observationsApiParams.lat;
  let longitude = appStore.observationsApiParams.lng;
  if (!latitude) return;
  if (!longitude) return;

  // update map
  fitBoundsPlaces(appStore);

  // update form
  componentCtx.latitudeEl.value = latitude.toString();
  componentCtx.longitudeEl.value = longitude.toString();

  await componentCtx.formChangeHandlerDebounced(componentCtx.formEl);
}
