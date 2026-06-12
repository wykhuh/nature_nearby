import { formatAppParams } from "./url_utils";
import { observationsApiNames } from "../data/app_data";
import type {
  AppStoreType,
  MapTilesAPIParamsType,
  ObservationsApiParamsKeysType,
  ObservationsApiParamsType,
  ObservationsMapTilesAPIParamsType,
} from "../types/app";
import { iNatOrange } from "./map_colors_utils";

function cleanupParamsStore(appStore: AppStoreType) {
  let params = new URLSearchParams(
    appStore.observationsApiParams as Record<string, string>,
  );
  cleanupParams(params);
  return params;
}

function cleanupParams(params: URLSearchParams) {
  // delete properties that should not go to api
  params.delete("colors");
  params.delete("view");
  params.delete("subview");

  if (params.get("taxon_id") === "0") {
    params.delete("taxon_id");
  }
  if (params.get("place_id") === "0") {
    params.delete("place_id");
  }

  if (params.get("spam") === null) {
    params.append("spam", "false");
  }
}

function deleteParams(deleteParams: string[], params: URLSearchParams) {
  deleteParams.forEach((param) => {
    if (params.get(param)) {
      params.delete(param);
    }
  });
}

// =============
// taxa API
// =============

export function cleanupTaxaParamsForRecord(
  inatParams: ObservationsApiParamsType,
) {
  let params = new URLSearchParams(inatParams as any);
  cleanupParams(params);

  return params.toString().replaceAll("%2C", ",");
}

// =============
// observations API
// =============

export function cleanupObervationsParamsForRecord(
  inatParams: ObservationsApiParamsType,
) {
  let params = new URLSearchParams(inatParams as any);
  cleanupParams(params);

  return params.toString();
}

export function cleanupObervationsParams(
  appStore: AppStoreType,
  format = "string",
) {
  let params = cleanupParamsStore(appStore);

  if (format === "string") {
    return params.toString();
  } else {
    return params;
  }
}

export function cleanupObervationsSpeciesParams(
  appStore: AppStoreType,
  format = "string",
) {
  let params = cleanupParamsStore(appStore);

  if (format === "string") {
    return params.toString();
  } else {
    return params;
  }
}

// =============
// tiles API
// =============

export let identificationOnlyParams = [
  "d1",
  "d2",
  "iconic_taxon_id",
  "hrank",
  "lrank",
  "rank",
  "without_taxon_id",
  "category",
];

export const processedIdentificationsToObservationsParams = [
  "observation_taxon_active",
  "observation_created_d2",
  "observation_created_d1",
  "observation_rank",
  "observation_hrank",
  "observation_lrank",
  "observation_taxon_id",
  "observed_d2",
  "observed_d1",
  "observation_iconic_taxon_id",
  "user_id",
  "without_observation_taxon_id",
];

export const ignoreMapParams: ObservationsApiParamsKeysType[] = [
  "page",
  "per_page",
];

function cleanupMapParams(rawParams: MapTilesAPIParamsType) {
  let validParams = observationsApiNames;
  Object.keys(rawParams).forEach((key) => {
    // @ts-ignore
    if (!validParams.includes(key)) {
      delete (rawParams as any).key;
    }
  });

  if (rawParams.taxon_id == "0") {
    delete rawParams.taxon_id;
  }

  if (rawParams.place_id == "0") {
    delete rawParams.place_id;
  }
  if (rawParams.place_id == "-1") {
    delete rawParams.place_id;
  }
  if (rawParams.colors) {
    (rawParams as any)["color"] = rawParams.colors?.split(",")[0];
    delete rawParams.colors;
  }

  ignoreMapParams.forEach((param) => {
    if (rawParams[param]) {
      delete rawParams[param];
    }
  });
}

export function cleanupObservationsMapParams(
  rawParams: ObservationsMapTilesAPIParamsType,
) {
  let params = structuredClone(rawParams);
  cleanupMapParams(params);

  if (!params.color) {
    params.color = iNatOrange;
  }
  return params;
}

// =============
// iNaturalist site
// =============

let ignoreWebsiteSpecificParams = [
  "per_page",
  "page",
  "colors",
  "name_order",
  "locale",
];

function cleaniNatSiteParams(params: URLSearchParams) {
  deleteParams(ignoreWebsiteSpecificParams, params);

  let taxon_id = params.get("taxon_id");
  if (taxon_id) {
    params.append("taxon_ids", taxon_id);
    params.delete("taxon_id");
  }
}

export function formatInatExportParams(appStore: AppStoreType) {
  let params = formatAppParams(appStore, "object") as URLSearchParams;

  cleaniNatSiteParams(params);
  deleteParams(["view", "subview"], params);

  if (!params.get("spam")) {
    params.append("spam", "false");
  }

  return params.toString();
}

export function formatInatExploreParams(appStore: AppStoreType) {
  let params = formatAppParams(appStore, "object") as URLSearchParams;

  cleaniNatSiteParams(params);
  deleteParams(["spam"], params);

  if (params.get("verifiable") === "true") {
    params.delete("verifiable");
  }

  return params.toString();
}

export function formatInatIdentifyParams(appStore: AppStoreType) {
  let params = formatAppParams(appStore, "object") as URLSearchParams;

  cleaniNatSiteParams(params);
  deleteParams(["view", "subview", "spam"], params);

  return params.toString();
}

export function formatInatApiParams(appStore: AppStoreType) {
  let params = formatAppParams(appStore, "object") as URLSearchParams;

  deleteParams(ignoreWebsiteSpecificParams, params);
  deleteParams(["view", "subview", "spam"], params);

  return params.toString();
}

export function formatSpeciesToInatExploreParams(
  taxonId: number,
  appStore: AppStoreType,
) {
  let params = formatAppParams(appStore, "object") as URLSearchParams;

  cleaniNatSiteParams(params);
  deleteParams(["spam", "view", "subview"], params);

  if (params.get("verifiable") === "true") {
    params.delete("verifiable");
  }

  if (params.get("taxon_ids")) {
    params.set("taxon_ids", taxonId.toString());
  }

  return params.toString();
}
