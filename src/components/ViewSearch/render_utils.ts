import { observationsApiNonFilterableNames } from "../../data/app_data";
import { geoprivacyValues, obscurationValues } from "../../data/inat_data";
import { html } from "../../lib/component_utils";
import { capitalizeFirstLetter, range } from "../../lib/utils";
import type { AppStoreType, DataComponentType } from "../../types/app";

export const iNatObservationsYears = [
  ...range(2000, new Date().getFullYear()).reverse(),
];

export function renderYearsOptions(defaultValue: string) {
  let content = `<option value="">${defaultValue}</option>`;
  iNatObservationsYears.forEach((year) => {
    content += `<option value="${year}">${year}</option>`;
  });
  return content;
}

export function renderHoursOptions(defaultValue: string) {
  let content = `<option value="">${defaultValue}</option>`;
  [...Array(24).keys()].forEach((num) => {
    content += `<option value="${num}">${num}</option>`;
  });
  return content;
}

export function renderDaysOptions(defaultValue: string) {
  let content = `<option value="">${defaultValue}</option>`;
  [...Array(31).keys()].forEach((num) => {
    content += `<option value="${num + 1}">${num + 1}</option>`;
  });
  return content;
}

export function renderTrueFalseSelect(
  name: string,
  id: string,
  defaultText = "",
) {
  return html`<select id="${id}" name="${name}">
    <option value="">${defaultText}</option>
    <option value="true">True</option>
    <option value="false">False</option>
  </select>`;
}

export function renderGeoprivacyOptions(defaultValue: string) {
  let content = `<option value="">${defaultValue}</option>`;
  geoprivacyValues.forEach((value) => {
    let displayValue = capitalizeFirstLetter(value.replace("_", " "));
    content += `<option value="${value}" id="${value}">${displayValue}</option>`;
  });
  return content;
}

export function renderObscurationOptions(defaultValue: string) {
  let content = `<option value="">${defaultValue}</option>`;
  obscurationValues.forEach((value) => {
    let displayValue = capitalizeFirstLetter(value.replace("_", " "));
    content += `<option value="${value}" id="${value}">${displayValue}</option>`;
  });
  return content;
}

export function renderSelectedFiltersList(appStore: AppStoreType) {
  let listEl = document.querySelector(".filters-list");
  if (!listEl) return;

  listEl.innerHTML = "";

  for (let [key, value] of Object.entries(appStore.observationsApiParams)) {
    if (
      ["taxon_id", "place_id", "spam", "license", "lat", "lng", "radius"]
        .concat(observationsApiNonFilterableNames)
        .includes(key)
    ) {
      continue;
    }

    let itemEl = document.createElement(
      "selected-filters-item",
    ) as DataComponentType;
    itemEl.data = { field: key, value: value };

    listEl.appendChild(itemEl);
  }
}

export function renderSelectedFiltersBasicList(appStore: AppStoreType) {
  let listBasicEl = document.querySelector(".filters-basic-list");
  if (!listBasicEl) return;

  listBasicEl.innerHTML = "";

  appStore.selectedTaxa.forEach((taxon) => {
    let templateEl = document.createElement(
      "selected-filters-item",
    ) as DataComponentType;
    templateEl.data = taxon;
    templateEl.type = "taxon";
    listBasicEl.appendChild(templateEl);
  });

  appStore.selectedPlaces.forEach((place) => {
    let templateEl = document.createElement(
      "selected-filters-item",
    ) as DataComponentType;
    templateEl.data = place;
    templateEl.type = "place";
    listBasicEl.appendChild(templateEl);
  });

  for (let [key, value] of Object.entries(appStore.observationsApiParams)) {
    if (
      ["lat", "lng", "radius", "month", "year"].includes(key) &&
      value !== ""
    ) {
      let itemEl = document.createElement(
        "selected-filters-item",
      ) as DataComponentType;
      itemEl.data = { field: key, value: value };

      listBasicEl.appendChild(itemEl);
    }
  }
}
