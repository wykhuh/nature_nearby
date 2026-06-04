import type { GeoJSON, Map } from "leaflet";

import type { ObservationPhoto, CCLicense, MultiPolygonJson, PolygonJson } from "./inat_api";

declare global {
  interface Window {
    app: { store: AppStoreType; router: RouterType };
  }
}

export type AppStoreType = {
  currentPage: AppPage;
  currentView?: ValidViews;
  map: Map | null;
  selectedPlaces: NormalizedPlace[];
  selectedTaxa: NormalizedTaxon[];
  observationsApiParams: ObservationsApiParamsType;
  viewMetadata: { name_order };
};

type ObservationsApiParamsType = {
  taxon_id?: string;
  place_id?: string;
  verifiable?: boolean | "any";
  spam?: boolean;
  order?: string;
  order_by?: string;
  page?: number;
  per_page?: number;
  locale?: string;
};

export interface ValidAppParams extends ObservationsApiParamsType {}

export type AppPage = "home" | "about";

export type NormalizedTaxon = {
  id: number;
  count: number;
  iconic_taxon_name: string;
  name: string;
  preferred_common_name: string;
  rank: string;
  photos: ObservationPhoto[];
};

export type NormalizedPlace = {
  display_name?: string;
  geometry?: PolygonJson | MultiPolygonJson;
  bounding_box?: PolygonJson;
  id: number;
  place_type_name?: string;
};

export interface ObservationTilesSettingType {
  name: string;
  type: "overlay" | "basemap";
  url: string;
  options: {
    attribution: string;
    minZoom: number;
    maxZoom: number;
    layer_description: string;
    layer_type: string;
    control_name?: string;
  };
}

type Spinner = {
  start: () => void;
  stop: () => void;
};

type RouterType = {
  init: () => void;
  go: (path: string) => void;
};

export interface AutoCompleteEventType {
  detail: {
    query: string;
    selection: {
      index: number;
      match: string;
      value: NormalizedPlace;
    };
  };
}

interface LeafletOptions {
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
}

export interface GeoJSONSettings extends LeafletOptions {
  geometry: MultiPolygonJson | PolygonJson;
  interactive?: boolean;
}

export interface CircleSettings extends LeafletOptions {
  latitude: number;
  longitude: number;
  radius?: number;
}

export interface MarkerSettings {
  latitude: number;
  longitude: number;
}

type GeolocationData = {
  coords: {
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: numb | null;
    latitude: number;
    longitude: number;
    speed: number | null;
  };
  timestamp: number;
};

export type ValidViews = "search" | "observations" | "species";
export type NameOrderType = "cs" | "sc" | "s";

// https://stackoverflow.com/a/79734045
export type ViewComponentType = {
  [k in (typeof validView)[number]]: string;
};

export interface DataComponentType extends HTMLElement {
  data?: any;
  type?: string;
}

export type PaginationCallback = (currentPage: number, appStore: AppStoreType) => Promise<void>;
