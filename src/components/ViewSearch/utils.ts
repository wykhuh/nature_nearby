import {
  observationsApiNames,
  observationsFieldName_InputType,
} from "../../data/app_data";
import { populateFormFields } from "../../lib/form_utils";
import {
  observationsApiNonFilterableNames,
  observationsFilterableImplementedArrays,
} from "../../data/app_data";
import {
  addDefaultTaxonToStoreAndMap,
  resetPageNumber,
} from "../../lib/data_utils";
import {
  renderSelectedResources,
  updateTilesForSelectedTaxaDebounced,
} from "../../lib/search_utils";
import type {
  AppStoreType,
  DataComponentType,
  FiltersResults,
  ObservationsApiParamsKeysType,
  ObservationsApiParamsType,
} from "../../types/app";
import {
  removeOnePlaceFromMap,
  removeOnePlaceFromStore,
} from "../../lib/search_places";
import {
  removeOneTaxonFromMap,
  removeOneTaxonFromStore,
} from "../../lib/search_taxa";
import { defaultStore } from "../../lib/store";
import { updateAppUrl } from "../../lib/url_utils";

export function initFilters(appStore: AppStoreType) {
  populateFormFields(
    "#observations-form",
    observationsFieldName_InputType,
    appStore,
  );
}

export async function updateAppWithFilters(
  data: FormData,
  appStore: AppStoreType,
) {
  // get values from form data
  let results = processFiltersFormObservations(data);

  resetPageNumber(appStore);

  // update store observationsApiParams with form values
  updateStoreUsingFilters(appStore, results);

  await updateTilesForSelectedTaxaDebounced(appStore);

  // update UI
  renderSelectedFiltersList(results.params);
  renderSelectedResources(appStore, true);
}

export function processFiltersFormObservations(data: FormData): {
  params: ObservationsApiParamsType;
  string: string;
} {
  // convert form data into object that can be use with URLSearchParams
  let values: ObservationsApiParamsType = {};

  for (let [k, value] of data) {
    let key = k as ObservationsApiParamsKeysType;

    // skip invalid fields
    if (!observationsApiNames.includes(key)) {
      continue;
    }
    console.log(key, value);

    // ignore fields
    if (observationsFilterableImplementedArrays.includes(key)) {
      // ignore value "on"
    } else if (value === "on") {
      // convert boolean strings to boolean
    } else if (value === "true") {
      // @ts-ignore
      values[key] = true;
      // convert boolean strings to boolean
    } else if (value === "false") {
      // @ts-ignore
      values[key] = false;
    } else if (value !== "") {
      // @ts-ignore
      values[key] = value.toString().trim();
    } else if (value === "") {
      delete values[key];
    }
  }

  // handle comma-separated params
  observationsFilterableImplementedArrays.forEach((field) => {
    concatParamsWithMultivalues(data, field, values);
  });

  return {
    params: values,
    string: new URLSearchParams(values as any)
      .toString()
      .replaceAll("%2C", ","),
  };
}

export function concatParamsWithMultivalues(
  data: FormData,
  field: ObservationsApiParamsKeysType,
  values: ObservationsApiParamsType,
) {
  let items = data
    .getAll(field)
    .filter((i) => i !== "")
    .map((i) => i.toString().trim());
  if (items.length > 0) {
    // @ts-ignore
    values[field] = items.join(",");
  }
}

export function updateStoreUsingFilters(
  appStore: AppStoreType,
  filtersResults: FiltersResults,
) {
  // update store formFilters

  handleObservationsFilters(filtersResults, appStore);

  appStore.observationsApiParams = {
    ...appStore.observationsApiParams,
    ...filtersResults.params,
  };
}

function handleObservationsFilters(
  filtersResults: FiltersResults,
  appStore: AppStoreType,
) {
  for (let [k, _value] of Object.entries(appStore.observationsApiParams)) {
    let key = k as ObservationsApiParamsKeysType;

    // ignore params that can't be changed in the filter modal
    if (observationsApiNonFilterableNames.includes(key)) {
      continue;
    }

    let params = filtersResults.params as ObservationsApiParamsType;
    if (key === "verifiable") {
    } else if (key === "spam") {
    } else if (appStore.observationsApiParams[key] !== params[key]) {
      if (params[key] === undefined) {
        delete appStore.observationsApiParams[key];
      }
    }
  }
}

export function renderSelectedFiltersList(params: ObservationsApiParamsType) {
  let listEl = document.querySelector(".filters-list");
  if (!listEl) return;

  listEl.innerHTML = "";
  for (let [key, value] of Object.entries(params)) {
    let itemEl = document.createElement(
      "selected-filters-item",
    ) as DataComponentType;
    itemEl.data = { field: key, value: value };

    listEl.appendChild(itemEl);
  }

  let countEl = document.querySelector(".filters-count") as HTMLElement;
  if (countEl) {
    let count = Object.keys(params).length;
    if (count > 0) {
      countEl.innerHTML = count.toString();
      countEl.style = "display:inline-block";
    } else {
      countEl.innerHTML = "";
      countEl.style = "display:none";
    }
  }
}

export function setTaxonId(appStore: AppStoreType) {
  let inputEl = document.querySelector<HTMLInputElement>("#taxon_id");
  if (!inputEl) return;

  if (appStore.observationsApiParams.taxon_id) {
    inputEl.value = appStore.observationsApiParams.taxon_id;
  }
}

export function setPlaceId(appStore: AppStoreType) {
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
    // update store
    for (let place of appStore.selectedPlaces) {
      removeOnePlaceFromMap(appStore, place.id);
      removeOnePlaceFromStore(appStore, place.id);
    }
    for (let taxon of appStore.selectedTaxa) {
      removeOneTaxonFromMap(appStore, taxon.id);
      removeOneTaxonFromStore(appStore, taxon.id);
    }
    appStore.observationsApiParams = defaultStore.observationsApiParams;

    // update form
    initFilters(appStore);
    // update header counts
    window.dispatchEvent(new Event("observationsChange"));
    // update map and store
    await addDefaultTaxonToStoreAndMap(appStore);

    updateAppUrl(window.location, appStore);
  }, 0);
}
