import { observationsFieldName_InputType } from "../../data/app_data";
import {
  populateFormFields,
  setSelectedOption,
  unsetSelectedOption,
} from "../../lib/form_utils";
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
import { updateAppState, updateAppWithFormData } from "./shared_utils";

export function initFilters(appStore: AppStoreType) {
  populateFormFields(
    "#observations-form",
    observationsFieldName_InputType,
    appStore,
  );

  setPresetDates(appStore);
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

// set option to selected for preset dates menu when page loads
export function presetDatesHandler(
  target: HTMLSelectElement,
  formEl: HTMLFormElement,
  appstore: AppStoreType,
) {
  const formData = new FormData(formEl);

  // unselect old months and years for html
  let oldMonths = formData.getAll("month");
  for (let month of oldMonths) {
    unsetSelectedOption(
      `#observations-form select[name='month'] option[value='${month}']`,
    );
  }
  let oldYears = formData.getAll("year");
  for (let year of oldYears) {
    unsetSelectedOption(
      `#observations-form select[name='year'] option[value='${year}']`,
    );
  }
  // delete month and year for formData
  formData.delete("month");
  formData.delete("year");

  // if user selects one of the options with month and data
  let data = target[Number(target.value)]?.dataset;
  if (data && data.month && data.year) {
    // set month and year for formData
    formData.set("month", data.month);
    formData.set("year", data.year);

    // set month and year for html
    for (let month of data.month.split(",")) {
      setSelectedOption(
        `#observations-form select[name='month'] option[value='${month}']`,
      );
    }
    for (let year of data.year.split(",")) {
      setSelectedOption(
        `#observations-form select[name='year'] option[value='${year}']`,
      );
    }
  }

  updateAppWithFormData(formData, appstore);
}

export function setPresetDates(appStore: AppStoreType) {
  let month = appStore.observationsApiParams.month;
  let year = appStore.observationsApiParams.year;
  if (month === undefined || year === undefined) {
    return;
  }

  let optionEls = document.querySelectorAll<HTMLOptionElement>(
    `#observations-form select#presetDates option`,
  );
  for (let optionEl of optionEls) {
    if (
      optionEl.dataset.month === month.toString() &&
      optionEl.dataset.year === year.toString()
    ) {
      optionEl.selected = true;
    }
  }
}
