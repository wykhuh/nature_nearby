import type {
  NameOrderType,
  ObservationsApiParamsKeysType,
  ValidViews,
  ViewComponentType,
} from "../types/app";

export const viewComponentObj: ViewComponentType = {
  search: "view-search",
  observations: "view-observations",
  species: "view-species",
};

export const validView: ValidViews[] = ["search", "observations", "species"];

export const validNameOrders: NameOrderType[] = ["cs", "sc", "s"];

export const observationsApiNonFilterableNames: ObservationsApiParamsKeysType[] = [
  "colors",
  "locale",
  "nelat",
  "nelng",
  "order",
  "order_by",
  "page",
  "per_page",
  "swlat",
  "swlng",

  // selected resources
  "place_id",
  "taxon_id",
];

export const observationsFilterableImplemented: ObservationsApiParamsKeysType[] = [
  "captive",
  "d1",
  "d2",
  "endemic",
  "introduced",
  "lat",
  "lng",
  "native",
  "photos",
  "radius",
  "sounds",
  "spam",
  "verifiable",
];
export const observationsFilterableImplementedArrays: ObservationsApiParamsKeysType[] = [
  "day",
  "hour",
  "license",
  "month",
  "obscuration",
  "quality_grade",
  "photo_license",
  "year",
];

export const observationsApiNames = observationsFilterableImplemented
  .concat(observationsFilterableImplementedArrays)
  .concat(observationsApiNonFilterableNames);

