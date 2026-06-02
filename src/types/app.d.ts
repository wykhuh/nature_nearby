import type { GeoJSON, Map } from "leaflet";

import type {
  BasicPhoto,
  CCLicense,
  MultiPolygonJson,
  PolygonJson,
} from "./inat_api";

declare global {
  interface Window {
    app: { store: AppStoreType; router: RouterType };
  }
}

export type AppStoreType = {
  currentPage: AppPage;
  map: Map | null;
  selectedPlaces: NormalizedPlace[];
  selectedTaxa: NormalizedTaxon[];
};

export type AppPage = "home" | "about";

export type NormalizedTaxon = {
  project_id: number;
  taxon_id: number;
  count: number;
  iconic_taxon_name: string;
  name: string;
  preferred_common_name: string;
  rank: string;
  photos: BasicPhoto[];
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

export type ValidAppParams = {
  taxon_id?: string;
  place_id?: string;
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
