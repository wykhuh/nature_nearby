import type { GeoJSON, GeoJSONOptions, Map, TileLayer } from "leaflet";

import type {
  ObservationPhoto,
  CCLicense,
  MultiPolygonJson,
  PolygonJson,
  DefaultPhoto,
} from "./inat_api";
import type { appColorSchemes } from "../lib/map_colors_utils";

declare global {
  interface Window {
    app: { store: AppStoreType; router: RouterType };
  }
}

export type ValidViews = "search" | "observations" | "species";
export type NameOrderType = "cs" | "sc" | "s";
export type AppPage = "home" | "about";
export type QualityGrade = "research" | "needs_id" | "casual";
export type ObscurationValue = "obscured" | "private" | "none";
export type AppStoreSelectedResourcesKeysType =
  | "selectedPlaces"
  | "selectedTaxa";

export type AppStoreType = {
  currentPage: AppPage;
  currentView?: ValidViews;
  map: {
    map: Map | null;
    layerControl: Control.Layers | null;
  };
  selectedPlaces: NormalizedPlace[];
  selectedTaxa: NormalizedTaxon[];
  observationsApiParams: ObservationsApiParamsType;
  viewMetadata: { name_order };
  taxaMapLayers: { [index: string]: TileLayer[] };
  placesMapLayers: { [index: string]: CustomGeoJSONType[] };
  color?: string;
  primaryColorScheme: keyof typeof appColorSchemes;
};

type ObservationsApiParamsType = {
  captive?: boolean;
  colors?: string;
  d1?: string;
  d2?: string;
  day?: string;
  endemic?: boolean;
  hour?: string;
  introduced?: boolean;
  lat?: number;
  license?: string;
  lng?: number;
  locale?: string;
  month?: string;
  native?: boolean;
  nelat?: number;
  nelng?: number;
  obscuration?: ObscurationValue;
  order?: string;
  order_by?: string;
  page?: number;
  per_page?: number;
  photo_license?: string;
  photos?: boolean;
  place_id?: string;
  quality_grade?: QualityGrade;
  radius?: number;
  sounds?: boolean;
  spam?: boolean;
  swlat?: number;
  swlng?: number;
  taxon_id?: string;
  verifiable?: boolean | "any";
  year?: string;
};

export type ObservationsApiParamsKeysType = keyof ObservationsApiParamsType;

export interface ValidAppParams extends ObservationsApiParamsType {}
export type ValidAppParamsKeys = keyof ValidAppParams;

export type NormalizedTaxon = {
  color?: string;
  count?: number;
  default_photo?: string;
  iconic_taxon_name?: string;
  id: number;
  matched_term?: string;
  name?: string;
  photos?: DefaultPhoto[] | null;
  preferred_common_name?: string;
  rank?: string;
  subtitle?: string;
  title?: string;
};

export type NormalizedPlace = {
  name?: string;
  geometry?: PolygonJson | MultiPolygonJson;
  bounding_box?: PolygonJson;
  geometry?: PolygonJson | MultiPolygonJson;
  id: number;
  name?: string;
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
  layer_description?: string;
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

// https://stackoverflow.com/a/79734045
export type ViewComponentType = {
  [k in (typeof validView)[number]]: string;
};

export interface DataComponentType extends HTMLElement {
  data?: any;
  type?: string;
}

export type PaginationCallback = (
  currentPage: number,
  appStore: AppStoreType,
) => Promise<void>;

export type FiltersResults = {
  params: ObservationsApiParamsType;
  string: string;
};

export type iNatObservationTilesSettingsType = {
  iNatGrid: ObservationTilesSettingType;
  iNatPoint: ObservationTilesSettingType;
  iNatTaxonRange?: ObservationTilesSettingType;
  iNatHeatmap: ObservationTilesSettingType;
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

interface ObservationsMapTilesAPIParamsType extends ObservationsApiParamsType {
  color?: string;
}

type MapTilesAPIParamsType = ObservationsMapTilesAPIParamsType;

export type MapTilesApiParamsKeysType = keyof MapTilesAPIParamsType;

export type AppColorSchemes = {
  [k: string]: string[];
};

export type AppColorSchemesNames = keyof AppColorSchemes;

export type PlaceTypes = {
  [key: string]: string;
};
export type PlaceTypesKey = keyof PlaceTypes;

export interface CustomGeoJSONType extends GeoJSON {
  options: CustomGeoJSONTypeOptions;
}

export interface CustomGeoJSONTypeOptions extends GeoJSONOptions {
  layer_description: string;
  layer_type: string;
}
