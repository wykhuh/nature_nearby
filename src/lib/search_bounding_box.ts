import { updateAppState } from "../components/ViewSearch/shared_utils";
import { bboxPlaceRecord } from "../data/inat_data";
import type { AppStoreType, CustomGeoJSONType, LngLatType } from "../types/app";
import { createGeojsonDemo } from "./dev_utils";
import {
  convertiNatBBoxToLngLat,
  convertLnLatToiNatBBox,
  normalizeTerraDrawLngLat,
  renderBoundingBoxLayer,
} from "./map_utils";

// called when user clicks draw rectangle icon.
// terradraw coordinates is array of 5 sets of long, lat [[-105, 46]].
// terradraw and geojson use long,lat. Leaflet uses lat,long.
export async function drawBBoxHandler(
  coordinates: LngLatType[],
  appStore: AppStoreType,
) {
  if (import.meta.env?.VITE_MAP_DEBUG === "true") {
    console.log("drawBBoxHandler", JSON.stringify(coordinates));
  }

  let map = appStore.map.map;
  let layerControl = appStore.map.layerControl;
  if (map === null) return;
  if (layerControl === null) return;

  // remove old places
  removeAllPlacesFromStoreAndMap(appStore);

  // delete terradraw layer; replace with renderBoundingBoxLayer
  appStore.map.terraDraw?.clear();

  let { normalizedLngLat, latLng } = normalizeTerraDrawLngLat(coordinates, map);

  let { nelat, nelng, swlat, swlng } = convertLnLatToiNatBBox(
    normalizedLngLat,
    coordinates,
  );

  // render leaflet layer
  let layer = renderBoundingBoxLayer(map, latLng) as any;

  // update store
  let place = bboxPlaceRecord(coordinates);
  appStore.selectedPlaces.push(place);
  appStore.placesMapLayers = {
    ...appStore.placesMapLayers,
    "0": [layer as unknown as CustomGeoJSONType],
  };
  appStore.observationsApiParams = {
    ...appStore.observationsApiParams,
    nelng,
    nelat,
    swlat,
    swlng,
  };

  if (import.meta.env?.VITE_MAP_DEBUG === "true") {
    let lngLatCoors = convertiNatBBoxToLngLat(appStore.observationsApiParams);
    if (lngLatCoors) {
      createGeojsonDemo(lngLatCoors, map);
    }
  }

  await updateAppState(appStore);
}

export function removeAllPlacesFromStoreAndMap(appStore: AppStoreType) {
  // remove from map
  for (let [id, layers] of Object.entries(appStore.placesMapLayers)) {
    if (id === "-1") continue;
    layers.forEach((layer) => {
      // remove layer from map
      layer.remove();
    });
    delete appStore.placesMapLayers[id];
  }

  // remove from store
  appStore.selectedPlaces = appStore.selectedPlaces.filter((p) => p.id === -1);
  delete appStore.observationsApiParams.place_id;
  delete appStore.observationsApiParams.nelat;
  delete appStore.observationsApiParams.nelng;
  delete appStore.observationsApiParams.swlat;
  delete appStore.observationsApiParams.swlng;
}
