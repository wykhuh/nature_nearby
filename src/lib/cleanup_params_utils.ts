import type { AppStoreType } from "../types/app";

let ignoreWebsiteSpecificParams = [
  "per_page",
  "page",
  "colors",
  "name_order",
  "locale",
];

function deleteParams(deleteParams: string[], params: URLSearchParams) {
  deleteParams.forEach((param) => {
    if (params.get(param)) {
      params.delete(param);
    }
  });
}

function cleaniNatSiteParams(params: URLSearchParams) {
  deleteParams(ignoreWebsiteSpecificParams, params);

  let taxon_id = params.get("taxon_id");
  if (taxon_id) {
    params.append("taxon_ids", taxon_id);
    params.delete("taxon_id");
  }
}

export function formatSpeciesToInatExploreParams(
  taxonId: number,
  appStore: AppStoreType,
) {
  let params = new URLSearchParams(
    appStore.observationsParams as any,
  ) as URLSearchParams;

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
