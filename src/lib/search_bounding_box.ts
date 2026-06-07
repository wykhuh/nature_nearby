import type { AppStoreType, CustomGeoJSONType, LngLatType } from "../types/app";
import {
  convertLnLatToiNatBBox,
  flipLatLng,
  renderBoundingBoxLayer,
} from "./map_utils.ts";
import { bboxPlaceRecord } from "../data/inat_data.ts";
import { updateAppState } from "../components/ViewSearch/shared_utils.ts";

// called when user clicks draw rectangle icon.
// terradraw coordinates is array of 5 sets of long, lat [[-105, 46]].
// terradraw and geojson use long,lat. Leaflet uses lat,long.
export async function processTerraDrawBBox(
  coordinates: LngLatType[],
  appStore: AppStoreType,
) {
  let map = appStore.map.map;
  let layerControl = appStore.map.layerControl;
  if (map === null) return;
  if (layerControl === null) return;

  // remove old places
  removePlacesFromStoreAndMap(appStore);

  // delete old terradraw layer
  appStore.map.terraDraw?.clear();

  // change to lat/lng  for leaflet
  let latLngCoors = coordinates.map(flipLatLng);

  // render leaflet layer
  let layer = renderBoundingBoxLayer(map, latLngCoors) as any;

  // save place
  let place = bboxPlaceRecord(coordinates);
  appStore.selectedPlaces = [place];
  appStore.placesMapLayers = { "0": [layer as unknown as CustomGeoJSONType] };

  // update observationsApiParams
  let { nelng, swlng, nelat, swlat } = convertLnLatToiNatBBox(coordinates);

  appStore.observationsApiParams = {
    ...appStore.observationsApiParams,
    nelng,
    nelat,
    swlat,
    swlng,
  };

  await updateAppState(appStore);
}

function removePlacesFromStoreAndMap(appStore: AppStoreType) {
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
