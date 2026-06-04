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
  default_photo?: DefaultPhoto;
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
// search api
// ==================

export interface iNatSearchAPI {
  total_results: number;
  page: number;
  per_page: number;
  results: SearchResult[];
}

export interface SearchResult {
  matches: string[];
  place?: PlaceSearchRecord;
  project?: ProjectSearchRecord;
  score: number;
  type: string;
}

export interface PlaceSearchRecord {
  admin_level: number | null;
  ancestor_place_ids: number[] | null;
  bbox_area: number;
  bounding_box_geojson: PolygonJson;
  display_name_autocomplete: string;
  display_name: string;
  geometry_geojson: MultiPolygonJson | PolygonJson;
  id: number;
  location: string;
  matched_term: string;
  name: string;
  observations_count: number;
  place_type: number | null;
  point_geojson: Point;
  slug: string;
  universal_search_rank: number;
  user: UserBasic | null;
  uuid: string;
  without_check_list: boolean | null;
}

export interface ProjectSearchRecord {
  id: number;
  admins: Admin[];
  banner_color: null | string;
  created_at: string;
  delegated_project_id: null | number;
  description: string;
  flags: [];
  header_image_contain: boolean;
  header_image_file_name: string;
  header_image_url: string;
  hide_leaderboard: boolean;
  hide_title: boolean;
  icon: string;
  icon_file_name: string;
  is_delegated_umbrella: boolean;
  is_umbrella: boolean;
  latitude: string;
  location: string;
  longitude: string;
  membership_model: string;
  observation_requirements_updated_at: null | string;
  place_id: number;
  prefers_user_trust: boolean;
  project_observation_fields: ProjectObservationFields[];
  project_observation_rules: ProjectObservationRules[];
  project_type: "";
  rule_preferences: RulePreferences[];
  search_parameters: SearchParameters[];
  site_features: [];
  slug: string;
  terms: string;
  title: string;
  updated_at: string;
  user_id: number;
  user_ids: number[];
}

type ProjectObservationFields = {
  id: number;
  observation_field: {
    id: number;
    allowed_values: string;
    datatype: string;
    description: string;
    description_autocomplete: string;
    name: string;
    name_autocomplete: string;
    users_count: number;
    values_count: number;
  };
  position: number;
  required: boolean;
};

type ProjectObservationRules = {
  id: number;
  operand_id: number;
  operand_type: string;
  operator: string;
};

type RulePreferences = { field: string; value: string };

type SearchParameters = {
  field: string;
  value: number[] | string[];
  value_keyword?: string[];
};

type Admin = {
  id: number;
  project_id: number;
  role: "manager" | "curator";
  user_id: number;
};

export interface UserBasic {
  created_at: string;
  id: number;
  login: string;
  spam: boolean;
  suspended: boolean;
}

interface MultiPolygonJson {
  type: "MultiPolygon";
  coordinates: LngLat[][][];
}

export interface PolygonJson {
  type: "Polygon";
  coordinates: LngLat[][];
}

interface Point {
  type: "Point";
  coordinates: LngLat;
}

export interface Geojson {
  type: string;
  coordinates: number[][][];
}

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

// ==================
// autocomplete api
// ==================

export interface iNatAutocompleteTaxaAPI {
  total_results: number;
  page: number;
  per_page: number;
  results: AutocompleteTaxaResult[];
}

export interface AutocompleteTaxaResult {
  default_photo: DefaultPhoto | null;
  iconic_taxon_name?: string;
  id: number;
  matched_term: string;
  name: string;
  preferred_common_name?: string;
  rank: string;
}

export interface DefaultPhoto {
  attribution_name?: string;
  attribution: string;
  id: number;
  license_code?: CCLicense | "pd" | null;
  medium_url: string;
  square_url: string;
  url: string;
}
