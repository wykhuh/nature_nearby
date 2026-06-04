import type { AppStoreType, ValidAppParams } from "../types/app";

export function decodeAppUrl(searchParams: string, path: string) {
  if (path !== "/") return {};

  const urlParams = new URLSearchParams(searchParams);
  let params: ValidAppParams = {};

  let taxon_id = urlParams.get("taxon_id");
  if (taxon_id) {
    params.taxon_id = taxon_id;
  }

  let place_id = urlParams.get("place_id");
  if (place_id) {
    params.place_id = place_id;
  }

  let page = urlParams.get("page");
  if (page) {
    params.page = Number(page);
  }

  let per_page = urlParams.get("per_page");
  if (per_page) {
    params.per_page = Number(per_page);
  }

  return params;
}

export function formatAppParams(appStore: AppStoreType) {
  if (appStore.currentPage !== "home") return;

  let params = new URLSearchParams();

  if (appStore.selectedTaxa.length > 0) {
    params.set("place_id", appStore.selectedTaxa.map((t) => t.id).join(","));
  }
  if (appStore.selectedPlaces.length > 0) {
    params.set("place_id", appStore.selectedPlaces.map((p) => p.id).join(","));
  }
  if (appStore.observationsApiParams.page) {
    params.set("page", appStore.observationsApiParams.page.toString());
  }
  if (appStore.observationsApiParams.per_page) {
    params.set("per_page", appStore.observationsApiParams.per_page.toString());
  }

  return params.toString();
}

export function updateAppUrl(url_location: Location, appStore: AppStoreType) {
  let url = `${url_location.origin}${url_location.pathname}`;
  let params = formatAppParams(appStore);
  if (params) {
    url += `?${params}`;
  }
  updatePushState(url_location.pathname, url, appStore);
}

export function updatePushState(pathname: string, url: string, appStore: AppStoreType) {
  let state = {
    pathname,
    place_id: appStore.selectedPlaces.map((p) => p.id).join(","),
    taxon_id: appStore.selectedTaxa.map((p) => p.id).join(","),
  };
  window.history.pushState(state, "", url);
}
