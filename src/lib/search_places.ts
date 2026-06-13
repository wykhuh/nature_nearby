import autoComplete from "@tarekraafat/autocomplete.js";

import type {
  AutoCompleteEventType,
  NormalizedPlace,
  AppStoreType,
  CustomGeoJSONType,
} from "../types/app.d.ts";
import { getAutocompletePlaces } from "../lib/inat_api.ts";
import type { iNatAutocompletePlaceAPI } from "../types/inat_api";

import {
  addValueToCommaSeparatedString,
  normalizePlaceResult,
  removeIdfromInatApiParams,
  renderResourceGeometryLayer,
  resetPageNumber,
} from "./data_utils.ts";
import { fitBoundsPlaces } from "./map_utils.ts";
import { updateTilesForSelectedTaxa } from "./search_utils.ts";
import { updateAppState } from "../components/ViewSearch/shared_utils.ts";

export function setupPlacesSearch(selector: string) {
  const autoCompletePlacesJS = new autoComplete({
    autocomplete: "off",
    selector: selector,
    placeHolder: "Enter place name",
    threshold: 2,
    searchEngine: (_query: string, record: NormalizedPlace) => {
      return renderAutocompletePlace(record);
    },
    data: {
      src: async (query: string) => {
        try {
          let data = await getAutocompletePlaces(query);
          return processAutocompletePlaces(data);
        } catch (error) {
          console.error("setupPlacesSearch ERROR:", error);
        }
      },
    },
    resultsList: {
      maxResults: 50,
    },
    events: {
      input: {
        selection: (event: AutoCompleteEventType) => {
          const selection = event.detail.selection.value as NormalizedPlace;
          autoCompletePlacesJS.input.value = selection.name;
        },
      },
    },
  });

  return autoCompletePlacesJS;
}

export function processAutocompletePlaces(
  data: iNatAutocompletePlaceAPI,
): NormalizedPlace[] {
  return data.results.map((item) => {
    return normalizePlaceResult(item.place);
  });
}

export function renderAutocompletePlace(item: NormalizedPlace): string {
  let html = `
  <div class="places-ac-option" data-testid="places-ac-option">
    <div class="place-name">
    ${item.name}`;
  if (item.place_type_name) {
    html += ` <span class="place-type">(${item.place_type_name})</span>`;
  }
  html += `
    </div>
  </div>`;

  return html;
}

// called by autocomplete search when an place option is selected
export async function placeSelectedHandler(
  selection: NormalizedPlace,
  appStore: AppStoreType,
) {
  let place = selection;
  let map = appStore.map.map;
  let layer;
  if (map) {
    // draw boundaries of selected place
    layer = renderResourceGeometryLayer(selection, map, "place layer");

    // remove selected place layer from map
    if (appStore.placesMapLayers) {
      let layers = appStore.placesMapLayers[selection.id.toString()];
      if (layers) {
        layers.forEach((layer) => {
          layer.removeFrom(map);
        });
      }
    }
  }

  // remove bound box from map
  if (appStore.observationsApiParams.swlat) {
    if (map) {
      appStore.placesMapLayers["0"].forEach((l) => l.removeFrom(map));
    }
    delete appStore.observationsApiParams.swlat;
    delete appStore.observationsApiParams.swlng;
    delete appStore.observationsApiParams.nelat;
    delete appStore.observationsApiParams.nelng;

    appStore.selectedPlaces = appStore.selectedPlaces.filter((p) => p.id > 0);
    delete appStore.placesMapLayers["0"];
  }

  // save place to store
  appStore.selectedPlaces = [...appStore.selectedPlaces, place];
  resetPageNumber(appStore);

  appStore.observationsApiParams = {
    ...appStore.observationsApiParams,
    place_id: addValueToCommaSeparatedString(
      place.id,
      appStore.observationsApiParams.place_id,
    ),
  };

  if (map && layer) {
    appStore.placesMapLayers = {
      ...appStore.placesMapLayers,
      [selection.id]: [layer as CustomGeoJSONType],
    };
  }

  await updateTilesForSelectedTaxa(appStore);

  // zoom to map to fit all selected places
  if (map) {
    fitBoundsPlaces(appStore);
  }
}

// called when user deletes a place
export async function removePlace(placeId: number, appStore: AppStoreType) {
  if (!appStore.selectedPlaces) return;

  // remove place
  removeOnePlaceFromMap(appStore, placeId);
  await removeOnePlaceFromStore(appStore, placeId);

  updateAppState(appStore);
}

export function removeOnePlaceFromStore(
  appStore: AppStoreType,
  placeId: number,
) {
  appStore.selectedPlaces = appStore.selectedPlaces.filter(
    (place) => place.id !== placeId,
  );
  resetPageNumber(appStore);

  // update observationsApiParams for bounding box
  if (placeId === 0) {
    delete appStore.observationsApiParams.nelat;
    delete appStore.observationsApiParams.nelng;
    delete appStore.observationsApiParams.swlat;
    delete appStore.observationsApiParams.swlng;
    //  update observationsApiParams for current location
  } else if (placeId === -1) {
    delete appStore.observationsApiParams.lat;
    delete appStore.observationsApiParams.lng;
    delete appStore.observationsApiParams.radius;
    appStore.placesMarkers = [];

    // update observationsApiParams for places
  } else {
    removeIdfromInatApiParams(appStore, "selectedPlaces", placeId);
  }
}

export function removeOnePlaceFromMap(appStore: AppStoreType, placeId: number) {
  let mapLayers = appStore.placesMapLayers[placeId];
  if (mapLayers) {
    mapLayers.forEach((layer) => {
      layer.remove();
    });
  }

  if (placeId === -1) {
    appStore.placesMarkers.forEach((marker) => marker.remove());
  }

  delete appStore.placesMapLayers[placeId];
}
