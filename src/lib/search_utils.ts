import { renderSelectResourcesLists } from "../data/app_data";
import type {
  AppStoreSelectedResourcesKeysType,
  AppStoreType,
} from "../types/app";
import { fetchiNatMapDataForTaxon } from "./data_utils";
import { removeOneTaxonFromMap } from "./search_taxa";
import { updateAppUrl } from "./url_utils";
import { debouncePromise } from "./utils";

const DEBOUNCE_TIME = import.meta.env?.VITE_DEBOUNCE_TIME || 1000;

export async function updateTilesForSelectedTaxa(appStore: AppStoreType) {
  for await (const taxon of appStore.selectedTaxa) {
    // remove existing taxon layers from map
    removeOneTaxonFromMap(appStore, taxon.id);

    // get new iNat map tiles
    let layers = await fetchiNatMapDataForTaxon(taxon, appStore);
    if (layers) {
      appStore.taxaMapLayers = {
        ...appStore.taxaMapLayers,
        [taxon.id]: layers,
      };
    }
  }
}

export const updateTilesForSelectedTaxaDebounced = debouncePromise(
  updateTilesForSelectedTaxa,
  DEBOUNCE_TIME,
);

export function renderSelectedResources(
  appStore: AppStoreType,
  doSideEffects: boolean,
) {
  // NOTE: update when adding selectedResource; renderSelectedResources
  renderSelectResourcesLists.forEach((list) => {
    list(appStore);
  });

  if (doSideEffects) {
    updateAppUrl(window.location, appStore);

    window.dispatchEvent(new Event("observationsChange"));
  }
}

export function showHideHeader(
  selector: string,
  storeResource: AppStoreSelectedResourcesKeysType,
) {
  let heading = document.querySelector(selector) as HTMLElement;

  if (!heading) return;
  let resource = window.app.store[storeResource];
  heading.hidden = resource.length === 0 ? false : true;
}
