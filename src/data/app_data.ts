import { renderPlacesList } from "../lib/search_places";
import { renderTaxaList } from "../lib/search_taxa";
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
    "order",
    "order_by",
    "page",
    "per_page",
    "swlat",
    "swlng",
  ];

export const observationsFilterableImplemented: ObservationsApiParamsKeysType[] =
  [
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

export const observationsFilterableImplementedArrays: ObservationsApiParamsKeysType[] =
  [
    "day",
    "hour",
    "license",
    "month",
    "obscuration",
    "quality_grade",
    "photo_license",
    "year",
    "place_id",
    "taxon_id",
  ];

export const observationsApiNames = observationsFilterableImplemented
  .concat(observationsFilterableImplementedArrays)
  .concat(observationsApiNonFilterableNames);

export const observationsFieldName_InputType = {
  captive: "select",
  d1: "dateInput",
  d2: "dateInput",
  day: "multiselect",
  endemic: "select",
  hour: "multiselect",
  introduced: "select",
  lat: "textInput",
  license: "multiselect",
  lng: "textInput",
  month: "multiselect",
  native: "select",
  obscuration: "multiselect",
  photo_license: "multiselect",
  photos: "select",
  place_id: "textInput",
  quality_grade: "multiselect",
  radius: "select",
  sounds: "select",
  spam: "textInput",
  taxon_id: "textInput",
  verifiable: "select",
  year: "multiselect",
};

export let renderSelectResourcesLists = [renderPlacesList, renderTaxaList];
