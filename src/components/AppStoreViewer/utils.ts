import type { AppStoreType, AppStoreKeysType } from "../../types/app";
import type { PolygonJson } from "../../types/inat_api";
import { leafletMapLayers } from "../../lib/data_utils";
import { displayJson } from "../../lib/utils";
import type { TileLayer } from "leaflet";

function formatTaxaMapLayers(taxaMapLayers: { [index: string]: TileLayer[] }) {
  let temp: any = {};
  Object.entries(taxaMapLayers).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    temp[key] = val
      .filter((v) => v)
      .map((v: any) => v.options?.layer_description);
  });
  return temp;
}
function formatSelectedPlaces(appStore: AppStoreType) {
  return appStore.selectedPlaces.map((place) => {
    let temp = {} as any;
    Object.entries(place).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      if (["bounding_box", "geometry"].includes(key)) {
        let value = val as PolygonJson;

        let coors;
        if (value.coordinates[0][0]) {
          if (value.coordinates[0].length <= 5) {
            coors = value.coordinates[0];
          } else {
            coors = value.coordinates[0].length;
          }
        } else if (value.coordinates[0]) {
          if (value.coordinates[0].length <= 5) {
            coors = value.coordinates[0];
          } else {
            coors = value.coordinates[0].length;
          }
        }

        if (value !== null) {
          temp[key] = {
            type: value.type,
            coordinates: coors,
          };
        }
      } else {
        temp[key] = val;
      }
    });
    return temp;
  });
}
function formatPlacesMapLayers(appStore: AppStoreType) {
  let temp: any = {};
  Object.entries(appStore.placesMapLayers).forEach(([key, val]) => {
    temp[key] = val.map((v: any) => v.options?.layer_description);
  });
  return temp;
}

export function displayAppstoreData(appStore: AppStoreType, _source: string) {
  const debug = import.meta.env?.VITE_DEBUG;
  if (!debug || debug === "false") return;

  let displayJsonWrapperEl = document.getElementById("display-json-wrapper");
  if (!displayJsonWrapperEl) return;

  let data = {} as any;
  Object.keys(appStore).forEach((k) => {
    let key = k as AppStoreKeysType;
    if (key === "taxaMapLayers") {
      data.taxaMapLayers = formatTaxaMapLayers(appStore.taxaMapLayers);
    } else if (key === "placesMapLayers") {
      data.placesMapLayers = formatPlacesMapLayers(appStore);
    } else if (key === "map") {
      data.map = {
        map: !!appStore.map.map,
        layerControl: !!appStore.map.layerControl,
      };
      data.mapLayerDescriptions = leafletMapLayers(appStore);
    } else if (key === "selectedPlaces") {
      data.selectedPlaces = formatSelectedPlaces(appStore);
    } else {
      data[key] = appStore[key];
    }
  });

  displayJson(data, displayJsonWrapperEl);
}

export function displayMapData(appStore: AppStoreType) {
  const debug = import.meta.env?.VITE_DEBUG;
  if (!debug || debug === "false") return;
  let displayJsonWrapperEl = document.getElementById("display-json-map");
  if (!displayJsonWrapperEl) return;

  let data = {
    map: {
      taxaMapLayers: Object.keys(appStore.taxaMapLayers),
    },
  };

  displayJson(data, displayJsonWrapperEl);
}
