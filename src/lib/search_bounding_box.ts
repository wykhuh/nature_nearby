import type { AppStoreType } from "../types/app";

export function removePlacesFromStoreAndMap(appStore: AppStoreType) {
  // remove from map
  Object.values(appStore.placesMapLayers).forEach((layers) => {
    layers.forEach((layer) => {
      // remove layer from map
      layer.remove();
    });
  });

  // remove from store
  appStore.placesMapLayers = {};
  appStore.selectedPlaces = [];

  delete appStore.observationsApiParams.place_id;
  delete appStore.observationsApiParams.nelat;
  delete appStore.observationsApiParams.nelng;
  delete appStore.observationsApiParams.swlat;
  delete appStore.observationsApiParams.swlng;
}
