import type { Map } from "leaflet";
import type {
  AppPage,
  AppStoreType,
  LngLatType,
  ObservationsApiParamsKeysType,
  ValidViews,
} from "../types/app";
import { normalizePlaceResult, normalizeTaxonResult } from "./data_utils";
import {
  addDefaultTaxaRecordToMap,
  addDefaultTaxaRecordToStore,
} from "./data_utils";
import { getPlaceById, getTaxonById } from "./inat_api";
import {
  addiNatBBoxToMapAndStore,
  convertiNatBBoxToLngLat,
  fitBoundsPlaces,
  renderMarker,
  renderSelectedPlacesBoundaries,
} from "./map_utils";
import { updateTilesForSelectedTaxa } from "./search_utils";
import { decodeAppUrl } from "./url_utils";
import { drawBBoxHandler } from "./search_bounding_box";
import type { TerraDraw } from "terra-draw";
import { bboxPlaceRecord, currentLocationPlaceRecord } from "../data/inat_data";

const pathPage = {
  "/about/": "about",
  "/": "home",
};

export function getAppPage(pathname: string) {
  return pathPage[pathname as keyof typeof pathPage] as AppPage;
}

export async function initApp(
  searchParams: string,
  pathname: string,
  appStore: AppStoreType,
) {
  let urlData = decodeAppUrl(searchParams, pathname);

  for await (let [k, value] of Object.entries(urlData)) {
    let key = k as ObservationsApiParamsKeysType;

    if (key === "view") {
      appStore.currentView = value as ValidViews;
    } else {
      // populate observationsApiParams
      appStore.observationsApiParams[key] = value as any;
    }

    // populate selectedPlaces
    if (key === "place_id") {
      await fetchAndSavePlace(value as any, appStore);
    } else if (key === "taxon_id") {
      await fetchAndSaveTaxa(value as any, appStore);
    }
  }

  // add lat & lng to selected places as current location
  if (urlData["lng"] && urlData["lat"]) {
    let place = currentLocationPlaceRecord([urlData["lng"], urlData["lat"]]);
    appStore.selectedPlaces.push(place);
  }

  // add ne/sw  to selected places as custom boundary
  if (
    urlData["nelng"] !== undefined &&
    urlData["nelat"] !== undefined &&
    urlData["swlat"] !== undefined &&
    urlData["swlng"] !== undefined
  ) {
    let lngLatCoors = convertiNatBBoxToLngLat(appStore.observationsApiParams);
    if (lngLatCoors) {
      let place = bboxPlaceRecord(lngLatCoors);
      appStore.selectedPlaces.push(place);
    }
  }

  if (urlData.taxon_id === undefined) {
    // add default taxon if no search params
    addDefaultTaxaRecordToStore(appStore);
  }
}

async function fetchAndSavePlace(
  value: string | number,
  appStore: AppStoreType,
) {
  let data = await getPlaceById(value);

  if (data && !("error" in data)) {
    data.results.forEach((result) => {
      let place = normalizePlaceResult(result);

      appStore.selectedPlaces.push(place);
    });
  }
}

async function fetchAndSaveTaxa(
  value: string | number,
  appStore: AppStoreType,
) {
  let data = await getTaxonById(value);

  if (data && !("error" in data)) {
    data.results.forEach((result) => {
      let taxon = normalizeTaxonResult(result, appStore);
      appStore.selectedTaxa.push(taxon);
      appStore.observationsApiParams.colors = appStore.selectedTaxa
        .map((t) => t.color)
        .join(",");
      appStore.color = taxon.color;
    });
  }
}

// add store data to map and  add map to store
export async function initPopulateMap(
  map: Map,
  terraDraw: TerraDraw,
  layerControl: L.Control,
  appStore: AppStoreType,
) {
  if (!document.querySelector("#map")) return;
  if (!terraDraw) return;
  if (!map) return;
  if (!layerControl) return;

  terraDraw.on("finish", () => {
    // add bounding box
    const snapshot = terraDraw.getSnapshot();
    let coors = snapshot[0].geometry.coordinates[0] as LngLatType[];
    drawBBoxHandler(coors, appStore);
  });

  // add map to store
  appStore.map.map = map;
  appStore.map.layerControl = layerControl;
  appStore.map.terraDraw = terraDraw;

  // add places layers
  renderSelectedPlacesBoundaries(appStore);

  // add bounding box layer
  if (appStore.observationsApiParams.nelat !== undefined) {
    addiNatBBoxToMapAndStore(appStore);
  }

  if (
    appStore.observationsApiParams.lat &&
    appStore.observationsApiParams.lng
  ) {
    renderMarker(
      {
        latitude: appStore.observationsApiParams.lat,
        longitude: appStore.observationsApiParams.lng,
      },
      appStore.map.map,
    );
  }

  // load default or selected taxa map layer
  if (appStore.selectedTaxa.length === 1 && appStore.selectedTaxa[0].id === 0) {
    // load default Taxa map tiles
    await addDefaultTaxaRecordToMap(appStore);
  } else {
    // update taxa tiles for selected taxa
    await updateTilesForSelectedTaxa(appStore);
  }

  fitBoundsPlaces(appStore);

  return map;
}

export async function registerServiceWorker() {
  // register service worker
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/service_worker.js", {
        type: "module",
      });
      console.log("service worker register");
    } catch (err) {
      console.log("service worker not register", err);
    }

    //listen for messages from the service worker
    navigator.serviceWorker.addEventListener(
      "message",
      onMessageFromServiceWorker,
    );
  } else {
    console.log("Service workers are not supported.");
  }
}

function onMessageFromServiceWorker(event: MessageEvent) {
  console.log("Message from service worker:", event.data);
}

export function sendMessageToServiceWorker(message: any) {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
}
