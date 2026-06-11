import { updateAppState } from "../components/ViewSearch/shared_utils";
import { bboxPlaceRecord } from "../data/inat_data";
import type { AppStoreType, LngLatType } from "../types/app";
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
  removePlacesFromStoreAndMap(appStore);

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
  appStore.selectedPlaces = [place];
  appStore.placesMapLayers = { "0": [layer as unknown as CustomGeoJSONType] };
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
