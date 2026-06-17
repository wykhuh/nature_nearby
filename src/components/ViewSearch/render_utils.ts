import { observationsApiNonFilterableNames } from "../../data/app_data";
import { MONTHS } from "../../data/constants";
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

export function renderSelectedMoreFiltersList(appStore: AppStoreType) {
  let listEl = document.querySelector(".more-filters-list");
  if (!listEl) return;

  listEl.innerHTML = "";

  let ignoreFields = [
    "license",
    "month",
    "order_by",
    "order",
    "photo_license",
    "place_id",
    "spam",
    "taxon_id",
    "unobserved_by_user_id",
    "year",
  ];

  for (let [key, value] of Object.entries(appStore.observationsApiParams)) {
    if (ignoreFields.concat(observationsApiNonFilterableNames).includes(key)) {
      continue;
    }

    let itemEl = document.createElement(
      "selected-filters-item",
    ) as DataComponentType;
    itemEl.data = { field: key, value: value };

    listEl.appendChild(itemEl);
  }
}

export function renderSelectedFiltersList(appStore: AppStoreType) {
  let listBasicEl = document.querySelector(".filters-list");
  if (!listBasicEl) return;

  listBasicEl.innerHTML = "";

  appStore.selectedTaxa
    .filter((t) => t.id !== 0)
    .forEach((taxon) => {
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
    if (place.id > 0) {
      templateEl.type = "place";
    } else if (place.id === 0) {
      templateEl.type = "custom_boundary";
    } else if (place.id === -1) {
      templateEl.type = "current_location";
    }
    listBasicEl.appendChild(templateEl);
  });

  if (appStore.selectedUnobservedByUser.id) {
    let templateEl = document.createElement(
      "selected-filters-item",
    ) as DataComponentType;
    templateEl.data = appStore.selectedUnobservedByUser;
    templateEl.type = "unobservedByUser";
    listBasicEl.appendChild(templateEl);
  }

  for (let [key, value] of Object.entries(appStore.observationsApiParams)) {
    if (["month", "year", "iconic_taxa"].includes(key) && value !== "") {
      let itemEl = document.createElement(
        "selected-filters-item",
      ) as DataComponentType;
      itemEl.data = { field: key, value: value };

      listBasicEl.appendChild(itemEl);
    }
  }
}

export function renderPresetDates() {
  let now = new Date();
  let month = now.getMonth() + 1;
  let lastMonth = month === 1 ? 12 : month - 1;
  let nextMonth = month === 12 ? 1 : month + 1;
  let year = now.getFullYear();
  let lastYear = year - 1;
  let lastTwoYears = lastYear - 1;

  let displayMonth = (month: number) => MONTHS[month - 1];

  let content = `<select id="presetDates">
    <option value="">All</option>
    <option value="1" data-month="${month}" data-year="${year}">
    ${displayMonth(month)} ${year}
    </option>
    <option value="2" data-month="${month}" data-year="${lastYear},${year}">
    ${displayMonth(month)} ${year}, ${displayMonth(month)} ${lastYear}
    </option>
    <option value="3" data-month="${month}" data-year="${lastTwoYears},${lastYear},${year}">
    ${displayMonth(month)} ${year}, ${displayMonth(month)} ${lastYear}, ${displayMonth(month)} ${lastTwoYears}
    </option>
    <hr>

    <option value="4" data-month="${lastMonth},${month}" data-year="${year}">
    ${displayMonth(lastMonth)}-${displayMonth(month)} ${year}
    </option>
    <option value="5" data-month="${lastMonth},${month}" data-year="${lastYear},${year}">
    ${displayMonth(lastMonth)}-${displayMonth(month)} ${year},  ${displayMonth(lastMonth)}-${displayMonth(month)} ${lastYear}
    </option>
    <option value="6" data-month="${lastMonth},${month}" data-year="${lastTwoYears},${lastYear},${year}">
    ${displayMonth(lastMonth)}-${displayMonth(month)} ${year},  ${displayMonth(lastMonth)}-${displayMonth(month)} ${lastYear},  ${displayMonth(lastMonth)}-${displayMonth(month)} ${lastTwoYears}
    </option>
    <hr>

    <option value="7" data-month="${lastMonth},${month},${nextMonth}" data-year="${lastYear},${year}">
    ${displayMonth(lastMonth)}-${displayMonth(month)} ${year},  ${displayMonth(lastMonth)}-${displayMonth(nextMonth)} ${lastYear}
    </option>
    <option value="8" data-month="${lastMonth},${month},${nextMonth}" data-year="${lastTwoYears},${lastYear},${year}">
    ${displayMonth(lastMonth)}-${displayMonth(month)} ${year},  ${displayMonth(lastMonth)}-${displayMonth(nextMonth)} ${lastYear}, ${displayMonth(lastMonth)}-${displayMonth(nextMonth)} ${lastTwoYears}
    </option>
  </select>`;

  return content;
}
