import type { AppStoreType, NormalizedTaxon } from "../types/app";
import type { ObservationTaxon } from "../types/inat_api";
import { capitalizeFirstLetter } from "./utils";

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
