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
import type { ViewSearch } from "./component";
import {
  addCurrentPlaceToMapAndStore,
  initGeoCurrent,
} from "../../lib/search_current_place";
import { updateFormLatLong } from "./render_utils";
import { initGeoTracking } from "../../lib/search_tracking_location";
import { updateAppUrl } from "../../lib/url_utils";

export function initFilters(
  appStore: AppStoreType,
  componentCtx: ViewSearch | null,
) {
  populateFormFields(
    "#observations-form",
    observationsFieldName_InputType,
    appStore,
  );

  if (
    componentCtx &&
    componentCtx.trackLocationEl &&
    appStore.geolocation === "tracking"
  ) {
    componentCtx.trackLocationEl.textContent = "Stop tracking";
  }

  setPresetDates(appStore);
}

export function setTaxonIdFormField(appStore: AppStoreType) {
  let inputEl = document.querySelector<HTMLInputElement>("#taxon_id");
  if (!inputEl) return;

  if (appStore.observationsApiParams.taxon_id) {
    inputEl.value = appStore.observationsApiParams.taxon_id;
  }
}

export function setPlaceIdFormField(appStore: AppStoreType) {
  let inputEl = document.querySelector<HTMLInputElement>("#place_id");
  if (!inputEl) return;

  if (appStore.observationsApiParams.place_id) {
    inputEl.value = appStore.observationsApiParams.place_id;
  }
}

export function setUnobservedByUserIdFormField(appStore: AppStoreType) {
  let inputEl = document.querySelector<HTMLInputElement>(
    "#unobserved_by_user_id",
  );
  if (!inputEl) return;

  if (appStore.observationsApiParams.unobserved_by_user_id) {
    inputEl.value =
      appStore.observationsApiParams.unobserved_by_user_id.toString();
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
    initFilters(appStore, null);

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
    if (optionEl.dataset.month && optionEl.dataset.year) {
      let years = new Set(year.toString().split(","));
      let optionYears = new Set(optionEl.dataset.year.split(","));
      let months = new Set(month.toString().split(","));
      let optionMonths = new Set(optionEl.dataset.month.split(","));
      if (
        years.difference(optionYears).size === 0 &&
        optionYears.difference(years).size === 0 &&
        months.difference(optionMonths).size === 0 &&
        optionMonths.difference(months).size === 0
      ) {
        optionEl.selected = true;
      }
    }
  }
}

export function showMoreOptionsHandler(componentCtx: ViewSearch) {
  if (!componentCtx.moreOptionsButton) return;
  if (!componentCtx.moreOptionsContainer) return;
  if (!componentCtx.moreFilterContainer) return;

  componentCtx.showMoreOptions = !componentCtx.showMoreOptions;
  if (componentCtx.showMoreOptions) {
    componentCtx.moreOptionsButton.textContent = "Less Options";
    componentCtx.moreOptionsContainer.classList.remove("hidden");
    componentCtx.moreFilterContainer.classList.remove("hidden");
  } else {
    componentCtx.moreOptionsButton.textContent = "More Options";
    componentCtx.moreOptionsContainer.classList.add("hidden");
    componentCtx.moreFilterContainer.classList.add("hidden");
  }
}

// called when button clicked
export async function currentLocationHandler(
  appStore: AppStoreType,
  componentCtx: ViewSearch,
) {
  if (!componentCtx.trackLocationEl) return;

  let map = appStore.map.map;
  if (!map) return;

  stopTracking(appStore);
  componentCtx.trackLocationEl.textContent = "Track location";

  await initGeoCurrent(appStore);
  addCurrentPlaceToMapAndStore(appStore);
  updateFormLatLong(appStore, componentCtx);
  await componentCtx.formChangeHandlerDebounced(componentCtx.formEl);
}

// called when button clicked
export async function trackingLocationHandler(
  appStore: AppStoreType,
  componentCtx: ViewSearch,
) {
  if (!componentCtx.trackLocationEl) return;
  if (!navigator.geolocation) {
    return;
  }

  // stop tracking
  if (appStore.geolocation === "tracking") {
    stopTracking(appStore);
    addCurrentPlaceToMapAndStore(appStore);
    componentCtx.trackLocationEl.textContent = "Track location";

    // start tracking
  } else {
    initGeoTracking(appStore);

    componentCtx.trackLocationEl.textContent = "Stop tracking";
  }
}

export function stopTracking(appStore: AppStoreType) {
  delete appStore.geolocation;

  delete appStore.trackingTimestamp;
  if (appStore.trackingId) {
    navigator.geolocation.clearWatch(appStore.trackingId);
    delete appStore.trackingId;
  }
  updateAppUrl(window.location, appStore);
}
