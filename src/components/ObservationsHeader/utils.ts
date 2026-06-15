import { viewComponentObj } from "../../data/app_data";
import {
  cleanupObervationsParams,
  cleanupObervationsSpeciesParams,
} from "../../lib/cleanup_params_utils";
import { getObservations, getObservationsSpecies } from "../../lib/inat_api";
import { updateAppUrl } from "../../lib/url_utils";
import type { AppStoreType, ValidViews } from "../../types/app";
import type { ObservationHeader } from "./component";

export function updateCountsHeader(appStore: AppStoreType) {
  let params = cleanupObervationsParams(
    appStore,
    "searchParams",
  ) as URLSearchParams;
  updateHeaderCount("observations", getObservations, params);

  let speciesParams = cleanupObervationsSpeciesParams(
    appStore,
    "searchParams",
  ) as URLSearchParams;
  updateHeaderCount("species", getObservationsSpecies, speciesParams);
}

export async function updateHeaderCount(
  selector: string,
  dataFn: any,
  searchParams: URLSearchParams,
) {
  searchParams.set("per_page", "0");
  let count =
    (await fetchHeaderCounts(dataFn, searchParams.toString())) || "--";
  renderHeaderCounts(selector, count);
}

function renderHeaderCounts(selector: string, count: number) {
  let countEls = document.querySelectorAll(`[data-count-label="${selector}"]`);
  if (countEls.length === 0) return;

  Array.from(countEls).forEach((countEl) => {
    countEl.textContent = count.toLocaleString();
  });
}

async function fetchHeaderCounts(dataFn: any, searchParams: string) {
  if (import.meta.env?.VITE_CACHE === "true") {
    return -999;
  }

  let data = await dataFn(searchParams);
  let count = data?.total_results;
  return count;
}

export function setView(
  view: ValidViews,
  appStore: AppStoreType,
  scrollToTop: boolean = false,
) {
  if (appStore.currentView === view) return;
  let viewContainerEl = document.querySelector("#view-container");
  if (!viewContainerEl) return;

  // reset page
  delete appStore.observationsApiParams.page;
  updateAppUrl(window.location, appStore);
  appStore.currentView = view;

  // render view
  viewContainerEl.innerHTML = "";
  let component = document.createElement(viewComponentObj[view]);
  viewContainerEl.appendChild(component);
  updateAppUrl(window.location, appStore);

  // set .current-view class
  let oldEl = document.querySelector(`button.current-view`);
  if (oldEl) {
    oldEl.classList.remove("current-view");
  }
  let el = document.querySelector(`button[data-view="${view}"]`);
  if (el) {
    el.classList.add("current-view");
  }

  if (scrollToTop) {
    window.scroll(0, 0);
  }
}

export function initFilters(
  appStore: AppStoreType,
  componentCtx: ObservationHeader,
) {
  // set .current-view class
  let view = appStore.currentView;
  let el = componentCtx.querySelector(`button[data-view="${view}"]`);
  if (el) {
    el.classList.add("current-view");
  }
}
