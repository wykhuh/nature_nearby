import { observationsFieldName_InputType } from "../../data/app_data";
import { populateFormFields } from "../../lib/form_utils";
import { addDefaultTaxonToStoreAndMap } from "../../lib/data_utils";
import type { AppStoreType } from "../../types/app";
import {
  removeOnePlaceFromMap,
  removeOnePlaceFromStore,
} from "../../lib/search_places";
import {
  removeOneTaxonFromMap,
  removeOneTaxonFromStore,
} from "../../lib/search_taxa";
import { defaultStore } from "../../lib/store";
import { updateAppState } from "./shared_utils";

export function initFilters(appStore: AppStoreType) {
  populateFormFields(
    "#observations-form",
    observationsFieldName_InputType,
    appStore,
  );
}

export function setTaxonIdField(appStore: AppStoreType) {
  let inputEl = document.querySelector<HTMLInputElement>("#taxon_id");
  if (!inputEl) return;

  if (appStore.observationsApiParams.taxon_id) {
    inputEl.value = appStore.observationsApiParams.taxon_id;
  }
}

export function setPlaceIdField(appStore: AppStoreType) {
  let inputEl = document.querySelector<HTMLInputElement>("#place_id");
  if (!inputEl) return;

  if (appStore.observationsApiParams.place_id) {
    inputEl.value = appStore.observationsApiParams.place_id;
  }
}

export async function resetFormHandler(appStore: AppStoreType) {
  // HACK: use setTimeout to add new event to event queue so the code
  // has access to resetted form
  setTimeout(async () => {
    // update store and map
    for (let place of appStore.selectedPlaces) {
      removeOnePlaceFromMap(appStore, place.id);
      removeOnePlaceFromStore(appStore, place.id);
    }
    for (let taxon of appStore.selectedTaxa) {
      removeOneTaxonFromMap(appStore, taxon.id);
      removeOneTaxonFromStore(appStore, taxon.id);
    }
    appStore.observationsApiParams = defaultStore.observationsApiParams;

    // update ui
    initFilters(appStore);

    updateAppState(appStore);

    // update map and store
    await addDefaultTaxonToStoreAndMap(appStore);
  }, 0);
}
