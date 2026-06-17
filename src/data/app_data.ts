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

export const observationsApiNonFilterableNames: ObservationsApiParamsKeysType[] =
  [
    "colors",
    "locale",
    "nelat",
    "nelng",
    "page",
    "per_page",
    "swlat",
    "swlng",
    "place_id",
    "taxon_id",
  ];

export const observationsFilterableImplemented: ObservationsApiParamsKeysType[] =
  [
    "captive",
    "d1",
    "d2",
    "endemic",
    "introduced",
    "lat",
    "license",
    "lng",
    "native",
    "order_by",
    "order",
    "photo_license",
    "photos",
    "radius",
    "sounds",
    "spam",
    "unobserved_by_user_id",
    "verifiable",
  ];

export const observationsFilterableImplementedArrays: ObservationsApiParamsKeysType[] =
  [
    "day",
    "hour",
    "iconic_taxa",
    "month",
    "obscuration",
    "quality_grade",
    "year",
  ];

const appParams: ObservationsApiParamsKeysType[] = ["view"];

export const observationsApiNames = observationsFilterableImplemented
  .concat(observationsFilterableImplementedArrays)
  .concat(observationsApiNonFilterableNames)
  .concat(appParams);

export const observationsFieldName_InputType = {
  captive: "select",
  d1: "dateInput",
  d2: "dateInput",
  day: "multiselect",
  endemic: "select",
  hour: "multiselect",
  iconic_taxa: "checkbox",
  introduced: "select",
  lat: "textInput",
  license: "textInput",
  lng: "textInput",
  month: "multiselect",
  native: "select",
  obscuration: "multiselect",
  order_by: "textInput",
  order: "textInput",
  photo_license: "textInput",
  photos: "select",
  place_id: "textInput",
  quality_grade: "multiselect",
  radius: "select",
  sounds: "select",
  spam: "textInput",
  taxon_id: "textInput",
  unobserved_by_user_id: "textInput",
  verifiable: "select",
  year: "multiselect",
};
