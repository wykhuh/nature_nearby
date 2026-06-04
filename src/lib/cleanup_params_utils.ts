import type { AppStoreType } from "../types/app";
import { formatAppParams } from "./url_utils";

let ignoreWebsiteSpecificParams = ["per_page", "page", "colors", "name_order", "locale"];

function cleanupParamsStore(appStore: AppStoreType) {
  let string = formatAppParams(appStore);

  let params = new URLSearchParams(string);
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
// iNaturalist site
// =============

function cleaniNatSiteParams(params: URLSearchParams) {
  deleteParams(ignoreWebsiteSpecificParams, params);

  let taxon_id = params.get("taxon_id");
  if (taxon_id) {
    params.append("taxon_ids", taxon_id);
    params.delete("taxon_id");
  }
}

export function formatSpeciesToInatExploreParams(taxonId: number, appStore: AppStoreType) {
  let params = new URLSearchParams(appStore.observationsApiParams as any) as URLSearchParams;

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

// =============
// observations API
// =============

export function cleanupObervationsParamsObject(appStore: AppStoreType) {
  let params = cleanupParamsStore(appStore);
  return params;
}

export function cleanupObervationsParams(appStore: AppStoreType) {
  let params = cleanupObervationsParamsObject(appStore);

  return params.toString();
}

export function cleanupGraphs(appStore: AppStoreType) {
  let params = cleanupObervationsParamsObject(appStore);
  if (params.get("graphs_category")) {
    params.delete("graphs_category");
  }
  if (params.get("graphs_group_by")) {
    params.delete("graphs_group_by");
  }
  return params;
}

export function cleanupObervationsSpeciesParams(appStore: AppStoreType) {
  let params = cleanupParamsStore(appStore);

  return params.toString();
}
