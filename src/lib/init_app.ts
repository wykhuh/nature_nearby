import type {
  AppPage,
  AppStoreType,
  ObservationsApiParamsKeysType,
} from "../types/app";
import { normalizePlaceResult, normalizeTaxonResult } from "./data_utils";
import { getPlaceById, getTaxonById } from "./inat_api";
import { decodeAppUrl } from "./url_utils";

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

    // populate observationsApiParams
    appStore.observationsApiParams[key] = value as any;

    // populate selectedPlaces
    if (key === "place_id") {
      await fetchAndSavePlace(value as any, appStore);
    } else if (key === "taxon_id") {
      await fetchAndSaveTaxa(value as any, appStore);
    }
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
    });
  }
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
