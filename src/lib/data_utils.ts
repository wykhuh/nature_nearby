import type {
  AppStoreType,
  NormalizedPlace,
  NormalizedTaxon,
  PlaceTypesKey,
} from "../types/app";
import type {
  ObservationTaxon,
  PlaceResult,
  PlaceSearchRecord,
  TaxonResult,
} from "../types/inat_api";
import { capitalizeFirstLetter } from "./utils";
import { getColor, primaryColorScheme } from "./map_colors_utils";
import { placeTypes } from "../data/inat_data";

export function formatTaxonName(
  item: ObservationTaxon | NormalizedTaxon,
  appStore: AppStoreType,
) {
  let hasCommonName = true;
  let title;
  let titleAriaLabel;
  let subtitle;
  let subtitleAriaLabel;
  let commonName;
  let scientificName;
  let rank;

  if (item.preferred_common_name) {
    commonName = item.preferred_common_name
      .split(" ")
      .map((word) => {
        if (word !== "and") {
          return capitalizeFirstLetter(word);
        } else {
          return word;
        }
      })
      .join(" ");
  } else {
    hasCommonName = false;
  }

  // has scientific name
  if (item.name) {
    scientificName = item.name;
  }

  if (item.rank) {
    rank = item.rank;
  }

  let nameOrder = appStore.viewMetadata.name_order;
  if (nameOrder === "cs") {
    title = commonName;
    titleAriaLabel = commonName ? "taxon common name" : undefined;
    subtitle = scientificName;
    subtitleAriaLabel = scientificName ? "taxon scientific name" : undefined;
  } else if (nameOrder === "sc") {
    title = scientificName;
    titleAriaLabel = scientificName ? "taxon scientific name" : undefined;
    subtitle = commonName;
    subtitleAriaLabel = commonName ? "taxon common name" : undefined;
  } else {
    title = scientificName;
    titleAriaLabel = scientificName ? "taxon scientific name" : undefined;
  }

  return {
    title,
    titleAriaLabel,
    subtitle,
    subtitleAriaLabel,
    hasCommonName,
    rank,
  };
}

export function normalizePlaceResult(
  record: PlaceSearchRecord | PlaceResult,
): NormalizedPlace {
  let typeName;
  if (record.place_type) {
    typeName = placeTypes[record.place_type.toString() as PlaceTypesKey];
  }
  return {
    name: record.display_name,
    geometry: record.geometry_geojson as any,
    bounding_box: record.bounding_box_geojson,
    id: record.id,
    place_type_name: typeName,
  };
}

export function normalizeTaxonResult(
  record: TaxonResult,
  appStore: AppStoreType,
): NormalizedTaxon {
  let nameData = formatTaxonName(record, appStore);
  let color = getColor(appStore, primaryColorScheme);
  appStore.color = color;

  return {
    id: record.id,
    name: record.name,
    preferred_common_name: record.preferred_common_name,
    iconic_taxon_name: record.iconic_taxon_name,
    photos: [record.default_photo],
    color: color,
    rank: nameData.rank,
    title: nameData.title,
    subtitle: nameData.subtitle,
  };
}
