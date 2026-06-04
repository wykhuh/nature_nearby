import type {
  iNatAPIError,
  iNatObservationsAPI,
  iNatObservationsSpeciesAPI,
  iNatPlacesAPI,
  iNatTaxaAPI,
} from "../types/inat_api.d.ts";
import { loggerUrl } from "./logger.ts";

const search_api = "https://api.inaturalist.org/v2/search";
export const autocomplete_places_api = `${search_api}?fields=all&sources=places`;
export const autocomplete_projects_api = `${search_api}?fields=all&sources=projects`;
const observations_api = "https://api.inaturalist.org/v2/observations";
const places_api = "https://api.inaturalist.org/v2/places";
const taxa_api = "https://api.inaturalist.org/v2/taxa";

export async function inatFetch(url: string, funcName: string) {
  try {
    let resp = (await fetch(url)) as Response;

    if (resp.status !== 200) {
      let json = await resp.json();
      let message = "";
      if (json.errors) {
        message = json.errors[0].message;
      } else {
        message = json.error;
      }
      console.error(message);
      return { error: message, status: resp.status };
    }

    let data = await resp.json();
    return data;
  } catch (error) {
    console.error(`${funcName} ERROR: ${error}`);
    return { error: error };
  }
}

export async function getObservations(appParams: string) {
  const fields =
    "(id:!t," +
    "user:(login:!t,icon_url:!t,icon:!t)," +
    "place_guess:!t," +
    "observed_on:!t," +
    "observed_time_zone:!t," +
    "obscured:!t," +
    "time_observed_at:!t," +
    "quality_grade:!t," +
    "license_code:!t," +
    "sounds:(id:!t,file_url:!t,attribution:!t,license_code:!t)," +
    "taxon:(name:!t,preferred_common_name:!t,rank:!t)," +
    "photos:(id:!t,url:!t,attribution:!t,license_code:!t))";
  let url = `${observations_api}?${appParams}` + `&fields=${fields}`;
  let data = (await inatFetch(url, "getObservationPhoto")) as iNatObservationsAPI | iNatAPIError;
  if ("results" in data) {
    loggerUrl(url.split("&fields")[0] + "&fields...", data.total_results);
  }
  return data;
}

export async function getObservationsSpecies(appParams: string) {
  let fields =
    "(taxon:" +
    "(" +
    "establishment_means:(establishment_means:!t)," +
    "conservation_status:(status:!t)," +
    "default_photo:(attribution:!t,license_code:!t,medium_url:!t,square_url:!t,url:!t)," +
    "iconic_taxon_name:!t," +
    "id:!t," +
    "name:!t," +
    "preferred_common_name:!t," +
    "rank:!t))";
  let url = `${observations_api}/species_counts?${appParams}&ttl=3600` + `&fields=${fields}`;
  let data = (await inatFetch(url, "getObservationsSpeciesBasic")) as
    | iNatObservationsSpeciesAPI
    | iNatAPIError;
  if ("results" in data) {
    loggerUrl(url.split("&fields")[0] + "&fields...", data.total_results);
  }
  return data;
}

export async function getAutocompletePlaces(query: string) {
  let url = `${autocomplete_places_api}&per_page=50&q=${query}`;
  let data = await inatFetch(url, "getAutocompletePlaces");
  if (data) {
    loggerUrl(url, data.total_results);
  }
  return data;
}

export async function getAutocompleteProjects(query: string) {
  let url = `${autocomplete_projects_api}&per_page=50&q=${query}`;
  let data = await inatFetch(url, "getAutocompleteProjects");
  if ("results" in data) {
    loggerUrl(url, data.total_results);
  }
  return data;
}

export async function getPlaceById(id: number | string) {
  let fields =
    "(bounding_box_geojson:!t,display_name:!t,geometry_geojson:!t,name:!t,place_type:!t)";
  let url = `${places_api}/${id}?fields=${fields}`;
  let data = (await inatFetch(url, "getPlaceById")) as
    | iNatPlacesAPI
    | iNatAPIError;
  if ("results" in data) {
    loggerUrl(url, data.total_results);
  }
  return data;
}

export async function getTaxonById(ids: number | string) {
  let fields =
    `(preferred_common_name:!t,` +
    `name:!t,` +
    `iconic_taxon_name:!t,` +
    "default_photo:(attribution:!t,license_code:!t,medium_url:!t,square_url:!t,url:!t)," +
    `rank:!t` +
    `)`;
  let url = `${taxa_api}/${ids}?fields=${fields}`;
  let data = (await inatFetch(url, "getTaxonById")) as iNatTaxaAPI;
  if ("results" in data) {
    loggerUrl(url, data.total_results);
  }
  return data;
}
