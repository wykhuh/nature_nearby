type iNatAPIError = {
  error: string;
  status?: number;
};

// ==================
// obseservations
// ==================

type iNatObservationsAPI = {
  total_results: number;
  page: number;
  per_page: number;
  results: ObservationsResult[];
};

export type ObservationsResult = {
  uuid: string;
  id: number;
  user: ObservationUser;
  place_guess: string;
  obscured: boolean;
  observed_on: string;
  time_observed_at: string;
  observed_time_zone: string;
  quality_grade: string;
  license_code: CCLicense;
  photos: ObservationPhoto[];
  sounds: ObservationSound[];
  taxon: ObservationTaxon;
};

export type ObservationUser = {
  id: number;
  login: string;
  icon_url: string | null;
  icon: string | null;
};

export type ObservationTaxon = {
  conservation_status?: {
    id: number;
    status: string;
  };
  establishment_means?: { establishment_means: string };
  iconic_taxon_name?: string;
  id: number;
  name: string;
  preferred_common_name?: string;
  rank: string;
  default_photo?: DefaultPhoto | null;
};

export type ObservationPhoto = {
  id: number;
  url: string;
  attribution: string;
  license_code: CCLicense | null;
};

export interface ObservationSound {
  attribution?: string;
  file_url?: string;
  id: number;
  license_code?: CCLicense | null;
}

export type iNatObservationsSpeciesAPI = {
  total_results: number;
  page: number;
  per_page: number;
  results: ObservationsSpeciesResult[];
};

export type ObservationsSpeciesResult = {
  count: number;
  taxon: ObservationTaxon;
};

// ==================
// place api
// ==================

export type iNatPlacesAPI = {
  total_results: number;
  page: number;
  per_page: number;
  results: PlaceResult[];
};

type PlaceResult = {
  id: number;
  bounding_box_geojson: PolygonJson;
  display_name: string;
  geometry_geojson: MultiPolygonJson | PolygonJson;
  name: string;
  place_type: number;
};

interface MultiPolygonJson {
  type: "MultiPolygon";
  coordinates: LngLat[][][];
}

export interface PolygonJson {
  type: "Polygon";
  coordinates: LngLat[][];
}

export interface Point {
  type: "Point";
  coordinates: LngLat;
}

export interface Geojson {
  type: string;
  coordinates: number[][][];
}

// ==================
// taxa api
// ==================

export type iNatTaxaAPI = {
  total_results: number;
  page: number;
  per_page: number;
  results: TaxonResult[];
};

type TaxonResult = {
  id: number;
  preferred_common_name?: string;
  name: string;
  iconic_taxon_name?: string;
  default_photo?: DefaultPhoto | null;
  rank: string;
};

export interface DefaultPhoto {
  attribution: string;
  id: number;
  license_code?: CCLicense | "pd" | null;
  medium_url: string;
  square_url: string;
  url: string;
}
// ==================
// user api
// ==================

export interface iNatUsersAPI {
  total_results: number;
  page: number;
  per_page: number;
  results: UserResult[];
}

type UserResult = {
  id: number;
  icon: null | string;
  login: string;
  name: string;
};

// ==================
// autocomplete api
// ==================

export interface iNatAutocompleteTaxaAPI {
  total_results: number;
  page: number;
  per_page: number;
  results: AutocompleteTaxonResult[];
}

export interface AutocompleteTaxonResult extends TaxonResult {
  matched_term: string;
}

export interface iNatAutocompletePlaceAPI {
  total_results: number;
  page: number;
  per_page: number;
  results: AutocompletePlaceResult[];
}

export interface AutocompletePlaceResult {
  type: "place";
  place: AutocompletePlacePlace;
}

interface AutocompletePlacePlace extends PlaceResult {
  matched_term: string;
}

export interface iNatAutocompleteUsersAPI {
  total_results: number;
  page: number;
  per_page: number;
  results: UserResult[];
}
