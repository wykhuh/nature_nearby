import { iNatOrange } from "../lib/map_colors_utils";
import type {
  PlaceTypes,
  NormalizedTaxon,
  LngLatType,
  NormalizedPlace,
} from "../types/app";

export const iNatTaxaUrl = "https://www.inaturalist.org/taxa";
export const iNatPlacesUrl = "https://www.inaturalist.org/places";
export const iNatProjectsUrl = "https://www.inaturalist.org/projects";
export const iNatObservationsUrl = "https://www.inaturalist.org/observations";
export const iNatUsersUrl = "https://www.inaturalist.org/users";

export const CCLicenses = [
  "cc0",
  "cc-by",
  "cc-by-nc",
  "cc-by-sa",
  "cc-by-nd",
  "cc-by-nc-sa",
  "cc-by-nc-nd",
];

export const gbifObservationsCC = ["cc0", "cc-by", "cc-by-nc"];
export const wikimediaPhotosCC = ["cc0", "cc-by"];
export const siteCC = ["cc0", "cc-by", "cc-by-nc", "cc-by-sa", "cc-by-nc-sa"];

export const geoprivacyValues = [
  "obscured",
  "obscured_private",
  "open",
  "private",
];
export const obscurationValues = ["obscured", "private", "none"];

export const allTaxaRecord: NormalizedTaxon = {
  id: 0,
  color: iNatOrange,
  title: "All species",
  preferred_common_name: "All species",
};

//forum.inaturalist.org/t/what-is-places-type-for-the-api-call-for-places-nearby/49446/2?u=wy_bio
export const placeTypes: PlaceTypes = {
  "0": "Undefined",
  "2": "Street Segment",
  "5": "Intersection",
  "6": "Street",
  "7": "Town",
  "8": "State",
  "9": "County",
  "10": "Local Administrative Area",
  "12": "Country",
  "13": "Island",
  "14": "Airport",
  "15": "Drainage",
  "16": "Land Feature",
  "17": "Miscellaneous",
  "18": "Nationality",
  "19": "Supername",
  "20": "Point of Interest",
  "21": "Region",
  "24": "Colloquial",
  "25": "Zone",
  "26": "Historical State",
  "27": "Historical County",
  "29": "Continent",
  "33": "Estate",
  "35": "Historical Town",
  "36": "Aggregate",
  "100": "Open Space",
  "101": "Territory",
  "102": "District",
  "103": "Province",
  "1000": "Municipality",
  "1001": "Parish",
  "1002": "Department Segment",
  "1003": "City Building",
  "1004": "Commune",
  "1005": "Governorate",
  "1006": "Prefecture",
  "1007": "Canton",
  "1008": "Republic",
  "1009": "Division",
  "1010": "Subdivision",
  "1011": "Village block",
  "1012": "Sum",
  "1013": "Unknown",
  "1014": "Shire",
  "1015": "Prefecture City",
  "1016": "Regency",
  "1017": "Constituency",
  "1018": "Local Authority",
  "1019": "Poblacion",
  "1020": "Delegation",
};

export function bboxPlaceRecord(bbox: LngLatType[]): NormalizedPlace {
  return {
    id: 0,
    name: "Custom Boundary",
    bounding_box: { type: "Polygon", coordinates: [bbox] },
  };
}

export function currentLocationPlaceRecord(point: LngLatType): NormalizedPlace {
  return {
    id: -1,
    name: "Current Location",
    bounding_box: { type: "Point", coordinates: point },
  };
}
