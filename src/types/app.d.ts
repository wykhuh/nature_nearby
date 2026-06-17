import type {
  Circle,
  CircleMarker,
  GeoJSON,
  GeoJSONOptions,
  LatLngBounds,
  Map,
  Marker,
  TileLayer,
} from "leaflet";
import type { TerraDraw } from "terra-draw";

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
    terraDraw: TerraDraw | null;
  };
  selectedPlaces: NormalizedPlace[];
  selectedTaxa: NormalizedTaxon[];
  selectedUnobservedByUser: NormalizedUser;
  observationsApiParams: ObservationsApiParamsType;
  viewMetadata: { name_order };
  // need to save leaflet layers to store so the app can remove the layers
  // when user deletes a selected resources
  taxaMapLayers: { [index: string]: TileLayer[] };
  placesMapLayers: { [index: string]: CustomGeoJSONType[] };
  placesMarkers: (LeafletMarker | LeafletCircle)[];
  color?: string;
  primaryColorScheme: keyof typeof appColorSchemes;
  radius: number;
};

export interface LeafletMarker extends Marker {
  _latlng?: { lat: number; lng: number };
}

export interface LeafletCircle extends Circle {
  _latlng?: { lat: number; lng: number };
}

export type AppStoreKeysType = keyof AppStoreType;

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
  unobserved_by_user_id?: number;
  verifiable?: boolean;
  year?: string;

  // app params
  view?: string;
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
  bounding_box?: PolygonJson | Point;
  geometry?: PolygonJson | MultiPolygonJson | Point;
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
  interactive?: boolean;
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
  type?: DataComponentValidTypes;
}

export type DataComponentValidTypes =
  | "place"
  | "current_location"
  | "custom_boundary"
  | "taxon";

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
  getLatLngs: () => {};
}

export interface CustomGeoJSONTypeOptions extends GeoJSONOptions {
  layer_description: string;
  layer_type: string;
}

type Lng = number;
type Lat = number;
export type LngLatType = [Lng, Lat];
export type LatLngType = [Lat, Lng];
export type CoordinatesType = LngLatType | LatLngType;

export interface CustomLayerOptionsType extends LayerOptions {
  layer_description: string;
  layer_type: string;
  control_name: string;
}

interface LeafletBoundsType extends LatLngBounds {
  _northEast: { lat: number; lng: number };
  _southWest: { lat: number; lng: number };
}

type iNatBBox = {
  nelat: number;
  nelng: number;
  swlat: number;
  swlng: number;
};

type NormalizedUser = {
  id: number;
  icon?: null | string;
  login: string;
  name: string;
};
