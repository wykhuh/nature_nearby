import {
  observationsApiNonFilterableNames,
  observationsFilterableImplemented,
  observationsFilterableImplementedArrays,
} from "../../data/app_data";
import { resetPageNumber } from "../../lib/data_utils";
import { updateTilesForSelectedTaxaDebounced } from "../../lib/search_utils";
import { updateAppUrl } from "../../lib/url_utils";
import type {
  AppStoreType,
  FiltersResults,
  ObservationsApiParamsKeysType,
  ObservationsApiParamsType,
} from "../../types/app";
import {
  renderSelectedMoreFiltersList,
  renderSelectedFiltersList,
} from "./render_utils";

export async function updateAppWithFormData(
  data: FormData,
  appStore: AppStoreType,
) {
  // get values from form data
  let results = processFormObservationsData(data);

  // update store observationsApiParams with form values
  updateStoreUsingFormData(appStore, results);

  await updateAppState(appStore);
}

function processFormObservationsData(data: FormData): {
  params: ObservationsApiParamsType;
  string: string;
} {
  // convert form data into object that can be use with URLSearchParams
  let values: ObservationsApiParamsType = {};

  for (let [k, value] of data) {
    let key = k as ObservationsApiParamsKeysType;

    // skip fields
    if (!observationsFilterableImplemented.includes(key)) {
      continue;
    }

    // ignore value "on"
    if (value === "on") {
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

function updateStoreUsingFormData(
  appStore: AppStoreType,
  filtersResults: FiltersResults,
) {
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
    if (appStore.observationsApiParams[key] !== params[key]) {
      if (params[key] === undefined) {
        delete appStore.observationsApiParams[key];
      }
    }
  }
}

export async function updateAppState(appStore: AppStoreType) {
  resetPageNumber(appStore);
  // update UI
  renderSelectedFiltersList(appStore);
  renderSelectedMoreFiltersList(appStore);
  // update url
  updateAppUrl(window.location, appStore);
  // update header count
  window.dispatchEvent(new Event("observationsChange"));
  // update map
  await updateTilesForSelectedTaxaDebounced(appStore);
}

function concatParamsWithMultivalues(
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

// set the form data value for autocomplete fields to use the number id from
// app store instead of the string name that is displayed on the form UI
export function setAutocompleteValuesToId(
  data: FormData,
  appStore: AppStoreType,
) {
  if (
    data.get("unobserved_by_user_id") &&
    appStore.observationsApiParams.unobserved_by_user_id
  ) {
    data.set(
      "unobserved_by_user_id",
      appStore.observationsApiParams.unobserved_by_user_id.toString(),
    );
  }
}
