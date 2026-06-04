import {
  cleanupObervationsParams,
  cleanupObervationsSpeciesParams,
} from "../../lib/cleanup_params_utils";
import { getObservations, getObservationsSpecies } from "../../lib/inat_api";
import type { AppStoreType } from "../../types/app";

export function updateCountsHeader(appStore: AppStoreType) {
  let params = cleanupObervationsParams(appStore);
  updateHeaderCount("observations_observations", getObservations, params);

  let speciesParams = cleanupObervationsSpeciesParams(appStore);
  updateHeaderCount("observations_species", getObservationsSpecies, speciesParams);
}

export async function updateHeaderCount(selector: string, dataFn: any, searchParams: string) {
  let count = 0;
  searchParams = searchParams.replace(/per_page=[0-9]+/, `per_page=${0}`);
  count = (await fetchHeaderCounts(dataFn, searchParams)) || "--";
  renderHeaderCounts(selector, count);
}

function renderHeaderCounts(selector: string, count: number) {
  // use querySelectorAll because there are header and filter counts
  let countEls = document.querySelectorAll(`[data-count-label="${selector}"] .header-count`);
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
