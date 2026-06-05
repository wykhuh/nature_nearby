import { primaryColorScheme } from "../../lib/map_colors_utils";
import type { NormalizedPlace, NormalizedTaxon } from "../../types/app";
import type {
  DefaultPhoto,
  iNatPlacesAPI,
  iNatTaxaAPI,
} from "../../types/inat_api";

export const places1APIResponse: iNatPlacesAPI = {
  total_results: 1,
  page: 1,
  per_page: 30,
  results: [
    {
      id: 1,
      display_name: "city, state",
      name: "city",
      geometry_geojson: {
        type: "Polygon",
        coordinates: [
          [
            [-124, 32],
            [-124, 42],
            [-114, 42],
            [-114, 32],
            [-124, 32],
          ],
        ],
      },
      bounding_box_geojson: { type: "Polygon", coordinates: [] },
      place_type: 7,
    },
  ],
};

export const places2APIResponse: iNatPlacesAPI = {
  total_results: 2,
  page: 1,
  per_page: 30,
  results: [
    {
      id: 1,
      display_name: "city, state",
      name: "city",
      geometry_geojson: {
        type: "Polygon",
        coordinates: [
          [
            [-124, 32],
            [-124, 42],
            [-114, 42],
            [-114, 32],
            [-124, 32],
          ],
        ],
      },
      bounding_box_geojson: { type: "Polygon", coordinates: [] },
      place_type: 7,
    },
    {
      id: 2,
      display_name: "country, Asia",
      name: "country",
      geometry_geojson: {
        type: "Polygon",
        coordinates: [
          [
            [-124, 32],
            [-124, 42],
            [-114, 42],
            [-114, 32],
            [-124, 32],
          ],
        ],
      },
      bounding_box_geojson: { type: "Polygon", coordinates: [] },
      place_type: 12,
    },
  ],
};

export const placeCity: NormalizedPlace = {
  id: 1,
  name: "city, state",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-124, 32],
        [-124, 42],
        [-114, 42],
        [-114, 32],
        [-124, 32],
      ],
    ],
  },
  bounding_box: { type: "Polygon", coordinates: [] },
  place_type_name: "Town",
};

export const placeCountry: NormalizedPlace = {
  id: 2,
  name: "country, Asia",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-124, 32],
        [-124, 42],
        [-114, 42],
        [-114, 32],
        [-124, 32],
      ],
    ],
  },
  bounding_box: { type: "Polygon", coordinates: [] },
  place_type_name: "Country",
};

export const monarchTaxaApiResponse: iNatTaxaAPI = {
  total_results: 1,
  page: 1,
  per_page: 30,
  results: [
    {
      id: 48662,
      preferred_common_name: "Monarch",
      name: "Danaus plexippus",
      iconic_taxon_name: "Insecta",
      default_photo: {
        id: 625551566,
        attribution: "(c) Virginia Rivers, some rights reserved (CC BY-NC)",
        license_code: "cc-by-nc",
        medium_url:
          "https://inaturalist-open-data.s3.amazonaws.com/photos/625551566/medium.jpg",
        square_url:
          "https://inaturalist-open-data.s3.amazonaws.com/photos/625551566/square.jpg",
        url: "https://inaturalist-open-data.s3.amazonaws.com/photos/625551566/square.jpg",
      },
      rank: "species",
    },
  ],
};

export const monarchMilkweedTaxaApiResponse: iNatTaxaAPI = {
  total_results: 2,
  page: 1,
  per_page: 30,
  results: [
    {
      id: 48662,
      preferred_common_name: "Monarch",
      name: "Danaus plexippus",
      iconic_taxon_name: "Insecta",
      default_photo: {
        id: 625551566,
        attribution: "(c) Virginia Rivers, some rights reserved (CC BY-NC)",
        license_code: "cc-by-nc",
        medium_url:
          "https://inaturalist-open-data.s3.amazonaws.com/photos/625551566/medium.jpg",
        square_url:
          "https://inaturalist-open-data.s3.amazonaws.com/photos/625551566/square.jpg",
        url: "https://inaturalist-open-data.s3.amazonaws.com/photos/625551566/square.jpg",
      },
      rank: "species",
    },
    {
      id: 56851,
      preferred_common_name: "narrowleaf milkweed",
      name: "Asclepias fascicularis",
      iconic_taxon_name: "Plantae",
      default_photo: {
        id: 514857843,
        attribution:
          "(c) Thorny Toad Photography, some rights reserved (CC BY-NC), uploaded by Thorny Toad Photography",
        license_code: "cc-by-nc",
        medium_url:
          "https://inaturalist-open-data.s3.amazonaws.com/photos/514857843/medium.jpg",
        square_url:
          "https://inaturalist-open-data.s3.amazonaws.com/photos/514857843/square.jpg",
        url: "https://inaturalist-open-data.s3.amazonaws.com/photos/514857843/square.jpg",
      },
      rank: "species",
    },
  ],
};

export const milkweedTaxaApiResponse: iNatTaxaAPI = {
  total_results: 1,
  page: 1,
  per_page: 30,
  results: [
    {
      id: 56851,
      preferred_common_name: "narrowleaf milkweed",
      name: "Asclepias fascicularis",
      iconic_taxon_name: "Plantae",
      default_photo: {
        id: 514857843,
        attribution:
          "(c) Thorny Toad Photography, some rights reserved (CC BY-NC), uploaded by Thorny Toad Photography",
        license_code: "cc-by-nc",
        medium_url:
          "https://inaturalist-open-data.s3.amazonaws.com/photos/514857843/medium.jpg",
        square_url:
          "https://inaturalist-open-data.s3.amazonaws.com/photos/514857843/square.jpg",
        url: "https://inaturalist-open-data.s3.amazonaws.com/photos/514857843/square.jpg",
      },
      rank: "species",
    },
  ],
};

export const monarch: NormalizedTaxon = {
  color: primaryColorScheme[0],
  iconic_taxon_name: "Insecta",
  id: 48662,
  name: "Danaus plexippus",
  photos: [monarchTaxaApiResponse.results[0].default_photo as DefaultPhoto],
  preferred_common_name: "Monarch",
  rank: "species",
  subtitle: "Danaus plexippus",
  title: "Monarch",
};

export const milkweed: NormalizedTaxon = {
  color: primaryColorScheme[1],
  iconic_taxon_name: "Plantae",
  id: 56851,
  name: "Asclepias fascicularis",
  photos: [milkweedTaxaApiResponse.results[0].default_photo as DefaultPhoto],
  preferred_common_name: "narrowleaf milkweed",
  rank: "species",
  subtitle: "Asclepias fascicularis",
  title: "Narrowleaf Milkweed",
};
