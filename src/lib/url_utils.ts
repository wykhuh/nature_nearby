import { observationsApiNames } from "../data/app_data";
import type {
  AppStoreType,
  ObservationsApiParamsKeysType,
  ValidAppParams,
  ValidAppParamsKeys,
} from "../types/app";

export function decodeAppUrl(searchParams: string, path: string) {
  if (path !== "/") return {};

  const urlParams = new URLSearchParams(searchParams);
  let params: ValidAppParams = {};

  for (let [key, value] of urlParams.entries()) {
    if (observationsApiNames.includes(key as ValidAppParamsKeys)) {
      let cleanedValue;
      if (value === "true") {
        cleanedValue = true;
      } else if (value === "false") {
        cleanedValue = false;
      } else if (/^[-\d.]+$/.test(value)) {
        cleanedValue = Number(value);
      } else {
        cleanedValue = value;
      }
      // @ts-ignore
      params[key] = cleanedValue;
    }
  }

  return params;
}

export function formatAppParams(appStore: AppStoreType, format = "string") {
  if (appStore.currentPage !== "home") return;

  let params = new URLSearchParams();

  if (appStore.selectedTaxa.length > 0 && appStore.selectedTaxa[0].id !== 0) {
    params.set("taxon_id", appStore.selectedTaxa.map((t) => t.id).join(","));
  }
  if (
    appStore.selectedPlaces.length > 0 &&
    appStore.selectedPlaces[0].id !== 0
  ) {
    params.set("place_id", appStore.selectedPlaces.map((p) => p.id).join(","));
  }

  let processedKeys: ObservationsApiParamsKeysType[] = [
    "taxon_id",
    "place_id",
    "colors",
  ];

  Object.entries(appStore.observationsApiParams).forEach(([key, value]) => {
    // @ts-ignore
    if (processedKeys.includes(key)) {
      // ignore default values
    } else if (
      key in defaultStore.observationsApiParams &&
      defaultStore.observationsApiParams[
        key as ObservationsApiParamsKeysType
      ] === value
    ) {
    } else if (params) {
      // @ts-ignore
      if (observationsApiNames.includes(key)) {
        (params as any)[key] = value as any;
        if (typeof value === "number" || typeof value === "boolean") {
          value = value.toString();
        }

        params.set(key, value);
      }
    }
  });

  if (format === "string") {
    return params.toString().replaceAll("%2C", ",");
  } else {
    return params;
  }
}

export function updateAppUrl(url_location: Location, appStore: AppStoreType) {
  let url = `${url_location.origin}${url_location.pathname}`;
  let params = formatAppParams(appStore);
  if (params) {
    url += `?${params}`;
  }
  updatePushState(url_location.pathname, url, appStore);
}

export function updatePushState(
  pathname: string,
  url: string,
  appStore: AppStoreType,
) {
  let state = {
    pathname,
    place_id: appStore.selectedPlaces.map((p) => p.id).join(","),
    taxon_id: appStore.selectedTaxa.map((p) => p.id).join(","),
  };
  window.history.pushState(state, "", url);
}
