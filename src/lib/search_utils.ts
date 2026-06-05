import type { AppStoreType } from "../types/app";
import { fetchiNatMapDataForTaxon } from "./data_utils";
import { removeOneTaxonFromMap } from "./search_taxa";
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
